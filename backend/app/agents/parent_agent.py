import re
from typing import Dict, Any, Optional, List, Tuple
import asyncio
import logging
from datetime import datetime, timedelta

from ..services import geocoding_service
from .weather_agent import WeatherAgent
from .places_agent import PlacesAgent

logger = logging.getLogger(__name__)


class ParentAgent:
    """
    Main orchestrator agent that handles user queries and coordinates child agents.
    """

    def __init__(self):
        self.weather_agent = WeatherAgent()
        self.places_agent = PlacesAgent()
        self.cache = {}  # Simple in-memory cache
        self.cache_ttl = timedelta(hours=1)  # Cache for 1 hour

    async def process_query(self, user_message: str) -> Dict[str, Any]:
        """
        Process a user query and return a structured response.

        Args:
            user_message: The user's natural language query

        Returns:
            Dict containing reply and optional structured data
        """
        try:
            # Extract location from message
            location = self._extract_location(user_message)
            if not location:
                return {
                    "reply": "I couldn't find a location in your message. Could you please mention a place you'd like to visit?",
                    "location_info": None,
                    "weather_data": None,
                    "places_data": None
                }

            # Get coordinates for the location
            location_info = await self._get_cached_location_info(location)
            if not location_info:
                return {
                    "reply": f"I don't know if '{location}' exists or I'm not sure about this place. Could you please recheck the name?",
                    "location_info": None,
                    "weather_data": None,
                    "places_data": None
                }

            # Determine intent
            intent = self._classify_intent(user_message)

            # Execute based on intent
            weather_data = None
            places_data = None

            if intent["weather"]:
                weather_data = await self._get_cached_weather(location_info["lat"], location_info["lon"])

            if intent["places"]:
                places_data = await self._get_cached_places(location_info["lat"], location_info["lon"])

            # Format response
            reply = self._format_response(
                intent, location_info, weather_data, places_data)

            return {
                "reply": reply,
                "location_info": location_info,
                "weather_data": weather_data,
                "places_data": places_data
            }

        except Exception as e:
            logger.error(f"Error processing query '{user_message}': {str(e)}")
            return {
                "reply": "Sorry, I encountered an error while processing your request. Please try again.",
                "location_info": None,
                "weather_data": None,
                "places_data": None
            }

    def _extract_location(self, message: str) -> Optional[str]:
        """
        Extract location name from user message.
        Uses simple regex patterns to find location mentions.
        """
        # Common patterns for mentioning locations
        patterns = [
            r"(?:going?\s+to|visit(?:ing)?|travel(?:ing)?\s+to|trip\s+to)\s+([A-Za-z\s,]+?)(?:\s*[,.?!]|$)",
            r"(?:tourist\s+attractions\s+in|attractions\s+in|places\s+in)\s+([A-Za-z\s,]+?)(?:\s*[,.?!]|$)",
            r"(?:weather\s+in|temperature\s+in)\s+([A-Za-z\s,]+?)(?:\s*[,.?!]|$)",
            r"(?:in|at)\s+([A-Za-z\s,]+?)(?:\s*[,.?!]|$)",
            r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)",  # Capitalized words
        ]

        for pattern in patterns:
            matches = re.findall(pattern, message, re.IGNORECASE)
            for match in matches:
                location = match.strip()
                # Filter out common non-location words
                excluded_words = [
                    "going", "visit", "trip", "travel", "temperature", "weather",
                    "places", "plan", "let", "what", "there", "and", "the", "is",
                    "are", "can", "i", "tourist", "attractions", "these", "those",
                    "many", "some", "all", "most", "best", "good", "great"
                ]
                if location.lower() not in excluded_words and len(location) > 1:
                    # Clean up the location name
                    location = re.sub(r'\s+', ' ', location).strip()
                    return location

        return None

    def _classify_intent(self, message: str) -> Dict[str, bool]:
        """
        Classify the user's intent based on keywords in the message.

        Returns:
            Dict with 'weather' and 'places' boolean flags
        """
        message_lower = message.lower()

        # Weather keywords
        weather_keywords = ["temperature", "weather",
                            "rain", "precipitation", "hot", "cold", "climate"]
        weather_intent = any(
            keyword in message_lower for keyword in weather_keywords)

        # Places keywords
        places_keywords = ["places", "visit", "attractions",
                           "trip", "plan", "see", "go", "tourist", "sightseeing"]
        places_intent = any(
            keyword in message_lower for keyword in places_keywords)

        # If neither is explicitly mentioned, default based on context
        if not weather_intent and not places_intent:
            if "plan" in message_lower or "trip" in message_lower:
                places_intent = True
            else:
                # Default to both if unclear
                weather_intent = True
                places_intent = True

        return {
            "weather": weather_intent,
            "places": places_intent
        }

    async def _get_cached_location_info(self, location: str) -> Optional[Dict[str, Any]]:
        """Get location info with caching"""
        cache_key = f"location:{location.lower()}"

        if cache_key in self.cache:
            cached_data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < self.cache_ttl:
                return cached_data

        # Fetch fresh data
        location_info = await geocoding_service.get_coordinates(location)
        if location_info:
            location_data = {
                # Get city name
                "name": location_info["display_name"].split(",")[0],
                "country": location_info["country"],
                "lat": location_info["lat"],
                "lon": location_info["lon"]
            }
            self.cache[cache_key] = (location_data, datetime.now())
            return location_data

        return None

    async def _get_cached_weather(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        """Get weather data with caching"""
        cache_key = f"weather:{lat:.2f},{lon:.2f}"

        if cache_key in self.cache:
            cached_data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < timedelta(minutes=30):  # Weather cache for 30 min
                return cached_data

        # Fetch fresh data
        weather_data = await self.weather_agent.get_weather(lat, lon)
        if weather_data:
            self.cache[cache_key] = (weather_data, datetime.now())

        return weather_data

    async def _get_cached_places(self, lat: float, lon: float) -> Optional[List[Dict[str, Any]]]:
        """Get places data with caching"""
        cache_key = f"places:{lat:.2f},{lon:.2f}"

        if cache_key in self.cache:
            cached_data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < self.cache_ttl:
                return cached_data

        # Fetch fresh data
        places_data = await self.places_agent.get_places(lat, lon)
        if places_data:
            self.cache[cache_key] = (places_data, datetime.now())

        return places_data

    def _format_response(self, intent: Dict[str, bool], location_info: Dict[str, Any],
                         weather_data: Optional[Dict[str, Any]],
                         places_data: Optional[List[Dict[str, Any]]]) -> str:
        """Format the final response based on intent and available data"""
        location_name = location_info["name"]
        response_parts = []

        # Weather response
        if intent["weather"] and weather_data:
            weather_response = self.weather_agent.format_weather_response(
                weather_data, location_name)
            response_parts.append(weather_response)

        # Places response
        if intent["places"] and places_data:
            places_response = self.places_agent.format_places_response(
                places_data, location_name)
            response_parts.append(places_response)

        # Combine responses
        if response_parts:
            if len(response_parts) == 2:
                # Format combined response properly
                weather_part = response_parts[0]
                places_part = response_parts[1]

                # Extract the places list properly
                if "these are the places you can go:" in places_part.lower():
                    places_intro = f"And these are the places you can go:"
                    places_list = places_part.split(
                        "these are the places you can go:")[1].strip()
                    return f"{weather_part} {places_intro}\n{places_list}"
                else:
                    return f"{weather_part} {places_part}"
            else:
                return response_parts[0]

        # Fallback response
        return f"I found information about {location_name}, but couldn't retrieve the specific data you requested. Please try again."

    async def close(self):
        """Close all agent sessions"""
        await self.weather_agent.close()
        await self.places_agent.close()
        await geocoding_service.close()
