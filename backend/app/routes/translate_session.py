"""
Combines sign detection results and facial grammar context into a final translation response.
"""

from fastapi import APIRouter
from app.services import llm_service
from app.schemas.schemas import TranslationSessionRequest, TranslationSessionResponse

router = APIRouter()


@router.post("/translate-session", response_model=TranslationSessionResponse)
def translate_session(request: TranslationSessionRequest):
    sentence = llm_service.smooth_words_into_sentence(
        request.words, request.facial_context
    )

    avg_sign_confidence = None
    if request.sign_confidences:
        avg_sign_confidence = round(
            sum(request.sign_confidences) / len(request.sign_confidences), 2
        )

    return TranslationSessionResponse(
        raw_sequence=request.words,
        facial_context=request.facial_context,
        sentence=sentence,
        sign_confidence=avg_sign_confidence,
        facial_confidence=request.facial_confidence,
    )