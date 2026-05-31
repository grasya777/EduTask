import { useState } from 'react'
import { loginUser, registerUser } from '../api'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'

const initialForm = {
  name: '',
  email: '',
  password: '',
  courseProgram: '',
}

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload =
        mode === 'register'
          ? {
              name: form.name,
              email: form.email,
              password: form.password,
              courseProgram: form.courseProgram,
            }
          : {
              email: form.email,
              password: form.password,
            }

      const user = mode === 'register' ? await registerUser(payload) : await loginUser(payload)
      if (!user || !user.id) {
        throw new Error('Unable to sign in. Please try again.')
      }

      onLogin(user)
      setForm(initialForm)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to authenticate.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-sky-50 to-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white/95 shadow-soft shadow-slate-900/10 backdrop-blur-sm">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="flex flex-col justify-center gap-6 bg-slate-950 px-8 py-12 text-white sm:px-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-400">EduTask</p>
              <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">{mode === 'login' ? 'Welcome back' : 'Welcome to EduTask'}</h1>
            </div>
            <p className="max-w-xl text-slate-300">
              {mode === 'login'
                ? 'Sign in to access your study planner, task board, and Pomodoro focus mode.'
                : 'Create an account to organize your deadlines, subjects, and focus sessions in one place.'}
            </p>
          </section>

          <section className="flex items-center justify-center bg-slate-50 px-6 py-10 sm:px-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-700">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className={`rounded-full px-4 py-2 transition ${mode === 'login' ? 'bg-white shadow text-slate-950' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className={`rounded-full px-4 py-2 transition ${mode === 'register' ? 'bg-white shadow text-slate-950' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Register
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'register' && (
                  <>
                    <Input label="Full name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" required />
                    <Input label="Course / program" name="courseProgram" value={form.courseProgram} onChange={handleChange} placeholder="Computer Science" required />
                  </>
                )}
                <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required />
                {error && <p className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
                <Button type="submit" variant="primary" className="w-full">{loading ? 'Saving...' : mode === 'login' ? 'Login' : 'Create account'}</Button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
