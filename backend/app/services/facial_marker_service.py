"""
Turns raw MediaPipe Face Mesh landmarks into a meaningful grammatical
label (neutral / question / emphasis) - our "non-manual markers" feature.

Key idea: we use RATIOS between facial features, not absolute positions,
so this works regardless of how close someone is to the camera.
"""

import math

LEFT_EYEBROW = 105
RIGHT_EYEBROW = 334
LEFT_EYE_TOP = 159
RIGHT_EYE_TOP = 386
LEFT_EYE_OUTER = 33
RIGHT_EYE_OUTER = 263


def _distance(p1, p2):
    return math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)


def compute_eyebrow_raise_ratio(landmarks_dict):
    left_gap = _distance(landmarks_dict[LEFT_EYEBROW], landmarks_dict[LEFT_EYE_TOP])
    right_gap = _distance(landmarks_dict[RIGHT_EYEBROW], landmarks_dict[RIGHT_EYE_TOP])
    avg_gap = (left_gap + right_gap) / 2

    eye_distance = _distance(landmarks_dict[LEFT_EYE_OUTER], landmarks_dict[RIGHT_EYE_OUTER])
    if eye_distance == 0:
        return 0

    return avg_gap / eye_distance


def compute_head_tilt_angle(landmarks_dict):
    left_eye = landmarks_dict[LEFT_EYE_OUTER]
    right_eye = landmarks_dict[RIGHT_EYE_OUTER]

    dx = right_eye[0] - left_eye[0]
    dy = right_eye[1] - left_eye[1]

    angle_radians = math.atan2(dy, dx)
    return abs(math.degrees(angle_radians))


def interpret_facial_marker(landmarks_dict, neutral_baseline_ratio):
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