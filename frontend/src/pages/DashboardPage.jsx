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
  if (remaining === 0) return 'Today'
  if (remaining === 1) return 'Tomorrow'
  return `${remaining}d`
}

function deadlineLabel(value) {
  if (!value) return 'No date'
  const remaining = Math.ceil((new Date(value) - new Date()) / (1000 * 60 * 60 * 24))
  if (remaining < 0) return 'Overdue'
  if (remaining === 0) return 'Today'
  if (remaining === 1) return 'Tomorrow'
  return `${remaining}d`
}

export default function DashboardPage({ user, tasks, subjects, sessions }) {
  const userTasks = useMemo(() => tasks.filter((task) => task.user?.id === user.id), [tasks, user.id])
  const userSubjects = useMemo(() => subjects.filter((subject) => subject.user?.id === user.id), [subjects, user.id])
  const userSessions = useMemo(() => sessions.filter((session) => session.user?.id === user.id), [sessions, user.id])

  const completedTasks = useMemo(() => userTasks.filter((task) => task.status === 'COMPLETED'), [userTasks])
  const pendingTasks = useMemo(() => userTasks.filter((task) => task.status !== 'COMPLETED'), [userTasks])

  const overdueTasks = useMemo(
    () =>
      pendingTasks.filter((task) => {
        if (!task.dueDate) return false
        const due = new Date(task.dueDate)
        const today = new Date()
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        return due < startOfToday
      }),
    [pendingTasks],
  )

  const upcomingTasks = useMemo(
    () =>
      pendingTasks
        .filter((task) => task.dueDate)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5),
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
          progress: subjectTasks.length ? Math.round((done / subjectTasks.length) * 100) : 0,
        }
      }),
    [userSubjects, userTasks],
  )

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="page dashboard-page">
      <section className="dashboard-top">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Dashboard</h1>
          <p className="dashboard-date">{todayLabel}</p>
        </div>
      </section>

      <section className="stats-row">
        <article className="stat-card overview-card">
          <div className="icon-circle purple">📁</div>
          <div>
            <p>Total Tasks</p>
            <strong>{userTasks.length}</strong>
          </div>
        </article>
        <article className="stat-card overview-card">
          <div className="icon-circle blue">✅</div>
          <div>
            <p>Completed</p>
            <strong>{completedTasks.length}</strong>
          </div>
        </article>
        <article className="stat-card overview-card">
          <div className="icon-circle orange">⏳</div>
          <div>
            <p>In Progress</p>
            <strong>{pendingTasks.length}</strong>
          </div>
        </article>
        <article className="stat-card overview-card">
          <div className="icon-circle red">⚠️</div>
          <div>
            <p>Overdue</p>
            <strong>{overdueTasks.length}</strong>
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card progress-card">
          <div className="card-header">
            <span>Overall Progress</span>
            <strong>{completionPercent}%</strong>
          </div>
          <div className="progress-large">{completionPercent}%</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${completionPercent}%` }} />
          </div>
          <p className="progress-label">Completion rate</p>
        </div>

        <div className="dashboard-card due-card">
          <div className="due-state">
            <div className="status-badge success">✓</div>
            <div>
              <p className="card-label">Due Today</p>
              {dueToday.length === 0 ? (
                <strong>All clear for today!</strong>
              ) : (
                <strong>{dueToday.length} task{dueToday.length === 1 ? '' : 's'} due</strong>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-card status-card">
          <div className="card-header">
            <span>Status</span>
            <strong>{overdueTasks.length === 0 ? 'On Track' : 'Attention'}</strong>
          </div>
          <p>{overdueTasks.length === 0 ? 'No overdue tasks' : `${overdueTasks.length} overdue tasks`}</p>
        </div>
      </section>

      <section className="bottom-section">
        <div className="dashboard-card subject-card-panel">
          <div className="card-header">
            <span>Progress by Subject</span>
            <span>{subjectSummary.length} subjects</span>
          </div>
          <div className="subject-list">
            {subjectSummary.length ? (
              subjectSummary.map((subject) => (
                <div key={subject.id} className="subject-row">
                  <div className="subject-meta">
                    <strong>{subject.name}</strong>
                    <span>{subject.done}/{subject.total} completed</span>
                  </div>
                  <div className="subject-bar">
                    <div className="subject-progress" style={{ width: `${subject.progress}%`, background: subject.color || '#8b5cf6' }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-note">Add subjects to see progress bars by class.</p>
            )}
          </div>
        </div>

        <div className="dashboard-card deadline-panel">
          <div className="card-header">
            <span>Upcoming Deadlines</span>
            <span>{upcomingTasks.length} upcoming</span>
          </div>
          <div className="deadline-list">
            {upcomingTasks.length ? (
              upcomingTasks.map((task) => (
                <div key={task.id} className="deadline-item">
                  <span className="deadline-dot" style={{ background: task.subject?.color || '#8b5cf6' }} />
                  <div className="deadline-info">
                    <strong>{task.title}</strong>
                    <span>{task.subject?.name || 'No subject'}</span>
                  </div>
                  <span className="deadline-badge">{deadlineLabel(task.dueDate)}</span>
                </div>
              ))
            ) : (
              <p className="empty-note">No upcoming deadlines. Great job staying ahead.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
