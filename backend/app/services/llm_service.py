"""
Handles turning a raw list of detected sign words into a natural
sentence using Google's Gemini API, enhanced with facial grammar context.
"""

import os
from dotenv import load_dotenv

load_dotenv()

_api_key = os.getenv("GEMINI_API_KEY")

_client = None
if _api_key and _api_key != "your_gemini_api_key_here":
    try:
        from google import genai
        _client = genai.Client(api_key=_api_key)
    except Exception as e:
        print(f"Warning: Failed to initialize Gemini client: {e}")


def _fallback_sentence(words: list[str], facial_context: str) -> str:
    if not words:
        return ""
    joined = " ".join(words)
    if facial_context == "question":
        return f"{joined}?"
    if facial_context == "emphasis":
        return f"{joined}!"
    return f"{joined}."


def smooth_words_into_sentence(words: list[str], facial_context: str = "neutral") -> str:
    """
    Sends detected sign words to Gemini with facial grammar context,
    returning a polished, natural sentence.
    """
    if not words:
        return ""

    if not _client:
        return _fallback_sentence(words, facial_context)

    word_list = ", ".join(words)
    context_instruction = {
        "question": "The signer's facial expression (raised eyebrows) indicates this is a QUESTION. Phrase the sentence as a natural question.",
        "emphasis": "The signer's facial expression (furrowed brows / head tilt) indicates EMPHASIS or urgency. Phrase the sentence with appropriate emphasis or urgency.",
        "neutral": "The signer's facial expression was neutral. Phrase this as a natural statement.",
    }.get(facial_context, "Phrase this as a natural statement.")

    prompt = (
        f"These are words detected from sign language in the order signed: {word_list}. "
        f"{context_instruction} "
        f"Turn them into one natural, grammatically correct sentence that reflects this context. "
        f"Only output the sentence itself, nothing else - no explanation, no markdown quotes."
    )

    try:
        response = _client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        text = response.text.strip().strip('"').strip("'")
        return text if text else _fallback_sentence(words, facial_context)
    except Exception as e:
        print(f"LLM call error: {e}")
        return _fallback_sentence(words, facial_context)