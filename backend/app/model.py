import os
import urllib.request
import numpy as np
from PIL import Image

try:
    from ai_edge_litert.interpreter import Interpreter as TFLiteInterpreter
except ImportError:
    try:
        import tflite_runtime.interpreter as _tflite
        TFLiteInterpreter = _tflite.Interpreter
    except ImportError:
        import tensorflow.lite as _tflite
        TFLiteInterpreter = _tflite.Interpreter

from app.config import MODEL_PATH, MODEL_URL


def _ensure_model():
    """Download model to /tmp if running on serverless and not yet cached."""
    if not os.path.exists(MODEL_PATH):
        if not MODEL_URL:
            raise RuntimeError(
                "Model file not found and MODEL_URL env var is not set."
            )
        print(f"Downloading model from {MODEL_URL} ...")
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        print(f"Model downloaded to {MODEL_PATH} ({os.path.getsize(MODEL_PATH) / 1e6:.1f} MB)")


class SketchToPhotoModel:
    def __init__(self):
        self.interpreter = None
        self.input_details = None
        self.output_details = None

    def load(self):
        """Ensure model is present then load the TFLite interpreter."""
        _ensure_model()
        print(f"Loading TFLite model from {MODEL_PATH}...")
        self.interpreter = TFLiteInterpreter(model_path=MODEL_PATH)
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()
        print("Model loaded successfully!")

    def predict(self, image: Image.Image) -> np.ndarray:
        """Generate photo from sketch"""
        image = image.convert("RGB").resize((256, 256))
        image_array = np.array(image).astype('float32') / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        self.interpreter.set_tensor(self.input_details[0]['index'], image_array)
        self.interpreter.invoke()
        prediction = self.interpreter.get_tensor(self.output_details[0]['index'])

        output = (prediction[0] * 255).astype(np.uint8)
        output = np.clip(output, 0, 255)
        return output


ml_model = SketchToPhotoModel()