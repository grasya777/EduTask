import { useEffect, useMemo, useState } from 'react'

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`
}

export default function FocusPage({ user, sessions, onCompleteFocus, onReloadSessions }) {
  const [seconds, setSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState('work')
  const [message, setMessage] = useState('Ready to focus')

  const userSessions = useMemo(() => sessions.filter((session) => session.user?.id === user.id), [sessions, user.id])
  const completedToday = useMemo(() => {
    const today = new Date()
    return userSessions.filter((session) => {
      const completed = new Date(session.completedAt)
      return (
        completed.getFullYear() === today.getFullYear() &&
        completed.getMonth() === today.getMonth() &&
        completed.getDate() === today.getDate()
      )
    }).length
  }, [userSessions])

  useEffect(() => {
    if (!isRunning) return undefined
    const timer = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          finishPhase()
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning])

  const finishPhase = async () => {
    setIsRunning(false)
    const completedAt = new Date().toISOString()
    const session = {
      focusMinutes: phase === 'work' ? 25 : 0,
      breakMinutes: phase === 'work' ? 5 : 0,
      completedAt,
      user: { id: user.id },
    }
    try {
      await onCompleteFocus(session)
      await onReloadSessions()
      setMessage(phase === 'work' ? 'Work session complete! Take a short break.' : 'Break complete! Ready for another session.')
      setPhase(phase === 'work' ? 'break' : 'work')
      setSeconds(phase === 'work' ? 5 * 60 : 25 * 60)
    } catch {
      setMessage('Unable to save session. Please refresh.')
    }
  }

  const toggleTimer = () => {
    if (seconds === 0) {
      setSeconds(phase === 'work' ? 25 * 60 : 5 * 60)
    }
    setIsRunning((current) => !current)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setPhase('work')
    setSeconds(25 * 60)
    setMessage('Ready to focus')
  }

  return (
    <main className="page focus-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Distraction-free mode</p>
          <h1>Focus mode</h1>
          <p className="subtitle">Use a built-in Pomodoro timer for deeper study and track completed focus sessions.</p>
        </div>
        <div className="focus-summary-card card">
          <h2>Today&apos;s focus</h2>
          <p>{completedToday} completed sessions</p>
          <div className="quarter-grid">
            <div>
              <strong>{userSessions.length}</strong>
              <span>Total sessions</span>
            </div>
            <div>
              <strong>{userSessions.reduce((total, session) => total + (session.focusMinutes || 0), 0)}</strong>
              <span>Minutes studied</span>
            </div>
          </div>
        </div>
      </div>

      <section className="grid-panel">
        <div className="focus-timer-card card wide-card">
          <h2>{phase === 'work' ? 'Study session' : 'Break time'}</h2>
          <div className="timer-display">{formatTime(seconds)}</div>
          <p className="timer-note">{message}</p>
          <div className="timer-actions">
            <button type="button" className="primary-button" onClick={toggleTimer}>
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button type="button" className="secondary-button" onClick={resetTimer}>
              Reset
            </button>
          </div>
          <p className="break-info">{phase === 'work' ? '25 min work, then 5 min break.' : 'Enjoy your short break and prepare for the next study block.'}</p>
        </div>

        <div className="focus-session-list card wide-card">
          <div className="section-title">
            <h2>Recent focus sessions</h2>
            <span>{userSessions.length} records</span>
          </div>
          {userSessions.length ? (
            <ul className="session-list">
              {userSessions
                .slice()
                .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                .map((session) => (
                  <li key={session.id}>
                    <div>
                      <strong>{session.focusMinutes} min study</strong>
                      <span>{new Date(session.completedAt).toLocaleString()}</span>
                    </div>
                    <span>{session.breakMinutes ? `${session.breakMinutes} min break` : 'Short reset'}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="empty-note">Complete a focus session to build your streak.</p>
          )}
        </div>
      </section>
    </main>
  )
}
