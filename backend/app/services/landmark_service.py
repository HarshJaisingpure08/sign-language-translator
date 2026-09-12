"""
This is where the actual "business logic" lives - equivalent to a
controller function in Express. Routes will just call these functions
and return the result; routes should never contain heavy logic themselves.
"""

import cv2
import numpy as np
import mediapipe as mp

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

KEY_FACE_POINTS = [70, 105, 107, 336, 334, 1, 152]


def decode_image(image_bytes: bytes) -> np.ndarray:
    """Convert raw uploaded file bytes into an OpenCV image."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)


def extract_landmarks(image_bgr: np.ndarray):
    """
    Returns a flat NumPy array (hand + face landmarks combined),
    or None if no hand was found in the frame.
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

    if face_results.multi_face_landmarks:
        face_landmarks = face_results.multi_face_landmarks[0]
        for idx in KEY_FACE_POINTS:
            lm = face_landmarks.landmark[idx]
            features.extend([lm.x, lm.y, lm.z])
    else:
        features.extend([0.0] * (len(KEY_FACE_POINTS) * 3))

    return np.array(features)

FACIAL_MARKER_POINTS = [105, 334, 159, 386, 33, 263]  # the specific points facial_marker_service needs


def extract_face_landmarks_dict(image_bgr):
    """
    Returns facial landmarks as a dictionary {landmark_index: (x, y)},
    which is the format facial_marker_service.py needs for its geometry
    calculations. Returns None if no face is detected.
    """
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    face_results = face_detector.process(image_rgb)

    if not face_results.multi_face_landmarks:
        return None

    face_landmarks = face_results.multi_face_landmarks[0]
    landmarks_dict = {}

    for idx in FACIAL_MARKER_POINTS:
        lm = face_landmarks.landmark[idx]
        landmarks_dict[idx] = (lm.x, lm.y)

    return landmarks_dict