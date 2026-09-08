import cv2
import mediapipe as mp
import csv
import os

mp_hands = mp.solutions.hands
hands_detector = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.5,
)

# Change this to whatever sign you're recording right now
CURRENT_LABEL = "HELLO"

DATA_FILE = "../data/training_data.csv"

cap = cv2.VideoCapture(0)

while True:
    success, frame = cap.read()
    if not success:
        break

    cv2.imshow("Data Collection - Press SPACE to capture, Q to quit", frame)

    key = cv2.waitKey(1) & 0xFF

    if key == ord('q'):
        break

    if key == ord(' '):
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands_detector.process(image_rgb)

        if results.multi_hand_landmarks:
            features = []
            for hand_landmarks in results.multi_hand_landmarks:
                for lm in hand_landmarks.landmark:
                    features.extend([lm.x, lm.y, lm.z])

            # pad to fixed length for 2 hands, same as your main backend logic
            expected_hand_values = 21 * 3 * 2
            while len(features) < expected_hand_values:
                features.append(0.0)

            # Save to CSV: label first, then all the feature numbers
            file_exists = os.path.isfile(DATA_FILE)
            with open(DATA_FILE, mode='a', newline='') as f:
                writer = csv.writer(f)
                if not file_exists:
                    header = ["label"] + [f"f{i}" for i in range(len(features))]
                    writer.writerow(header)
                writer.writerow([CURRENT_LABEL] + features)

            print(f"Saved 1 sample for '{CURRENT_LABEL}'")
        else:
            print("No hand detected - try again.")

cap.release()
cv2.destroyAllWindows()