export default function SocialLinks() {
  return <section className="mx-auto mt-20 max-w-7xl border-y border-white/10 px-6 py-12">
    <p className="text-[10px] uppercase tracking-[0.25em] text-lime">Stay in the loop</p>
    <h2 className="font-display mt-4 text-2xl font-black uppercase sm:text-3xl">Follow us on Instagram<span className="text-lime">.</span></h2>
    <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:gap-10">
      <a href="https://www.instagram.com/wheatybisksgaming" target="_blank" rel="noreferrer" className="flex items-center gap-4 font-bold transition hover:text-lime">
        <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
        <span><span className="block text-[10px] uppercase tracking-widest text-white/50">Instagram</span><strong className="text-sm sm:text-base">@wheatybisksgaming ↗</strong></span>
      </a>
      <a href="https://www.youtube.com/@wheatybisksgaming" target="_blank" rel="noreferrer" className="flex items-center gap-4 font-bold transition hover:text-lime">
        <svg aria-hidden="true" width="32" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" /></svg>
        <span><span className="block text-[10px] uppercase tracking-widest text-white/50">YouTube</span><strong className="text-sm sm:text-base">@wheatybisksgaming ↗</strong></span>
      </a>
    </div>
  </section>
}
