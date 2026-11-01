"""
AI Prompt Templates for CelebAI.
All prompts return structured JSON that is validated against Pydantic schemas.
"""

SYSTEM_PROMPT = """You are CelebAI, an expert celebration and event planning assistant with
deep knowledge of Indian and international event planning, budgeting, vendor management,
and cultural celebrations. You provide personalized, practical, and budget-conscious advice.

RULES:
1. Always respond with valid JSON matching the requested schema.
2. All monetary amounts must be in the event's specified currency.
3. Budget estimates must total to approximately the user's stated budget.
4. Never fabricate real vendor names, ratings, or contact information.
5. Clearly label all costs as estimates, not confirmed quotations.
6. Personalize every recommendation based on event specifics.
7. If budget is very low, suggest creative low-cost alternatives.
8. Be warm, encouraging, and practical."""


def build_event_context(event: dict) -> str:
    """Build a rich context string from event details."""
    return f"""
EVENT DETAILS:
- Name: {event.get('name', 'Special Event')}
- Type: {event.get('event_type', 'General Celebration')}
- Date: {event.get('event_date', 'TBD')}
- Location: {event.get('location', 'India')}
- Guests: {event.get('guest_count', 50)}
- Budget: {event.get('currency', 'INR')} {event.get('budget', 100000):,.0f}
- Theme/Style: {event.get('theme') or 'Open to suggestions'}
- Atmosphere: {event.get('atmosphere') or 'Celebratory'}
- Venue Type: {event.get('venue_type', 'indoor')}
- Food Preference: {event.get('food_preference') or 'Mixed'}
- Age Group: {event.get('age_group') or 'Mixed ages'}
- Special Requests: {event.get('special_requests') or 'None'}
""".strip()


IDEAS_PROMPT = """Based on the event details, generate 3 creative and distinct event concept ideas.

{event_context}

Respond ONLY with valid JSON in this exact format:
{{
  "ideas": [
    {{
      "name": "Concept Name",
      "description": "2-3 sentence description of the concept",
      "theme_colors": ["color1", "color2", "color3"],
      "key_elements": ["element 1", "element 2", "element 3", "element 4", "element 5"],
      "vibe": "One-word vibe (e.g. Elegant, Whimsical, Festive)"
    }}
  ]
}}"""


BUDGET_PROMPT = """Create a detailed budget breakdown for this event.

{event_context}

The total budget is {currency} {budget:,.0f}. Allocate it realistically across all necessary
categories. Budget totals MUST sum to exactly the stated budget.

Respond ONLY with valid JSON in this exact format:
{{
  "budget": {{
    "total": {budget},
    "currency": "{currency}",
    "categories": [
      {{
        "category": "Venue",
        "amount": 0,
        "percentage": 0,
        "notes": "Brief explanation"
      }},
      {{
        "category": "Catering & Beverages",
        "amount": 0,
        "percentage": 0,
        "notes": "Brief explanation"
      }},
      {{
        "category": "Decoration & Flowers",
        "amount": 0,
        "percentage": 0,
        "notes": "Brief explanation"
      }},
      {{
        "category": "Photography & Videography",
        "amount": 0,
        "percentage": 0,
        "notes": "Brief explanation"
      }},
      {{
        "category": "Entertainment & Music",
        "amount": 0,
        "percentage": 0,
        "notes": "Brief explanation"
      }},
      {{
        "category": "Invitations & Stationery",
        "amount": 0,
        "percentage": 0,
        "notes": "Brief explanation"
      }},
      {{
        "category": "Gifts & Party Favors",
        "amount": 0,
        "percentage": 0,
        "notes": "Brief explanation"
      }},
      {{
        "category": "Transportation",
        "amount": 0,
        "percentage": 0,
        "notes": "Brief explanation"
      }},
      {{
        "category": "Miscellaneous & Contingency",
        "amount": 0,
        "percentage": 0,
        "notes": "10% buffer for unexpected costs"
      }}
    ],
    "disclaimer": "These are AI-generated estimates only. Actual costs may vary by vendor and location."
  }}
}}"""


TIMELINE_PROMPT = """Create a practical event planning timeline for this event.

{event_context}

Generate a milestone-based timeline from now until after the event.
Include specific tasks for each period.

Respond ONLY with valid JSON in this exact format:
{{
  "timeline": [
    {{
      "period": "3 Months Before",
      "tasks": ["task 1", "task 2", "task 3"],
      "priority": "high"
    }},
    {{
      "period": "2 Months Before",
      "tasks": ["task 1", "task 2"],
      "priority": "high"
    }},
    {{
      "period": "6 Weeks Before",
      "tasks": ["task 1", "task 2"],
      "priority": "high"
    }},
    {{
      "period": "1 Month Before",
      "tasks": ["task 1", "task 2"],
      "priority": "medium"
    }},
    {{
      "period": "2 Weeks Before",
      "tasks": ["task 1", "task 2"],
      "priority": "medium"
    }},
    {{
      "period": "1 Week Before",
      "tasks": ["task 1", "task 2"],
      "priority": "high"
    }},
    {{
      "period": "3 Days Before",
      "tasks": ["task 1", "task 2"],
      "priority": "high"
    }},
    {{
      "period": "Day Of Event",
      "tasks": ["task 1", "task 2", "task 3"],
      "priority": "high"
    }},
    {{
      "period": "After Event",
      "tasks": ["task 1", "task 2"],
      "priority": "low"
    }}
  ]
}}"""


VENDORS_PROMPT = """Suggest vendor categories for this event.

{event_context}

Provide guidance on what to look for and questions to ask. 
IMPORTANT: Do NOT fabricate real vendor names, prices, phone numbers, or availability.
Only provide category-level guidance.

Respond ONLY with valid JSON in this exact format:
{{
  "vendors": [
    {{
      "category": "Venue",
      "description": "What type of venue suits this event",
      "selection_criteria": ["criterion 1", "criterion 2", "criterion 3"],
      "questions_to_ask": ["question 1", "question 2", "question 3"],
      "estimated_cost_range": "{currency} X,XXX - X,XXX",
      "disclaimer": "AI-generated suggestion. Verify with real vendors before booking."
    }}
  ]
}}"""


INVITATION_PROMPT = """Write a beautiful, personalized invitation for this event.

{event_context}

Create:
1. A formal invitation message
2. A casual WhatsApp/text message version
3. A social media caption
4. A thank-you note template

Respond ONLY with valid JSON in this exact format:
{{
  "invitation": {{
    "formal": "Full formal invitation text with [PLACEHOLDERS] for date/time/venue",
    "casual": "Casual WhatsApp-style message",
    "social_media": "Instagram/Facebook caption with hashtags",
    "thank_you": "Thank you note template for after the event"
  }}
}}"""


TIPS_PROMPT = """Provide professional event planning tips for this specific event.

{event_context}

Generate 10 practical, specific tips that will help make this event memorable while
staying within budget. Include money-saving hacks and things commonly overlooked.

Respond ONLY with valid JSON in this exact format:
{{
  "tips": [
    "Tip 1: specific actionable advice",
    "Tip 2: specific actionable advice"
  ]
}}"""


CHAT_SYSTEM = """You are CelebAI, a friendly and expert celebration & event planning assistant.
You help users plan memorable events within their budget. You give practical, specific,
and personalized advice. 

Keep responses concise (under 200 words unless more detail is explicitly needed).
Use bullet points for lists. Be warm, encouraging, and helpful.
All monetary amounts default to Indian Rupees unless the user specifies otherwise.
Never claim bookings have been made or vendors contacted through this chat."""


def chat_with_context(event: dict | None = None) -> str:
    """Build system prompt with optional event context."""
    if not event:
        return CHAT_SYSTEM

    return CHAT_SYSTEM + f"""

CURRENT EVENT CONTEXT:
{build_event_context(event)}

Use this context to personalize your answers when relevant."""
