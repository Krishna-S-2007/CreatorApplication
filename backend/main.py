import os
from typing import Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from dotenv import load_dotenv

from backend.models import (
    ChatRequest, ChatResponse,
    WaitlistCreate, WaitlistEntry,
    NewsletterCreate, NewsletterSubscriber,
    NewsArticleCreate, NewsArticle
)
from backend.db import db
from backend.groq_service import generate_chat_reply

load_dotenv()

app = FastAPI(
    title="Wheaty Bisks Gaming API",
    description="Interactive backend & Groq AI chatbot for Wheaty Bisks Gaming (@wheatybisksgaming)",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Health & Stats ---
@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "channel": "@wheatybisksgaming",
        "groqConfigured": bool(os.getenv("GROQ_API_KEY", "").strip()),
        "groqModel": os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b"),
    }

@app.get("/api/stats")
async def get_stats():
    return {
        "status": "ok",
        "stats": db.get_stats(),
        "groqConfigured": bool(os.getenv("GROQ_API_KEY", "").strip()),
    }

# --- AI Chatbot Route (Groq API) ---
@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    if not payload.messages:
        raise HTTPException(status_code=400, detail="Missing messages list.")
    
    last_msg = payload.messages[-1]
    if not last_msg.content.strip():
        raise HTTPException(status_code=400, detail="Last message cannot be empty.")

    reply = await generate_chat_reply(payload.messages)
    db.log_chat(last_msg.content, reply)
    return ChatResponse(reply=reply)

# --- Waitlist Endpoints ---
@app.get("/api/waitlist")
async def list_waitlist():
    entries = db.get_waitlist()
    return {
        "status": "ok",
        "total": len(entries),
        "waitlist": entries,
    }

@app.post("/api/waitlist")
async def add_to_waitlist(payload: WaitlistCreate):
    entry, is_dup = db.add_waitlist_entry(payload.name, payload.email, payload.interests)
    if is_dup:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"status": "duplicate", "message": "You are already on the waitlist."}
        )
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"status": "ok", "entry": entry}
    )

@app.delete("/api/waitlist/{entry_id}")
async def delete_waitlist_entry(entry_id: str):
    removed = db.delete_waitlist_entry(entry_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Entry not found.")
    return {"status": "ok", "message": "Waitlist entry deleted."}

# --- Newsletter Endpoints ---
@app.get("/api/newsletter")
async def list_newsletter():
    subscribers = db.get_newsletter()
    return {
        "status": "ok",
        "total": len(subscribers),
        "subscribers": subscribers,
    }

@app.post("/api/newsletter")
async def add_to_newsletter(payload: NewsletterCreate):
    subscriber, is_dup = db.add_newsletter_subscriber(payload.email, payload.firstName, payload.favouriteClub)
    if is_dup:
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"status": "duplicate", "message": "You are already subscribed to the newsletter."}
        )
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"status": "ok", "subscriber": subscriber}
    )

@app.delete("/api/newsletter/{sub_id}")
async def delete_newsletter_subscriber(sub_id: str):
    removed = db.delete_newsletter_subscriber(sub_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Subscriber not found.")
    return {"status": "ok", "message": "Subscriber deleted."}

# --- News Articles Endpoints ("news article nd all") ---
@app.get("/api/news")
async def list_news_articles(
    category: Optional[str] = Query(None),
    q: Optional[str] = Query(None)
):
    articles = db.get_articles(category, q)
    return {
        "status": "ok",
        "total": len(articles),
        "articles": articles,
    }

@app.get("/api/news/{identifier}")
async def get_news_article(identifier: str):
    article = db.get_article(identifier)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found.")
    return {"status": "ok", "article": article}

@app.post("/api/news")
async def create_news_article(payload: NewsArticleCreate):
    article = db.add_article(payload)
    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"status": "ok", "article": article}
    )

@app.delete("/api/news/{article_id}")
async def delete_news_article(article_id: str):
    removed = db.delete_article(article_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Article not found.")
    return {"status": "ok", "message": "Article deleted."}

# --- Interactive Web Admin Dashboard ---
@app.get("/admin", response_class=HTMLResponse)
async def admin_dashboard():
    stats = db.get_stats()
    waitlist = db.get_waitlist()
    newsletter = db.get_newsletter()
    articles = db.get_articles()
    groq_active = bool(os.getenv("GROQ_API_KEY", "").strip())

    waitlist_rows = "".join([
        f"""<tr>
            <td style="color: #888;">{w.get('createdAt', '')[:10]}</td>
            <td><strong>{w.get('name')}</strong></td>
            <td><a href="mailto:{w.get('email')}" style="color: #b6ff1c; text-decoration: none;">{w.get('email')}</a></td>
            <td>{"".join([f"<span class='tag'>{i}</span>" for i in w.get('interests', [])]) or "All"}</td>
        </tr>"""
        for w in waitlist
    ]) or "<tr><td colspan='4' style='color:#888;'>No entries yet.</td></tr>"

    newsletter_rows = "".join([
        f"""<tr>
            <td style="color: #888;">{n.get('createdAt', '')[:10]}</td>
            <td><a href="mailto:{n.get('email')}" style="color: #b6ff1c; text-decoration: none;">{n.get('email')}</a></td>
            <td>{n.get('firstName') or "-"}</td>
            <td>{n.get('favouriteClub') or "-"}</td>
        </tr>"""
        for n in newsletter
    ]) or "<tr><td colspan='4' style='color:#888;'>No subscribers yet.</td></tr>"

    articles_rows = "".join([
        f"""<tr>
            <td style="color: #888;">{a.get('publishedAt', '')[:10]}</td>
            <td><strong>{a.get('title')}</strong></td>
            <td><span class="tag">{a.get('category')}</span></td>
            <td>{a.get('author')} <span style="color: #888; font-size: 10px;">({a.get('authorHandle')})</span></td>
            <td style="color: #888;">{a.get('readTime')}</td>
        </tr>"""
        for a in articles
    ])

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Wheaty Bisks Gaming - FastAPI Python Admin</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Space+Mono:wght@400;700&display=swap">
  <style>
    :root {{
      --lime: #b6ff1c;
      --ink: #141414;
      --ink-deep: #0a0a0a;
      --card: #1f1f1f;
      --text: #f0f0f0;
      --muted: #888888;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      background: var(--ink-deep);
      color: var(--text);
      font-family: 'Space Mono', monospace;
      padding: 24px;
      line-height: 1.5;
    }}
    header {{
      max-width: 1200px;
      margin: 0 auto 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 20px;
    }}
    h1 {{
      font-family: 'Unbounded', sans-serif;
      font-size: 24px;
      color: var(--lime);
      text-transform: uppercase;
    }}
    .badge {{
      display: inline-block;
      background: rgba(182, 255, 28, 0.15);
      color: var(--lime);
      border: 1px solid var(--lime);
      padding: 4px 10px;
      font-size: 11px;
      font-weight: bold;
      border-radius: 4px;
      text-transform: uppercase;
    }}
    .container {{
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      gap: 24px;
    }}
    .stats-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }}
    .card {{
      background: var(--card);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 20px;
    }}
    .card h2 {{
      font-family: 'Unbounded', sans-serif;
      font-size: 16px;
      margin-bottom: 16px;
      color: var(--lime);
      text-transform: uppercase;
    }}
    .stat-number {{
      font-family: 'Unbounded', sans-serif;
      font-size: 36px;
      font-weight: 900;
      color: #fff;
    }}
    .stat-label {{
      font-size: 12px;
      color: var(--muted);
      text-transform: uppercase;
      margin-top: 4px;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 12px;
    }}
    th, td {{
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }}
    th {{
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }}
    tr:hover {{
      background: rgba(255,255,255,0.02);
    }}
    .tag {{
      background: rgba(255,255,255,0.1);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      margin-right: 4px;
    }}
    .docs-btn {{
      display: inline-block;
      margin-left: 10px;
      padding: 4px 10px;
      background: rgba(255,255,255,0.1);
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      font-size: 11px;
    }}
    .docs-btn:hover {{
      background: var(--lime);
      color: #000;
    }}
  </style>
</head>
<body>
  <header>
    <div>
      <h1>FastAPI Python Backend</h1>
      <p style="color: var(--muted); font-size: 12px; margin-top: 4px;">Wheaty Bisks Gaming (@wheatybisksgaming) Squad API</p>
    </div>
    <div>
      <span class="badge">Groq: {"Live API Connected" if groq_active else "Local AI Fallback Active"}</span>
      <a href="/docs" class="docs-btn" target="_blank">Swagger Docs &rarr;</a>
    </div>
  </header>

  <div class="container">
    <div class="stats-grid">
      <div class="card">
        <div class="stat-number">{stats['waitlistCount']}</div>
        <div class="stat-label">Waitlist Applicants</div>
      </div>
      <div class="card">
        <div class="stat-number">{stats['newsletterCount']}</div>
        <div class="stat-label">Newsletter Subscribers</div>
      </div>
      <div class="card">
        <div class="stat-number">{stats['articlesCount']}</div>
        <div class="stat-label">News Articles</div>
      </div>
      <div class="card">
        <div class="stat-number">{stats['recentChatsCount']}</div>
        <div class="stat-label">Chat Interactions</div>
      </div>
    </div>

    <div class="card">
      <h2>Waitlist Applicants ({len(waitlist)})</h2>
      <table>
        <thead>
          <tr><th>Date</th><th>Name</th><th>Email</th><th>Interests</th></tr>
        </thead>
        <tbody>{waitlist_rows}</tbody>
      </table>
    </div>

    <div class="card">
      <h2>Newsletter Subscribers ({len(newsletter)})</h2>
      <table>
        <thead>
          <tr><th>Date</th><th>Email</th><th>First Name</th><th>Favourite Club</th></tr>
        </thead>
        <tbody>{newsletter_rows}</tbody>
      </table>
    </div>

    <div class="card">
      <h2>Squad News & Lore Articles ({len(articles)})</h2>
      <table>
        <thead>
          <tr><th>Published</th><th>Title</th><th>Category</th><th>Author</th><th>Read Time</th></tr>
        </thead>
        <tbody>{articles_rows}</tbody>
      </table>
    </div>
  </div>
</body>
</html>"""
    return HTMLResponse(content=html)
