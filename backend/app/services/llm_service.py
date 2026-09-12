"""
Handles turning a raw list of detected sign words into a natural
sentence, using Google's Gemini API - now enhanced with facial
grammar context (question / emphasis / neutral).
"""

import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def smooth_words_into_sentence(words: list[str], facial_context: str = "neutral") -> str:
    """
    Sends the detected sign words to Gemini, along with the facial
    grammar context, and asks it to form a natural sentence that
    reflects that context (e.g., phrased as a question if the
    signer's expression indicated one).
    """
    word_list = ", ".join(words)

    # This is the key change: we tell the LLM WHAT the facial expression
    # meant grammatically, and ask it to actually use that information -
    # not just decoration, but a real instruction that changes the output.
    context_instruction = {
        "question": "The signer's facial expression (raised eyebrows) indicates this is a QUESTION. Phrase the sentence as a question.",
        "emphasis": "The signer's facial expression (furrowed brows / head tilt) indicates EMPHASIS or urgency. Phrase the sentence with appropriate emphasis or urgency.",
        "neutral": "The signer's facial expression was neutral. Phrase this as a normal statement.",
    }.get(facial_context, "Phrase this as a normal statement.")

    prompt = (
        f"These are words detected from sign language, in the order signed: {word_list}. "
        f"{context_instruction} "
        f"Turn them into one natural, grammatically correct sentence that reflects this context. "
        f"Only output the sentence itself, nothing else - no explanation, no quotes."
    )

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
        )
        return response.text.strip()
    except Exception as e:
        print(f"LLM call failed: {e}")
        return " ".join(words)