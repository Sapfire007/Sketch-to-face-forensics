import numpy as np
from PIL import Image
from keras.models import load_model
from app.config import MODEL_PATH

class SketchToPhotoModel:
    def __init__(self):
        self.model = None
    
    def load(self):
        """Load the Keras model"""
        print(f"Loading model from {MODEL_PATH}...")
        self.model = load_model(MODEL_PATH)
        print("Model loaded successfully!")
    
    def predict(self, image: Image.Image) -> np.ndarray:
        """Generate photo from sketch"""
        # Preprocess
        image = image.convert("RGB").resize((256, 256))
        image_array = np.array(image).astype('float32') / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        
        # Predict
        prediction = self.model.predict(image_array, verbose=0)
        
        # Postprocess
        output = (prediction[0] * 255).astype(np.uint8)
        output = np.clip(output, 0, 255)
        
        return output

# Global model instance
ml_model = SketchToPhotoModel()