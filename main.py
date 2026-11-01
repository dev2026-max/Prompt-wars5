"""
CelebAI FastAPI Backend — Main Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.database import init_db
from app.routes import events, planner, chat, guests
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize DB on startup."""
    await init_db()
    yield


app = FastAPI(
    title="CelebAI API",
    description="AI-Powered Celebration & Event Planner — PromptWars Challenge 5",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router, prefix="/api/events", tags=["Events"])
app.include_router(planner.router, prefix="/api/planner", tags=["AI Planner"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Chat"])
app.include_router(guests.router, prefix="/api/guests", tags=["Guests"])


@app.get("/")
async def root():
    return {"message": "CelebAI API is running 🎉", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "ok"}
