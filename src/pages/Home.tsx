import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router"
import Slideshow from "../components/Slideshow"
import Ticker from "../components/Ticker"
import QuoteOverlay from "../components/QuoteOverlay"
import { featured, quotes } from "../data/content"
import SquadHighlights from "../components/SquadHighlights"

function Hero() {
  const [idx, setIdx] = useState(0)
  const f = featured[idx]

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % featured.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])
  return (
    <Slideshow>
    <section className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-36 pt-16 sm:pt-24 lg:min-h-[760px] lg:grid-cols-[1fr] lg:items-center lg:gap-16 lg:pb-40">
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-lime"><span className="h-2 w-2 rounded-full bg-lime" /> Five friends. One squad. No limits.</div>
        <h1 className="font-display font-black uppercase leading-[0.95]">
          <span className="block text-[clamp(1.65rem,4.6vw,3.7rem)]">Professional</span>
          <span className="gaming-title block w-fit text-[clamp(2.6rem,7.4vw,6rem)]">Gaming</span>
        </h1>
        <div className="mt-6 h-1.5 w-20 bg-lime" />
        <p className="hero-copy mt-7 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">Five distinct playstyles. One shared ambition. We’re Ryan, Jordan, Emedic, CyanDragon and aka JB — a close-knit gaming crew built on sharp teamwork, competitive drive and a genuine love for the game. From ranked battles to unforgettable late-night sessions, we turn every match into a story worth sharing. Welcome to WheatyBisksGaming. This is where the squad comes together.</p>
        <div key={idx} className="pop mt-7 max-w-sm">
          <div className="font-display text-sm font-black uppercase text-lime">/{f.n} {f.title}</div>
          <p className="mt-3 text-sm leading-relaxed text-white/75">{f.copy}</p>
        </div>
        <Link
          to="/waitlist"
          className="btn-slant mt-8 inline-block bg-lime px-10 py-4 text-sm font-bold uppercase text-ink transition hover:bg-white"
        >
          Join the waitlist
        </Link>
      </div>

      <ol className="flex gap-6 lg:col-span-1" aria-label="Featured stories">
        {featured.map((x, i) => (
          <li key={x.n}>
            <button
              onClick={() => setIdx(i)}
              aria-current={i === idx}
              className={`font-display flex items-center gap-3 text-sm font-black transition hover:text-white ${i === idx ? "text-white" : "text-white/35"}`}
            >
              {i === idx && <span className="hidden h-px w-8 bg-white lg:block" />}
              {x.n}
            </button>
          </li>
        ))}
      </ol>
    </section>
    </Slideshow>
  )
}

function Quotes() {
  const [open, setOpen] = useState<number | null>(null)
  const step = useCallback(
    (d: number) => setOpen((o) => (o === null ? o : (o + d + quotes.length) % quotes.length)),
    [],
  )
  const close = useCallback(() => setOpen(null), [])
  const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1"]

  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="flex items-end justify-between gap-6">
        <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-none">
          <span className="text-outline">Wall of</span> <span className="text-lime">legends</span>
        </h2>
        <span className="hidden text-xs uppercase tracking-widest text-white/50 sm:block">Tap a card for full screen</span>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setOpen(i)}
            className={`paper group relative p-8 text-left text-ink shadow-[0_20px_40px_rgba(0,0,0,0.45)] transition hover:-translate-y-2 hover:rotate-0 focus-visible:outline-2 focus-visible:outline-lime ${tilts[i % tilts.length]}`}
          >
            <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-lime/70" aria-hidden />
            <span className="font-display block text-6xl font-black leading-none text-ink/20">&ldquo;</span>
            <span className="font-display -mt-4 block text-lg font-black uppercase leading-snug">
              {q.text.length > 90 ? q.text.slice(0, 88).trimEnd() + "..." : q.text}
            </span>
            <span className="mt-6 flex items-center justify-between text-xs uppercase tracking-widest">
              <span className="font-bold">{q.author}</span>
              <span className="bg-ink px-3 py-1 text-lime transition group-hover:bg-lime group-hover:text-ink">Read</span>
            </span>
          </button>
        ))}
      </div>
      {open !== null && <QuoteOverlay quote={quotes[open]} onClose={close} onStep={step} />}
    </section>
  )
}

function Cta() {
  return (
    <section className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-2">
      <Link to="/newsletter" className="group rounded-3xl bg-lime p-10 text-ink transition hover:-translate-y-1">
        <div className="text-xs uppercase tracking-widest">Weekly</div>
        <div className="font-display mt-10 text-3xl font-black uppercase">Newsletter &rarr;</div>
        <p className="mt-3 text-sm">Match-day stories and quotes straight to your inbox.</p>
      </Link>
      <Link to="/waitlist" className="glass group rounded-3xl p-10 transition hover:-translate-y-1 hover:border-lime/60">
        <div className="text-xs uppercase tracking-widest text-lime">Members only</div>
        <div className="font-display mt-10 text-3xl font-black uppercase">Exclusive waitlist &rarr;</div>
        <p className="mt-3 text-sm text-white/70">Be first in line for behind-the-scenes content.</p>
      </Link>
    </section>
  )
}

export default function Home() {
  return (
    <div className="space-y-8">
      <Hero />
      <Ticker />
      <SquadHighlights />
      <div className="py-20">
        <Quotes />
      </div>
      <div className="pt-20">
        <Cta />
      </div>
    </div>
  )
}
