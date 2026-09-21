"""
CarePredict AI - FastAPI Backend API Server
Provides production REST API endpoints for Predictive Healthcare Analytics Platform.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

app = FastAPI(
    title="CarePredict AI REST API",
    description="Predictive Healthcare Analytics Platform API backend. Uses synthetic data for demonstration.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "CarePredict AI Backend Server",
        "version": "1.0.0",
        "disclaimer": "Synthetic Data / Research Prototype. Not suitable for real clinical decisions."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
