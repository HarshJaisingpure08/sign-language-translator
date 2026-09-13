"""
Loads the trained classifier and runs predictions on hand landmarks.
"""

from pathlib import Path
import logging
from typing import Optional, Tuple
import joblib

logger = logging.getLogger(__name__)

# Absolute path to model file
_MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "classifier.pkl"

_model = None
try:
    if _MODEL_PATH.exists():
        _model = joblib.load(_MODEL_PATH)
        logger.info("Classifier loaded successfully from %s", _MODEL_PATH)
    else:
        logger.warning("Classifier file not found at %s. Predictions will be unavailable.", _MODEL_PATH)
except Exception as e:
    logger.error("Failed to load classifier: %s", e)

HAND_FEATURE_LENGTH = 126


def predict_sign(landmarks) -> Tuple[Optional[str], float]:
    """
    Takes the landmark array (126 values),
    returns (predicted_sign, confidence_score).
    """
    if _model is None:
        logger.warning("Classifier model is not loaded.")
        return None, 0.0

    if landmarks is None or len(landmarks) < HAND_FEATURE_LENGTH:
        return None, 0.0

    hand_only = landmarks[:HAND_FEATURE_LENGTH]

    try:
        prediction = _model.predict([hand_only])[0]
        probabilities = _model.predict_proba([hand_only])[0]
        confidence = float(max(probabilities))
        return str(prediction), round(confidence, 2)
    except Exception as e:
        logger.error("Prediction error: %s", e)
        return None, 0.0