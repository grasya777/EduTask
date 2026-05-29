import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import FocusPage from './pages/FocusPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import {
  fetchFocusSessions,
  fetchSubjects,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  createSubject,
  deleteSubject,
  completeFocusSession,
} from './api'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('edu-user')) || null
    } catch {
      return null
    }
  })
  const [tasks, setTasks] = useState([])
  const [subjects, setSubjects] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!currentUser) {
      setTasks([])
      setSubjects([])
      setSessions([])
      return
    }

    const loadData = async () => {
      setLoading(true)
      setError('')
      try {
        const [taskData, subjectData, sessionData] = await Promise.all([
          fetchTasks(),
          fetchSubjects(),
          fetchFocusSessions(),
        ])
        setTasks(taskData)
        setSubjects(subjectData)
        setSessions(sessionData)
      } catch (loadError) {
        console.error(loadError)
        setError('Unable to load your saved study data. Refresh or try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentUser])

  const saveUser = (user) => {
    setCurrentUser(user)
    localStorage.setItem('edu-user', JSON.stringify(user))
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('edu-user')
  }

  const refreshTasks = async () => {
    const latest = await fetchTasks()
    setTasks(latest)
  }

  const refreshSubjects = async () => {
    const latest = await fetchSubjects()
    setSubjects(latest)
  }

  const refreshSessions = async () => {
    const latest = await fetchFocusSessions()
    setSessions(latest)
  }

  const handleCreateTask = async (task) => {
    await createTask(task)
    await refreshTasks()
  }

  const handleUpdateTask = async (id, task) => {
    await updateTask(id, task)
    await refreshTasks()
  }

  const handleDeleteTask = async (id) => {
    await deleteTask(id)
    await refreshTasks()
  }

  const handleCompleteTask = async (id) => {
    await completeTask(id)
    await refreshTasks()
  }

  const handleCreateSubject = async (subject) => {
    await createSubject(subject)
    await refreshSubjects()
  }

  const handleDeleteSubject = async (id) => {
    await deleteSubject(id)
    await refreshSubjects()
  }

  const handleCompleteFocus = async (session) => {
    await completeFocusSession(session)
  }

  const handleUpdateUser = (user) => {
    saveUser(user)
  }

  return (
    <BrowserRouter>
      {currentUser && (
        <header className="topbar">
          <div className="brand">
            <Link to="/dashboard">EduTask</Link>
          </div>
          <nav className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/focus">Focus</Link>
            <Link to="/profile">Profile</Link>
          </nav>
          <div className="nav-actions">
            <span>{currentUser.name}</span>
            <button type="button" className="text-button" onClick={logout}>
              Sign out
            </button>
          </div>
        </header>
      )}
      {error && <div className="app-alert">{error}</div>}
      {loading && <div className="app-loading">Loading your study data...</div>}
      <Routes>
        <Route path="/auth" element={currentUser ? <Navigate to="/dashboard" replace /> : <AuthPage onLogin={saveUser} />} />
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <DashboardPage user={currentUser} tasks={tasks} subjects={subjects} sessions={sessions} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/tasks"
          element={
            currentUser ? (
              <TasksPage
                user={currentUser}
                tasks={tasks}
                subjects={subjects}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onCompleteTask={handleCompleteTask}
                onReloadTasks={refreshTasks}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/focus"
          element={
            currentUser ? (
              <FocusPage user={currentUser} sessions={sessions} onCompleteFocus={handleCompleteFocus} onReloadSessions={refreshSessions} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            currentUser ? (
              <ProfilePage
                user={currentUser}
                subjects={subjects}
                onUpdateUser={handleUpdateUser}
                onCreateSubject={handleCreateSubject}
                onDeleteSubject={handleDeleteSubject}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to={currentUser ? '/dashboard' : '/auth'} replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
