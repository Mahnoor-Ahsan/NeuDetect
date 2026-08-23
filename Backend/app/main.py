from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import os

from app.models.model_loader import load_model
from app.routes.prediction import router as prediction_router
from app.routes.analyze import router as analysis_router
from app.routes.analyses import router as analyses_router
from app.routes.auth import router as auth_router


app = FastAPI(
    title="NeuDetect API",
    description="AI-powered Brain Tumor Detection System",
    version="1.0"
)
# ---------------------------------------------------------
# Static image directories
# ---------------------------------------------------------

UPLOAD_DIR = "app/uploads"
RESULTS_DIR = "app/results"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_DIR),
    name="uploads"
)

app.mount(
    "/results",
    StaticFiles(directory=RESULTS_DIR),
    name="results"
)


# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load AI model when backend starts


@app.on_event("startup")
def startup_event():
    load_model()


# ---------------------------------------------------------
# API Routes
# ---------------------------------------------------------

app.include_router(
    prediction_router
)

app.include_router(
    analysis_router
)

app.include_router(
    analyses_router
)

app.include_router(
    auth_router
)
# ---------------------------------------------------------
# Health Check
# ---------------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "NeuDetect Backend is running",
        "status": "success"
    }