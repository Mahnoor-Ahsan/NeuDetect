from pathlib import Path

import tensorflow as tf

MODEL_PATH = (
    Path(__file__).resolve().parents[2]
    / "model"
    / "NeuDetect_ResNet50.keras"
)

model = None


def load_model():
    global model

    if model is None:
        if not MODEL_PATH.is_file():
            raise FileNotFoundError(
                f"NeuDetect model not found at: {MODEL_PATH}"
            )

        print("Loading NeuDetect AI model...")
        model = tf.keras.models.load_model(str(MODEL_PATH))
        print("NeuDetect AI model loaded successfully.")

    return model
