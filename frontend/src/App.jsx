import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import FocusPage from './pages/FocusPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import AppShell from './components/layout/AppShell.jsx'
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
import './index.css'

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
      {currentUser ? (
        <AppShell user={currentUser} logout={logout}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  user={currentUser}
                  tasks={tasks}
                  subjects={subjects}
                  sessions={sessions}
                  loading={loading}
                  error={error}
                />
              }
            />
            <Route
              path="/tasks"
              element={
                <TasksPage
                  user={currentUser}
                  tasks={tasks}
                  subjects={subjects}
                  onCreateTask={handleCreateTask}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                  onCompleteTask={handleCompleteTask}
                />
              }
            />
            <Route
              path="/focus"
              element={
                <FocusPage user={currentUser} sessions={sessions} onCompleteFocus={handleCompleteFocus} onReloadSessions={refreshSessions} />
              }
            />
            <Route
              path="/profile"
              element={
                <ProfilePage
                  user={currentUser}
                  subjects={subjects}
                  onUpdateUser={handleUpdateUser}
                  onCreateSubject={handleCreateSubject}
                  onDeleteSubject={handleDeleteSubject}
                />
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppShell>
      ) : (
        <Routes>
          <Route path="*" element={<AuthPage onLogin={saveUser} />} />
        </Routes>
      )}
    </BrowserRouter>
  )
}

export default App

