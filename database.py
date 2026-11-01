"""SQLite async database setup using aiosqlite."""
import aiosqlite
import os

DB_PATH = os.getenv("DB_PATH", "./celebai.db")


async def get_db():
    """Async context manager for DB connection."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        yield db


async def init_db():
    """Create all tables on startup."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.executescript("""
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                event_type TEXT NOT NULL,
                event_date TEXT,
                location TEXT,
                guest_count INTEGER DEFAULT 50,
                budget REAL DEFAULT 100000,
                currency TEXT DEFAULT 'INR',
                theme TEXT,
                atmosphere TEXT,
                venue_type TEXT DEFAULT 'indoor',
                food_preference TEXT,
                age_group TEXT,
                special_requests TEXT,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS event_plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER NOT NULL,
                section TEXT NOT NULL,
                content TEXT NOT NULL,
                generated_at TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS guests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                rsvp_status TEXT DEFAULT 'pending',
                dietary_requirement TEXT,
                notes TEXT,
                created_at TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                due_date TEXT,
                priority TEXT DEFAULT 'medium',
                status TEXT DEFAULT 'pending',
                category TEXT,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now'))
            );
        """)
        await db.commit()
