export type ApiResult =
  | { status: "ok" }
  | { status: "duplicate" }
  | { status: "not_connected" }
  | { status: "error"; message: string }

export type ChatMessage = { role: "user" | "assistant"; content: string }

export interface NewsArticle {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  author: string
  authorHandle: string
  category: "Match Report" | "Squad News" | "Art & Community" | "Podcast" | "Tournament"
  readTime: string
  coverImage?: string
  publishedAt: string
}

export interface BackendStats {
  waitlistCount: number
  newsletterCount: number
  articlesCount: number
  recentChatsCount: number
}

const API_BASE = import.meta.env.VITE_API_BASE || ""
const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || "/api/chat"

// The AI Chat backend is connected via our Express/Groq server
export const chatConnected = true

export async function sendChat(messages: ChatMessage[], signal?: AbortSignal): Promise<string> {
  const endpoint = `${API_BASE}${CHAT_ENDPOINT}`
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || "The squad assistant is unavailable right now. Please try again shortly.")
  }

  const data = await response.json()
  if (typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("The assistant returned an empty response. Please try again.")
  }
  return data.reply
}

export async function subscribeNewsletter(d: { email: string; firstName?: string; favouriteClub?: string }): Promise<ApiResult> {
  try {
    const res = await fetch(`${API_BASE}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: d.email,
        firstName: d.firstName || null,
        favouriteClub: d.favouriteClub || null,
      }),
    })

    const data = await res.json()
    if (res.ok && data.status === "ok") return { status: "ok" }
    if (data.status === "duplicate") return { status: "duplicate" }
    return { status: "error", message: data.message || "Failed to subscribe. Please try again." }
  } catch (err) {
    return { status: "error", message: "Network error. Please make sure the backend is running and retry." }
  }
}

export async function joinWaitlist(d: { name: string; email: string; interests: string[] }): Promise<ApiResult> {
  try {
    const res = await fetch(`${API_BASE}/api/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: d.name,
        email: d.email,
        interests: d.interests,
      }),
    })

    const data = await res.json()
    if (res.ok && data.status === "ok") return { status: "ok" }
    if (data.status === "duplicate") return { status: "duplicate" }
    return { status: "error", message: data.message || "Failed to join waitlist. Please try again." }
  } catch (err) {
    return { status: "error", message: "Network error. Please make sure the backend is running and retry." }
  }
}

export async function fetchNewsArticles(category?: string, query?: string): Promise<NewsArticle[]> {
  try {
    const params = new URLSearchParams()
    if (category) params.set("category", category)
    if (query) params.set("q", query)

    const url = `${API_BASE}/api/news${params.toString() ? `?${params.toString()}` : ""}`
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch news articles")
    const data = await res.json()
    return data.articles || []
  } catch (err) {
    console.error("Error fetching articles:", err)
    return []
  }
}

export async function createNewsArticle(article: {
  title: string
  summary: string
  content: string
  author: string
  authorHandle: string
  category: NewsArticle["category"]
  readTime: string
}): Promise<NewsArticle | null> {
  try {
    const res = await fetch(`${API_BASE}/api/news`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article),
    })
    if (!res.ok) throw new Error("Failed to post news article")
    const data = await res.json()
    return data.article
  } catch (err) {
    console.error("Error creating article:", err)
    return null
  }
}

export async function fetchBackendStats(): Promise<BackendStats | null> {
  try {
    const res = await fetch(`${API_BASE}/api/stats`)
    if (!res.ok) return null
    const data = await res.json()
    return data.stats
  } catch {
    return null
  }
}
