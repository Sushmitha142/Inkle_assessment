import httpx
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class PlacesAgent:
    """Agent responsible for fetching tourist attractions and places of interest"""

    OVERPASS_URL = "https://overpass-api.de/api/interpreter"

    def __init__(self):
        self.session = httpx.AsyncClient(timeout=15.0)

    def _build_overpass_query(self, lat: float, lon: float, radius: int = 50000) -> str:
        """Build Overpass QL query for tourist attractions with English name preference"""
        return f"""
        [out:json][timeout:25];
        (
          // Tourist attractions
          node["tourism"~"^(attraction|museum|gallery|zoo|theme_park|viewpoint)$"](around:{radius},{lat},{lon});
          way["tourism"~"^(attraction|museum|gallery|zoo|theme_park|viewpoint)$"](around:{radius},{lat},{lon});
          
          // Historical sites
          node["historic"~"^(castle|palace|monument|memorial|ruins|fort)$"](around:{radius},{lat},{lon});
          way["historic"~"^(castle|palace|monument|memorial|ruins|fort)$"](around:{radius},{lat},{lon});
          
          // Parks and gardens
          node["leisure"~"^(park|garden|nature_reserve)$"](around:{radius},{lat},{lon});
          way["leisure"~"^(park|garden|nature_reserve)$"](around:{radius},{lat},{lon});
          
          // Religious sites (remove tourism requirement for better coverage)
          node["amenity"="place_of_worship"](around:{radius},{lat},{lon});
          way["amenity"="place_of_worship"](around:{radius},{lat},{lon});
          
          // Entertainment
          node["amenity"~"^(theatre|cinema)$"](around:{radius},{lat},{lon});
          way["amenity"~"^(theatre|cinema)$"](around:{radius},{lat},{lon});
        );
        out center meta;
        """

    async def get_places(self, lat: float, lon: float) -> Optional[List[Dict[str, Any]]]:
        """
        Get tourist attractions near the given coordinates.

        Args:
            lat: Latitude
            lon: Longitude

        Returns:
            List of places with name and category or None if failed
        """
        try:
            # Try different radii - start small for cities, expand for countries
            radii = [5000, 20000, 50000]  # 5km, 20km, 50km

            for radius in radii:
                query = self._build_overpass_query(lat, lon, radius)

                response = await self.session.post(
                    self.OVERPASS_URL,
                    data=query,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )

                if response.status_code == 200:
                    data = response.json()
                    places = self._process_overpass_results(data)

                    # If we found places, return them
                    if places and len(places) > 0:
                        return places

                # If this radius didn't work, try the next one
                continue

            logger.warning(
                f"No places data found for coordinates: {lat}, {lon}")
            return None

        except Exception as e:
            logger.error(f"Places API error for {lat}, {lon}: {str(e)}")
            return None

    def _get_best_name(self, tags: Dict[str, str]) -> Optional[str]:
        """
        Get the best name for a place, prioritizing English names.

        Args:
            tags: OSM tags dictionary

        Returns:
            Best available name or None
        """
        # Priority order for name selection
        name_keys = [
            "name:en",          # English name
            "name",             # Default name
            "int_name",         # International name
            "official_name:en",  # Official English name
            "alt_name:en",      # Alternative English name
            "short_name",       # Short name
            "alt_name"          # Alternative name
        ]

        for key in name_keys:
            if key in tags and tags[key].strip():
                return tags[key].strip()

        return None

    def _process_overpass_results(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process Overpass API results into structured data"""
        places = []
        elements = data.get("elements", [])

        for element in elements:
            tags = element.get("tags", {})
            name = self._get_best_name(tags)

            if not name:
                continue

            # Determine category
            category = self._determine_category(tags)

            # Get coordinates
            if element.get("type") == "node":
                lat, lon = element.get("lat"), element.get("lon")
            else:
                # For ways, use center
                center = element.get("center", {})
                lat, lon = center.get("lat"), center.get("lon")

            places.append({
                "name": name,
                "category": category,
                "lat": lat,
                "lon": lon
            })

        # Remove duplicates and limit to 5
        seen = set()
        unique_places = []
        for place in places:
            if place["name"] not in seen:
                seen.add(place["name"])
                unique_places.append(place)
                if len(unique_places) >= 5:
                    break

        return unique_places

    def _determine_category(self, tags: Dict[str, str]) -> str:
        """Determine the category of a place based on its tags"""
        if tags.get("tourism"):
            tourism_type = tags["tourism"]
            if tourism_type in ["museum", "gallery"]:
                return "Museum/Gallery"
            elif tourism_type == "attraction":
                return "Tourist Attraction"
            elif tourism_type in ["zoo", "theme_park"]:
                return "Entertainment"
            elif tourism_type == "viewpoint":
                return "Viewpoint"

        if tags.get("historic"):
            return "Historical Site"

        if tags.get("leisure"):
            leisure_type = tags["leisure"]
            if leisure_type in ["park", "garden"]:
                return "Park/Garden"
            elif leisure_type == "nature_reserve":
                return "Nature Reserve"

        if tags.get("amenity") == "place_of_worship":
            return "Religious Site"

        if tags.get("amenity") in ["theatre", "cinema"]:
            return "Entertainment"

        return "Point of Interest"

    def format_places_response(self, places: List[Dict[str, Any]], location_name: str) -> str:
        """Format places data into human-readable response"""
        if not places:
            return f"Sorry, I couldn't find any tourist attractions in {location_name}."

        place_names = [place["name"] for place in places]
        places_text = "\n".join([f"– {name}" for name in place_names])

        return f"In {location_name} these are the places you can go:\n{places_text}"

    async def close(self):
        """Close the HTTP session"""
        await self.session.aclose()
