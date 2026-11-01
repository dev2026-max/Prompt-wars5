"""
Guest Management Router.
Handles guest list tracking, RSVP confirmations, dietary requirements, and headcount summaries.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
import aiosqlite
from app.db.database import get_db
from app.models.schemas import GuestCreate, GuestResponse

router = APIRouter()


@router.post("", response_model=GuestResponse, status_code=201)
async def add_guest(guest: GuestCreate, db: aiosqlite.Connection = Depends(get_db)):
    """Add a guest to an event."""
    # Verify event exists
    async with db.execute("SELECT id FROM events WHERE id = ?", (guest.event_id,)) as cur:
        if not await cur.fetchone():
            raise HTTPException(status_code=404, detail="Event not found")

    query = """
        INSERT INTO guests (event_id, name, email, phone, rsvp_status, dietary_requirement, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """
    params = (
        guest.event_id,
        guest.name,
        guest.email,
        guest.phone,
        guest.rsvp_status,
        guest.dietary_requirement,
        guest.notes
    )
    cursor = await db.execute(query, params)
    await db.commit()
    guest_id = cursor.lastrowid

    async with db.execute("SELECT * FROM guests WHERE id = ?", (guest_id,)) as cur:
        row = await cur.fetchone()
        return dict(row)


@router.get("", response_model=List[GuestResponse])
async def list_guests(event_id: int, db: aiosqlite.Connection = Depends(get_db)):
    """List all guests registered for a specific event."""
    async with db.execute("SELECT * FROM guests WHERE event_id = ? ORDER BY id DESC", (event_id,)) as cur:
        rows = await cur.fetchall()
        return [dict(r) for r in rows]


@router.get("/summary/{event_id}")
async def guest_summary(event_id: int, db: aiosqlite.Connection = Depends(get_db)):
    """Get RSVP statistics and counts for an event."""
    async with db.execute("""
        SELECT
            COUNT(*) as total,
            SUM(CASE WHEN rsvp_status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
            SUM(CASE WHEN rsvp_status = 'declined' THEN 1 ELSE 0 END) as declined,
            SUM(CASE WHEN rsvp_status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN rsvp_status = 'maybe' THEN 1 ELSE 0 END) as maybe
        FROM guests WHERE event_id = ?
    """, (event_id,)) as cur:
        row = await cur.fetchone()
        return {
            "event_id": event_id,
            "total": row["total"] or 0,
            "confirmed": row["confirmed"] or 0,
            "declined": row["declined"] or 0,
            "pending": row["pending"] or 0,
            "maybe": row["maybe"] or 0
        }


@router.put("/{guest_id}", response_model=GuestResponse)
async def update_guest(guest_id: int, guest: GuestCreate, db: aiosqlite.Connection = Depends(get_db)):
    """Update a guest record (e.g. RSVP status change)."""
    async with db.execute("SELECT id FROM guests WHERE id = ?", (guest_id,)) as cur:
        if not await cur.fetchone():
            raise HTTPException(status_code=404, detail="Guest not found")

    query = """
        UPDATE guests SET
            name = ?, email = ?, phone = ?, rsvp_status = ?,
            dietary_requirement = ?, notes = ?
        WHERE id = ?
    """
    params = (
        guest.name,
        guest.email,
        guest.phone,
        guest.rsvp_status,
        guest.dietary_requirement,
        guest.notes,
        guest_id
    )
    await db.execute(query, params)
    await db.commit()

    async with db.execute("SELECT * FROM guests WHERE id = ?", (guest_id,)) as cur:
        row = await cur.fetchone()
        return dict(row)


@router.delete("/{guest_id}", status_code=204)
async def delete_guest(guest_id: int, db: aiosqlite.Connection = Depends(get_db)):
    """Remove a guest."""
    async with db.execute("SELECT id FROM guests WHERE id = ?", (guest_id,)) as cur:
        if not await cur.fetchone():
            raise HTTPException(status_code=404, detail="Guest not found")

    await db.execute("DELETE FROM guests WHERE id = ?", (guest_id,))
    await db.commit()
    return None
