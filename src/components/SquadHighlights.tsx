import { useCallback, useEffect, useState } from "react"
import { crew } from "../data/content"
import ryanAvatar from "../assets/game/ryan-avatar.jpg"
import jordanAvatar from "../assets/game/jordan-avatar.png"
import emedicAvatar from "../assets/game/emedic-avatar.png"
import cyanAvatar from "../assets/game/cyandragon-avatar.png"
import VideoOverlay, { type HighlightVideo } from "./VideoOverlay"

export const highlightVideos: HighlightVideo[] = [
  {
    id: "JeExnRpZ2Dk",
    title: "Cyandragon Mei Triple Kill",
    game: "Overwatch 2",
    player: "CyanDragon",
    gamertag: "Cyandragon",
    views: "3.2K views",
    description: "Clutch Blizzard freeze and icicle headshots wiping out the enemy assault on defense.",
  },
  {
    id: "3bzAjlTbqwI",
    title: "When Volta Has A Brain Fart",
    game: "FIFA 23",
    player: "Ryan",
    gamertag: "RealRyan360",
    views: "3.3K views",
    description: "Unbelievable EA Sports Volta street football rebound and physics catastrophe turned into a hilarious squad goal.",
  },
  {
    id: "PmTS6_SEpIM",
    title: "Chong Bling Duo Wipe",
    game: "Fortnite",
    player: "aka JB",
    gamertag: "Chong Bling",
    views: "2.5K views",
    description: "JB lands clean pump shotgun shots and quick-edits to dismantle a duo in the moving endgame circle.",
  },
  {
    id: "JeRLgTRDQ3Q",
    title: "Mid-Air No-Scope Victory",
    game: "Fortnite",
    player: "Ryan",
    gamertag: "RealRyan360",
    views: "2.5K views",
    description: "RealRyan360 delivers an insane sliding sniper no-scope shot to clutch the Victory Royale.",
  },
  {
    id: "ookG4pQQNLI",
    title: "Chong Bling Flash Knockout",
    game: "UFC 4",
    player: "aka JB",
    gamertag: "Chong Bling",
    views: "2.1K views",
    description: "Chong Bling catches the opponent dipping with a lethal counter-hook for an instant walk-off KO.",
  },
  {
    id: "6Za19yF1PkE",
    title: "Amazing Pinch in Hoops",
    game: "Rocket League",
    player: "Ryan",
    gamertag: "RealRyan360",
    views: "1.8K views",
    description: "A blistering 120 km/h team pinch rocket off the corner wall straight into the hoop rim.",
  },
  {
    id: "bWHVG26Hoc0",
    title: "Orisa Play of the Game",
    game: "Overwatch 2",
    player: "Emedic",
    gamertag: "E Medic",
    views: "1.2K views",
    description: "E Medic spear-spins the opposition off the objective and follows up with an unstoppable Terra Surge.",
  },
  {
    id: "H8NxZM2Izm8",
    title: "Ramattra Annihilation Team Wipe",
    game: "Overwatch 2",
    player: "Ryan",
    gamertag: "RealRyan360",
    views: "1.2K views",
    description: "RealRyan360 pops Ramattra's ultimate in overtime and punches through 5 defenders for the team wipe.",
  },
  {
    id: "5ZUgcT_TKY8",
    title: "Ryan Dribbles Past Both Opponents",
    game: "Rocket League",
    player: "Ryan",
    gamertag: "RealRyan360",
    views: "913 views",
    description: "Silky ground-to-air dribble flick beating both goal line defenders in ranked 2v2.",
  },
  {
    id: "HB8dQax-Kls",
    title: "Vantage Grenade Triple Kill",
    game: "Warface",
    player: "CyanDragon",
    gamertag: "Cyandragon",
    views: "1.3K views",
    description: "Cyandragon banks a precision fragmentation grenade off the rooftop for an explosive triple kill.",
  },
  {
    id: "BwL3p7fs5tg",
    title: "Best Diana EU-West Skirmish",
    game: "League of Legends",
    player: "aka JB",
    gamertag: "Chong Bling",
    views: "EUW Highlight",
    description: "JB executes a multi-target Moonfall dive onto the enemy carry to turn the midlane skirmish.",
  },
  {
    id: "tRxiHxVODOI",
    title: "Jordinho Solo Goal",
    game: "Rocket League",
    player: "Jordan",
    gamertag: "Jordinho",
    views: "Solo Highlight",
    description: "Jordan (Jordinho) takes control off the back wall and buries an uncontested solo strike.",
  },
  {
    id: "2nzv7LLfsIg",
    title: "The Making of Meowhardt",
    game: "Rec Room / Art",
    player: "Emedic",
    gamertag: "E Medic",
    views: "Fan Favorite",
    description: "Behind the scenes 3D drawing of the squad's legendary Meowscles x Reinhardt crossover emblem.",
  },
]

const profiles: Record<string, { image: string; channel: string }> = {
  Ryan: { image: ryanAvatar, channel: "https://youtube.com/@realryan360?si=X8qQw0Peq2Ii3sVh" },
  Jordan: { image: jordanAvatar, channel: "https://youtube.com/@a1a7s45?si=ctPoa1j0t97J0-JR" },
  Emedic: { image: emedicAvatar, channel: "https://youtube.com/@emedic0615?si=WNtgO8Tc69tF9jNB" },
  CyanDragon: { image: cyanAvatar, channel: "https://youtube.com/@cyandragon4921?si=6fogUYKhNsQcbzE-" },
}

function ReelCard({
  video,
  onOpen,
}: {
  video: HighlightVideo
  onOpen: () => void
}) {
  return (
    <article className="reel-card group">
      <button
        onClick={onOpen}
        type="button"
        aria-label={`Play highlight: ${video.title}`}
        className="relative block w-full cursor-pointer text-left aspect-[9/16] overflow-hidden rounded-xl border border-white/15 bg-ink-deep transition-all duration-300 hover:border-lime hover:shadow-[0_10px_30px_rgba(200,255,0,0.25)] focus-visible:outline-2 focus-visible:outline-lime"
      >
        {/* Thumbnail */}
        <img
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30" />

        {/* Game Tag Badge (Top Left) */}
        <div className="absolute left-3 top-3 z-10">
          <span className="rounded bg-black/75 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-lime backdrop-blur-md border border-lime/40">
            {video.game}
          </span>
        </div>

        {/* Views / Tag (Top Right) */}
        {video.views && (
          <div className="absolute right-3 top-3 z-10">
            <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
              {video.views}
            </span>
          </div>
        )}

        {/* Original YouTube Shorts Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="transition-transform duration-300 ease-out group-hover:scale-125 filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_0_24px_rgba(255,0,0,0.7)]">
            <svg
              viewBox="0 0 98.94 122.88"
              className="h-12 w-10 sm:h-14 sm:w-11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="YouTube Shorts"
              role="img"
            >
              {/* Official YouTube Shorts Red Lozenge */}
              <path
                d="M63.49 2.71c11.59-6.04 25.94-1.64 32.04 9.83 6.1 11.47 1.65 25.66-9.94 31.7l-9.53 5.01c8.21.3 16.04 4.81 20.14 12.52 6.1 11.47 1.66 25.66-9.94 31.7l-50.82 26.7c-11.59 6.04-25.94 1.64-32.04-9.83-6.1-11.47-1.65-25.66 9.94-31.7l9.53-5.01c-8.21-.3-16.04-4.81-20.14-12.52-6.1-11.47-1.65-25.66 9.94-31.7L63.49 2.71z"
                fill="#FF0000"
              />
              {/* Official Crisp White Play Triangle */}
              <polygon
                points="36.06,42.53 66.82,61.52 36.06,80.42"
                fill="#FFFFFF"
              />
            </svg>
          </div>
        </div>

        {/* Bottom Title & Player */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 z-10">
          <p className="font-display line-clamp-2 text-xs font-black uppercase leading-snug text-white transition group-hover:text-lime">
            {video.title}
          </p>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/70">
            <span className="truncate">{video.player}</span>
            <span className="font-mono text-lime font-bold">[{video.gamertag}]</span>
          </div>
        </div>
      </button>

      <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-white/60">
        <button
          onClick={onOpen}
          type="button"
          className="cursor-pointer font-bold transition hover:text-lime text-lime/90"
        >
          Watch Pop-up &rarr;
        </button>
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-lime text-white/40"
          title="Open directly on YouTube"
        >
          YouTube ↗
        </a>
      </div>
    </article>
  )
}

export default function SquadHighlights() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reelsPaused, setReelsPaused] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)

  const member = crew[active]
  const profile = profiles[member.name]

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => setActive((current) => (current + 1) % crew.length), 5000)
    return () => window.clearInterval(timer)
  }, [paused])

  const stepVideo = useCallback(
    (d: number) =>
      setSelectedVideo((o) => (o === null ? o : (o + d + highlightVideos.length) % highlightVideos.length)),
    [],
  )
  const closeVideo = useCallback(() => setSelectedVideo(null), [])

  return (
    <section className="mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20" aria-label="Meet the squad and watch highlights">
      <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}>
        <p className="text-[10px] uppercase tracking-[0.25em] text-lime">The people behind the plays</p>
        <h2 className="font-display mt-4 text-[clamp(1.5rem,3vw,2.5rem)] font-black uppercase leading-tight">Meet the<br /><span className="text-lime">squad.</span></h2>
        <div className="mt-10 flex items-start justify-between gap-4">
          <div key={member.name} className="pop player-portrait">
            <div className="player-portrait-content">
              {profile ? <img src={profile.image} alt={`${member.name}’s gaming profile picture`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-ink-deep font-display text-6xl font-black text-lime" aria-label={`${member.name} profile placeholder`}>JB</div>}
            </div>
          </div>
          <span className="font-display text-sm text-lime">/{member.number}</span>
        </div>
        <div key={`name-${member.name}`} className="pop mt-7">
          <h3 className="font-display break-words text-2xl font-black">{member.name}</h3>
          <p className="mt-2 text-xs uppercase tracking-widest text-white/50">WheatyBisksGaming / Squad member</p>
          {profile && <a href={profile.channel} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-4 border-b border-lime/50 pb-2 text-xs uppercase tracking-widest text-lime hover:text-white">Connect with us <span aria-hidden>↗</span><span className="sr-only"> on {member.name}’s YouTube channel</span></a>}
        </div>
        <div className="mt-8 flex flex-wrap gap-2" aria-label="Select a squad member">
          {crew.map((player, index) => <button key={player.name} onClick={() => setActive(index)} aria-pressed={active === index} className={`border px-3 py-2 text-[10px] transition focus-visible:outline-2 focus-visible:outline-lime ${active === index ? "border-lime bg-lime text-ink" : "border-white/20 text-white/70 hover:border-lime"}`}>{player.name}</button>)}
        </div>
        <button className="mt-5 text-[10px] uppercase tracking-widest text-white/60 hover:text-lime" onClick={() => setPaused((current) => !current)}>{paused ? "Resume rotation" : "Pause rotation"}</button>
      </div>

      <div className="min-w-0">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-lime">Straight from the squad</p>
            <h2 className="font-display mt-4 text-xl font-black uppercase sm:text-2xl">Game highlights</h2>
          </div>
          <span className="text-[10px] font-mono text-white/50">{highlightVideos.length} HIGHLIGHTS</span>
        </div>

        <div className={`reels-window ${reelsPaused ? "reels-paused" : ""}`}>
          <div className="reels-track">
            {[0, 1].map((copy) => (
              <div className="reels-group" key={copy}>
                {highlightVideos.map((video, index) => (
                  <ReelCard
                    key={`${copy}-${video.id}`}
                    video={video}
                    onOpen={() => setSelectedVideo(index)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/60">
          <button onClick={() => setReelsPaused((current) => !current)} className="hover:text-lime">
            {reelsPaused ? "Resume reel motion" : "Pause reel motion"}
          </button>
          <span className="text-white/40">Tap any highlight to play in pop-up</span>
        </div>
      </div>

      {selectedVideo !== null && (
        <VideoOverlay
          video={highlightVideos[selectedVideo]}
          currentIndex={selectedVideo}
          totalCount={highlightVideos.length}
          onClose={closeVideo}
          onStep={stepVideo}
        />
      )}
    </section>
  )
}
