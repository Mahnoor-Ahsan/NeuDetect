from fastapi import APIRouter, UploadFile, File
import shutil
import os

from app.services.prediction import predict_image


router = APIRouter(
    prefix="/predict",
    tags=["Prediction"]
)


UPLOAD_DIR = "app/uploads"


@router.post("/")
async def predict(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )


    result = predict_image(
        file_path
    )


    return result