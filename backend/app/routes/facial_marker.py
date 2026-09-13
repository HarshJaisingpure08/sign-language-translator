"""
Endpoints for facial calibration and live facial marker interpretation.
"""

from fastapi import APIRouter, UploadFile, File
from app.services import landmark_service, facial_marker_service
from app.schemas.schemas import CalibrationResponse, FacialMarkerResponse

router = APIRouter()

# Default baseline ratio if uncalibrated
_baseline_ratio = None


@router.post("/calibrate-face", response_model=CalibrationResponse)
def calibrate_face(file: UploadFile = File(...)):
    global _baseline_ratio

    contents = file.file.read()
    image = landmark_service.decode_image(contents)
    if image is None:
        return CalibrationResponse(calibrated=False, baseline_ratio=None)

    face_landmarks = landmark_service.extract_face_landmarks_dict(image)
    if face_landmarks is None:
        return CalibrationResponse(calibrated=False, baseline_ratio=None)

    _baseline_ratio = facial_marker_service.compute_eyebrow_raise_ratio(face_landmarks)
    return CalibrationResponse(calibrated=True, baseline_ratio=round(_baseline_ratio, 3))


@router.post("/detect-facial-marker", response_model=FacialMarkerResponse)
def detect_facial_marker(file: UploadFile = File(...)):
    contents = file.file.read()
    image = landmark_service.decode_image(contents)
    if image is None:
        return FacialMarkerResponse(detected=False)

    face_landmarks = landmark_service.extract_face_landmarks_dict(image)
    if face_landmarks is None:
        return FacialMarkerResponse(detected=False)

    baseline = _baseline_ratio if (_baseline_ratio is not None and _baseline_ratio > 0) else 0.35
    result = facial_marker_service.interpret_facial_marker(face_landmarks, baseline)

    return FacialMarkerResponse(
        detected=True,
        label=result["label"],
        eyebrow_ratio=result["eyebrow_ratio"],
        tilt_angle=result["tilt_angle"],
    )