import os
import base64

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.gradcam import generate_gradcam
from app.services.prediction import model


router = APIRouter(
    prefix="/gradcam",
    tags=["Explainable AI"]
)


@router.post("/")
async def gradcam(file: UploadFile = File(...)):

    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid MRI image."
        )

    # Temporary upload path
    upload_dir = "app/uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(
        upload_dir,
        file.filename
    )

    # Save uploaded image
    contents = await file.read()

    with open(file_path, "wb") as f:
        f.write(contents)

    try:

        # Generate Grad-CAM
        overlay, heatmap = generate_gradcam(
            model,
            file_path
        )

        # Encode overlay image as JPEG
        import cv2

        success, encoded_image = cv2.imencode(
            ".jpg",
            overlay
        )

        if not success:
            raise HTTPException(
                status_code=500,
                detail="Failed to encode Grad-CAM image."
            )

        image_base64 = base64.b64encode(
            encoded_image.tobytes()
        ).decode("utf-8")

        return {
            "message": "Grad-CAM generated successfully",
            "target_layer": "last convolutional layer",
            "heatmap_image": image_base64
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        # Remove temporary uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)