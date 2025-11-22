import httpx
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


class WeatherAgent:
    """Agent responsible for fetching weather information"""

    BASE_URL = "https://api.open-meteo.com/v1"

    def __init__(self):
        self.session = httpx.AsyncClient(timeout=10.0)

    async def get_weather(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        """
        Get current weather for given coordinates.

        Args:
            lat: Latitude
            lon: Longitude

        Returns:
            Dict with temperature and precipitation data or None if failed
        """
        try:
            params = {
                "latitude": lat,
                "longitude": lon,
                "current": "temperature_2m,precipitation_probability",
                "hourly": "precipitation_probability",
                "timezone": "auto",
                "forecast_days": 1
            }

            response = await self.session.get(
                f"{self.BASE_URL}/forecast",
                params=params
            )

            if response.status_code == 200:
                data = response.json()
                current = data.get("current", {})

                temperature = current.get("temperature_2m")
                precipitation_prob = current.get(
                    "precipitation_probability", 0)

                if temperature is not None:
                    return {
                        "temperature": temperature,
                        "precipitation_probability": precipitation_prob or 0,
                        "unit": data.get("current_units", {}).get("temperature_2m", "°C")
                    }

            logger.warning(f"No weather data for coordinates: {lat}, {lon}")
            return None

        except Exception as e:
            logger.error(f"Weather API error for {lat}, {lon}: {str(e)}")
            return None

    def format_weather_response(self, weather_data: Dict[str, Any], location_name: str) -> str:
        """Format weather data into human-readable response"""
        temp = weather_data["temperature"]
        precip = weather_data["precipitation_probability"]
        unit = weather_data.get("unit", "°C")

        response = f"In {location_name} it's currently {temp}{unit}"

        if precip > 0:
            response += f" with a chance of {precip}% to rain"

        return response + "."

    async def close(self):
        """Close the HTTP session"""
        await self.session.aclose()
