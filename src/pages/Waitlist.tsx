import { useState } from "react"
import { Field, inputClass, Status, SubmitButton, useSubmit, validEmail } from "../components/Forms"
import { joinWaitlist } from "../lib/api"

type V = { name: string; email: string; interests: string[] }

const options = ["Behind the scenes", "Early access to stories", "Crew meet-ups", "Match-day giveaways"]

export default function Waitlist() {
  const [v, setV] = useState<V>({ name: "", email: "", interests: [] })
  const { errors, loading, result, submit } = useSubmit<V>(
    (x) => {
      const errs: Record<string, string> = {}
      if (!x.name.trim()) errs.name = "Tell us your name."
      const e = validEmail(x.email)
      if (e) errs.email = e
      return errs
    },
    joinWaitlist,
  )
  const toggle = (o: string) =>
    setV((p) => ({ ...p, interests: p.interests.includes(o) ? p.interests.filter((i) => i !== o) : [...p.interests, o] }))

  return (
    <section className="mx-auto grid max-w-7xl gap-14 px-6 py-10 lg:grid-cols-2">
      <div>
        <div className="text-xs uppercase tracking-widest text-lime">Exclusive content</div>
        <h1 className="font-display mt-4 text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.95]">
          <span className="text-outline block">Join the</span>
          <span className="block">squad</span>
        </h1>
        <div className="mt-6 h-1.5 w-20 bg-lime" />
        <p className="mt-10 max-w-md text-sm leading-relaxed text-white/75">
          Members-only drops are coming. Get on the waitlist and you will be first through the tunnel when the doors open.
        </p>
      </div>
      <form onSubmit={(e) => submit(e, v)} noValidate className="glass space-y-8 rounded-3xl p-8 sm:p-10">
        <Field label="Name *" error={errors.name}>
          <input value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} placeholder="Your name" className={inputClass} autoComplete="name" />
        </Field>
        <Field label="Email *" error={errors.email}>
          <input type="email" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} placeholder="you@email.com" className={inputClass} autoComplete="email" />
        </Field>
        <fieldset>
          <legend className="text-xs uppercase tracking-widest text-white/60">What do you want first?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {options.map((o) => {
              const on = v.interests.includes(o)
              return (
                <label
                  key={o}
                  className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition focus-within:outline-2 focus-within:outline-lime ${on ? "border-lime bg-lime/10 text-lime" : "border-white/20 hover:border-white/50"}`}
                >
                  <input type="checkbox" checked={on} onChange={() => toggle(o)} className="sr-only" />
                  <span aria-hidden className={`flex h-4 w-4 items-center justify-center border text-[10px] ${on ? "border-lime bg-lime text-ink" : "border-white/40"}`}>
                    {on && "✓"}
                  </span>
                  {o}
                </label>
              )
            })}
          </div>
        </fieldset>
        <SubmitButton loading={loading}>Join waitlist</SubmitButton>
        <Status result={result} success="You're on the list. We'll call you when it's your turn." />
      </form>
    </section>
  )
}
