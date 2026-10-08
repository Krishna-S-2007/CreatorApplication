import { useEffect, useRef } from "react"

export interface HighlightVideo {
  id: string
  title: string
  game: string
  player: string
  gamertag: string
  views?: string
  description?: string
}

export default function VideoOverlay({
  video,
  currentIndex,
  totalCount,
  onClose,
  onStep,
}: {
  video: HighlightVideo
  currentIndex: number
  totalCount: number
  onClose: () => void
  onStep: (d: number) => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

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
      aria-label={`Highlight video: ${video.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 p-4 sm:p-6 backdrop-blur-xl"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-2xl text-white transition hover:bg-lime hover:text-ink focus-visible:outline-2 focus-visible:outline-lime"
      >
        &times;
      </button>

      <div
        className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-ink shadow-[0_30px_100px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            key={video.id}
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        {/* Video Details & Meta */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="rounded bg-lime px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-ink">
                {video.game}
              </span>
              {video.views && (
                <span className="text-xs text-white/50">{video.views}</span>
              )}
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-lime">
              {String(currentIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
            </div>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h3 className="font-display text-xl font-black uppercase sm:text-2xl text-white">
                {video.title}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/70">
                <span>Featured Squad Member:</span>
                <span className="font-bold text-white">{video.player}</span>
                <span className="text-white/40">•</span>
                <span>Gamertag:</span>
                <span className="font-mono text-lime">[{video.gamertag}]</span>
              </div>
              {video.description && (
                <p className="mt-3 text-sm text-white/60 leading-relaxed">
                  {video.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0">
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded border border-white/20 px-4 py-2 text-xs uppercase tracking-wider text-white transition hover:border-lime hover:text-lime"
              >
                Watch on YouTube <span aria-hidden>↗</span>
              </a>
              <div className="flex gap-2">
                <button
                  onClick={() => onStep(-1)}
                  aria-label="Previous video"
                  className="flex h-9 items-center justify-center rounded border border-white/30 px-3 text-xs uppercase tracking-wider transition hover:bg-lime hover:text-ink hover:border-lime"
                >
                  &larr; Prev
                </button>
                <button
                  onClick={() => onStep(1)}
                  aria-label="Next video"
                  className="flex h-9 items-center justify-center rounded border border-white/30 px-3 text-xs uppercase tracking-wider transition hover:bg-lime hover:text-ink hover:border-lime"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
