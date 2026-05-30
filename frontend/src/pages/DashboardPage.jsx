import { useMemo } from 'react'
import Card from '../components/ui/Card.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

function formatDate(value) {
  if (!value) return 'No date'
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function getStatusLabel(value) {
  if (!value) return 'No deadline'
  const remaining = Math.ceil((new Date(value) - new Date()) / (1000 * 60 * 60 * 24))
  if (remaining < 0) return 'Overdue'
  if (remaining === 0) return 'Today'
  if (remaining === 1) return 'Tomorrow'
  return `${remaining}d`
}

export default function DashboardPage({ user, tasks, subjects, sessions, loading, error }) {
  const userTasks = useMemo(() => tasks.filter((task) => task.user?.id === user.id), [tasks, user.id])
  const userSubjects = useMemo(() => subjects.filter((subject) => subject.user?.id === user.id), [subjects, user.id])
  const userSessions = useMemo(() => sessions.filter((session) => session.user?.id === user.id), [sessions, user.id])

  const completedTasks = useMemo(() => userTasks.filter((task) => task.status === 'COMPLETED'), [userTasks])
  const pendingTasks = useMemo(() => userTasks.filter((task) => task.status !== 'COMPLETED'), [userTasks])

  const overdueTasks = useMemo(
    () => pendingTasks.filter((task) => {
      if (!task.dueDate) return false
      const due = new Date(task.dueDate)
      const today = new Date()
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      return due < startOfToday
    }),
    [pendingTasks],
  )

  const upcomingTasks = useMemo(
    () => pendingTasks
      .filter((task) => task.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5),
    [pendingTasks],
  )

  const completionPercent = userTasks.length ? Math.round((completedTasks.length / userTasks.length) * 100) : 0

  const subjectSummary = useMemo(
    () => userSubjects.map((subject) => {
      const subjectTasks = userTasks.filter((task) => task.subject?.id === subject.id)
      const done = subjectTasks.filter((task) => task.status === 'COMPLETED').length
      return {
        ...subject,
        total: subjectTasks.length,
        done,
        progress: subjectTasks.length ? Math.round((done / subjectTasks.length) * 100) : 0,
      }
    }),
    [userSubjects, userTasks],
  )

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-500">Dashboard</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950 sm:text-4xl">Track your study momentum</h1>
            <p className="mt-3 max-w-2xl text-slate-600">A clean overview of your tasks, subjects, and Pomodoro focus progress.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-5 py-4 text-slate-700">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Today</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-4 text-rose-700">{error}</div>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">Total tasks</p>
            <div className="rounded-2xl bg-sky-100 px-3 py-2 text-sky-700">📁</div>
          </div>
          <div>
            <p className="text-4xl font-semibold text-slate-950">{userTasks.length}</p>
            <p className="text-sm text-slate-500">All tasks assigned to you</p>
          </div>
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">Completed</p>
            <div className="rounded-2xl bg-emerald-100 px-3 py-2 text-emerald-700">✅</div>
          </div>
          <div>
            <p className="text-4xl font-semibold text-slate-950">{completedTasks.length}</p>
            <p className="text-sm text-slate-500">Tasks completed so far</p>
          </div>
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">In progress</p>
            <div className="rounded-2xl bg-amber-100 px-3 py-2 text-amber-700">⏳</div>
          </div>
          <div>
            <p className="text-4xl font-semibold text-slate-950">{pendingTasks.length}</p>
            <p className="text-sm text-slate-500">Tasks still open</p>
          </div>
        </Card>
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">Overdue</p>
            <div className="rounded-2xl bg-rose-100 px-3 py-2 text-rose-700">⚠️</div>
          </div>
          <div>
            <p className="text-4xl font-semibold text-slate-950">{overdueTasks.length}</p>
            <p className="text-sm text-slate-500">Tasks needing attention</p>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Weekly progress</p>
              <h2 className="text-2xl font-semibold text-slate-950">{completionPercent}% complete</h2>
            </div>
            <div className="rounded-3xl bg-sky-50 px-4 py-3 text-sky-700">Keep the streak going</div>
          </div>
          <div className="overflow-hidden rounded-full bg-slate-100 h-4">
            <div className="h-4 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600" style={{ width: `${completionPercent}%` }} />
          </div>
          <p className="text-sm text-slate-500">You have completed {completedTasks.length} of {userTasks.length} tasks.</p>
        </Card>
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Today’s focus</p>
              <h2 className="text-xl font-semibold text-slate-950">{userSessions.length} sessions</h2>
            </div>
            <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">{userSessions.reduce((sum, session) => sum + (session.focusMinutes || 0), 0)} min studied</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-950">{userSessions.length}</p>
              <p>Sessions recorded</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-950">{userSessions.filter((session) => {
                const today = new Date()
                const completedDate = new Date(session.completedAt)
                return completedDate.getFullYear() === today.getFullYear() && completedDate.getMonth() === today.getMonth() && completedDate.getDate() === today.getDate()
              }).length}</p>
              <p>Completed today</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Card className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Subject progress</p>
              <h2 className="text-xl font-semibold text-slate-950">Category overview</h2>
            </div>
            <span className="rounded-3xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{subjectSummary.length} subjects</span>
          </div>
          {subjectSummary.length ? (
            <div className="space-y-4">
              {subjectSummary.map((subject) => (
                <div key={subject.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950">{subject.name}</p>
                      <p className="text-sm text-slate-500">{subject.done} of {subject.total} done</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{subject.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600" style={{ width: `${subject.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">Add subjects and assign tasks to start seeing progress by category.</p>
          )}
        </Card>
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Upcoming tasks</p>
              <h2 className="text-xl font-semibold text-slate-950">Next deadlines</h2>
            </div>
            <span className="rounded-3xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{upcomingTasks.length} items</span>
          </div>
          {upcomingTasks.length ? (
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-slate-950">{task.title}</h3>
                      <p className="text-sm text-slate-500">{formatDate(task.dueDate)}</p>
                    </div>
                    <span className="rounded-2xl bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">{getStatusLabel(task.dueDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming tasks"
              description="You’re caught up for the next few days. Add a new task to stay on track."
            />
          )}
        </Card>
      </section>
    </main>
  )
}
