# Sign Language Translator — Backend

FastAPI backend providing real-time hand landmark extraction, sign classification, MediaPipe facial marker tracking, and LLM-assisted sentence smoothing with Google Gemini.

## Prerequisites

- Python 3.10+
- [`uv`](https://docs.astral.sh/uv/) package manager

## Quick Start with `uv`

1. **Install dependencies:**
   ```bash
   cd backend
   uv sync
   ```

2. **(Optional) Configure Gemini API:**
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY from https://aistudio.google.com/apikey
   ```

3. **Start the backend server:**
   ```bash
   uv run dev
   # or
   uv run python main.py
   # or
   uv run uvicorn main:app --reload
   ```

The API will be available at `http://127.0.0.1:8000`.
Interactive API docs are at `http://127.0.0.1:8000/docs`.

## Dataset & Training

- **Check dataset stats:**
  ```bash
  uv run python check_data.py
  ```

- **Train the classifier:**
  ```bash
  uv run python train_model.py
  ```

- **Collect new sign data via webcam:**
  ```bash
  uv run python collect_data.py
  ```
