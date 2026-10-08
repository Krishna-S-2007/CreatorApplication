import { useState, type FormEvent, type ReactNode } from "react"
import type { ApiResult } from "../lib/api"

const input =
  "w-full border-b border-white/30 bg-transparent py-3 text-base outline-none transition placeholder:text-white/40 focus:border-lime"

export function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-white/60">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-400">{error}</span>}
    </label>
  )
}

export const inputClass = input

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export function useSubmit<T>(
  validate: (v: T) => Record<string, string>,
  send: (v: T) => Promise<ApiResult>,
) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiResult | null>(null)

  const submit = async (e: FormEvent, values: T) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    setResult(await send(values))
    setLoading(false)
  }
  return { errors, loading, result, submit, reset: () => setResult(null) }
}

export function validEmail(v: string) {
  return emailOk(v) ? "" : "Enter a valid email address."
}

export function Status({ result, success }: { result: ApiResult | null; success: ReactNode }) {
  if (!result) return null
  if (result.status === "ok") return <div role="status" className="pop border border-lime bg-lime/10 p-5 text-lime">{success}</div>
  const msg =
    result.status === "duplicate"
      ? "You're already on the list. See you at kick-off."
      : result.status === "not_connected"
        ? "The signup backend isn't connected yet, so nothing was saved. Connect Supabase to go live."
        : result.message
  return <div role="alert" className="border border-red-400/60 bg-red-400/10 p-5 text-red-300">{msg}</div>
}

export function SubmitButton({ loading, children }: { loading: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn-slant bg-lime px-10 py-4 text-sm font-bold uppercase text-ink transition hover:bg-white disabled:cursor-wait disabled:opacity-60"
    >
      {loading ? "Sending..." : children}
    </button>
  )
}
