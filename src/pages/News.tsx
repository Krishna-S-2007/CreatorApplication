import { useEffect, useState, type FormEvent } from "react"
import { fetchNewsArticles, createNewsArticle, type NewsArticle } from "../lib/api"
import { crew } from "../data/content"

const categories = ["All", "Match Report", "Squad News", "Art & Community", "Podcast", "Tournament"] as const

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

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state for creating a new article
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("Ryan")
  const [category, setCategory] = useState<NewsArticle["category"]>("Match Report")
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  const loadArticles = async () => {
    setLoading(true)
    const cat = selectedCategory === "All" ? undefined : selectedCategory
    const data = await fetchNewsArticles(cat, searchQuery)
    setArticles(data)
    setLoading(false)
  }

  useEffect(() => {
    loadArticles()
  }, [selectedCategory, searchQuery])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setFormError("Title and content are required.")
      return
    }

    setSubmitting(true)
    setFormError("")
    const profile = PLAYER_PROFILES[author]
    const authorHandle = profile ? `${profile.gamertag}` : "@wheatybisksgaming"

    const created = await createNewsArticle({
      title,
      summary: summary.trim() || title.trim(),
      content,
      author,
      authorHandle,
      category,
      readTime: "5 min read",
    })

    if (created) {
      setTitle("")
      setSummary("")
      setContent("")
      setIsModalOpen(false)
      await loadArticles()
    } else {
      setFormError("Failed to save article. Check backend connection.")
    }
    setSubmitting(false)
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-lime">
            <span className="h-2 w-2 rounded-full bg-lime" />
            Competitive Guides & Game Intelligence
          </div>
          <h1 className="font-display mt-4 text-[clamp(2.4rem,6vw,5rem)] font-black uppercase leading-[0.95]">
            <span className="text-outline block">Meta Guides &</span>
            <span className="block">Game Updates</span>
          </h1>
          <p className="mt-4 max-w-2xl text-xs leading-relaxed text-white/70 sm:text-sm">
            Actionable strategies, patch breakdowns, and mechanics from real games — with verified tactical case studies from Wheaty Bisks squad players and their in-game tags.
          </p>
          <div className="mt-6 h-1.5 w-20 bg-lime" />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-slant bg-lime px-8 py-4 text-xs font-bold uppercase text-ink transition hover:bg-white shrink-0"
        >
          + Publish Guide / Intel
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`border px-4 py-2 text-xs transition uppercase tracking-wider ${
                selectedCategory === cat
                  ? "border-lime bg-lime text-ink font-bold"
                  : "border-white/20 text-white/70 hover:border-lime"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search game, hero, or player tag..."
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs text-white placeholder-white/40 outline-none focus:border-lime"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-lime">Loading tactical guides from squad database...</div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center text-sm text-white/50">No guides found matching your filter.</div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((art) => {
            const profile = PLAYER_PROFILES[art.author]
            const gamertag = profile ? profile.gamertag : art.authorHandle

            return (
              <article
                key={art.id}
                className="glass group flex flex-col justify-between rounded-2xl p-7 transition hover:-translate-y-1 hover:border-lime/50 border border-white/10"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-white/50 mb-3">
                    <span className="font-bold uppercase tracking-wider text-lime bg-lime/10 px-2 py-0.5 rounded border border-lime/30">
                      {art.category}
                    </span>
                    <span>{art.readTime}</span>
                  </div>

                  <h2 className="font-display mt-3 text-lg font-black uppercase leading-snug group-hover:text-lime transition">
                    {art.title}
                  </h2>

                  <p className="mt-3 text-xs leading-relaxed text-white/70 line-clamp-3">
                    {art.summary}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4">
                  {/* Verified Player & Gamertag Box */}
                  <div className="mb-4 rounded-lg bg-white/5 p-3 border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-white/40">Verified Player</span>
                      <span className="text-[10px] font-bold text-lime">WheatyBisks</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-bold text-white text-xs">{art.author}</span>
                      <span className="text-[10px] text-white/40 font-mono">
                        Tag: <strong className="text-lime">{gamertag}</strong>
                      </span>
                    </div>
                    {profile && (
                      <p className="mt-1 text-[9px] text-white/50 truncate">
                        {profile.role} • {profile.games}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveArticle(art)}
                    className="w-full text-center rounded bg-lime px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-white"
                  >
                    Read Guide & Breakdown &rarr;
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="glass max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-lime/40 bg-ink-deep p-8 shadow-[0_25px_100px_#000]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-lime bg-lime/10 px-2.5 py-1 rounded border border-lime/30">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-white/40">{activeArticle.readTime}</span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="text-2xl text-white/60 hover:text-lime"
                aria-label="Close article"
              >
                &times;
              </button>
            </div>

            <h2 className="font-display mt-6 text-2xl font-black uppercase text-white sm:text-3xl leading-tight">
              {activeArticle.title}
            </h2>

            {/* Author & Gamertag Header Banner */}
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-white/15 bg-white/5 p-4 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/50 block">Author</span>
                <strong className="text-white text-sm">{activeArticle.author}</strong>
              </div>
              <div className="border-l border-white/15 pl-4">
                <span className="text-[10px] uppercase tracking-widest text-white/50 block">In-Game Gamertag</span>
                <strong className="text-lime text-sm font-mono">
                  {PLAYER_PROFILES[activeArticle.author]?.gamertag || activeArticle.authorHandle}
                </strong>
              </div>
              <div className="border-l border-white/15 pl-4 hidden sm:block">
                <span className="text-[10px] uppercase tracking-widest text-white/50 block">Published</span>
                <span className="text-white/80">{new Date(activeArticle.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Summary Box */}
            <div className="mt-6 rounded-lg border-l-4 border-lime bg-white/5 p-4 text-xs italic leading-relaxed text-white/90">
              <strong>Executive Summary:</strong> {activeArticle.summary}
            </div>

            {/* Formatted Article Content */}
            <div className="mt-6 border-t border-white/10 pt-4">
              {renderFormattedContent(activeArticle.content)}
            </div>

            <div className="mt-8 border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-[10px] text-white/50 uppercase tracking-widest">
                Wheaty Bisks Gaming Official Guide
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="btn-slant bg-lime px-8 py-2.5 text-xs font-bold uppercase text-ink hover:bg-white"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="glass max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-lime/40 bg-ink-deep p-8 shadow-[0_25px_90px_#000]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-lg font-black uppercase text-lime">Publish Game Guide & Strategy</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl text-white/60 hover:text-lime"
              >
                &times;
              </button>
            </div>

            {formError && <p className="mt-4 text-xs text-red-400">{formError}</p>}

            <form onSubmit={handleCreate} className="mt-6 space-y-5 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-white/60 mb-1">Headline / Guide Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Rocket League 2v2 Fast Aerial & Rotation Guide"
                  className="w-full rounded-lg border border-white/20 bg-white/5 p-3 text-white outline-none focus:border-lime"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-white/60 mb-1">Player & Gamertag</label>
                  <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-ink p-3 text-white outline-none focus:border-lime"
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
                  <label className="block uppercase tracking-wider text-white/60 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NewsArticle["category"])}
                    className="w-full rounded-lg border border-white/20 bg-ink p-3 text-white outline-none focus:border-lime"
                  >
                    <option value="Match Report">Match Report (Meta Analysis)</option>
                    <option value="Tournament">Tournament (Esports Guide)</option>
                    <option value="Squad News">Squad News (Patch Updates)</option>
                    <option value="Art & Community">Art & Community (Studio Setup)</option>
                    <option value="Podcast">Podcast (Competitive Breakdown)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-white/60 mb-1">Executive Summary</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Two-sentence value takeaway for players..."
                  className="w-full rounded-lg border border-white/20 bg-white/5 p-3 text-white outline-none focus:border-lime"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-white/60 mb-1">Guide Content & Squad Examples *</label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write actionable advice, patch notes, ability numbers, and weave in your squad case study..."
                  className="w-full rounded-lg border border-white/20 bg-white/5 p-3 text-white outline-none focus:border-lime"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-white/20 px-6 py-2.5 font-bold uppercase text-white/70 hover:border-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-slant bg-lime px-8 py-2.5 font-bold uppercase text-ink hover:bg-white disabled:opacity-50"
                >
                  {submitting ? "Publishing..." : "Publish Commercial Guide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
