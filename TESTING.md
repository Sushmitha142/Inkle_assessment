# Test instructions for the Multi-Agent Tourism System

## Local Testing

### Backend Tests

1. **Start the backend:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:8000/health
   ```

3. **Test query endpoint:**
   ```bash
   curl -X POST http://localhost:8000/api/query \
     -H "Content-Type: application/json" \
     -d '{"message": "What is the weather in London?"}'
   ```

### Frontend Tests

1. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test these queries in the UI:**
   - "I'm going to Tokyo, what's the weather?"
   - "Show me tourist attractions in Paris"
   - "I want to visit New York, what's the temperature and what places can I see?"
   - "What's the weather in Nonexistentcity?" (should show error handling)

## Example API Responses

### Successful Weather Query
```json
{
  "reply": "In London it's currently 12°C with a chance of 60% to rain.",
  "location_info": {
    "name": "London",
    "country": "United Kingdom",
    "lat": 51.5074,
    "lon": -0.1278
  },
  "weather_data": {
    "temperature": 12.0,
    "precipitation_probability": 60,
    "unit": "°C"
  },
  "places_data": null
}
```

### Successful Places Query
```json
{
  "reply": "In Paris these are the places you can go:\n– Louvre Museum\n– Eiffel Tower\n– Notre-Dame Cathedral\n– Arc de Triomphe\n– Sacré-Cœur",
  "location_info": {
    "name": "Paris",
    "country": "France", 
    "lat": 48.8566,
    "lon": 2.3522
  },
  "weather_data": null,
  "places_data": [
    {
      "name": "Louvre Museum",
      "category": "Museum/Gallery",
      "lat": 48.8606,
      "lon": 2.3376
    }
  ]
}
```

### Error Response (Non-existent Place)
```json
{
  "reply": "I don't know if 'Fakecity' exists or I'm not sure about this place. Could you please recheck the name?",
  "location_info": null,
  "weather_data": null,
  "places_data": null
}
```