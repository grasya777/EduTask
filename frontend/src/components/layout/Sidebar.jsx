import { NavLink } from 'react-router-dom'

const navLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { label: 'Tasks', path: '/tasks', icon: '📋' },
  { label: 'Focus', path: '/focus', icon: '⏱️' },
  { label: 'Profile', path: '/profile', icon: '👤' },
]

export default function Sidebar({ user, open, onClose }) {
  // On small screens the sidebar is fixed and slides in/out.
  // On large screens we position it absolutely when closed so it doesn't
  // occupy the grid column, and make it relative when open so it sits
  // in the layout.
  const lgPosition = open ? 'lg:relative lg:translate-x-0' : 'lg:absolute lg:top-0 lg:left-0 lg:-translate-x-full'

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} bg-slate-900/95 text-white ${lgPosition} lg:min-h-screen lg:bg-gradient-to-b lg:from-white lg:to-blue-50 lg:text-slate-900 lg:shadow-sm`}>
      <div className="flex min-h-screen flex-col border-r border-slate-200 bg-slate-950 px-6 py-6 lg:border-slate-200 lg:bg-gradient-to-b lg:from-white lg:to-blue-100 lg:px-5 lg:py-8 text-white lg:text-slate-900">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-400 lg:text-sky-500">EduTask</p>
            <h2 className="mt-2 text-2xl font-semibold">Study hub</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl border border-slate-300 bg-slate-100 p-2 text-slate-900 transition hover:bg-slate-200">
            ✕
          </button>
        </div>

        <div className="mt-8 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? 'bg-sky-100 text-sky-900 shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
              onClick={onClose}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-auto rounded-[28px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-900">
          <p className="text-slate-600">Logged in as</p>
          <p className="mt-2 font-semibold">{user.name}</p>
          <p className="mt-1 text-xs text-slate-500">{user.email}</p>
        </div>
      </div>
    </aside>
  )
}
