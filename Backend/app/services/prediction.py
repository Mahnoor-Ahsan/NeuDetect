import cv2
import numpy as np
import json

from tensorflow.keras.applications.resnet50 import preprocess_input

from app.models.model_loader import load_model


CLASS_PATH = "model/class_names.json"


with open(CLASS_PATH, "r") as file:
    class_names = json.load(file)


def predict_image(image_path):

    model = load_model()

    # ---------------------------------------------------------
    # 1. Load image
    # ---------------------------------------------------------

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError("Unable to read the MRI image.")

    # ---------------------------------------------------------
    # 2. Resize
    # ---------------------------------------------------------

    image = cv2.resize(
        image,
        (224, 224)
    )

    # ---------------------------------------------------------
    # 3. Convert BGR -> RGB
    # ---------------------------------------------------------

    image = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )

    # ---------------------------------------------------------
    # 4. IMPORTANT:
    # Use the EXACT same preprocessing used during training
    # ---------------------------------------------------------

    image = image.astype(np.float32)

    image = preprocess_input(image)

    # ---------------------------------------------------------
    # 5. Add batch dimension
    # ---------------------------------------------------------

    image = np.expand_dims(
        image,
        axis=0
    )

    # ---------------------------------------------------------
    # 6. Prediction
    # ---------------------------------------------------------

    prediction = model.predict(
        image,
        verbose=0
    )

    predicted_index = int(
        np.argmax(prediction[0])
    )

    confidence = float(
        np.max(prediction[0])
    )

    # ---------------------------------------------------------
    # 7. Return result
    # ---------------------------------------------------------

    return {
        "prediction": class_names[predicted_index],
        "confidence": round(confidence * 100, 2)
    }