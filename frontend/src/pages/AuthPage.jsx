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
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-soft shadow-slate-900/10 backdrop-blur-sm sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <section className="max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-500">EduTask</p>
          <h1 className="text-4xl font-semibold text-slate-950 sm:text-5xl">{mode === 'login' ? 'Welcome back' : 'Start your study flow'}</h1>
          <p className="max-w-md text-slate-600">{mode === 'login' ? 'Sign in to access your study planner, task board, and Pomodoro focus mode.' : 'Create an account to organize your deadlines, subjects, and focus sessions in one place.'}</p>
          <div className="inline-flex rounded-3xl bg-slate-100 p-1 text-sm font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`rounded-3xl px-5 py-3 transition ${mode === 'login' ? 'bg-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`rounded-3xl px-5 py-3 transition ${mode === 'register' ? 'bg-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Register
            </button>
          </div>
        </section>

        <section className="w-full max-w-md rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-sm shadow-slate-900/5">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{mode === 'login' ? 'Sign in' : 'Create account'}</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">{mode === 'login' ? 'Welcome back' : 'Let’s get you started'}</h2>
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
        </section>
      </div>
    </main>
  )
}
