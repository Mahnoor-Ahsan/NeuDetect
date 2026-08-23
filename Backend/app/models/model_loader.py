import tensorflow as tf
import os

MODEL_PATH = os.path.join(
    "model",
    "NeuDetect_ResNet50.keras"
)

model = None


def load_model():
    global model

    if model is None:
        print("Loading NeuDetect AI model...")

        model = tf.keras.models.load_model(
            MODEL_PATH
        )

        print("NeuDetect AI model loaded successfully.")

    return model