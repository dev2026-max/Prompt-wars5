"""Pydantic models for request/response validation."""
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from enum import Enum


# ─── Enums ───────────────────────────────────────────────────────────────────

class EventType(str, Enum):
    birthday = "Birthday Party"
    wedding = "Wedding"
    anniversary = "Anniversary"
    baby_shower = "Baby Shower"
    graduation = "Graduation"
    corporate = "Corporate Event"
    housewarming = "Housewarming"
    farewell = "Farewell Party"
    festival = "Festival Celebration"
    kids_party = "Kids Party"
    retirement = "Retirement Party"
    custom = "Custom Event"


class VenueType(str, Enum):
    indoor = "indoor"
    outdoor = "outdoor"
    hybrid = "hybrid"


class FoodPreference(str, Enum):
    vegetarian = "Vegetarian"
    non_vegetarian = "Non-Vegetarian"
    vegan = "Vegan"
    mixed = "Mixed (Veg + Non-Veg)"
    international = "International Cuisine"


class RsvpStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    declined = "declined"
    maybe = "maybe"


class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


# ─── Event Models ─────────────────────────────────────────────────────────────

class EventCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    event_type: str
    event_date: Optional[str] = None
    location: Optional[str] = None
    guest_count: int = Field(default=50, ge=1, le=100000)
    budget: float = Field(default=100000, ge=100)
    currency: str = Field(default="INR", max_length=3)
    theme: Optional[str] = None
    atmosphere: Optional[str] = None
    venue_type: str = Field(default="indoor")
    food_preference: Optional[str] = None
    age_group: Optional[str] = None
    special_requests: Optional[str] = None

    @field_validator("budget")
    @classmethod
    def validate_budget(cls, v):
        if v <= 0:
            raise ValueError("Budget must be positive")
        return v


class EventResponse(EventCreate):
    id: int
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


# ─── Plan Models ──────────────────────────────────────────────────────────────

class PlanRequest(BaseModel):
    event_id: int
    sections: Optional[List[str]] = None  # None = generate all


class BudgetCategory(BaseModel):
    category: str
    amount: float
    percentage: float
    notes: str = ""


class BudgetBreakdown(BaseModel):
    total: float
    currency: str
    categories: List[BudgetCategory]
    disclaimer: str = "These are AI-generated estimates, not confirmed vendor quotations."


class TimelineItem(BaseModel):
    period: str
    tasks: List[str]
    priority: str = "medium"


class VendorSuggestion(BaseModel):
    category: str
    description: str
    selection_criteria: List[str]
    questions_to_ask: List[str]
    estimated_cost_range: str
    disclaimer: str = "AI-generated suggestion. Verify with real vendors before booking."


class EventIdea(BaseModel):
    name: str
    description: str
    theme_colors: List[str]
    key_elements: List[str]
    vibe: str


class EventPlanResponse(BaseModel):
    event_id: int
    ideas: Optional[List[EventIdea]] = None
    budget: Optional[BudgetBreakdown] = None
    timeline: Optional[List[TimelineItem]] = None
    vendors: Optional[List[VendorSuggestion]] = None
    invitation: Optional[str] = None
    tips: Optional[List[str]] = None
    raw_sections: Dict[str, Any] = {}


# ─── Guest Models ─────────────────────────────────────────────────────────────

class GuestCreate(BaseModel):
    event_id: int
    name: str = Field(..., min_length=1, max_length=200)
    email: Optional[str] = None
    phone: Optional[str] = None
    rsvp_status: str = "pending"
    dietary_requirement: Optional[str] = None
    notes: Optional[str] = None


class GuestResponse(GuestCreate):
    id: int
    created_at: str
    model_config = {"from_attributes": True}


# ─── Task Models ──────────────────────────────────────────────────────────────

class TaskCreate(BaseModel):
    event_id: int
    title: str = Field(..., min_length=1, max_length=300)
    description: Optional[str] = None
    due_date: Optional[str] = None
    priority: str = "medium"
    status: str = "pending"
    category: Optional[str] = None


class TaskResponse(TaskCreate):
    id: int
    model_config = {"from_attributes": True}


# ─── Chat Models ──────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    event_id: Optional[int] = None


class ChatResponse(BaseModel):
    role: str = "assistant"
    content: str
    event_id: Optional[int] = None
