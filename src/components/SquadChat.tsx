import { useEffect, useRef, useState, type FormEvent } from "react"
import { chatConnected, sendChat, type ChatMessage } from "../lib/api"

function BotMascot({ isHappy = false, size = "md" }: { isHappy?: boolean; size?: "sm" | "md" }) {
  const isSm = size === "sm"
  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none">
      {/* Jumping Bot Body */}
      <div className={`${isSm ? "" : "bot-jumping"} relative z-10`}>
        <svg
          viewBox="0 0 64 64"
          className={isSm ? "h-7 w-7" : "h-11 w-11 drop-shadow-[0_6px_14px_rgba(182,255,28,0.45)]"}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antenna */}
          <line x1="32" y1="13" x2="32" y2="4" stroke="#b6ff1c" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="4" r="3.5" fill="#b6ff1c" className="bot-antenna" />

          {/* Gamer Headset Band */}
          <path d="M12 28 C12 12, 52 12, 52 28" stroke="#222b26" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Headset Earcups */}
          <rect x="8" y="23" width="6" height="12" rx="3" fill="#b6ff1c" />
          <rect x="50" y="23" width="6" height="12" rx="3" fill="#b6ff1c" />

          {/* Bot Helmet */}
          <rect x="14" y="14" width="36" height="30" rx="10" fill="#0d1410" stroke="#b6ff1c" strokeWidth="2" />

          {/* Visor Screen */}
          <rect x="18" y="19" width="28" height="18" rx="6" fill="#040605" />

          {/* Animated LED Eyes */}
          {isHappy ? (
            <>
              {/* Happy eyes ^ ^ */}
              <path d="M22 28 Q25 24 28 28" stroke="#b6ff1c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M36 28 Q39 24 42 28" stroke="#b6ff1c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M29 32 Q32 35 35 32" stroke="#b6ff1c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              {/* Friendly visor eyes */}
              <circle cx="25" cy="27" r="3" fill="#b6ff1c" className="animate-pulse" />
              <circle cx="39" cy="27" r="3" fill="#b6ff1c" className="animate-pulse" />
              <line x1="28" y1="33" x2="36" y2="33" stroke="#b6ff1c" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
            </>
          )}

          {/* Jet Thruster Body */}
          <path d="M24 44 L40 44 L36 51 L28 51 Z" fill="#1b241e" stroke="#b6ff1c" strokeWidth="1.5" />
          {/* Jet Thruster Glow Flame */}
          <ellipse cx="32" cy="54" rx="4" ry="2" fill="#b6ff1c" opacity="0.95" />
        </svg>
      </div>

      {/* Dynamic Ground Shadow */}
      {!isSm && <div className="bot-shadow -mt-0.5 h-1.5 w-7 rounded-full bg-lime/45 blur-[1.5px]" />}
    </div>
  )
}

const QUICK_PROMPTS = [
  "Who are the 5 squad members?",
  "Tell me about Ryan's Ramattra plays",
  "What is Emedic's Meowhardt art?",
  "How do I join the exclusive waitlist?",
]

export default function SquadChat() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [hovered, setHovered] = useState(false)

  const input = useRef<HTMLInputElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)
  const end = useRef<HTMLDivElement>(null)
  const request = useRef<AbortController | null>(null)

  useEffect(() => () => request.current?.abort(), [])

  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        launcher.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" })
  }, [messages, busy])

  async function submit(customText?: string, event?: FormEvent) {
    if (event) event.preventDefault()
    const content = (customText || draft).trim()
    if (!content || busy) return

    if (!chatConnected) {
      setError("AI connection coming soon. This chat is ready for the backend, but live replies aren’t available yet.")
      return
    }

    const next: ChatMessage[] = [...messages, { role: "user", content }]
    setMessages(next)
    setDraft("")
    setError("")
    setBusy(true)
    request.current = new AbortController()
    const timeout = window.setTimeout(() => request.current?.abort(), 30000)

    try {
      const reply = await sendChat(next, request.current.signal)
      setMessages([...next, { role: "assistant", content: reply }])
    } catch (failure) {
      setError(failure instanceof Error && failure.name !== "AbortError" ? failure.message : "The request timed out. Please try again.")
    } finally {
      window.clearTimeout(timeout)
      setBusy(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7 flex flex-col items-end">
      {/* Chat Window Dialog */}
      {open && (
        <section
          role="dialog"
          aria-label="Squad AI assistant"
          className="chat-panel mb-4 flex w-[min(410px,calc(100vw-36px))] flex-col overflow-hidden rounded-2xl border border-lime/30 bg-ink-deep/95 shadow-[0_25px_100px_rgba(0,0,0,0.85)] backdrop-blur-xl"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <BotMascot isHappy size="sm" />
              <div>
                <p className="font-display text-xs font-black tracking-wider text-lime uppercase flex items-center gap-2">
                  <span>WHEATY AI AGENT</span>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime animate-ping" />
                </p>
                <p className="text-[10px] text-white/50">
                  Powered by Groq Cloud • Dublin, Ireland
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setOpen(false)
                launcher.current?.focus()
              }}
              aria-label="Close assistant"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-lg text-white/70 transition hover:border-lime hover:bg-lime hover:text-ink cursor-pointer"
            >
              &times;
            </button>
          </header>

          {/* Messages Log */}
          <div className="max-h-[46dvh] min-h-56 overflow-y-auto p-4 sm:p-5" role="log" aria-live="polite">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-lime/20 bg-lime/5 p-4">
                  <p className="font-display text-base font-bold text-white">
                    Need tactics, clips or squad lore?
                  </p>
                  <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
                    I’m the official Wheaty Bisks AI assistant. Ask me anything about Ryan, Jordan, Emedic, CyanDragon, and aka JB, or our top plays!
                  </p>
                </div>

                {/* Quick Prompts */}
                <div>
                  <p className="mb-2 text-[10px] uppercase font-bold tracking-widest text-lime/80">
                    Quick Suggestions
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => submit(prompt)}
                        className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-left text-[11px] text-white/80 transition hover:border-lime hover:bg-lime/10 hover:text-lime cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === "user"
                    ? "ml-8 bg-lime font-medium text-ink shadow-[0_2px_12px_rgba(182,255,28,0.25)]"
                    : "mr-6 border border-white/10 bg-black/40 text-white/90"
                }`}
              >
                <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider opacity-60">
                  {message.role === "user" ? "You" : "Wheaty AI"}
                </span>
                {message.content}
              </div>
            ))}

            {busy && (
              <div className="flex items-center gap-2 rounded-xl border border-lime/30 bg-black/40 p-3 text-xs text-lime">
                <span className="inline-block h-2 w-2 rounded-full bg-lime animate-bounce" />
                <span className="inline-block h-2 w-2 rounded-full bg-lime animate-bounce [animation-delay:0.2s]" />
                <span className="inline-block h-2 w-2 rounded-full bg-lime animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px] text-white/60">Squad AI is cooking up a reply…</span>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-200">
                {error}
              </p>
            )}
            <div ref={end} />
          </div>

          {/* Chat Input */}
          <div className="flex gap-2 border-t border-white/10 bg-black/30 p-3.5">
            <label htmlFor="squad-chat" className="sr-only">
              Message the squad assistant
            </label>
            <input
              ref={input}
              id="squad-chat"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  submit()
                }
              }}
              maxLength={2000}
              placeholder="Ask the squad anything…"
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 outline-none transition focus:border-lime focus:bg-white/10"
            />
            <button
              type="button"
              onClick={() => submit()}
              disabled={busy || !draft.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime text-ink font-bold transition hover:scale-105 hover:bg-white disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
            >
              &uarr;
            </button>
          </div>
          <p className="bg-black/50 px-4 py-2 text-[9px] text-white/40 text-center">
            AI replies can make mistakes. Powered by Groq & Wheaty Bisks channel context.
          </p>
        </section>
      )}

      {/* Floating Animated Mascot & Launcher Button */}
      <div
        className="flex items-center gap-2.5"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Floating Speech Bubble (when closed) */}
        {!open && (
          <div className="speech-float hidden sm:flex items-center gap-2 rounded-full border border-lime/40 bg-ink-deep/90 px-3.5 py-1.5 text-[11px] font-bold text-lime shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
            <span>Ask Wheaty AI!</span>
          </div>
        )}

        {/* The Jumping Bot + Pill Action Button */}
        <button
          ref={launcher}
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label="Toggle squad AI assistant"
          className="group relative flex items-center gap-3 rounded-full border-2 border-lime bg-ink-deep pl-2.5 pr-5 py-2 text-xs font-black uppercase tracking-wider text-lime shadow-[0_0_30px_rgba(182,255,28,0.25)] transition-all duration-300 hover:scale-105 hover:bg-lime hover:text-ink hover:shadow-[0_0_40px_rgba(182,255,28,0.6)] cursor-pointer"
        >
          {/* Jumping Bot Mascot */}
          <div className="-mt-3 mb-1">
            <BotMascot isHappy={hovered || open} />
          </div>

          <span className="font-display tracking-widest">
            {open ? "CLOSE SQUAD AI" : "ASK THE SQUAD"}
          </span>
        </button>
      </div>
    </div>
  )
}
