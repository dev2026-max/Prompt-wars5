"""
AI Chat Assistant Router.
Provides an interactive event planning conversational assistant powered by Gemini.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import aiosqlite
from app.db.database import get_db
from app.models.schemas import ChatMessage, ChatResponse
from app.services.gemini_service import GeminiService

router = APIRouter()
ai_service = GeminiService()


@router.post("", response_model=ChatResponse)
async def send_chat_message(msg: ChatMessage, db: aiosqlite.Connection = Depends(get_db)):
    """Send a prompt to CelebAI assistant with optional event context."""
    event = None
    if msg.event_id:
        async with db.execute("SELECT * FROM events WHERE id = ?", (msg.event_id,)) as cur:
            row = await cur.fetchone()
            if row:
                event = dict(row)

    # Store user message
    await db.execute(
        "INSERT INTO chat_messages (event_id, role, content) VALUES (?, ?, ?)",
        (msg.event_id, "user", msg.content)
    )
    await db.commit()

    # Call AI
    ai_reply = await ai_service.chat(msg.content, event=event)

    # Store assistant reply
    await db.execute(
        "INSERT INTO chat_messages (event_id, role, content) VALUES (?, ?, ?)",
        (msg.event_id, "assistant", ai_reply)
    )
    await db.commit()

    return ChatResponse(
        role="assistant",
        content=ai_reply,
        event_id=msg.event_id
    )


@router.get("/history", response_model=List[dict])
async def get_history(event_id: Optional[int] = None, db: aiosqlite.Connection = Depends(get_db)):
    """Fetch stored conversation history."""
    if event_id:
        async with db.execute(
            "SELECT id, role, content, created_at FROM chat_messages WHERE event_id = ? ORDER BY id ASC",
            (event_id,)
        ) as cur:
            rows = await cur.fetchall()
            return [dict(r) for r in rows]
    else:
        async with db.execute(
            "SELECT id, role, content, created_at FROM chat_messages WHERE event_id IS NULL ORDER BY id ASC LIMIT 50"
        ) as cur:
            rows = await cur.fetchall()
            return [dict(r) for r in rows]


@router.delete("/history")
async def clear_history(event_id: Optional[int] = None, db: aiosqlite.Connection = Depends(get_db)):
    """Clear conversation history."""
    if event_id:
        await db.execute("DELETE FROM chat_messages WHERE event_id = ?", (event_id,))
    else:
        await db.execute("DELETE FROM chat_messages WHERE event_id IS NULL")
    await db.commit()
    return {"message": "Chat history cleared"}
