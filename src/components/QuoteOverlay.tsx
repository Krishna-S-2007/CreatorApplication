import { useEffect, useRef } from "react"
import type { Quote } from "../data/content"

const legendArt: Record<number, { title: string; script: string; footer: string; number: string }> = {
  1: { title: "O REI", script: "Built on\nbeautiful football.", footer: "BRAZIL / THE KING", number: "10" },
  2: { title: "MAGIC", script: "Small touches.\nInfinite possibility.", footer: "ARGENTINA / THE MAESTRO", number: "10" },
  3: { title: "RELENTLESS", script: "Every rep.\nEvery goal.", footer: "PORTUGAL / THE DRIVE", number: "07" },
  4: { title: "VISION", script: "Think faster.\nPlay smarter.", footer: "NETHERLANDS / TOTAL FOOTBALL", number: "14" },
  5: { title: "JOY", script: "Play freely.\nLeave them smiling.", footer: "BRAZIL / THE ARTIST", number: "10" },
}

export default function QuoteOverlay({
  quote,
  onClose,
  onStep,
}: {
  quote: Quote
  onClose: () => void
  onStep: (d: number) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const art = legendArt[quote.id]

  useEffect(() => {
    closeRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onStep(1)
      if (e.key === "ArrowLeft") onStep(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose, onStep])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Quote by ${quote.author}`}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-6 backdrop-blur-lg"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close quote"
        className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-2xl transition hover:bg-lime hover:text-ink focus-visible:outline-2 focus-visible:outline-lime"
      >
        &times;
      </button>
      <figure key={quote.id} className="legend-paper paper pop relative mx-auto grid max-w-5xl gap-8 p-8 text-ink md:grid-cols-[0.8fr_1.2fr] md:gap-12 md:p-12" onClick={(e) => e.stopPropagation()}>
        <div className="legend-collage relative flex min-h-48 flex-col justify-center overflow-hidden p-6" aria-hidden>
          <span className="font-display break-all text-3xl font-black uppercase text-ink/25 sm:text-4xl">{art.title}</span>
          <span className="my-5 -rotate-6 whitespace-pre-line font-serif text-4xl italic">{art.script}</span>
          <span className="font-display text-7xl font-black text-ink/15">{art.number}</span>
          <span className="mt-4 text-[10px] tracking-widest">{art.footer}</span>
        </div>
        <div>
        <figcaption className="mb-8">
          <span className="legend-author font-display relative inline-block text-2xl font-black uppercase sm:text-4xl">{quote.author}</span>
          <span className="mt-4 block text-xs text-ink/65">{quote.role}</span>
        </figcaption>
        <blockquote className="hero-copy text-xl font-semibold leading-relaxed sm:text-2xl">
          &ldquo;
          {quote.text}
          &rdquo;
        </blockquote>
        <div className="mt-10 flex gap-4">
          <button onClick={() => onStep(-1)} className="border border-ink/30 px-5 py-2 text-sm transition hover:bg-ink hover:text-white">
            &larr; Prev
          </button>
          <button onClick={() => onStep(1)} className="border border-ink/30 px-5 py-2 text-sm transition hover:bg-ink hover:text-white">
            Next &rarr;
          </button>
        </div>
        </div>
      </figure>
    </div>
  )
}
