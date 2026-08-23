import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import preprocess_input


IMG_SIZE = (224, 224)

TARGET_LAYER = "conv5_block3_out"


def generate_gradcam(model, image_path):
    """
    Generate Grad-CAM for the predicted class.
    Uses the same image preprocessing as NeuDetect prediction.
    """

    # ---------------------------------------------------------
    # 1. Load image
    # ---------------------------------------------------------

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError("Unable to read the uploaded MRI image.")

    original_image = image.copy()

    # ---------------------------------------------------------
    # 2. Resize image
    # ---------------------------------------------------------

    resized = cv2.resize(
        image,
        IMG_SIZE
    )

    # ---------------------------------------------------------
    # 3. Convert BGR -> RGB
    # ---------------------------------------------------------

    resized = cv2.cvtColor(
        resized,
        cv2.COLOR_BGR2RGB
    )

    # ---------------------------------------------------------
    # 4. Same preprocessing used by NeuDetect
    # ---------------------------------------------------------

    resized = resized.astype(np.float32)

    resized = preprocess_input(resized)

    input_image = np.expand_dims(
        resized,
        axis=0
    )

    # ---------------------------------------------------------
    # 5. Get target convolutional layer
    # ---------------------------------------------------------

    target_layer = model.get_layer(
        TARGET_LAYER
    )

    # ---------------------------------------------------------
    # 6. Create Grad-CAM model
    # ---------------------------------------------------------

    grad_model = tf.keras.models.Model(
        inputs=model.inputs,
        outputs=[
            target_layer.output,
            model.output
        ]
    )

    # ---------------------------------------------------------
    # 7. Calculate gradients
    # ---------------------------------------------------------

    with tf.GradientTape() as tape:

        conv_outputs, predictions = grad_model(
            input_image
        )

        predicted_class = tf.argmax(
            predictions[0]
        )

        class_score = predictions[
            :, predicted_class
        ]

    gradients = tape.gradient(
        class_score,
        conv_outputs
    )

    # ---------------------------------------------------------
    # 8. Global average pooling of gradients
    # ---------------------------------------------------------

    pooled_gradients = tf.reduce_mean(
        gradients,
        axis=(1, 2)
    )

    # Remove batch dimension
    conv_outputs = conv_outputs[0]

    pooled_gradients = pooled_gradients[0]

    # ---------------------------------------------------------
    # 9. Weight feature maps
    # ---------------------------------------------------------

    heatmap = tf.reduce_sum(
        conv_outputs * pooled_gradients,
        axis=-1
    )

    # ---------------------------------------------------------
    # 10. ReLU
    # ---------------------------------------------------------

    heatmap = tf.maximum(
        heatmap,
        0
    )

    # ---------------------------------------------------------
    # 11. Normalize heatmap
    # ---------------------------------------------------------

    max_heatmap = tf.reduce_max(
        heatmap
    )

    if max_heatmap > 0:
        heatmap = heatmap / max_heatmap

    heatmap = heatmap.numpy()

    # ---------------------------------------------------------
    # 12. Resize heatmap to original MRI size
    # ---------------------------------------------------------

    heatmap = cv2.resize(
        heatmap,
        (
            original_image.shape[1],
            original_image.shape[0]
        )
    )

    # ---------------------------------------------------------
    # 13. Convert heatmap to image
    # ---------------------------------------------------------

    heatmap_uint8 = np.uint8(
        255 * heatmap
    )

    heatmap_color = cv2.applyColorMap(
        heatmap_uint8,
        cv2.COLORMAP_JET
    )

    # ---------------------------------------------------------
    # 14. Create Grad-CAM overlay
    # ---------------------------------------------------------

    overlay = cv2.addWeighted(
        original_image,
        0.60,
        heatmap_color,
        0.40,
        0
    )

    # ---------------------------------------------------------
    # 15. Prediction information
    # ---------------------------------------------------------

    predicted_index = int(
        tf.argmax(
            predictions[0]
        ).numpy()
    )

    confidence = float(
        tf.reduce_max(
            predictions[0]
        ).numpy()
    )

    return {
        "overlay": overlay,
        "heatmap": heatmap,
        "predicted_index": predicted_index,
        "confidence": confidence
    }