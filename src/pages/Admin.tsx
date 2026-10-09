import { useEffect, useState, type FormEvent } from "react"
import {
  fetchBackendStats,
  fetchHealth,
  fetchWaitlist,
  deleteWaitlistApplicant,
  fetchNewsletterSubscribers,
  deleteNewsletterSubscriber,
  fetchNewsArticles,
  createNewsArticle,
  deleteNewsArticle,
  adminLogin,
  type BackendStats,
  type HealthStatus,
  type WaitlistApplicant,
  type NewsletterSubscriberItem,
  type NewsArticle,
} from "../lib/api"
import { crew } from "../data/content"

// Verified squad members and gamertag intelligence
const PLAYER_PROFILES: Record<string, { gamertag: string; role: string; games: string }> = {
  Ryan: { gamertag: "RealRyan360", role: "Captain / Tank Anchor", games: "Overwatch 2 • Rocket League • FIFA" },
  Jordan: { gamertag: "Jordinho", role: "Playmaker / Voice", games: "Rocket League • Counter-Attacks" },
  Emedic: { gamertag: "E Medic (@emedic0615)", role: "3D Artist / Creator", games: "Rec Room • Overwatch 2 • Fortnite" },
  CyanDragon: { gamertag: "Cyandragon", role: "Clutch Specialist / DPS", games: "Rainbow Six Siege • Overwatch 2" },
  "aka JB": { gamertag: "Chong Bling", role: "Competitor / Mid-Laner", games: "League of Legends (EUW) • Fortnite • Dislyte" },
}

function renderFormattedContent(text: string) {
  const lines = text.split("\n")
  return lines.map((line, idx) => {
    const trimmed = line.trim()
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={idx} className="font-display mt-6 mb-3 text-lg font-black uppercase text-lime">
          {trimmed.replace("### ", "")}
        </h3>
      )
    }
    if (trimmed.startsWith("#### ")) {
      return (
        <h4 key={idx} className="font-display mt-4 mb-2 text-sm font-bold uppercase text-white/90">
          {trimmed.replace("#### ", "")}
        </h4>
      )
    }
    if (trimmed.startsWith("> ")) {
      return (
        <blockquote key={idx} className="my-4 border-l-2 border-lime bg-white/5 p-4 text-xs italic leading-relaxed text-white/90 rounded-r-lg">
          {trimmed.replace("> ", "")}
        </blockquote>
      )
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      return (
        <li key={idx} className="ml-4 list-disc text-xs leading-relaxed text-white/80 my-1">
          {trimmed.replace(/^[-•]\s*/, "")}
        </li>
      )
    }
    if (trimmed === "---") {
      return <hr key={idx} className="my-6 border-white/10" />
    }
    if (!trimmed) {
      return <div key={idx} className="h-2" />
    }
    return (
      <p key={idx} className="my-2 text-xs leading-relaxed text-white/80">
        {trimmed}
      </p>
    )
  })
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("wb_admin_auth") === "true"
  })
  const [loginUser, setLoginUser] = useState("")
  const [loginPass, setLoginPass] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loggingIn, setLoggingIn] = useState(false)

  const [stats, setStats] = useState<BackendStats | null>(null)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [waitlist, setWaitlist] = useState<WaitlistApplicant[]>([])
  const [newsletter, setNewsletter] = useState<NewsletterSubscriberItem[]>([])
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [activeTab, setActiveTab] = useState<"articles" | "waitlist" | "newsletter">("articles")
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState("")

  // Publish Article Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newSummary, setNewSummary] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newAuthor, setNewAuthor] = useState("Ryan")
  const [newCategory, setNewCategory] = useState<NewsArticle["category"]>("Match Report")
  const [newReadTime, setNewReadTime] = useState("5 min read")
  const [publishSubmitting, setPublishSubmitting] = useState(false)
  const [publishError, setPublishError] = useState("")

  // Article Preview Modal State
  const [previewArticle, setPreviewArticle] = useState<NewsArticle | null>(null)

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
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoginError("")
    setLoggingIn(true)
    const ok = await adminLogin(loginUser.trim(), loginPass)
    setLoggingIn(false)
    if (ok) {
      sessionStorage.setItem("wb_admin_auth", "true")
      setIsAuthenticated(true)
      setLoginPass("")
    } else {
      setLoginError("Invalid username or password. Access denied.")
    }
  }

  function showNotice(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(""), 5000)
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
      const freshStats = await fetchBackendStats()
      setStats(freshStats)
    }
  }

  async function handlePublishArticle(e: FormEvent) {
    e.preventDefault()
    if (!newTitle.trim() || !newContent.trim()) {
      setPublishError("Title and guide content are required.")
      return
    }

    setPublishSubmitting(true)
    setPublishError("")
    const profile = PLAYER_PROFILES[newAuthor]
    const authorHandle = profile ? profile.gamertag : "@wheatybisksgaming"

    const created = await createNewsArticle({
      title: newTitle.trim(),
      summary: newSummary.trim() || newTitle.trim(),
      content: newContent.trim(),
      author: newAuthor,
      authorHandle,
      category: newCategory,
      readTime: newReadTime.trim() || "5 min read",
    })

    setPublishSubmitting(false)
    if (created) {
      setNewTitle("")
      setNewSummary("")
      setNewContent("")
      setIsPublishModalOpen(false)
      showNotice(`Published "${created.title}" directly to live News section!`)
      // Refresh articles list and dashboard stats
      const freshArticles = await fetchNewsArticles()
      setArticles(freshArticles)
      const freshStats = await fetchBackendStats()
      setStats(freshStats)
    } else {
      setPublishError("Failed to save article. Check backend connection.")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-card p-8 shadow-2xl">
          <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-lime/10 blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-lime">
            <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
            <span>Restricted Access</span>
          </div>

          <h1 className="font-display mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
            Admin <span className="text-lime">Gate</span>
          </h1>
          <p className="mt-2 text-xs text-white/60">
            Please enter your squad credentials to access the Wheaty Bisks control center.
          </p>

          <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5 font-mono">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="wheatybisksgaming"
                className="w-full rounded-xl border border-white/15 bg-ink-deep px-4 py-3 text-sm text-white placeholder-white/30 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5 font-mono">
                Password
              </label>
              <input
                type="password"
                autoComplete="current-password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/15 bg-ink-deep px-4 py-3 text-sm text-white placeholder-white/30 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime"
                required
              />
            </div>

            {loginError && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-400">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="mt-2 w-full rounded-xl bg-lime py-3.5 text-xs font-black uppercase tracking-widest text-ink transition hover:bg-lime/90 disabled:opacity-50 cursor-pointer shadow-lg shadow-lime/20 font-mono"
            >
              {loggingIn ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      </div>
    )
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
            Publish meta guides, manage waitlist applicants, newsletter subscribers, and monitor AI status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="rounded-xl bg-lime px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-ink transition hover:bg-white cursor-pointer shadow-lg shadow-lime/20 font-mono"
          >
            + Publish Guide / Intel
          </button>
          <button
            onClick={() => loadData()}
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-lime hover:bg-lime hover:text-ink cursor-pointer"
          >
            Refresh
          </button>
          <a
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-lime/40 bg-lime/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-lime transition hover:bg-lime hover:text-ink"
          >
            Swagger API &rarr;
          </a>
          <button
            onClick={() => {
              sessionStorage.removeItem("wb_admin_auth")
              setIsAuthenticated(false)
            }}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red-400 transition hover:bg-red-500 hover:text-white cursor-pointer"
          >
            Lock Console
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="mt-6 rounded-xl border border-lime/40 bg-lime/10 px-4 py-3 text-xs font-bold text-lime flex items-center justify-between">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg("")} className="text-lime/70 hover:text-lime cursor-pointer font-mono">
            &times;
          </button>
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
            {health?.groqConfigured ? "Groq Cloud Connected (qwen/qwen3.8-27b)" : "Local Heuristic Engine"}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-ink-deep p-6">
          <p className="text-xs uppercase tracking-widest text-white/50">Published Articles</p>
          <p className="font-display mt-3 text-4xl font-black text-lime">
            {stats?.articlesCount ?? articles.length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-deep p-6">
          <p className="text-xs uppercase tracking-widest text-white/50">Waitlist Applicants</p>
          <p className="font-display mt-3 text-4xl font-black text-white">
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
          <p className="text-xs uppercase tracking-widest text-white/50">AI Chat Logs</p>
          <p className="font-display mt-3 text-4xl font-black text-lime">
            {stats?.recentChatsCount ?? 0}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-12 flex gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("articles")}
          className={`rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "articles"
              ? "bg-lime text-ink"
              : "border border-white/15 text-white/70 hover:border-lime hover:text-white"
          }`}
        >
          Articles & Intel ({articles.length})
        </button>
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
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        {loading ? (
          <div className="py-16 text-center text-sm text-white/50 font-mono">Loading dashboard records...</div>
        ) : (
          <>
            {/* ARTICLES TAB */}
            {activeTab === "articles" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs text-white/60">
                    Manage squad game intelligence published to <a href="/news" target="_blank" className="text-lime underline">/news</a>.
                  </p>
                  <button
                    onClick={() => setIsPublishModalOpen(true)}
                    className="rounded-lg bg-lime/20 border border-lime/40 px-3 py-1.5 text-xs font-bold uppercase text-lime hover:bg-lime hover:text-ink transition cursor-pointer"
                  >
                    + New Guide
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-ink-deep">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/10 bg-black/40 text-white/50 uppercase">
                      <tr>
                        <th className="p-4">Category</th>
                        <th className="p-4">Headline / Title</th>
                        <th className="p-4">Author</th>
                        <th className="p-4">Read Time</th>
                        <th className="p-4">Published</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {articles.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-white/40">
                            No articles published yet. Click "+ Publish Guide / Intel" to create your first guide.
                          </td>
                        </tr>
                      ) : (
                        articles.map((item) => (
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
                            <td className="p-4 text-white/50">{item.readTime}</td>
                            <td className="p-4 font-mono text-white/50">{item.publishedAt}</td>
                            <td className="p-4 text-right space-x-3">
                              <button
                                onClick={() => setPreviewArticle(item)}
                                className="text-lime hover:underline font-bold cursor-pointer"
                              >
                                Preview
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(item.id, item.title)}
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
              </div>
            )}

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
          </>
        )}
      </div>

      {/* PUBLISH ARTICLE MODAL */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="glass max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-lime/50 bg-ink-deep p-8 shadow-[0_30px_100px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-lime">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
                  <span>Admin Publishing Studio</span>
                </div>
                <h2 className="font-display mt-1 text-xl font-black uppercase text-white">
                  Publish <span className="text-lime">Guide & Intel</span>
                </h2>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-2xl text-white/60 hover:text-lime cursor-pointer font-mono"
              >
                &times;
              </button>
            </div>

            {publishError && (
              <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-400">
                {publishError}
              </div>
            )}

            <form onSubmit={handlePublishArticle} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-white/70 mb-1 font-mono font-bold">
                  Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Ramattra Overtime Mastery: Holding Point in Flashpoint"
                  className="w-full rounded-xl border border-white/20 bg-ink p-3 text-white placeholder-white/30 outline-none focus:border-lime focus:ring-1 focus:ring-lime"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-white/70 mb-1 font-mono font-bold">
                    Author / Player
                  </label>
                  <select
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-ink p-3 text-white outline-none focus:border-lime"
                  >
                    {crew.map((c) => {
                      const profile = PLAYER_PROFILES[c.name]
                      const tag = profile ? profile.gamertag : c.handle
                      return (
                        <option key={c.name} value={c.name}>
                          {c.name} ({tag})
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-white/70 mb-1 font-mono font-bold">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as NewsArticle["category"])}
                    className="w-full rounded-xl border border-white/20 bg-ink p-3 text-white outline-none focus:border-lime"
                  >
                    <option value="Match Report">Match Report</option>
                    <option value="Tournament">Tournament</option>
                    <option value="Squad News">Squad News</option>
                    <option value="Art & Community">Art & Community</option>
                    <option value="Podcast">Podcast</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-white/70 mb-1 font-mono font-bold">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={newReadTime}
                    onChange={(e) => setNewReadTime(e.target.value)}
                    placeholder="5 min read"
                    className="w-full rounded-xl border border-white/20 bg-ink p-3 text-white placeholder-white/30 outline-none focus:border-lime"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-white/70 mb-1 font-mono font-bold">
                  Executive Summary
                </label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Punchy key takeaway shown in news cards..."
                  className="w-full rounded-xl border border-white/20 bg-ink p-3 text-white placeholder-white/30 outline-none focus:border-lime"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="uppercase tracking-wider text-white/70 font-mono font-bold">
                    Guide Content & Tactical Breakdown *
                  </label>
                  <span className="text-[10px] text-lime font-mono">
                    Markdown supported: ###, &gt;, -, ---
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="### Strategy Overview&#10;Write actionable advice, patch breakdown, mechanics, ability stats...&#10;&#10;&gt; Tactical Tip from Ryan: Always save Nemesis form for the final 20 seconds.&#10;&#10;- Positioning tip&#10;- Cool down rotation"
                  className="w-full rounded-xl border border-white/20 bg-ink p-3 text-white placeholder-white/30 outline-none focus:border-lime font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="rounded-xl border border-white/20 px-6 py-2.5 font-bold uppercase text-white/70 hover:border-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishSubmitting}
                  className="rounded-xl bg-lime px-8 py-2.5 font-extrabold uppercase tracking-wider text-ink hover:bg-white disabled:opacity-50 cursor-pointer shadow-lg shadow-lime/20 font-mono"
                >
                  {publishSubmitting ? "Publishing to Live Feed..." : "Publish to Live News &rarr;"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTICLE PREVIEW MODAL */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="glass max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-lime/40 bg-ink-deep p-8 shadow-[0_25px_100px_#000]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-lime bg-lime/10 px-2.5 py-1 rounded border border-lime/30">
                  {previewArticle.category}
                </span>
                <span className="text-xs text-white/50">{previewArticle.readTime}</span>
              </div>
              <button
                onClick={() => setPreviewArticle(null)}
                className="text-2xl text-white/60 hover:text-lime cursor-pointer font-mono"
              >
                &times;
              </button>
            </div>

            <h1 className="font-display mt-6 text-2xl font-black uppercase text-white sm:text-3xl leading-snug">
              {previewArticle.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl bg-white/5 p-4 border border-white/10 text-xs">
              <div className="h-10 w-10 rounded-full bg-lime/20 border border-lime/40 flex items-center justify-center font-display font-black text-lime">
                {previewArticle.author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-white">
                  {previewArticle.author}{" "}
                  <span className="font-mono text-lime font-normal">
                    ({previewArticle.authorHandle})
                  </span>
                </div>
                <div className="text-[10px] text-white/50">
                  Published: {previewArticle.publishedAt} • Live on /news
                </div>
              </div>
            </div>

            {previewArticle.summary && (
              <div className="my-6 rounded-xl border border-lime/30 bg-lime/5 p-4 text-xs font-medium text-white/90 leading-relaxed">
                <strong>Executive Takeaway:</strong> {previewArticle.summary}
              </div>
            )}

            <div className="border-t border-white/10 pt-4">
              {renderFormattedContent(previewArticle.content)}
            </div>

            <div className="mt-8 flex justify-end border-t border-white/10 pt-4">
              <button
                onClick={() => setPreviewArticle(null)}
                className="rounded-xl bg-lime px-8 py-2.5 text-xs font-bold uppercase tracking-wider text-ink hover:bg-white cursor-pointer font-mono"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
