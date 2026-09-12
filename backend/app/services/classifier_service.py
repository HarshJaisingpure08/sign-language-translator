"""
Loads the trained classifier and runs predictions on it.
Kept separate from routes so that if you ever retrain or swap
the model, only this file needs to change.
"""

import joblib

# Loaded ONCE when the server starts - not on every request,
# since loading a model file from disk repeatedly would be slow.
_model = joblib.load("app/models/classifier.pkl")

# Our classifier was trained ONLY on hand landmarks (126 values),
# but extract_landmarks() also appends facial landmark values on
# the end for our facial-marker feature. We only want to feed the
# model the portion it was actually trained on.
HAND_FEATURE_LENGTH = 126


def predict_sign(landmarks):
    """
    Takes the full landmark array (hand + face combined),
    returns (predicted_sign, confidence_score).
    """
    hand_only = landmarks[:HAND_FEATURE_LENGTH]

    prediction = _model.predict([hand_only])[0]

    probabilities = _model.predict_proba([hand_only])[0]
    confidence = float(max(probabilities))

    return prediction, round(confidence, 2)