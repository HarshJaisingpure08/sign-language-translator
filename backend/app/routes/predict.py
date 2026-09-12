"""
Routes stay THIN - just receive the request, call the service,
return the response. No MediaPipe or classifier logic belongs here.
"""

from fastapi import APIRouter, UploadFile, File

from app.services import landmark_service, classifier_service
from app.schemas.schemas import LandmarkResponse, PredictionResponse

router = APIRouter()


@router.post("/extract-landmarks", response_model=LandmarkResponse)
async def extract_landmarks_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    image = landmark_service.decode_image(contents)

    landmarks = landmark_service.extract_landmarks(image)
    if landmarks is None:
        return LandmarkResponse(detected=False, landmarks=None)

    return LandmarkResponse(detected=True, landmarks=landmarks.tolist())


@router.post("/predict-sign", response_model=PredictionResponse)
async def predict_sign_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    image = landmark_service.decode_image(contents)

    landmarks = landmark_service.extract_landmarks(image)
    if landmarks is None:
        return PredictionResponse(detected=False, sign=None, confidence=None)

    predicted_sign, confidence = classifier_service.predict_sign(landmarks)
    return PredictionResponse(detected=True, sign=predicted_sign, confidence=confidence)