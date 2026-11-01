# 🎉 CelebAI — Smart Celebration & Event Planner
> **PromptWars Challenge 5 Submission** — Build Your AI Project from Scratch to Final Submission!

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-4285F4.svg?logo=google&logoColor=white)](https://aistudio.google.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Project Vision & Overview

Planning any celebration — whether a 30th birthday bash, an intimate housewarming, or a 500-guest royal wedding — is notoriously stressful, fragmented, and prone to budget overruns.

**CelebAI** is an intelligent, full-stack event planning companion that harnesses **Google Gemini Generative AI** to transform basic event requirements (type, budget, location, vibe, guest count) into an actionable, tailored celebration blueprint:

1. 🎨 **AI Theme & Concept Generator**: 3 bespoke concepts with cohesive color palettes, signature highlights, and vibe badges.
2. 💰 **Smart Budget Visualizer**: Interactive Recharts pie and bar graphs calculating category allocations, percentages, and money-saving hacks.
3. 📅 **Milestone Roadmap & Checklist**: Phased countdown with progress tracking and custom task addition.
4. 📋 **Vendor Vetting Playbook**: Category-by-category vetting criteria, essential interview questions, and budget ranges.
5. 💌 **Multi-Style Invitation Suite**: Instant formal invites, casual WhatsApp messages, Instagram captions, and post-event thank you notes.
6. 👥 **RSVP & Guest Tracker**: Full guest registry with RSVP status filtering, headcount metrics, and dietary requirement tracking.
7. 💬 **CelebAI Concierge Chat**: Conversational planning assistant with instant prompt chips for real-time guidance.

---

## 🏗️ Architecture & Technology Stack

```
challenge5/
├── backend/                       # Python FastAPI Backend
│   ├── app/
│   │   ├── config.py              # Pydantic Settings & environment variables
│   │   ├── db/
│   │   │   └── database.py        # Async SQLite setup (aiosqlite)
│   │   ├── models/
│   │   │   └── schemas.py         # Pydantic models for validation
│   │   ├── prompts/
│   │   │   └── templates.py       # Tuned prompts & JSON schemas
│   │   ├── routes/
│   │   │   ├── events.py          # Events CRUD router
│   │   │   ├── planner.py         # AI generation & plan storage
│   │   │   ├── chat.py            # AI concierge chat router
│   │   │   └── guests.py          # Guest list & RSVP manager
│   │   └── services/
│   │       └── gemini_service.py  # Google Gemini 2.0 / 1.5 Flash client + fallbacks
│   ├── main.py                    # App entry point & CORS configuration
│   ├── requirements.txt           # Python dependencies
│   └── .env.example               # Environment variables template
│
├── frontend/                      # React 19 + Vite Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          # Axios API client
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Responsive glassmorphism navigation
│   │   │   ├── EventForm.jsx      # Intake form with 12 event cards & sliders
│   │   │   ├── IdeasSection.jsx   # AI concept cards with color swatches
│   │   │   ├── BudgetChart.jsx    # Interactive Recharts donut/bar charts
│   │   │   ├── TimelineSection.jsx# Phased countdown checklist & progress bar
│   │   │   ├── VendorsSection.jsx # Vendor vetting criteria & interview questions
│   │   │   ├── InvitationSection.jsx # 4-style invitation copies & 1-click copy
│   │   │   ├── GuestTracker.jsx   # RSVP counters & guest management
│   │   │   ├── ChatAssistant.jsx  # Floating conversational AI concierge
│   │   │   └── ApiKeyModal.jsx    # Gemini API key management modal
│   │   ├── App.jsx                # Main application orchestrator
│   │   └── index.css              # Glassmorphism design system & fonts
│   ├── package.json
│   └── vite.config.js             # Vite + Tailwind v4 + API Proxy
│
└── index.html                     # Standalone Zero-Dependency Preview Prototype (55KB)
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Python**: v3.10+ (tested on Python 3.14)
- **Gemini API Key** (Optional for testing; fallback simulator built-in): [Get Free Key](https://aistudio.google.com/apikey)

---

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment (optional)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Start FastAPI server
uvicorn main:app --reload --port 8000
```
Backend API interactive documentation will be live at: **`http://localhost:8000/docs`**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend will be running at: **`http://localhost:5173`**

---

## 🎯 Verification & Testing

| Test Step | Action | Expected Result | Status |
|-----------|--------|-----------------|--------|
| **1. Backend Health** | `GET /health` | Returns `{"status":"ok"}` | ✅ Passed |
| **2. API Docs** | Open `http://localhost:8000/docs` | Swagger UI with Events, Planner, Chat, Guests | ✅ Passed |
| **3. Plan Generation** | Click "Generate Complete AI Event Plan" | Produces Themes, Budget Chart, Timeline, Vendors, Invites | ✅ Passed |
| **4. Budget Visualization** | Toggle Donut / Bar chart views | Recharts updates dynamically with tooltips | ✅ Passed |
| **5. Task Completion** | Check off milestone tasks | Progress bar fills up toward 100% | ✅ Passed |
| **6. RSVP Tracking** | Add guest & change status | Real-time counters update | ✅ Passed |
| **7. Production Build** | `npm run build` | Zero-warning build output in `frontend/dist/` | ✅ Passed |

---

## 📽️ Submission Pitch & Video Presentation Script

Use this concise 2-minute script when recording your PromptWars Challenge 5 demonstration:

> **Hook (0:00 - 0:20)**:  
> *"Have you ever spent weeks stressing over party planning, wrestling with chaotic spreadsheets, or accidentally blowing your budget? Welcome to **CelebAI**, our submission for PromptWars Challenge 5 — the AI-Powered Celebration and Event Planner."*
>
> **Problem & Solution (0:20 - 0:50)**:  
> *"With CelebAI, planning any celebration is as easy as selecting your event type, setting your budget, and letting Google Gemini formulate an end-to-end plan in seconds."*
>
> **Live Demo (0:50 - 1:30)**:  
> *"Notice how the AI crafts 3 bespoke themes with curated color palettes. Over in the Smart Budget tab, our interactive Recharts visualizer breaks down every rupee to prevent surprises. The Timeline tab gives you a countdown checklist with a real-time progress bar. The Vendor Guide arms you with the exact questions to ask before signing contracts, and the Invitation Suite gives you instant WhatsApp, formal, and Instagram captions ready to copy!"*
>
> **Closing (1:30 - 2:00)**:  
> *"Built with modern React, Tailwind CSS, FastAPI, and Google Gemini AI, CelebAI delivers enterprise-grade event intelligence right into your browser. Thank you for watching!"*

---

## 🛡️ License

This project is licensed under the MIT License.
