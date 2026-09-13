import csv
from pathlib import Path
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR.parent / "data" / "training_data.csv"
MODEL_OUTPUT_PATH = BASE_DIR / "app" / "models" / "classifier.pkl"
EXPECTED_FEATURE_LENGTH = 126

labels = []
features = []
skipped_rows = 0

if not DATA_FILE.exists():
    print(f"Error: Dataset not found at {DATA_FILE}")
    exit(1)

with open(DATA_FILE, "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    header = next(reader)

    for i, row in enumerate(reader, start=2):
        if len(row) == 0:
            skipped_rows += 1
            continue

        try:
            row_features = [float(x) for x in row[1:]]
        except ValueError:
            skipped_rows += 1
            continue

        if len(row_features) != EXPECTED_FEATURE_LENGTH:
            print(f"Skipping row {i} (label: {row[0]}) - has {len(row_features)} values, expected {EXPECTED_FEATURE_LENGTH}")
            skipped_rows += 1
            continue

        labels.append(row[0])
        features.append(row_features)

print(f"\nLoaded {len(features)} valid samples ({skipped_rows} rows skipped)")

X = np.array(features)
y = np.array(labels)

print(f"Training on {len(set(y))} unique signs")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training on {len(X_train)} samples, testing on {len(X_test)} samples")

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)

print(f"\nAccuracy on unseen test data: {accuracy * 100:.1f}%")
print("\nDetailed performance per sign:")
print(classification_report(y_test, predictions))

MODEL_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(model, MODEL_OUTPUT_PATH)
print(f"\nModel saved to {MODEL_OUTPUT_PATH}")