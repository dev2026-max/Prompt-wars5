"""
Events API Router.
Handles CRUD operations for user events and celebration projects.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import aiosqlite
import json
from app.db.database import get_db
from app.models.schemas import EventCreate, EventResponse

router = APIRouter()


@router.post("", response_model=EventResponse, status_code=201)
async def create_event(event: EventCreate, db: aiosqlite.Connection = Depends(get_db)):
    """Create a new event record in the database."""
    query = """
        INSERT INTO events (
            name, event_type, event_date, location, guest_count,
            budget, currency, theme, atmosphere, venue_type,
            food_preference, age_group, special_requests
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    params = (
        event.name,
        event.event_type,
        event.event_date,
        event.location,
        event.guest_count,
        event.budget,
        event.currency,
        event.theme,
        event.atmosphere,
        event.venue_type,
        event.food_preference,
        event.age_group,
        event.special_requests
    )
    cursor = await db.execute(query, params)
    await db.commit()
    event_id = cursor.lastrowid

    # Fetch created row
    async with db.execute("SELECT * FROM events WHERE id = ?", (event_id,)) as cur:
        row = await cur.fetchone()
        if not row:
            raise HTTPException(status_code=500, detail="Failed to retrieve created event")
        return dict(row)


@router.get("", response_model=List[EventResponse])
async def list_events(db: aiosqlite.Connection = Depends(get_db)):
    """List all saved events, ordered by most recent first."""
    async with db.execute("SELECT * FROM events ORDER BY id DESC") as cur:
        rows = await cur.fetchall()
        return [dict(r) for r in rows]


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: int, db: aiosqlite.Connection = Depends(get_db)):
    """Retrieve a single event by ID."""
    async with db.execute("SELECT * FROM events WHERE id = ?", (event_id,)) as cur:
        row = await cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Event not found")
        return dict(row)


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(event_id: int, event: EventCreate, db: aiosqlite.Connection = Depends(get_db)):
    """Update an existing event."""
    # Check exists
    async with db.execute("SELECT id FROM events WHERE id = ?", (event_id,)) as cur:
        if not await cur.fetchone():
            raise HTTPException(status_code=404, detail="Event not found")

    query = """
        UPDATE events SET
            name = ?, event_type = ?, event_date = ?, location = ?,
            guest_count = ?, budget = ?, currency = ?, theme = ?,
            atmosphere = ?, venue_type = ?, food_preference = ?,
            age_group = ?, special_requests = ?, updated_at = datetime('now')
        WHERE id = ?
    """
    params = (
        event.name,
        event.event_type,
        event.event_date,
        event.location,
        event.guest_count,
        event.budget,
        event.currency,
        event.theme,
        event.atmosphere,
        event.venue_type,
        event.food_preference,
        event.age_group,
        event.special_requests,
        event_id
    )
    await db.execute(query, params)
    await db.commit()

    async with db.execute("SELECT * FROM events WHERE id = ?", (event_id,)) as cur:
        row = await cur.fetchone()
        return dict(row)


@router.delete("/{event_id}", status_code=204)
async def delete_event(event_id: int, db: aiosqlite.Connection = Depends(get_db)):
    """Delete an event and cascade-delete its plans and guests."""
    async with db.execute("SELECT id FROM events WHERE id = ?", (event_id,)) as cur:
        if not await cur.fetchone():
            raise HTTPException(status_code=404, detail="Event not found")

    await db.execute("DELETE FROM events WHERE id = ?", (event_id,))
    await db.execute("DELETE FROM event_plans WHERE event_id = ?", (event_id,))
    await db.execute("DELETE FROM guests WHERE event_id = ?", (event_id,))
    await db.execute("DELETE FROM tasks WHERE event_id = ?", (event_id,))
    await db.commit()
    return None
