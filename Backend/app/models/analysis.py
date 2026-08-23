from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String

from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    patient_name = Column(
        String(150),
        nullable=True,
    )

    patient_age = Column(
        String(20),
        nullable=True,
    )

    patient_gender = Column(
        String(30),
        nullable=True,
    )

    prediction = Column(
        String(50),
        nullable=False,
    )

    confidence = Column(
        Float,
        nullable=False,
    )

    file_name = Column(
        String(255),
        nullable=True,
    )

    mri_url = Column(
        String(500),
        nullable=True,
    )

    gradcam_url = Column(
        String(500),
        nullable=True,
    )

    analyzed_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )