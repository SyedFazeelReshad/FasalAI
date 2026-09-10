import io
import json
import os
from pathlib import Path
from typing import Dict, Any, Optional

import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model


MODEL_CACHE: Dict[str, Any] = {}
LABELS_CACHE: Dict[str, Dict[str, str]] = {}


def _get_ml_models_dir() -> Path:
    """Get the ML models directory path with fallback."""
    # Try relative to this file: backend/app/services/ -> project_root/ml/models
    base = Path(__file__).resolve().parents[3] / "ml" / "models"
    if base.exists():
        return base
    # Fallback: current working directory
    cwd = Path.cwd() / "ml" / "models"
    if cwd.exists():
        return cwd
    # Last resort: return the first one (will raise on use if not found)
    return base


ML_MODELS_DIR = _get_ml_models_dir()
CROP_MODEL_MAP_PATH = ML_MODELS_DIR / "crop_model_map.json"

with open(CROP_MODEL_MAP_PATH, "r") as f:
    CROP_MODEL_MAP = json.load(f)


def _get_crop_key(crop_name: str) -> Optional[str]:
    """Map crop name to model key (case-insensitive, spaces to underscores)."""
    normalized = crop_name.strip().lower().replace(" ", "_")
    if normalized in CROP_MODEL_MAP:
        return normalized
    if normalized in ["mango_fruit", "mango"]:
        return "mango_fruit"
    return None


def _load_model_and_labels(crop_key: str) -> tuple:
    """Load model and labels for a crop key, using cache."""
    if crop_key in MODEL_CACHE and crop_key in LABELS_CACHE:
        return MODEL_CACHE[crop_key], LABELS_CACHE[crop_key]

    if crop_key in CROP_MODEL_MAP:
        model_file = CROP_MODEL_MAP[crop_key]["model_file"]
        labels_file = CROP_MODEL_MAP[crop_key]["labels_file"]
    elif crop_key == "mango_fruit":
        model_file = "mango_fruit_model.h5"
        labels_file = "mango_fruit_labels.json"
    else:
        raise ValueError(f"Unsupported crop: {crop_key}")

    model_path = ML_MODELS_DIR / model_file
    labels_path = ML_MODELS_DIR / labels_file

    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")
    if not labels_path.exists():
        raise FileNotFoundError(f"Labels file not found: {labels_path}")

    model = load_model(str(model_path))
    with open(labels_path, "r") as f:
        labels = json.load(f)

    MODEL_CACHE[crop_key] = model
    LABELS_CACHE[crop_key] = labels
    return model, labels


def predict_crop_disease(image_bytes: bytes, crop_name: str) -> dict:
    """
    Predict crop disease from image bytes.

    Args:
        image_bytes: Raw image bytes
        crop_name: Name of the crop (e.g., "cotton", "maize", "mango fruit")

    Returns:
        Dictionary with prediction results including:
        - predicted_class: str
        - confidence: float (0-100)
        - all_probabilities: dict of class_name -> probability (0-100)
        - is_low_confidence: bool
        - requires_field_verification: bool
    """
    crop_key = _get_crop_key(crop_name)
    if not crop_key:
        raise ValueError(f"Unsupported crop: {crop_name}")

    model, labels = _load_model_and_labels(crop_key)

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array, verbose=0)[0]
    predicted_idx = int(np.argmax(predictions))
    confidence = float(predictions[predicted_idx] * 100)
    predicted_class = labels.get(str(predicted_idx), f"class_{predicted_idx}")

    all_probabilities = {
        labels.get(str(i), f"class_{i}"): float(prob * 100)
        for i, prob in enumerate(predictions)
    }

    is_low_confidence = confidence < 50.0
    requires_field_verification = is_low_confidence

    return {
        "predicted_class": predicted_class,
        "confidence": round(confidence, 2),
        "all_probabilities": {k: round(v, 2) for k, v in all_probabilities.items()},
        "is_low_confidence": is_low_confidence,
        "requires_field_verification": requires_field_verification,
    }
