
import json
import os
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image, ImageOps

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "plantguard_efficientnet.keras"
CLASS_PATH = BASE_DIR / "class_names.json"

# This model (PlantGuard_EfficientNetB0) has its own Rescaling + Normalization
# layers baked into the graph (confirmed by inspecting config.json inside the
# .keras file), so the API must feed it RAW 0-255 pixel values. Dividing by
# 255 here (like the old MobileNet model needed) would double-normalize the
# input and silently wreck prediction accuracy.
# Options: "zero_one", "minus_one_one", "none"
PREPROCESS_MODE = os.getenv("PREPROCESS_MODE", "none")

def load_classes():
    with open(CLASS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def load_model():
    model = tf.keras.models.load_model(
        MODEL_PATH,
        compile=False
    )

    print("Model input:", model.input_shape)
    print("Model output:", model.output_shape)
    print("Potential preprocessing layers:")
    for layer in model.layers:
        if isinstance(layer, tf.keras.layers.Rescaling):
            print("Rescaling:", layer.get_config())

    return model

def prepare_image(image: Image.Image, model):
    image = ImageOps.exif_transpose(image).convert("RGB")

    input_shape = model.input_shape
    height = input_shape[1] or 160
    width = input_shape[2] or 160

    image = image.resize((width, height))
    array = np.asarray(image, dtype=np.float32)

    if PREPROCESS_MODE == "zero_one":
        array = array / 255.0
    elif PREPROCESS_MODE == "minus_one_one":
        array = (array / 127.5) - 1.0
    elif PREPROCESS_MODE == "none":
        pass
    else:
        raise ValueError("Invalid PREPROCESS_MODE")

    return np.expand_dims(array, axis=0)
