# Wheaty Bisks Gaming — Full-Stack Platform & AI Squad Assistant

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4.svg?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/AI_Engine-Groq_Cloud-F55036.svg?style=flat)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A high-performance full-stack web application and interactive community platform designed for **Wheaty Bisks Gaming** ([@wheatybisksgaming](https://www.youtube.com/@wheatybisksgaming)), a Dublin-based gaming squad. The platform unites competitive match guides, an authentic highlight reel player, membership waitlist and newsletter pipelines, and a real-time AI squad assistant powered by Groq Cloud and contextual squad intelligence.

---

## 🛠️ Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   React 19 Frontend                    │
│   (TypeScript • Vite • Tailwind CSS • React Router)     │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
      [HTTP / REST]                    [UI State / SPA]
            │                                │
┌───────────▼────────────────────────────────▼───────────┐
│                 FastAPI ASGI Backend                   │
│   (Python 3 • Uvicorn • Pydantic v2 • Swagger UI)      │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
    [LLM Inference]                   [Data Engine]
            │                                │
┌───────────▼──────────────┐   ┌─────────────▼───────────┐
│     Groq Cloud API       │   │  JSON Storage Engine    │
│ (Qwen 2.5 / Llama 3.3)   │   │  (Articles, Waitlist,   │
│ + Squad Knowledge Base   │   │   Subscribers, Logs)    │
└──────────────────────────┘   └─────────────────────────┘
```

### Stack Breakdown

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend Framework** | React 19, TypeScript, React Router 7 | Responsive component hierarchy and client-side routing |
| **Build & Styling** | Vite 8, Tailwind CSS v4, Lucide / Custom SVGs | Ultra-fast HMR, dark/lime gaming theme, custom micro-animations |
| **Backend Framework** | FastAPI, Uvicorn, Python 3.10+ | Asynchronous RESTful API engine with native OpenAPI docs |
| **Data Validation** | Pydantic v2, Python typing | Type safety, request/response validation, and schemas |
| **AI / LLM Engine** | Groq Cloud SDK (`qwen/qwen3.8-27b`) | Sub-second generative inference with squad persona grounding |
| **Fallback Engine** | Heuristic Knowledge Base (`backend/groq_service.py`) | Zero-downtime offline responses if API limits are reached |
| **Persistence** | File-backed JSON Engine (`backend/db.py`) | Lightweight, self-contained persistence for articles, subscriptions, and waitlists |
| **Deployment** | Vercel (Frontend SPA) + Render (FastAPI Web Service) | Production-ready, turnkey hosting configurations |

---

## ✨ Key Features

### 1. Animated Hero Slideshow & Game Highlight Reels
- **Fast-Paced Hero Slider**: Dynamic carousel highlighting squad achievements with snappy transitions.
- **YouTube Shorts Highlight Stream**: Continuous marquee track featuring top plays across Overwatch 2, Rocket League, Fortnite, League of Legends, FIFA 23, and UFC 4.
- **Modal Pop-up Player**: Clicking any highlight opens a responsive `VideoOverlay` modal with embedded playback, keyboard controls (`Esc`, arrow keys), player gamertag credits, and direct video links.

### 2. Interactive AI Squad Agent ("Wheaty AI")
- **Animated Mascot UI**: Retro-futuristic companion bot with real-time jumping physics, synchronized squash-and-stretch ground shadows, and pulsing antenna beacon.
- **Contextual Squad Grounding**: Embedded squad intelligence covering all 5 members (Ryan `RealRyan360`, Jordan `Jordinho`, Emedic `E Medic`, CyanDragon `Cyandragon`, and aka JB `Chong Bling`).
- **Interactive Chat Interface**: Includes pre-populated quick-prompt suggestion chips, live typing indicators, markdown message rendering, and error recovery.

### 3. Commercial Game Guides & Press Room
- **Actionable Game Guides**: Curated competitive articles spanning tank meta strategies, 2v2 rotation mechanics, bullet-drop adjustments, and streamer audio routing.
- **Filtering & Search**: Real-time filtering by category (`Match Report`, `Squad News`, `Art & Community`, `Podcast`, `Tournament`) and keyword search.
- **Content Creation**: Interactive modal to compose, categorize, and publish new squad articles directly to the backend.

### 4. Membership Waitlist & Newsletter Automation
- **Exclusive Waitlist (`/waitlist`)**: Deduplicated user onboarding pipeline capturing platform preferences, name, and email.
- **Weekly Newsletter (`/newsletter`)**: Automated subscriber intake storing preferred club and contact details.
- **Admin Dashboard (`/admin`)**: Built-in administrative dashboard to monitor member stats, view waitlist entries, and review active subscribers.

---

## 📡 API Specification

Interactive Swagger UI documentation is available locally at:
👉 **`http://localhost:3001/docs`** (or `/redoc` for ReDoc format).

### Core Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send conversational message history to the AI agent; returns assistant response |
| `GET` | `/api/news` | List published articles (supports `?category=...` and search query `?q=...`) |
| `GET` | `/api/news/{slug}` | Retrieve a specific article by its URL slug or ID |
| `POST` | `/api/news` | Publish a new news article or commercial game guide |
| `DELETE` | `/api/news/{id}` | Remove an article from the database |
| `GET` | `/api/waitlist` | List all waitlist submissions and breakdown |
| `POST` | `/api/waitlist` | Register a new user for the exclusive waitlist |
| `DELETE` | `/api/waitlist/{id}` | Delete a waitlist entry |
| `GET` | `/api/newsletter` | List all newsletter subscribers |
| `POST` | `/api/newsletter` | Subscribe an email address to the weekly newsletter |
| `DELETE` | `/api/newsletter/{id}` | Unsubscribe / remove an email address |
| `GET` | `/api/stats` | Aggregate metrics (waitlist count, subscriber count, articles count) |
| `GET` | `/api/health` | Service health status and Groq LLM integration verification |
| `GET` | `/admin` | Web-based administrative monitoring dashboard |

---

## 📂 Project Structure

```text
wheatybisks-gaming/
├── backend/                  # Python FastAPI Backend
│   ├── __init__.py
│   ├── main.py               # Application entry point, middleware, routes, admin UI
│   ├── models.py             # Pydantic data schemas (Chat, News, Waitlist, Newsletter)
│   ├── db.py                 # File-backed JSON persistence layer
│   └── groq_service.py       # Groq Cloud inference client, system prompt & fallback logic
├── data/
│   └── database.json         # Seeded database store (articles, waitlist, subscribers)
├── src/                      # React 19 Frontend
│   ├── assets/               # Member avatars and game artwork
│   ├── components/
│   │   ├── Navbar.tsx        # Navigation bar
│   │   ├── Footer.tsx        # Footer with social links
│   │   ├── Layout.tsx        # Global shell and header wrapper
│   │   ├── Slideshow.tsx     # Hero image carousel
│   │   ├── SquadHighlights.tsx# Horizontal highlight reel showcase with Shorts overlay
│   │   ├── VideoOverlay.tsx  # Pop-up modal player for video highlights
│   │   ├── QuoteOverlay.tsx  # Wall of Legends quote reader modal
│   │   ├── SquadChat.tsx     # Animated jumping bot mascot and AI chat widget
│   │   └── Forms.tsx         # Reusable form elements
│   ├── pages/
│   │   ├── Home.tsx          # Homepage
│   │   ├── News.tsx          # Press room and competitive gaming guides
│   │   ├── Waitlist.tsx      # Membership waitlist page
│   │   └── Newsletter.tsx    # Newsletter subscription page
│   ├── lib/
│   │   └── api.ts            # Frontend API client and TypeScript interfaces
│   ├── data/
│   │   └── content.ts        # Static squad roster and quote content
│   ├── index.css             # Tailwind v4 styles, custom animations, typography
│   └── App.tsx               # Client routes and layout wrapper
├── .env.example              # Template environment configuration
├── render.yaml               # Render Cloud deployment blueprint
├── vercel.json               # Vercel production routing and SPA rewrites
├── requirements.txt          # Python dependencies
├── package.json              # Frontend scripts and Node dependencies
└── vite.config.ts            # Vite build and proxy configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.10 or higher

---

### 1. Installation

#### Clone the repository
```bash
git clone https://github.com/<your-username>/wheatybisks-gaming.git
cd wheatybisks-gaming
```

#### Install Frontend Dependencies
```bash
npm install
```

#### Setup Python Virtual Environment & Install Backend Dependencies
```bash
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

### 2. Environment Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```bash
cp .env.example .env
```

Configure your environment variables:

```env
# Server Configuration
PORT=3001

# Groq Cloud API (Optional - local fallback runs if empty)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=qwen/qwen3.8-27b

# Frontend Client Configuration
VITE_CHAT_ENDPOINT=/api/chat
VITE_API_BASE=
```

> **Note**: If `GROQ_API_KEY` is not set, the assistant operates seamlessly using its internal heuristic knowledge base without throwing errors.

---

### 3. Running Locally

#### Terminal 1: Run the FastAPI Backend
```bash
source venv/bin/activate
uvicorn backend.main:app --port 3001 --host 0.0.0.0 --reload
```
*Backend runs at: `http://localhost:3001`*

#### Terminal 2: Run the Vite Frontend
```bash
npm run dev
```
*Frontend runs at: `http://localhost:5173` (requests to `/api` are automatically proxied to port `3001`).*

---

## 🚢 Production Deployment

### Backend Deployment (Render)
The repository includes a ready-to-use [`render.yaml`](./render.yaml) blueprint:
1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** &rarr; **Web Service** and connect your GitHub repository.
3. Configure settings:
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Set Environment Variables in Render:
   - `GROQ_API_KEY`: `<your_groq_api_key>`
   - `GROQ_MODEL`: `qwen/qwen3.8-27b`
5. Click **Deploy**. Render will assign a public URL (e.g. `https://wheatybisks-backend.onrender.com`).

---

### Frontend Deployment (Vercel)
The repository includes a pre-configured [`vercel.json`](./vercel.json) for SPA routing:
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New…** &rarr; **Project** and import the GitHub repository.
3. Select **Vite** as the framework preset (defaults will populate automatically).
4. Add Environment Variables in Vercel:
   - `VITE_API_BASE`: `https://wheatybisks-backend.onrender.com` *(your Render backend URL)*
   - `VITE_CHAT_ENDPOINT`: `/api/chat`
5. Click **Deploy**. Vercel will build and launch your production web app.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details. Built for the **Wheaty Bisks Gaming** squad community.
