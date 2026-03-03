"""
Converts sketch_to_image_final_model.keras -> sketch_to_image_final_model.tflite
Run from the backend/ directory:
    python convert_to_tflite.py
Optional flag --float16 to apply float16 quantization (~85 MB, negligible quality loss).
"""

import argparse
import os
import tensorflow as tf

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
KERAS_PATH = os.path.join(MODEL_DIR, "sketch_to_image_final_model.keras")
TFLITE_PATH = os.path.join(MODEL_DIR, "sketch_to_image_final_model.tflite")


def convert(float16: bool = False):
    print(f"Loading model from: {KERAS_PATH}")
    model = tf.keras.models.load_model(KERAS_PATH)

    converter = tf.lite.TFLiteConverter.from_keras_model(model)

    if float16:
        print("Applying float16 quantization...")
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        converter.target_spec.supported_types = [tf.float16]
    else:
        print("Converting with full float32 precision (no quality loss)...")

    tflite_model = converter.convert()

    with open(TFLITE_PATH, "wb") as f:
        f.write(tflite_model)

    size_mb = os.path.getsize(TFLITE_PATH) / (1024 * 1024)
    print(f"Saved: {TFLITE_PATH}")
    print(f"Size:  {size_mb:.1f} MB")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--float16",
        action="store_true",
        help="Apply float16 quantization to halve model size with negligible quality loss",
    )
    args = parser.parse_args()
    convert(float16=args.float16)
