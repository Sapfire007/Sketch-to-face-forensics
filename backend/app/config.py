import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# On Vercel/serverless, write to /tmp; locally use the model/ directory
if os.environ.get("VERCEL") or os.environ.get("MODEL_URL"):
    MODEL_PATH = "/tmp/sketch_to_image_final_model.tflite"
else:
    MODEL_PATH = str(BASE_DIR / "model" / "sketch_to_image_final_model.tflite")
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model file not found at: {MODEL_PATH}\n"
            f"Please place 'sketch_to_image_final_model.tflite' in the 'model' directory"
        )

MODEL_URL = os.environ.get("MODEL_URL", "")

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