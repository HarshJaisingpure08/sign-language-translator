from typing import Optional
from pydantic import BaseModel, Field


class LandmarkResponse(BaseModel):
    detected: bool
    landmarks: Optional[list[float]] = None


class PredictionResponse(BaseModel):
    detected: bool
    sign: Optional[str] = None
    confidence: Optional[float] = None


class SentenceRequest(BaseModel):
    words: list[str] = Field(default_factory=list)
    facial_context: str = "neutral"  # "question" | "emphasis" | "neutral"


class SentenceResponse(BaseModel):
    sentence: str
    note: Optional[str] = None


class CalibrationResponse(BaseModel):
    calibrated: bool
    baseline_ratio: Optional[float] = None


class FacialMarkerResponse(BaseModel):
    detected: bool
    label: Optional[str] = None
    eyebrow_ratio: Optional[float] = None
    tilt_angle: Optional[float] = None


class TranslationSessionRequest(BaseModel):
    words: list[str] = Field(default_factory=list)
    sign_confidences: list[float] = Field(default_factory=list)
    facial_context: str = "neutral"
    facial_confidence: Optional[float] = None


class TranslationSessionResponse(BaseModel):
    raw_sequence: list[str] = Field(default_factory=list)
    facial_context: str
    sentence: str
    sign_confidence: Optional[float] = None
    facial_confidence: Optional[float] = None