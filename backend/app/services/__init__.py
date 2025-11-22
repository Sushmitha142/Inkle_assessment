import httpx
import asyncio
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


class GeocodingService:
    """Service for converting place names to coordinates using Nominatim API"""

    BASE_URL = "https://nominatim.openstreetmap.org"

    def __init__(self):
        self.session = httpx.AsyncClient(
            headers={
                "User-Agent": "Inkle-Tourism-App/1.0 (educational-project)"},
            timeout=10.0
        )

    async def get_coordinates(self, place_name: str) -> Optional[Dict[str, Any]]:
        """
        Get coordinates for a place name.

        Args:
            place_name: Name of the place to geocode

        Returns:
            Dict with lat, lon, display_name, country or None if not found
        """
        try:
            params = {
                "q": place_name,
                "format": "json",
                "limit": 1,
                "addressdetails": 1
            }

            response = await self.session.get(
                f"{self.BASE_URL}/search",
                params=params
            )

            if response.status_code == 200:
                data = response.json()
                if data and len(data) > 0:
                    result = data[0]
                    return {
                        "lat": float(result["lat"]),
                        "lon": float(result["lon"]),
                        "display_name": result.get("display_name", ""),
                        "country": result.get("address", {}).get("country", "")
                    }

            logger.warning(f"No geocoding results for: {place_name}")
            return None

        except Exception as e:
            logger.error(f"Geocoding error for {place_name}: {str(e)}")
            return None

    async def close(self):
        """Close the HTTP session"""
        await self.session.aclose()


# Global instance
geocoding_service = GeocodingService()
