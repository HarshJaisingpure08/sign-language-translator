"""
Root entrypoint delegating to backend.main:app.
Enables running uvicorn directly from repo root.
"""
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = str(Path(__file__).resolve().parent / "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from backend.main import app  # noqa: F401
