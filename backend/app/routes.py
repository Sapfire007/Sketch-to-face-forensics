import io
import base64
from PIL import Image
from fastapi import APIRouter, File, UploadFile, HTTPException
from app.model import ml_model

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "SketchForge API", "status": "running"}

@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": ml_model.model is not None
    }

@router.post("/generate")
async def generate_photo(sketch: UploadFile = File(...)):
    """Upload sketch and generate photo"""
    
    # Validate file type
    if not sketch.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
    
    # Validate file size
    contents = await sketch.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(400, "File too large (max 10MB)")
    
    try:
        # Load image
        image = Image.open(io.BytesIO(contents))
        
        # Generate photo
        result = ml_model.predict(image)
        
        # Convert to base64
        output_image = Image.fromarray(result)
        buffer = io.BytesIO()
        output_image.save(buffer, format="PNG")
        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        return {
            "success": True,
            "image": f"data:image/png;base64,{img_base64}"
        }
    
    except Exception as e:
        raise HTTPException(500, f"Generation failed: {str(e)}")