"""
Two endpoints:
1. /calibrate-face - captures a "neutral" baseline reading once
2. /detect-facial-marker - compares live readings against that baseline
"""

from fastapi import APIRouter, UploadFile, File

from app.services import landmark_service, facial_marker_service
from app.schemas.schemas import CalibrationResponse, FacialMarkerResponse

router = APIRouter()

# Stored in memory for the current session - simple approach for a
# hackathon demo (single user at a time). Starts as None until calibrated.
_baseline_ratio = None


@router.post("/calibrate-face", response_model=CalibrationResponse)
async def calibrate_face(file: UploadFile = File(...)):
    global _baseline_ratio

    contents = await file.read()
    image = landmark_service.decode_image(contents)

    face_landmarks = landmark_service.extract_face_landmarks_dict(image)
    if face_landmarks is None:
        return CalibrationResponse(calibrated=False, baseline_ratio=None)

    _baseline_ratio = facial_marker_service.compute_eyebrow_raise_ratio(face_landmarks)
    return CalibrationResponse(calibrated=True, baseline_ratio=round(_baseline_ratio, 3))


@router.post("/detect-facial-marker", response_model=FacialMarkerResponse)
async def detect_facial_marker(file: UploadFile = File(...)):
    contents = await file.read()
    image = landmark_service.decode_image(contents)

    face_landmarks = landmark_service.extract_face_landmarks_dict(image)
    if face_landmarks is None:
        return FacialMarkerResponse(detected=False)

    # If not calibrated yet, use a reasonable default rather than failing
    baseline = _baseline_ratio if _baseline_ratio is not None else 0.35

    result = facial_marker_service.interpret_facial_marker(face_landmarks, baseline)

    return FacialMarkerResponse(
        detected=True,
        label=result["label"],
        eyebrow_ratio=result["eyebrow_ratio"],
        tilt_angle=result["tilt_angle"],
    )