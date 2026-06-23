from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import APP_NAME
from app.db import init_db
from app.routes import auth, convert, guides, history

app = FastAPI(title=APP_NAME, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def root():
    return {
        "name": APP_NAME,
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

app.include_router(auth.router)
app.include_router(convert.router)
app.include_router(guides.router)
app.include_router(history.router)
