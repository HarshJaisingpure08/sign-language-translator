"""
Entry point - equivalent to app.js/server.js in Express.
Creates the app, sets up CORS, and plugs in the routers.
No business logic belongs here anymore - it all moved to app/services/.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predict, sentence, facial_marker, translate_session

app = FastAPI(title="Sign Language Translator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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