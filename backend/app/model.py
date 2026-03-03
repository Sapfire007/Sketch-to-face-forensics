import numpy as np
from PIL import Image

try:
    import tflite_runtime.interpreter as tflite
except ImportError:
    # tflite_runtime not available on Windows — use TensorFlow's bundled interpreter
    import tensorflow.lite as tflite

from app.config import MODEL_PATH

class SketchToPhotoModel:
    def __init__(self):
        self.interpreter = None
        self.input_details = None
        self.output_details = None

    def load(self):
        """Load the TFLite model"""
        print(f"Loading TFLite model from {MODEL_PATH}...")
        self.interpreter = tflite.Interpreter(model_path=MODEL_PATH)
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()
        print("Model loaded successfully!")

    def predict(self, image: Image.Image) -> np.ndarray:
        """Generate photo from sketch"""
        # Preprocess
        image = image.convert("RGB").resize((256, 256))
        image_array = np.array(image).astype('float32') / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        # Run inference
        self.interpreter.set_tensor(self.input_details[0]['index'], image_array)
        self.interpreter.invoke()
        prediction = self.interpreter.get_tensor(self.output_details[0]['index'])

        # Postprocess
        output = (prediction[0] * 255).astype(np.uint8)
        output = np.clip(output, 0, 255)
        return output

# Global model instance
ml_model = SketchToPhotoModel()