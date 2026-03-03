from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.model import ml_model
from app.routes import router

# Initialize FastAPI
app = FastAPI(
    title="SketchForge API",
    description="Transform sketches into photorealistic images",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model on startup
@app.on_event("startup")
async def startup_event():
    ml_model.load()

# Include routes
app.include_router(router)