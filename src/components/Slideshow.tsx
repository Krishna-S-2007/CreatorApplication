import { useCallback, useEffect, useState, type ReactNode } from "react"
import img1 from "../assets/game/img1.png"
import img2 from "../assets/game/img2.png"
import img3 from "../assets/game/img3.png"
import img4 from "../assets/game/img4.png"
import img5 from "../assets/game/img5.png"

const slides = [
  { src: img2, alt: "Cars battling for the ball in a stadium arena", title: "Arena nights" },
  { src: img3, alt: "Two heroes clashing shield against fist", title: "Clash of heroes" },
  { src: img1, alt: "A lineup of team-shooter heroes", title: "Squad lineup" },
  { src: img4, alt: "A crowd of blocky avatars on a hillside", title: "Open worlds" },
  { src: img5, alt: "A football star roaring against a dark backdrop", title: "Matchday energy" },
]

export default function Slideshow({ children }: { children?: ReactNode }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const go = useCallback((d: number) => setI((x) => (x + d + slides.length) % slides.length), [])

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = setInterval(() => go(1), 3200)
    return () => clearInterval(t)
  }, [paused, go])

  return (
    <section className={children ? "relative" : "mx-auto max-w-7xl px-6"} aria-roledescription="carousel" aria-label="Game highlights">
      {!children && <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-none">
        <span className="text-outline">Game</span> <span className="text-lime">highlights</span>
      </h2>}
      <div
        className={children ? "gaming-hero relative overflow-hidden bg-ink-deep" : "relative mt-10 aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-ink-deep shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:aspect-[16/8]"}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((s, n) => (
          <img
            key={s.title}
            src={s.src}
            alt={s.alt}
            loading={n === 0 ? "eager" : "lazy"}
            aria-hidden={n !== i}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-600 ease-out ${n === i ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
          />
        ))}
        <div className={children ? "hero-shade absolute inset-0" : "absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.92),rgba(10,10,10,0.35)_55%,rgba(10,10,10,0.6))]"} />
        <div className="absolute inset-0 bg-ink/25 mix-blend-multiply" />
        {children && <div className="relative z-10">{children}</div>}

        <div className="glass absolute inset-x-4 bottom-4 z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-5 py-4 sm:inset-x-6 sm:bottom-6">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-lime">
              {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden gap-2 sm:flex">
              {slides.map((s, n) => (
                <button
                  key={s.title}
                  onClick={() => setI(n)}
                  aria-label={`Go to slide ${n + 1}`}
                  aria-current={n === i}
                  className={`h-1.5 rounded-full transition-all ${n === i ? "w-8 bg-lime" : "w-3 bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
            <button onClick={() => go(-1)} aria-label="Previous slide" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition hover:bg-lime hover:text-ink">
              &larr;
            </button>
            <button onClick={() => go(1)} aria-label="Next slide" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition hover:bg-lime hover:text-ink">
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
