import { useEffect, useState } from 'react'

const initialSubject = {
  name: '',
  color: '#8b5cf6',
}

export default function ProfilePage({ user, subjects, onUpdateUser, onCreateSubject, onDeleteSubject }) {
  const [profile, setProfile] = useState(user)
  const [subjectForm, setSubjectForm] = useState(initialSubject)
  const [statusMessage, setStatusMessage] = useState('')

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

  const [subjectStatus, setSubjectStatus] = useState('')
  const [subjectError, setSubjectError] = useState('')

  const handleAddSubject = async (event) => {
    event.preventDefault()
    setSubjectError('')
    setSubjectStatus('')

    try {
      await onCreateSubject({
        name: subjectForm.name,
        color: subjectForm.color,
        user: { id: user.id },
      })
      setSubjectForm(initialSubject)
      setSubjectStatus('Subject added successfully.')
      window.setTimeout(() => setSubjectStatus(''), 3000)
    } catch (error) {
      setSubjectError('Unable to add subject. Please try again.')
    }
  }

  return (
    <main className="page profile-page">
      <div className="page-header profile-header">
        <div>
          <p className="eyebrow">User profile</p>
          <h1>Account & subjects</h1>
          <p className="subtitle">Update your account details and organize your subjects with custom color labels.</p>
        </div>
      </div>

      <section className="grid-panel">
        <div className="card profile-card wide-card">
          <div className="section-title">
            <h2>Your profile</h2>
            <span>Keep your account info current</span>
          </div>
          <label>
            <span>Name</span>
            <input name="name" value={profile.name || ''} onChange={handleProfileChange} />
          </label>
          <label>
            <span>Course / Program</span>
            <input name="courseProgram" value={profile.courseProgram || ''} onChange={handleProfileChange} />
          </label>
          <label>
            <span>Email</span>
            <input name="email" value={profile.email || ''} disabled />
          </label>
          <button type="button" className="primary-button" onClick={handleSaveProfile}>
            Save profile
          </button>
          {statusMessage && <p className="success-text">{statusMessage}</p>}
        </div>

        <div className="card subject-card wide-card">
          <div className="section-title">
            <h2>Subjects</h2>
            <span>{subjects.filter((subject) => subject.user?.id === user.id).length} categories</span>
          </div>
          <form onSubmit={handleAddSubject} className="subject-form">
            <label>
              Subject name
              <input name="name" value={subjectForm.name} onChange={handleSubjectChange} placeholder="e.g. Biology" required />
            </label>
            <label className="color-pick">
              Color
              <input name="color" type="color" value={subjectForm.color} onChange={handleSubjectChange} />
            </label>
            <button type="submit" className="primary-button">
              Add subject
            </button>
            {subjectStatus && <p className="success-text">{subjectStatus}</p>}
            {subjectError && <p className="error-text">{subjectError}</p>}
          </form>
          <div className="subject-list">
            {subjects.filter((subject) => subject.user?.id === user.id).map((subject) => (
              <div key={subject.id} className="subject-row">
                <span className="subject-chip" style={{ background: subject.color || '#8b5cf6' }} />
                <strong>{subject.name}</strong>
                <button type="button" className="text-button" onClick={() => onDeleteSubject(subject.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
