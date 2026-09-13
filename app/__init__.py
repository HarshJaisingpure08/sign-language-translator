from pathlib import Path

# Extend package path to include backend/app
backend_app = Path(__file__).resolve().parent.parent / "backend" / "app"
if backend_app.exists():
    __path__.append(str(backend_app))
