export default function Topbar({ user, onOpenMenu, onLogout }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur-xl px-4 py-4 shadow-sm shadow-slate-900/5 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <button type="button" onClick={onOpenMenu} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-100">
            ☰
          </button>
          <div>
            <p className="text-sm text-slate-500">Welcome back,</p>
            <p className="font-semibold text-slate-900">{user.name}</p>
          </div>
        </div>

        <div className="hidden items-center justify-between gap-4 lg:flex">
          <div>
            <p className="text-sm text-slate-500">Welcome back,</p>
            <p className="font-semibold text-slate-900">{user.name}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
