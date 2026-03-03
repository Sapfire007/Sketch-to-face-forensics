import os
from pathlib import Path

# Get the backend directory (parent of app/)
BASE_DIR = Path(__file__).resolve().parent.parent

# TFLite model path
MODEL_PATH = str(BASE_DIR / "model" / "sketch_to_image_final_model.tflite")

# Verify model exists at startup
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model file not found at: {MODEL_PATH}\n"
        f"Please place 'sketch_to_image_final_model.tflite' in the 'model' directory"
    )

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg"]
CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "https://*.onrender.com",
    "https://*.vercel.app",
]

print(f"✓ Model path: {MODEL_PATH}")