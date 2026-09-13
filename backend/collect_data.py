import csv
import os
from pathlib import Path
import time
import cv2
import mediapipe as mp

mp_hands = mp.solutions.hands
hands_detector = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.5,
)

# Change this to whatever sign you're recording right now
CURRENT_LABEL = "WASHROOM"

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "training_data.csv"

# --- Auto-capture settings ---
AUTO_CAPTURE_COUNT = 20      # how many samples to grab in one burst
AUTO_CAPTURE_INTERVAL = 1.0  # seconds between each capture

cap = cv2.VideoCapture(0)

auto_capturing = False
auto_captures_done = 0
last_capture_time = 0


def save_sample(frame, label):
    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands_detector.process(image_rgb)

    if not results.multi_hand_landmarks:
        return False

    features = []
    for hand_landmarks in results.multi_hand_landmarks:
        for lm in hand_landmarks.landmark:
            features.extend([float(lm.x), float(lm.y), float(lm.z)])

    expected_hand_values = 21 * 3 * 2
    while len(features) < expected_hand_values:
        features.append(0.0)

    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    file_exists = DATA_FILE.is_file()
    with open(DATA_FILE, mode='a', newline='', encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            header = ["label"] + [f"f{i}" for i in range(len(features))]
            writer.writerow(header)
        writer.writerow([label] + features)

    return True


while True:
    success, frame = cap.read()
    if not success:
        break

    display_frame = frame.copy()

    if auto_capturing:
        status_text = f"AUTO-CAPTURING: {auto_captures_done}/{AUTO_CAPTURE_COUNT}"
        color = (0, 0, 255)
    else:
        status_text = "Press SPACE = single capture | A = auto-capture burst | Q = quit"
        color = (0, 255, 0)

    cv2.putText(display_frame, status_text, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
    cv2.putText(display_frame, f"Label: {CURRENT_LABEL}", (10, 60),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

    cv2.imshow("Data Collection", display_frame)

    key = cv2.waitKey(1) & 0xFF

    if key == ord('q'):
        break

    if key == ord('a') and not auto_capturing:
        auto_capturing = True
        auto_captures_done = 0
        last_capture_time = time.time()
        print(f"Starting auto-capture burst for '{CURRENT_LABEL}'. Hold your sign steady...")

    if key == ord(' ') and not auto_capturing:
        saved = save_sample(frame, CURRENT_LABEL)
        if saved:
            print(f"Saved 1 sample for '{CURRENT_LABEL}'")
        else:
            print("No hand detected - try again.")

    if auto_capturing:
        now = time.time()
        if now - last_capture_time >= AUTO_CAPTURE_INTERVAL:
            saved = save_sample(frame, CURRENT_LABEL)
            if saved:
                auto_captures_done += 1
                print(f"Auto-captured {auto_captures_done}/{AUTO_CAPTURE_COUNT}")
            else:
                print("No hand detected during auto-capture - skipped this frame.")
            last_capture_time = now

        if auto_captures_done >= AUTO_CAPTURE_COUNT:
            auto_capturing = False
            print(f"Auto-capture burst complete for '{CURRENT_LABEL}'.")

cap.release()
cv2.destroyAllWindows()