from fastapi import APIRouter

from app.services import llm_service
from app.schemas.schemas import SentenceRequest, SentenceResponse

router = APIRouter()


@router.post("/smooth-sentence", response_model=SentenceResponse)
async def smooth_sentence_endpoint(request: SentenceRequest):
    sentence = llm_service.smooth_words_into_sentence(request.words, request.facial_context)
    return SentenceResponse(sentence=sentence)