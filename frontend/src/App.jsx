import { useEffect, useState } from 'react'
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import FocusPage from './pages/FocusPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import {
  fetchFocusSessions,
  fetchSubjects,
  fetchTasks,
  fetchUsers,
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
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen((current) => !current)
  }

  useEffect(() => {
    if (!currentUser) {
      setTasks([])
      setSubjects([])
      setSessions([])
      return
    }

    const verifyAndLoadData = async () => {
      setLoading(true)
      setError('')
      try {
        const users = await fetchUsers()
        const validUser = users.find((user) => user.id === currentUser.id)

        if (!validUser) {
          setError('Your session is no longer valid. Please sign in again.')
          setCurrentUser(null)
          localStorage.removeItem('edu-user')
          return
        }

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

    verifyAndLoadData()
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

  const userTasks = currentUser ? tasks.filter((task) => task.user?.id === currentUser.id) : []
  const overdueTaskCount = userTasks.filter((task) => {
    if (!task.dueDate || task.status === 'COMPLETED') return false
    const due = new Date(task.dueDate)
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return due < startOfToday
  }).length
  const completedTaskCount = userTasks.filter((task) => task.status === 'COMPLETED').length

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
        <>
          <header className="topbar">
            <div className="brand">
              <Link to="/dashboard">EduTask</Link>
            </div>
            <div className="nav-actions">
              <span>{currentUser.name}</span>
              <button type="button" className="text-button" onClick={logout}>
                Sign out
              </button>
            </div>
          </header>
          <div className="app-shell">
            <aside className={`side-nav ${sidebarOpen ? 'open' : 'collapsed'}`}>
              <div className="side-nav-top">
                <div className="sidebar-brand">
                  <div className="sidebar-logo">ET</div>
                  <div>
                    <p className="sidebar-title">EduTask</p>
                  </div>
                </div>
                <button type="button" className="sidebar-toggle" onClick={toggleSidebar} aria-label={`${sidebarOpen ? 'Collapse' : 'Expand'} menu`}>
                  <span className="toggle-icon">{sidebarOpen ? '←' : '→'}</span>
                </button>
              </div>
              <nav className="side-nav-links">
                <NavLink to="/dashboard" className={({ isActive }) => `side-nav-link${isActive ? ' active-nav-item' : ''}`}>
                  <span className="nav-icon">🏠</span>
                  <span className="nav-label">Dashboard</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `side-nav-link${isActive ? ' active-nav-item' : ''}`}>
                  <span className="nav-icon">👤</span>
                  <span className="nav-label">Profile</span>
                </NavLink>
                <NavLink to="/tasks" className={({ isActive }) => `side-nav-link${isActive ? ' active-nav-item' : ''}`}>
                  <span className="nav-icon">📋</span>
                  <span className="nav-label">My Tasks</span>
                </NavLink>
                <NavLink to="/focus" className={({ isActive }) => `side-nav-link${isActive ? ' active-nav-item' : ''}`}>
                  <span className="nav-icon">⏱</span>
                  <span className="nav-label">Focus</span>
                </NavLink>
              </nav>
              <div className="side-nav-footer">
                <Link to="/tasks" className="quick-add-button">
                  <span className="quick-add-icon">+</span>
                  <span className="quick-add-label">Quick Add Task</span>
                </Link>
              </div>
            </aside>
            <div className="app-content">
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
            </div>
          </div>
        </>
      )}
      {!currentUser && (
        <Routes>
          <Route path="/auth" element={<AuthPage onLogin={saveUser} />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App
