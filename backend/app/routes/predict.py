"""
Routes for landmark extraction and sign prediction.
Runs CPU-heavy inference in worker threads to prevent event-loop starvation.
"""

from fastapi import APIRouter, UploadFile, File
from app.services import landmark_service, classifier_service
from app.schemas.schemas import LandmarkResponse, PredictionResponse

router = APIRouter()


@router.post("/extract-landmarks", response_model=LandmarkResponse)
def extract_landmarks_endpoint(file: UploadFile = File(...)):
    contents = file.file.read()
    image = landmark_service.decode_image(contents)
    if image is None:
        return LandmarkResponse(detected=False, landmarks=None)

    landmarks = landmark_service.extract_landmarks(image)
    if landmarks is None:
        return LandmarkResponse(detected=False, landmarks=None)

    return LandmarkResponse(detected=True, landmarks=landmarks.tolist())


@router.post("/predict-sign", response_model=PredictionResponse)
def predict_sign_endpoint(file: UploadFile = File(...)):
    contents = file.file.read()
    image = landmark_service.decode_image(contents)
    if image is None:
        return PredictionResponse(detected=False, sign=None, confidence=None)

    landmarks = landmark_service.extract_landmarks(image)
    if landmarks is None:
        return PredictionResponse(detected=False, sign=None, confidence=None)

    predicted_sign, confidence = classifier_service.predict_sign(landmarks)
    if predicted_sign is None:
        return PredictionResponse(detected=False, sign=None, confidence=None)

    return PredictionResponse(detected=True, sign=str(predicted_sign), confidence=confidence)