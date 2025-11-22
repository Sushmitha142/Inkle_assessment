from pydantic import BaseModel
from typing import Optional, List, Dict


class QueryRequest(BaseModel):
    message: str
    preferences: Optional[Dict[str, str]] = {"language": "en"}


class QueryResponse(BaseModel):
    reply: str
    location_info: Optional[dict] = None
    weather_data: Optional[dict] = None
    places_data: Optional[List[dict]] = None


class WeatherData(BaseModel):
    temperature: float
    precipitation_probability: Optional[float] = None
    description: str


class PlaceData(BaseModel):
    name: str
    category: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None


class LocationInfo(BaseModel):
    name: str
    country: str
    lat: float
    lon: float
