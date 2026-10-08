import { useState } from "react"
import { Link, NavLink, Outlet, ScrollRestoration } from "react-router"
import SquadChat from "./SquadChat"
import SocialLinks from "./SocialLinks"

const links = [
  { to: "/", label: "Home" },
  { to: "/news", label: "News" },
  { to: "/newsletter", label: "Newsletter" },
  { to: "/waitlist", label: "Waitlist" },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen overflow-x-hidden bg-ink">
      <header className="relative z-40 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-display flex items-center gap-2 text-lg font-black uppercase">
          <span className="h-3 w-3 rotate-45 bg-lime" /> WheatyBisksGaming
        </Link>
        <nav className="hidden gap-10 text-sm md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `border-b-2 pb-1 transition hover:text-lime ${isActive ? "border-lime text-lime" : "border-transparent"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/waitlist"
          className="btn-slant hidden bg-lime px-6 py-3 text-xs font-bold uppercase text-ink transition hover:bg-white md:block"
        >
          Get access
        </Link>
        <button
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block h-0.5 w-7 bg-white" />
          <span className="mt-1.5 block h-0.5 w-7 bg-lime" />
          <span className="mt-1.5 block h-0.5 w-7 bg-white" />
        </button>
        {open && (
          <div className="glass absolute inset-x-6 top-20 flex flex-col gap-4 rounded-xl bg-ink p-6 md:hidden">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end onClick={() => setOpen(false)} className="text-lg">
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <SocialLinks />
      <SquadChat />
      <footer className="mx-auto mt-24 flex max-w-7xl flex-col items-start justify-between gap-6 border-t border-white/10 px-6 py-10 text-sm text-white/60 sm:flex-row sm:items-center">
        <span className="font-display font-black uppercase text-white">WheatyBisksGaming</span>
        <span>Five friends. One squad.</span>
        <div className="flex items-center gap-4 text-xs">
          <Link to="/admin" className="text-white/40 hover:text-lime transition">
            Admin Dashboard
          </Link>
          <span>&copy; 2026</span>
        </div>
      </footer>
      <ScrollRestoration />
    </div>
  )
}
