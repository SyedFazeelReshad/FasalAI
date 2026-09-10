from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from typing import Dict, Any

from app.services.ml_service import predict_crop_disease

router = APIRouter(prefix="/predict", tags=["predictions"])


def _generate_advisory(predicted_class: str, confidence: float) -> Dict[str, Any]:
    """Generate agricultural advisory based on predicted disease."""
    disease_lower = predicted_class.lower()

    if "healthy" in disease_lower:
        return {
            "symptoms": "No disease symptoms detected. Plant appears healthy.",
            "immediate_actions": [
                "Continue current crop management practices",
                "Maintain regular monitoring schedule",
                "Ensure proper irrigation and fertilization"
            ],
            "prevention": [
                "Follow crop rotation schedule",
                "Use certified disease-free seeds",
                "Maintain field sanitation"
            ],
            "expert_note": "No immediate expert consultation needed unless symptoms appear."
        }

    is_fungal = any(term in disease_lower for term in ["blight", "mildew", "mould", "rust", "spot", "wilt", "rot", "anthracnose", "canker"])
    is_viral = any(term in disease_lower for term in ["virus", "curl", "mosaic"])
    is_bacterial = any(term in disease_lower for term in ["bacterial", "canker", "blight"])

    if is_fungal:
        symptoms = "Fungal infection detected. Typical symptoms include leaf spots, wilting, discoloration, or powdery growth."
        actions = [
            "Remove and destroy infected plant parts immediately",
            "Apply appropriate fungicide as per local agricultural guidelines",
            "Improve air circulation around plants",
            "Avoid overhead irrigation to reduce leaf wetness"
        ]
        prevention = [
            "Use resistant varieties when available",
            "Practice crop rotation with non-host crops",
            "Ensure proper plant spacing for airflow",
            "Apply preventive fungicide sprays during favorable conditions"
        ]
    elif is_viral:
        symptoms = "Viral disease detected. Symptoms include leaf curling, mosaic patterns, stunting, or yellowing."
        actions = [
            "Remove and destroy infected plants to prevent spread",
            "Control insect vectors (aphids, whiteflies) with appropriate measures",
            "Disinfect tools and equipment between plants"
        ]
        prevention = [
            "Use virus-free certified seeds/seedlings",
            "Control weed hosts that harbor viruses",
            "Implement vector control strategies early",
            "Practice strict sanitation in field operations"
        ]
    elif is_bacterial:
        symptoms = "Bacterial disease detected. Symptoms include water-soaked lesions, wilting, cankers, or oozing."
        actions = [
            "Remove infected plant material",
            "Apply copper-based bactericides as per recommendations",
            "Avoid working in fields when plants are wet",
            "Improve soil drainage"
        ]
        prevention = [
            "Use disease-free seeds and transplants",
            "Rotate with non-host crops for 2-3 years",
            "Avoid overhead irrigation",
            "Sanitize tools and equipment regularly"
        ]
    else:
        symptoms = f"Disease detected: {predicted_class}. Specific symptoms vary by pathogen."
        actions = [
            "Consult local agricultural extension officer for specific treatment",
            "Remove severely affected plant parts",
            "Follow integrated pest management practices"
        ]
        prevention = [
            "Maintain field hygiene and crop rotation",
            "Use resistant varieties when available",
            "Monitor regularly for early detection"
        ]

    risk = "HIGH" if confidence >= 70 else "MODERATE" if confidence >= 40 else "LOW"

    return {
        "symptoms": symptoms,
        "immediate_actions": actions,
        "prevention": prevention,
        "risk_level": risk,
        "expert_note": "Contact your local agricultural extension officer or plant pathologist for region-specific treatment recommendations and approved chemicals."
    }


@router.post("")
async def predict(file: UploadFile = File(...), crop: str = Form(...)):
    """
    Predict crop disease from uploaded leaf image.

    Args:
        file: Leaf image file (JPG, PNG, etc.)
        crop: Crop name (e.g., "Cotton", "Tomato", "Mango", "Maize")

    Returns:
        Prediction results with advisory information.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_bytes = await file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    try:
        result = predict_crop_disease(image_bytes, crop)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Model not available: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    predicted_class = result["predicted_class"]
    confidence = result["confidence"]
    is_low_confidence = result["is_low_confidence"]

    advisory = _generate_advisory(predicted_class, confidence)

    # Override risk_level if low confidence
    if is_low_confidence:
        advisory["risk_level"] = "LOW (uncertain)"
        advisory["expert_note"] = "Low confidence prediction. Field verification strongly recommended. " + advisory["expert_note"]

    return {
        "crop": crop,
        "predicted_disease": predicted_class,
        "confidence": confidence,
        "risk_level": advisory.get("risk_level", "medium"),
        "is_low_confidence": is_low_confidence,
        "advisory": {
            "symptoms": advisory["symptoms"],
            "immediate_actions": advisory["immediate_actions"],
            "prevention": advisory["prevention"],
            "expert_note": advisory["expert_note"]
        },
        "all_probabilities": result["all_probabilities"]
    }
