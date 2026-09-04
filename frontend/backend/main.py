"""
Sign Language Translator - Backend
Handles: landmark extraction (MediaPipe), sign prediction, sentence smoothing.

Run locally with:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import mediapipe as mp

app = FastAPI(title="Sign Language Translator API")

# Allow the React frontend (running on a different port) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this before final submission
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MediaPipe setup ---
mp_hands = mp.solutions.hands
mp_face_mesh = mp.solutions.face_mesh

hands_detector = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.5,
)

face_detector = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.5,
)


def extract_landmarks(image_bgr):
    """
    Given a BGR image (from OpenCV), run MediaPipe Hands + Face Mesh
    and return a flat feature vector.
    Returns None if no hand is detected.
    """
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)

    hand_results = hands_detector.process(image_rgb)
    face_results = face_detector.process(image_rgb)

    if not hand_results.multi_hand_landmarks:
        return None

    features = []

    for hand_landmarks in hand_results.multi_hand_landmarks:
        for lm in hand_landmarks.landmark:
            features.extend([lm.x, lm.y, lm.z])

    expected_hand_values = 21 * 3 * 2
    while len(features) < expected_hand_values:
        features.append(0.0)

    KEY_FACE_POINTS = [70, 105, 107, 336, 334, 1, 152]
    if face_results.multi_face_landmarks:
        face_landmarks = face_results.multi_face_landmarks[0]
        for idx in KEY_FACE_POINTS:
            lm = face_landmarks.landmark[idx]
            features.extend([lm.x, lm.y, lm.z])
    else:
        features.extend([0.0] * (len(KEY_FACE_POINTS) * 3))

    return np.array(features)


@app.get("/")
def root():
    return {"status": "Sign Language Translator API running"}


@app.post("/extract-landmarks")
async def extract_landmarks_endpoint(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    landmarks = extract_landmarks(image)
    if landmarks is None:
        return {"detected": False, "landmarks": None}

    return {"detected": True, "landmarks": landmarks.tolist()}


@app.post("/predict-sign")
async def predict_sign(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    landmarks = extract_landmarks(image)
    if landmarks is None:
        return {"detected": False, "sign": None}

    # TODO: load real trained model instead of this placeholder
    # import joblib
    # model = joblib.load("models/classifier.pkl")
    # prediction = model.predict([landmarks])[0]

    prediction = "PLACEHOLDER_SIGN"  # replace once model is trained

    return {"detected": True, "sign": prediction}


@app.post("/smooth-sentence")
async def smooth_sentence(words: list[str]):
    # TODO: replace with real LLM API call
    fallback_sentence = " ".join(words)
    return {"sentence": fallback_sentence, "note": "LLM smoothing not wired in yet"}