from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analysis import Analysis
from app.models.user import User
from app.utils.dependencies import get_current_user


router = APIRouter(
    prefix="/analyses",
    tags=["Analyses"],
)


def serialize_analysis(analysis: Analysis):
    return {
        "id": analysis.id,
        "patient": {
            "name": analysis.patient_name,
            "age": analysis.patient_age,
            "gender": analysis.patient_gender,
        },
        "prediction": analysis.prediction,
        "confidence": analysis.confidence,
        "fileName": analysis.file_name,
        "mri_url": analysis.mri_url,
        "gradcam_url": analysis.gradcam_url,
        "analyzedAt": (
            analysis.analyzed_at.isoformat()
            if analysis.analyzed_at
            else None
        ),
    }


@router.get("/")
def get_analyses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    statement = (
        select(Analysis)
        .where(
            Analysis.user_id == current_user.id
        )
        .order_by(
            Analysis.analyzed_at.desc()
        )
    )

    analyses = (
        db.execute(statement)
        .scalars()
        .all()
    )

    return [
        serialize_analysis(analysis)
        for analysis in analyses
    ]


@router.get("/{analysis_id}")
def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    statement = (
        select(Analysis)
        .where(
            Analysis.id == analysis_id,
            Analysis.user_id == current_user.id,
        )
    )

    analysis = (
        db.execute(statement)
        .scalar_one_or_none()
    )

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found.",
        )

    return serialize_analysis(analysis)