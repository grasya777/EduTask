import { useState } from 'react'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

export default function AppShell({ user, logout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // When the sidebar is closed we do not apply the `lg:grid` layout
  // so the main column can expand full width on large screens.
  const containerClass = `min-h-screen bg-slate-50 text-slate-950 ${
    sidebarOpen ? 'lg:grid lg:grid-cols-[18rem_1fr]' : ''
  }`

  return (
    <div className={containerClass}>
      <Sidebar user={user} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={sidebarOpen ? 'lg:col-start-2' : ''}>
        <Topbar user={user} onOpenMenu={() => setSidebarOpen(true)} onLogout={logout} />
        <main className="w-full px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
