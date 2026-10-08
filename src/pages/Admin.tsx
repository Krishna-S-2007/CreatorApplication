import { useEffect, useState } from "react"
import {
  fetchBackendStats,
  fetchHealth,
  fetchWaitlist,
  deleteWaitlistApplicant,
  fetchNewsletterSubscribers,
  deleteNewsletterSubscriber,
  fetchNewsArticles,
  deleteNewsArticle,
  type BackendStats,
  type HealthStatus,
  type WaitlistApplicant,
  type NewsletterSubscriberItem,
  type NewsArticle,
} from "../lib/api"

export default function Admin() {
  const [stats, setStats] = useState<BackendStats | null>(null)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [waitlist, setWaitlist] = useState<WaitlistApplicant[]>([])
  const [newsletter, setNewsletter] = useState<NewsletterSubscriberItem[]>([])
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [activeTab, setActiveTab] = useState<"waitlist" | "newsletter" | "articles">("waitlist")
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState("")

  async function loadData() {
    setLoading(true)
    const [s, h, w, n, a] = await Promise.all([
      fetchBackendStats(),
      fetchHealth(),
      fetchWaitlist(),
      fetchNewsletterSubscribers(),
      fetchNewsArticles(),
    ])
    setStats(s)
    setHealth(h)
    setWaitlist(w)
    setNewsletter(n)
    setArticles(a)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  function showNotice(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(""), 4000)
  }

  async function handleDeleteWaitlist(id: string, name: string) {
    if (!confirm(`Remove ${name} from waitlist?`)) return
    const ok = await deleteWaitlistApplicant(id)
    if (ok) {
      setWaitlist((prev) => prev.filter((item) => item.id !== id))
      showNotice(`Removed ${name} from waitlist.`)
    }
  }

  async function handleDeleteSubscriber(id: string, email: string) {
    if (!confirm(`Unsubscribe ${email}?`)) return
    const ok = await deleteNewsletterSubscriber(id)
    if (ok) {
      setNewsletter((prev) => prev.filter((item) => item.id !== id))
      showNotice(`Removed ${email} from newsletter.`)
    }
  }

  async function handleDeleteArticle(id: string, title: string) {
    if (!confirm(`Delete article: "${title}"?`)) return
    const ok = await deleteNewsArticle(id)
    if (ok) {
      setArticles((prev) => prev.filter((item) => item.id !== id))
      showNotice(`Deleted article "${title}".`)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-lime">
            <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
            <span>Wheaty Bisks Control Center</span>
          </div>
          <h1 className="font-display mt-3 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Admin <span className="text-lime">Dashboard</span>
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Real-time management for waitlist applicants, subscribers, articles, and AI status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData()}
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-lime hover:bg-lime hover:text-ink cursor-pointer"
          >
            Refresh Data
          </button>
          <a
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-lime/40 bg-lime/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-lime transition hover:bg-lime hover:text-ink"
          >
            Swagger API &rarr;
          </a>
        </div>
      </div>

      {actionMsg && (
        <div className="mt-6 rounded-xl border border-lime/40 bg-lime/10 px-4 py-3 text-xs font-bold text-lime">
          {actionMsg}
        </div>
      )}

      {/* Backend & AI Health Banner */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-ink-deep p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-lime animate-ping" />
            <div>
              <p className="font-display text-sm font-bold text-white">
                FastAPI Python Backend Status: <span className="text-lime uppercase">{health?.status || "Connecting..."}</span>
              </p>
              <p className="text-xs text-white/50">
                Squad Channel: {health?.channel || "@wheatybisksgaming"} • Model: {health?.groqModel || "qwen/qwen3.8-27b"}
              </p>
            </div>
          </div>
          <span className="rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-xs font-mono font-bold text-lime">
            {health?.groqConfigured ? "Groq Cloud Connected" : "Local Heuristic Engine"}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-ink-deep p-6">
          <p className="text-xs uppercase tracking-widest text-white/50">Waitlist Applicants</p>
          <p className="font-display mt-3 text-4xl font-black text-lime">
            {stats?.waitlistCount ?? waitlist.length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-deep p-6">
          <p className="text-xs uppercase tracking-widest text-white/50">Newsletter Subscribers</p>
          <p className="font-display mt-3 text-4xl font-black text-white">
            {stats?.newsletterCount ?? newsletter.length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-deep p-6">
          <p className="text-xs uppercase tracking-widest text-white/50">Published Articles</p>
          <p className="font-display mt-3 text-4xl font-black text-white">
            {stats?.articlesCount ?? articles.length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-deep p-6">
          <p className="text-xs uppercase tracking-widest text-white/50">AI Chat Logs</p>
          <p className="font-display mt-3 text-4xl font-black text-lime">
            {stats?.recentChatsCount ?? 0}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-12 flex gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("waitlist")}
          className={`rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "waitlist"
              ? "bg-lime text-ink"
              : "border border-white/15 text-white/70 hover:border-lime hover:text-white"
          }`}
        >
          Waitlist ({waitlist.length})
        </button>
        <button
          onClick={() => setActiveTab("newsletter")}
          className={`rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "newsletter"
              ? "bg-lime text-ink"
              : "border border-white/15 text-white/70 hover:border-lime hover:text-white"
          }`}
        >
          Newsletter ({newsletter.length})
        </button>
        <button
          onClick={() => setActiveTab("articles")}
          className={`rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "articles"
              ? "bg-lime text-ink"
              : "border border-white/15 text-white/70 hover:border-lime hover:text-white"
          }`}
        >
          Articles ({articles.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        {loading ? (
          <div className="py-16 text-center text-sm text-white/50">Loading dashboard records...</div>
        ) : (
          <>
            {/* WAITLIST TAB */}
            {activeTab === "waitlist" && (
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-ink-deep">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-black/40 text-white/50 uppercase">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Interests</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {waitlist.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-white/40">
                          No waitlist applicants registered yet.
                        </td>
                      </tr>
                    ) : (
                      waitlist.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition">
                          <td className="p-4 font-mono text-white/50">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 font-bold text-white">{item.name}</td>
                          <td className="p-4 font-mono text-lime">{item.email}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {item.interests.map((int, i) => (
                                <span
                                  key={i}
                                  className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/80"
                                >
                                  {int}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteWaitlist(item.id, item.name)}
                              className="text-red-400 hover:text-red-300 font-bold hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* NEWSLETTER TAB */}
            {activeTab === "newsletter" && (
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-ink-deep">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-black/40 text-white/50 uppercase">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">First Name</th>
                      <th className="p-4">Favourite Club</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {newsletter.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-white/40">
                          No newsletter subscribers yet.
                        </td>
                      </tr>
                    ) : (
                      newsletter.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition">
                          <td className="p-4 font-mono text-white/50">
                            {new Date(item.subscribedAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 font-mono text-lime font-bold">{item.email}</td>
                          <td className="p-4 text-white">{item.firstName || "—"}</td>
                          <td className="p-4 text-white/70">{item.favouriteClub || "—"}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteSubscriber(item.id, item.email)}
                              className="text-red-400 hover:text-red-300 font-bold hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ARTICLES TAB */}
            {activeTab === "articles" && (
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-ink-deep">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-black/40 text-white/50 uppercase">
                    <tr>
                      <th className="p-4">Category</th>
                      <th className="p-4">Title</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Published</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {articles.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition">
                        <td className="p-4">
                          <span className="rounded bg-lime/10 border border-lime/30 px-2 py-0.5 text-[10px] font-bold text-lime uppercase">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-white max-w-sm truncate">
                          {item.title}
                        </td>
                        <td className="p-4 text-white/70">
                          {item.author} <span className="font-mono text-lime text-[10px]">({item.authorHandle})</span>
                        </td>
                        <td className="p-4 font-mono text-white/50">{item.publishedAt}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteArticle(item.id, item.title)}
                            className="text-red-400 hover:text-red-300 font-bold hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
