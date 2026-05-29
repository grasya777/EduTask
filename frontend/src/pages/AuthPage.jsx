import { useState } from 'react'
import { loginUser, registerUser } from '../api'

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
    <main className="page auth-page">
      <div className="auth-header">
        <div className="auth-brand">EduTask</div>
        <div className="auth-mode-buttons">
          <button type="button" className={`mode-button ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>
            Sign in
          </button>
          <button type="button" className={`mode-button ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>
            Create account
          </button>
        </div>
      </div>

      <section className="auth-panel card">
        <div className="auth-intro">
          <p className="eyebrow">Welcome{mode === 'login' ? ' back!' : '!'}</p>
          <h1>{mode === 'login' ? 'Welcome back!' : 'Start tracking your tasks today'}</h1>
          <p className="intro-copy">
            {mode === 'login'
              ? 'Sign back in to access your tasks and deadlines.'
              : 'Create an account to organize your study time, deadlines, and focus sessions.'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <>
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
              </label>
              <label>
                Course / Program
                <input
                  name="courseProgram"
                  value={form.courseProgram}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  required
                />
              </label>
            </>
          )}
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter a secure password"
              required
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Saving...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </section>
    </main>
  )
}
