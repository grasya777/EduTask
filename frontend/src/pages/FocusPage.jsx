import { useEffect, useMemo, useState } from 'react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`
}

export default function FocusPage({ user, sessions, onCompleteFocus, onReloadSessions }) {
  const [workDuration, setWorkDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [seconds, setSeconds] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState('work')
  const [message, setMessage] = useState('Ready to focus')
  const [isEditing, setIsEditing] = useState(false)

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
      focusMinutes: phase === 'work' ? workDuration : 0,
      breakMinutes: phase === 'work' ? breakDuration : 0,
      completedAt,
      user: { id: user.id },
    }
    try {
      await onCompleteFocus(session)
      await onReloadSessions()
      setMessage(phase === 'work' ? `Work session complete! Take a ${breakDuration} minute break.` : `Break complete! Ready for another ${workDuration} minute session.`)
      setPhase(phase === 'work' ? 'break' : 'work')
      setSeconds(phase === 'work' ? breakDuration * 60 : workDuration * 60)
    } catch {
      setMessage('Unable to save session. Please refresh.')
    }
  }

  const toggleTimer = () => {
    if (seconds === 0) {
      setSeconds(phase === 'work' ? workDuration * 60 : breakDuration * 60)
    }
    setIsRunning((current) => !current)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setPhase('work')
    setSeconds(workDuration * 60)
    setMessage('Ready to focus')
  }

  const handleSaveDurations = () => {
    setIsRunning(false)
    setPhase('work')
    setSeconds(workDuration * 60)
    setMessage('Ready to focus')
    setIsEditing(false)
  }

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-500">Focus mode</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Distraction-free Pomodoro</h1>
            <p className="mt-2 text-slate-600">Use the timer to lock in your study rhythm and track completed focus sessions.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-5 py-4 text-slate-700">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Today</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{completedToday} completed</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{phase === 'work' ? 'Study session' : 'Break time'}</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">{formatTime(seconds)}</h2>
            </div>
            <div className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">{phase === 'work' ? 'Focus block' : 'Rest period'}</div>
          </div>

          <div className="rounded-[32px] bg-slate-50 p-6 text-slate-700">
            <p className="text-sm">{message}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg" onClick={toggleTimer}>{isRunning ? 'Pause' : 'Start'}</Button>
            <Button variant="secondary" size="lg" onClick={resetTimer}>Reset</Button>
          </div>

          <p className="text-sm text-slate-500">{phase === 'work' ? '25 min work session followed by a 5 min break. Keep consistent for better focus.' : 'Take a short break, breathe, and prepare for the next block.'}</p>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Session history</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">Recent focus sessions</h2>
            </div>
            <span className="rounded-3xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{userSessions.length} total</span>
          </div>

          {userSessions.length ? (
            <div className="space-y-4">
              {userSessions.slice().sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).map((session) => (
                <div key={session.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{session.focusMinutes} min study</p>
                      <p className="text-sm text-slate-500">{new Date(session.completedAt).toLocaleString()}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{session.breakMinutes ? `${session.breakMinutes} min break` : 'Quick reset'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No focus sessions yet"
              description="Start your first Pomodoro session to save progress and build study momentum."
              action={<Button variant="primary" onClick={toggleTimer}>Start session</Button>}
            />
          )}
        </Card>
      </section>
    </main>
  )
}
