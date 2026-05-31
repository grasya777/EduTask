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
  const [showAlarm, setShowAlarm] = useState(false)
  const [alarmMessage, setAlarmMessage] = useState('')
  const extendMinutes = 5

  const playAlarmSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioCtx()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = 880
      g.gain.value = 0.06
      o.connect(g)
      g.connect(ctx.destination)
      o.start()
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1)
      o.stop(ctx.currentTime + 1)
    } catch (e) {
      // ignore if Web Audio API not available
    }
  }

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
          if (phase === 'work') {
            setIsRunning(false)
            setShowAlarm(true)
            setAlarmMessage('Your focus session is complete. Extend focus or start your break.')
            setMessage('Focus session complete! Choose your next step.')
            playAlarmSound()
            return 0
          }
          finishPhase()
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning, phase])

  const finishPhase = async () => {
    setIsRunning(false)
    if (phase === 'work') {
      const completedAt = new Date().toISOString()
      const session = {
        focusMinutes: workDuration,
        breakMinutes: 0,
        completedAt,
        user: { id: user.id },
      }
      try {
        await onCompleteFocus(session)
        await onReloadSessions()
        setMessage(`Work session complete! Take a ${breakDuration} minute break.`)
        setPhase('break')
        setSeconds(breakDuration * 60)
      } catch {
        setMessage('Unable to save session. Please refresh.')
      }
      return
    }

    setPhase('work')
    setSeconds(workDuration * 60)
    setMessage('Break complete! Ready for another work session.')
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

  const handleExtendFocus = () => {
    setShowAlarm(false)
    setSeconds(extendMinutes * 60)
    setMessage(`Extended focus by ${extendMinutes} minutes.`)
    setIsRunning(true)
  }

  const handleStartBreak = async () => {
    setShowAlarm(false)
    const completedAt = new Date().toISOString()
    const session = {
      focusMinutes: workDuration,
      breakMinutes: 0,
      completedAt,
      user: { id: user.id },
    }
    try {
      await onCompleteFocus(session)
      await onReloadSessions()
      setPhase('break')
      setSeconds(breakDuration * 60)
      setMessage('Break started. Enjoy your rest.')
      setIsRunning(true)
    } catch {
      setMessage('Unable to save session. Please refresh.')
    }
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
          <div className="grid gap-4">
            <div className="rounded-[36px] bg-slate-950 px-8 py-8 text-center text-white shadow-soft shadow-slate-900/10">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-300">{phase === 'work' ? 'Study session' : 'Break time'}</p>
              <h2 className="mt-4 text-6xl font-semibold tracking-[0.06em]">{formatTime(seconds)}</h2>
              <span className="mt-4 inline-flex rounded-full bg-sky-500/15 px-4 py-2 text-sm font-semibold text-sky-200">{phase === 'work' ? 'Focus block' : 'Break period'}</span>
            </div>
            {/* First small badges removed - moved into the secondary card */}
          </div>

          {isEditing ? (
            <div className="relative grid gap-4 rounded-[32px] border border-slate-200 bg-slate-50 p-6">
              <div className="absolute top-4 right-4">
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>Close</Button>
              </div>
            
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Focus duration (minutes)</span>
                  <input
                    type="number"
                    min="1"
                    value={workDuration}
                    onChange={(event) => setWorkDuration(Number(event.target.value))}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="grid gap-2 text-sm text-slate-700">
                  <span className="font-medium text-slate-900">Break duration (minutes)</span>
                  <input
                    type="number"
                    min="1"
                    value={breakDuration}
                    onChange={(event) => setBreakDuration(Number(event.target.value))}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="lg" onClick={handleSaveDurations}>Save durations</Button>
                <Button variant="secondary" size="lg" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="relative grid gap-4 rounded-[32px] bg-slate-50 p-6 text-slate-700">
              <div className="absolute top-4 right-4">
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-3xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">Focus: {workDuration} min</div>
                <div className="rounded-3xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">Break: {breakDuration} min</div>
              </div>
              <p className="text-sm">{phase === 'work' ? `${workDuration} min work session followed by a ${breakDuration} min break. Keep consistent for better focus.` : `Take a ${breakDuration} min break, breathe, and prepare for the next ${workDuration} min work block.`}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg" onClick={toggleTimer}>{isRunning ? 'Pause' : 'Start'}</Button>
            <Button variant="secondary" size="lg" onClick={resetTimer}>Reset</Button>
          </div>

          {!isEditing && <p className="text-sm text-slate-500">Customize your study/break rhythm, then start your session.</p>}
        </Card>

        {showAlarm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
            <div className="w-full max-w-xl rounded-[32px] bg-white p-8 shadow-soft shadow-slate-900/20">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-500">Focus complete</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Nice work!</h2>
              <p className="mt-4 text-slate-600">{alarmMessage || 'Your focus session has ended. Extend the session or start your break now.'}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button variant="primary" onClick={handleExtendFocus}>Extend focus</Button>
                <Button variant="secondary" onClick={handleStartBreak}>Start break</Button>
                <Button variant="ghost" onClick={() => setShowAlarm(false)}>Dismiss</Button>
              </div>
            </div>
          </div>
        )}

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
