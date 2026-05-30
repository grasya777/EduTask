import { useEffect, useState } from 'react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Input from '../components/ui/Input.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

const initialSubject = {
  name: '',
  color: '#5b7dff',
}

export default function ProfilePage({ user, subjects, onUpdateUser, onCreateSubject, onDeleteSubject }) {
  const [profile, setProfile] = useState(user)
  const [subjectForm, setSubjectForm] = useState(initialSubject)
  const [statusMessage, setStatusMessage] = useState('')
  const [subjectStatus, setSubjectStatus] = useState('')
  const [subjectError, setSubjectError] = useState('')

  useEffect(() => {
    setProfile(user)
  }, [user])

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
  }

  const handleSaveProfile = () => {
    onUpdateUser(profile)
    setStatusMessage('Profile updated locally.')
    window.setTimeout(() => setStatusMessage(''), 3000)
  }

  const handleSubjectChange = (event) => {
    const { name, value } = event.target
    setSubjectForm((current) => ({ ...current, [name]: value }))
  }

  const handleAddSubject = async (event) => {
    event.preventDefault()
    setSubjectError('')
    setSubjectStatus('')

    try {
      await onCreateSubject({ name: subjectForm.name, color: subjectForm.color, user: { id: user.id } })
      setSubjectForm(initialSubject)
      setSubjectStatus('Subject added successfully.')
      window.setTimeout(() => setSubjectStatus(''), 3000)
    } catch (error) {
      setSubjectError('Unable to add subject. Please try again.')
    }
  }

  const subjectList = subjects.filter((subject) => subject.user?.id === user.id)

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-500">Profile</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Account settings & subjects</h1>
            <p className="mt-2 text-slate-600">Update your account details and manage study categories in one place.</p>
          </div>
          <Button variant="secondary" onClick={handleSaveProfile}>Save profile</Button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Card className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Your profile</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Update account details</h2>
          </div>
          <div className="grid gap-5">
            <Input label="Name" name="name" value={profile.name || ''} onChange={handleProfileChange} />
            <Input label="Course / program" name="courseProgram" value={profile.courseProgram || ''} onChange={handleProfileChange} />
            <Input label="Email" name="email" value={profile.email || ''} disabled />
          </div>
          {statusMessage && <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{statusMessage}</div>}
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Subjects</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Organize your categories</h2>
            </div>
            <span className="rounded-3xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{subjectList.length} categories</span>
          </div>
          <form onSubmit={handleAddSubject} className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Subject name" name="name" value={subjectForm.name} onChange={handleSubjectChange} placeholder="e.g. Biology" required />
              <div className="grid gap-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Color</span>
                <input name="color" type="color" value={subjectForm.color} onChange={handleSubjectChange} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" variant="primary">Add subject</Button>
              {subjectStatus && <span className="text-sm text-emerald-700">{subjectStatus}</span>}
              {subjectError && <span className="text-sm text-rose-700">{subjectError}</span>}
            </div>
          </form>

          {subjectList.length ? (
            <div className="space-y-3">
              {subjectList.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl" style={{ background: subject.color || '#5b7dff' }} />
                    <div>
                      <p className="font-semibold text-slate-950">{subject.name}</p>
                    </div>
                  </div>
                  <button type="button" className="text-rose-600 hover:text-rose-800" onClick={() => onDeleteSubject(subject.id)}>Remove</button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No subjects yet"
              description="Add a category to group your tasks by class, topic, or project."
            />
          )}
        </Card>
      </section>
    </main>
  )
}
