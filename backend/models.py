from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Literal

class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    reply: str

class WaitlistCreate(BaseModel):
    name: str = Field(..., min_length=1)
    email: str = Field(..., min_length=3)
    interests: List[str] = Field(default_factory=list)

class WaitlistEntry(BaseModel):
    id: str
    name: str
    email: str
    interests: List[str]
    createdAt: str

class NewsletterCreate(BaseModel):
    email: str = Field(..., min_length=3)
    firstName: Optional[str] = None
    favouriteClub: Optional[str] = None

class NewsletterSubscriber(BaseModel):
    id: str
    email: str
    firstName: Optional[str] = None
    favouriteClub: Optional[str] = None
    createdAt: str

class NewsArticleCreate(BaseModel):
    title: str = Field(..., min_length=1)
    summary: Optional[str] = None
    content: str = Field(..., min_length=1)
    author: Optional[str] = "Wheaty Bisks Crew"
    authorHandle: Optional[str] = "@wheatybisksgaming"
    category: Optional[Literal["Match Report", "Squad News", "Art & Community", "Podcast", "Tournament"]] = "Squad News"
    readTime: Optional[str] = "3 min read"
    coverImage: Optional[str] = None

class NewsArticle(BaseModel):
    id: str
    title: str
    slug: str
    summary: str
    content: str
    author: str
    authorHandle: str
    category: str
    readTime: str
    coverImage: Optional[str] = None
    publishedAt: str
