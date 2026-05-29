import { useMemo } from 'react'

function formatDate(value) {
  if (!value) return 'No due date'
  const date = new Date(value)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function countdownText(value) {
  if (!value) return 'No deadline'
  const remaining = Math.ceil((new Date(value) - new Date()) / (1000 * 60 * 60 * 24))
  if (remaining < 0) return 'Overdue'
  if (remaining === 0) return 'Due today'
  return `${remaining} day${remaining === 1 ? '' : 's'}`
}

export default function DashboardPage({ user, tasks, subjects, sessions }) {
  const userTasks = useMemo(() => tasks.filter((task) => task.user?.id === user.id), [tasks, user.id])
  const userSubjects = useMemo(() => subjects.filter((subject) => subject.user?.id === user.id), [subjects, user.id])
  const userSessions = useMemo(() => sessions.filter((session) => session.user?.id === user.id), [sessions, user.id])

  const completedTasks = useMemo(() => userTasks.filter((task) => task.status === 'COMPLETED'), [userTasks])
  const pendingTasks = useMemo(() => userTasks.filter((task) => task.status !== 'COMPLETED'), [userTasks])

  const upcomingTasks = useMemo(
    () =>
      pendingTasks
        .filter((task) => task.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 4),
    [pendingTasks],
  )

  const dueToday = useMemo(
    () =>
      pendingTasks.filter((task) => {
        if (!task.dueDate) return false
        const due = new Date(task.dueDate)
        const today = new Date()
        return (
          due.getFullYear() === today.getFullYear() &&
          due.getMonth() === today.getMonth() &&
          due.getDate() === today.getDate()
        )
      }),
    [pendingTasks],
  )

  const dueThisWeek = useMemo(
    () =>
      pendingTasks.filter((task) => {
        if (!task.dueDate) return false
        const due = new Date(task.dueDate)
        const today = new Date()
        const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
        return diff >= 0 && diff <= 7
      }),
    [pendingTasks],
  )

  const completionPercent = userTasks.length ? Math.round((completedTasks.length / userTasks.length) * 100) : 0

  const subjectSummary = useMemo(
    () =>
      userSubjects.map((subject) => {
        const subjectTasks = userTasks.filter((task) => task.subject?.id === subject.id)
        const done = subjectTasks.filter((task) => task.status === 'COMPLETED').length
        return {
          ...subject,
          total: subjectTasks.length,
          done,
        }
      }),
    [userSubjects, userTasks],
  )

  return (
    <main className="page dashboard-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Hello, {user.name}</p>
          <h1>My dashboard</h1>
          <p className="subtitle">Track pending tasks, deadlines, progress, and focus time in one place.</p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <p>Pending tasks</p>
            <strong>{pendingTasks.length}</strong>
          </div>
          <div className="stat-card">
            <p>Completed tasks</p>
            <strong>{completedTasks.length}</strong>
          </div>
          <div className="stat-card">
            <p>Active focus sessions</p>
            <strong>{userSessions.length}</strong>
          </div>
        </div>
      </div>

      <section className="grid-panel">
        <div className="dashboard-card">
          <h2>Progress overview</h2>
          <div className="progress-bar">
            <div className="progress-value" style={{ width: `${completionPercent}%` }} />
          </div>
          <p>{completionPercent}% complete across {userTasks.length} tasks</p>
          <div className="mini-metrics">
            <div>
              <strong>{dueToday.length}</strong>
              <span>Due today</span>
            </div>
            <div>
              <strong>{dueThisWeek.length}</strong>
              <span>Due this week</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card upcoming-card">
          <div className="dashboard-card-header">
            <h2>Upcoming deadlines</h2>
            <span>{upcomingTasks.length} tasks</span>
          </div>
          {upcomingTasks.length ? (
            <ul className="deadline-list">
              {upcomingTasks.map((task) => (
                <li key={task.id}>
                  <div>
                    <strong>{task.title}</strong>
                    <span>{task.subject?.name || 'No subject'}</span>
                  </div>
                  <div>
                    <span>{formatDate(task.dueDate)}</span>
                    <strong>{countdownText(task.dueDate)}</strong>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">No deadlines are approaching yet.</p>
          )}
        </div>
      </section>

      <section className="grid-panel">
        <div className="dashboard-card wide-card">
          <h2>Weekly / daily overview</h2>
          <div className="metric-grid">
            <div className="metric-box">
              <p>Due today</p>
              <strong>{dueToday.length}</strong>
            </div>
            <div className="metric-box">
              <p>Due this week</p>
              <strong>{dueThisWeek.length}</strong>
            </div>
            <div className="metric-box">
              <p>Active subjects</p>
              <strong>{userSubjects.length}</strong>
            </div>
            <div className="metric-box">
              <p>Focus sessions</p>
              <strong>{userSessions.length}</strong>
            </div>
          </div>
        </div>

        <div className="dashboard-card wide-card">
          <div className="dashboard-card-header">
            <h2>Subject progress</h2>
            <span>{subjectSummary.length} categories</span>
          </div>
          <div className="subject-progress-list">
            {subjectSummary.length ? (
              subjectSummary.map((subject) => (
                <div key={subject.id} className="subject-progress-row">
                  <div>
                    <span className="subject-chip" style={{ background: subject.color || '#cea5ff' }} />
                    <strong>{subject.name}</strong>
                  </div>
                  <div className="subject-progress-meta">
                    <span>{subject.done}/{subject.total} complete</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-note">Add subjects to track progress by class.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
