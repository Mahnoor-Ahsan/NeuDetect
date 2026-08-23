from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

import shutil
import os
import uuid
import cv2

from app.models.model_loader import load_model
from app.models.analysis import Analysis
from app.models.user import User

from app.services.prediction import predict_image
from app.services.gradcam import generate_gradcam

from app.database import get_db
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/analyze",
    tags=["Analysis"],
)


UPLOAD_DIR = "app/uploads"
RESULTS_DIR = "app/results"


os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)


@router.post("/")
async def analyze(
    file: UploadFile = File(...),
    patient_name: str = Form(...),
    patient_age: str = Form(...),
    patient_gender: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    # ---------------------------------------------------------
    # 1. Validate patient information
    # ---------------------------------------------------------

    if not patient_name.strip():
        raise HTTPException(
            status_code=400,
            detail="Patient name is required.",
        )

    if not patient_age.strip():
        raise HTTPException(
            status_code=400,
            detail="Patient age is required.",
        )

    if not patient_gender.strip():
        raise HTTPException(
            status_code=400,
            detail="Patient gender is required.",
        )

    # ---------------------------------------------------------
    # 2. Validate uploaded file
    # ---------------------------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No MRI file was provided.",
        )

    if (
        not file.content_type
        or not file.content_type.startswith("image/")
    ):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid MRI image.",
        )

    # ---------------------------------------------------------
    # 3. Create unique filename
    # ---------------------------------------------------------

    file_id = str(uuid.uuid4())

    original_extension = os.path.splitext(
        file.filename
    )[1].lower()

    filename = f"{file_id}{original_extension}"

    file_path = os.path.join(
        UPLOAD_DIR,
        filename,
    )

    # ---------------------------------------------------------
    # 4. Save uploaded MRI
    # ---------------------------------------------------------

    try:

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer,
            )

        # -----------------------------------------------------
        # 5. Load NeuDetect model
        # -----------------------------------------------------

        model = load_model()

        # -----------------------------------------------------
        # 6. AI prediction
        # -----------------------------------------------------

        prediction_result = predict_image(
            file_path
        )

        # -----------------------------------------------------
        # 7. Generate Grad-CAM
        # -----------------------------------------------------

        gradcam_result = generate_gradcam(
            model,
            file_path,
        )

        # -----------------------------------------------------
        # 8. Save Grad-CAM overlay
        # -----------------------------------------------------

        gradcam_filename = (
            f"{file_id}_gradcam.jpg"
        )

        gradcam_path = os.path.join(
            RESULTS_DIR,
            gradcam_filename,
        )

        save_success = cv2.imwrite(
            gradcam_path,
            gradcam_result["overlay"],
        )

        if not save_success:
            raise HTTPException(
                status_code=500,
                detail="Failed to save Grad-CAM result.",
            )

        # -----------------------------------------------------
        # 9. Create database analysis record
        # -----------------------------------------------------

        analysis = Analysis(
            user_id=current_user.id,

            patient_name=patient_name.strip(),
            patient_age=patient_age.strip(),
            patient_gender=patient_gender.strip(),

            prediction=prediction_result["prediction"],
            confidence=prediction_result["confidence"],

            file_name=file.filename,

            mri_url=f"/uploads/{filename}",
            gradcam_url=f"/results/{gradcam_filename}",
        )

        db.add(analysis)

        db.commit()

        db.refresh(analysis)

        # -----------------------------------------------------
        # 10. Return frontend-ready response
        # -----------------------------------------------------

        return {
            "id": analysis.id,
            "prediction": analysis.prediction,
            "confidence": analysis.confidence,
            "mri_url": analysis.mri_url,
            "gradcam_url": analysis.gradcam_url,
        }

    except HTTPException:
        raise

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}",
        )