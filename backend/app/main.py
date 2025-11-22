from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import asyncio

from .models import QueryRequest, QueryResponse
from .agents.parent_agent import ParentAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Multi-Agent Tourism API",
    description="A sophisticated AI travel assistant using multiple specialized agents",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global parent agent instance
parent_agent = ParentAgent()


@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    logger.info("Starting Multi-Agent Tourism API...")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup resources"""
    logger.info("Shutting down Multi-Agent Tourism API...")
    await parent_agent.close()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Multi-Agent Tourism API is running!"}


@app.get("/health")
async def health_check():
    """Detailed health check with keep-alive"""
    return {
        "status": "healthy",
        "message": "Multi-Agent Tourism API is operational",
        "version": "1.0.0",
        "timestamp": str(asyncio.get_event_loop().time())
    }


@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """
    Process a travel-related query using the multi-agent system.

    Args:
        request: QueryRequest containing the user's message

    Returns:
        QueryResponse with the agent's reply and structured data
    """
    try:
        if not request.message.strip():
            raise HTTPException(
                status_code=400, detail="Message cannot be empty")

        logger.info(f"Processing query: {request.message}")

        # Process the query using the parent agent
        result = await parent_agent.process_query(request.message)

        # Create response
        response = QueryResponse(
            reply=result["reply"],
            location_info=result["location_info"],
            weather_data=result["weather_data"],
            places_data=result["places_data"]
        )

        logger.info(f"Query processed successfully")
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/stats")
async def get_stats():
    """Get basic statistics about the API usage"""
    return {
        "cache_size": len(parent_agent.cache),
        "status": "operational"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
