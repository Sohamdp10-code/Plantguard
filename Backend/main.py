
from contextlib import asynccontextmanager
from io import BytesIO
from pathlib import Path

import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from model_utils import load_classes, load_model, prepare_image

MAX_FILE_SIZE = 12 * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

model = None
class_names = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, class_names
    model = load_model()
    class_names = load_classes()

    output_shape = model.output_shape
    output_count = output_shape[-1]

    if output_count != len(class_names):
        raise RuntimeError(
            f"Model outputs {output_count} classes but "
            f"class_names.json contains {len(class_names)}"
        )

    yield

app = FastAPI(
    title="PlantGuard API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://plantguard-two.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "PlantGuard API is running"}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "classes": len(class_names),
    }

@app.post("/predict")
def predict(
    file: UploadFile = File(...),
    crop: str | None = Form(default=None)
):
    if model is None:
        raise HTTPException(503, "Model is not loaded")

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            400, "Upload a JPG, PNG, or WEBP image"
        )

    raw = file.file.read(MAX_FILE_SIZE + 1)
    if len(raw) > MAX_FILE_SIZE:
        raise HTTPException(413, "Image must be 12 MB or smaller")

    try:
        image = Image.open(BytesIO(raw))
        image.load()
    except (UnidentifiedImageError, OSError):
        raise HTTPException(400, "Invalid or corrupted image")

    try:
        batch = prepare_image(image, model)
        scores = model.predict(batch, verbose=0)[0]
    except Exception as exc:
        raise HTTPException(500, f"Prediction failed: {exc}")

    if not np.all(np.isfinite(scores)):
        raise HTTPException(500, "Model returned invalid scores")

    top_indices = np.argsort(scores)[::-1][:3]

    predictions = [
        {
            "label": class_names[int(i)],
            "confidence": float(scores[i])
        }
        for i in top_indices
    ]

    return {
        "predictions": predictions,
        "crop": crop
    }
