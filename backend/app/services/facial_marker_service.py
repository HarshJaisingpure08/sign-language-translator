"""
Turns raw MediaPipe Face Mesh landmarks into grammatical labels (neutral / question / emphasis).
Uses ratios between facial features for distance invariance.
"""

import math

LEFT_EYEBROW = 105
RIGHT_EYEBROW = 334
LEFT_EYE_TOP = 159
RIGHT_EYE_TOP = 386
LEFT_EYE_OUTER = 33
RIGHT_EYE_OUTER = 263

REQUIRED_POINTS = [
    LEFT_EYEBROW, RIGHT_EYEBROW,
    LEFT_EYE_TOP, RIGHT_EYE_TOP,
    LEFT_EYE_OUTER, RIGHT_EYE_OUTER,
]


def _distance(p1, p2):
    return math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)


def compute_eyebrow_raise_ratio(landmarks_dict) -> float:
    if not landmarks_dict or not all(k in landmarks_dict for k in REQUIRED_POINTS):
        return 0.35

    left_gap = _distance(landmarks_dict[LEFT_EYEBROW], landmarks_dict[LEFT_EYE_TOP])
    right_gap = _distance(landmarks_dict[RIGHT_EYEBROW], landmarks_dict[RIGHT_EYE_TOP])
    avg_gap = (left_gap + right_gap) / 2

    eye_distance = _distance(landmarks_dict[LEFT_EYE_OUTER], landmarks_dict[RIGHT_EYE_OUTER])
    if eye_distance <= 1e-6:
        return 0.35

    return avg_gap / eye_distance


def compute_head_tilt_angle(landmarks_dict) -> float:
    if not landmarks_dict or LEFT_EYE_OUTER not in landmarks_dict or RIGHT_EYE_OUTER not in landmarks_dict:
        return 0.0

    left_eye = landmarks_dict[LEFT_EYE_OUTER]
    right_eye = landmarks_dict[RIGHT_EYE_OUTER]

    dx = right_eye[0] - left_eye[0]
    dy = right_eye[1] - left_eye[1]

    angle_radians = math.atan2(dy, dx)
    return abs(math.degrees(angle_radians))


def interpret_facial_marker(landmarks_dict, neutral_baseline_ratio: float = 0.35) -> dict:
    if not neutral_baseline_ratio or neutral_baseline_ratio <= 0:
        neutral_baseline_ratio = 0.35

    eyebrow_ratio = compute_eyebrow_raise_ratio(landmarks_dict)
    tilt_angle = compute_head_tilt_angle(landmarks_dict)

    if eyebrow_ratio > neutral_baseline_ratio * 1.15:
        label = "question"
    elif eyebrow_ratio < neutral_baseline_ratio * 0.85 or tilt_angle > 12:
        label = "emphasis"
    else:
        label = "neutral"

    return {
        "label": label,
        "eyebrow_ratio": round(eyebrow_ratio, 3),
        "tilt_angle": round(tilt_angle, 1),
    }