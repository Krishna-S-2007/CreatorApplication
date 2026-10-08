import { useState } from "react"
import { Field, inputClass, Status, SubmitButton, useSubmit, validEmail } from "../components/Forms"
import { subscribeNewsletter } from "../lib/api"

type V = { email: string; firstName: string; favouriteClub: string }

const perks = ["Weekly match-day stories", "A legend's quote every Friday", "First look at new crew content"]

export default function Newsletter() {
  const [v, setV] = useState<V>({ email: "", firstName: "", favouriteClub: "" })
  const { errors, loading, result, submit } = useSubmit<V>(
    (x) => {
      const errs: Record<string, string> = {}
      const e = validEmail(x.email)
      if (e) errs.email = e
      return errs
    },
    subscribeNewsletter,
  )
  const set = (k: keyof V) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value })

  return (
    <section className="mx-auto grid max-w-7xl gap-14 px-6 py-10 lg:grid-cols-2">
      <div>
        <div className="text-xs uppercase tracking-widest text-lime">Newsletter</div>
        <h1 className="font-display mt-4 text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-[0.95]">
          <span className="text-outline block">Never miss</span>
          <span className="block">a match</span>
        </h1>
        <div className="mt-6 h-1.5 w-20 bg-lime" />
        <ul className="mt-10 space-y-4">
          {perks.map((p, i) => (
            <li key={p} className="flex items-center gap-4 text-sm">
              <span className="font-display text-lime">/0{i + 1}</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
      <form
        onSubmit={(e) => submit(e, v)}
        noValidate
        className="glass space-y-8 rounded-3xl p-8 sm:p-10"
      >
        <Field label="Email *" error={errors.email}>
          <input type="email" value={v.email} onChange={set("email")} placeholder="you@email.com" className={inputClass} autoComplete="email" />
        </Field>
        <Field label="First name">
          <input value={v.firstName} onChange={set("firstName")} placeholder="Ryan" className={inputClass} autoComplete="given-name" />
        </Field>
        <Field label="Favourite club">
          <input value={v.favouriteClub} onChange={set("favouriteClub")} placeholder="Who do you back?" className={inputClass} />
        </Field>
        <SubmitButton loading={loading}>Subscribe</SubmitButton>
        <Status result={result} success="You're in. Check your inbox for the first whistle." />
      </form>
    </section>
  )
}
