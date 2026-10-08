const words = ["Ranked", "Clutch", "Squad", "Victory", "Level Up", "GG"]

function Tape({ lime, rotate }: { lime: boolean; rotate: string }) {
  const items = [...words, ...words]
  return (
    <div
      className={`overflow-hidden py-3 ${rotate} ${lime ? "bg-lime text-ink" : "bg-paper text-ink"} shadow-[0_8px_30px_rgba(0,0,0,0.5)]`}
    >
      <div className="marquee-track flex w-max whitespace-nowrap">
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center">
            {items.map((w, i) => (
              <span key={i} className="font-display flex items-center gap-6 pr-6 text-2xl font-black uppercase sm:text-4xl">
                {w}
                <span className="text-xl">&#9670;</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Ticker() {
  return (
    <div aria-hidden className="relative -mx-4 my-16 flex flex-col gap-0 overflow-hidden py-10">
      <Tape lime rotate="-rotate-2 scale-105" />
      <Tape lime={false} rotate="rotate-2 -mt-6 scale-105" />
    </div>
  )
}
