"""
AI Planner Router.
Generates and manages AI event plans, theme ideas, budget allocations,
timelines, vendor guidelines, and invitations.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, Dict, Any
import aiosqlite
import json
from app.db.database import get_db
from app.models.schemas import PlanRequest, EventPlanResponse, EventCreate
from app.services.gemini_service import GeminiService

router = APIRouter()
ai_service = GeminiService()


@router.post("/generate", response_model=EventPlanResponse)
async def generate_plan(request: PlanRequest, db: aiosqlite.Connection = Depends(get_db)):
    """Generate or regenerate a comprehensive celebration plan for a specific event."""
    async with db.execute("SELECT * FROM events WHERE id = ?", (request.event_id,)) as cur:
        row = await cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Event not found")
        event = dict(row)

    # Call AI service
    plan = await ai_service.generate_full_plan(event)

    # Persist the plan sections into event_plans table
    sections = {
        "ideas": plan.get("ideas"),
        "budget": plan.get("budget"),
        "timeline": plan.get("timeline"),
        "vendors": plan.get("vendors"),
        "invitation": plan.get("invitation"),
        "tips": plan.get("tips")
    }

    # Delete previous plan records for this event
    await db.execute("DELETE FROM event_plans WHERE event_id = ?", (request.event_id,))

    for section_name, content in sections.items():
        if content is not None:
            await db.execute(
                "INSERT INTO event_plans (event_id, section, content) VALUES (?, ?, ?)",
                (request.event_id, section_name, json.dumps(content))
            )
    await db.commit()

    return EventPlanResponse(
        event_id=request.event_id,
        ideas=plan.get("ideas"),
        budget=plan.get("budget"),
        timeline=plan.get("timeline"),
        vendors=plan.get("vendors"),
        invitation=json.dumps(plan.get("invitation")) if isinstance(plan.get("invitation"), (dict, list)) else plan.get("invitation"),
        tips=plan.get("tips"),
        raw_sections=sections
    )


@router.post("/preview")
async def preview_plan(event: EventCreate):
    """Generate plan on the fly from form input without requiring pre-saving."""
    plan = await ai_service.generate_full_plan(event.model_dump())
    return plan


@router.get("/{event_id}")
async def get_saved_plan(event_id: int, db: aiosqlite.Connection = Depends(get_db)):
    """Retrieve the most recent saved plan for an event."""
    async with db.execute("SELECT section, content FROM event_plans WHERE event_id = ?", (event_id,)) as cur:
        rows = await cur.fetchall()
        if not rows:
            raise HTTPException(status_code=404, detail="No plan found for this event")

        plan: Dict[str, Any] = {"event_id": event_id}
        for r in rows:
            try:
                plan[r["section"]] = json.loads(r["content"])
            except Exception:
                plan[r["section"]] = r["content"]
        return plan
