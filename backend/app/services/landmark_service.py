"""
Service for extracting hand landmarks and face mesh coordinates using MediaPipe.
Thread-safe and defensive against corrupt/empty frames.
"""

import threading
from typing import Optional
import cv2
import numpy as np
import mediapipe as mp

mp_hands = mp.solutions.hands
mp_face_mesh = mp.solutions.face_mesh

# Detector instances
hands_detector = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.5,
)

face_detector = mp_face_mesh.FaceMesh(
    static_image_mode=True,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
)

# Locks for thread-safe processing across concurrent requests
_hands_lock = threading.Lock()
_face_lock = threading.Lock()

# Specific landmark indices needed by facial_marker_service
FACIAL_MARKER_POINTS = [105, 334, 159, 386, 33, 263]
EXPECTED_HAND_FEATURES = 21 * 3 * 2  # 126 values


def decode_image(image_bytes: bytes) -> Optional[np.ndarray]:
    """
    Safely convert raw uploaded file bytes into an OpenCV BGR image.
    Returns None if bytes are empty or corrupt.
    """
    if not image_bytes or len(image_bytes) == 0:
        return None
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception:
        return None


def extract_landmarks(image_bgr: Optional[np.ndarray]) -> Optional[np.ndarray]:
    """
    Extracts hand landmarks (126 features) from an image.
    Returns a flat NumPy array of 126 floats, or None if no hand was found.
    """
    if image_bgr is None or image_bgr.size == 0:
        return None

    try:
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    except Exception:
        return None

    with _hands_lock:
        hand_results = hands_detector.process(image_rgb)

    if not hand_results.multi_hand_landmarks:
        return None

    features = []
    for hand_landmarks in hand_results.multi_hand_landmarks:
        for lm in hand_landmarks.landmark:
            features.extend([float(lm.x), float(lm.y), float(lm.z)])

    # Pad or slice to exactly EXPECTED_HAND_FEATURES (126)
    while len(features) < EXPECTED_HAND_FEATURES:
        features.append(0.0)

    return np.array(features[:EXPECTED_HAND_FEATURES], dtype=np.float32)


def extract_face_landmarks_dict(image_bgr: Optional[np.ndarray]) -> Optional[dict]:
    """
    Returns facial landmarks as a dictionary {landmark_index: (x, y)}
    needed for facial geometry calculation. Returns None if no face is detected.
    """
    if image_bgr is None or image_bgr.size == 0:
        return None

    try:
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    except Exception:
        return None

    with _face_lock:
        face_results = face_detector.process(image_rgb)

    if not face_results.multi_face_landmarks:
        return None

    face_landmarks = face_results.multi_face_landmarks[0]
    total_points = len(face_landmarks.landmark)

    landmarks_dict = {}
    for idx in FACIAL_MARKER_POINTS:
        if idx < total_points:
            lm = face_landmarks.landmark[idx]
            landmarks_dict[idx] = (float(lm.x), float(lm.y))
        else:
            return None

    return landmarks_dict