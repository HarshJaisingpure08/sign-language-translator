"""
Entry point - creates the app, sets up CORS, and plugs in the routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict, sentence, facial_marker, translate_session

app = FastAPI(title="Sign Language Translator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(sentence.router)
app.include_router(facial_marker.router)
app.include_router(translate_session.router)


@app.get("/")
def root():
    return {"status": "Sign Language Translator API running"}


def start():
    """Start uvicorn server for development."""
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)


if __name__ == "__main__":
    start()