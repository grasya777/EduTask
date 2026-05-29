import { useMemo, useState } from 'react'

const initialTask = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'MODERATE',
  status: 'PENDING',
  subjectId: '',
}

const priorityLabels = {
  URGENT: 'Urgent',
  MODERATE: 'Moderate',
  CHILL: 'Chill',
}

const statusLabels = {
  PENDING: 'To Do',
  COMPLETED: 'Done',
  IN_PROGRESS: 'In Progress',
}

const statusIcon = {
  COMPLETED: '✅',
  IN_PROGRESS: '⏳',
  PENDING: '⚪',
}

export default function TasksPage({ user, tasks, subjects, onCreateTask, onUpdateTask, onDeleteTask, onCompleteTask }) {
  const [taskForm, setTaskForm] = useState(initialTask)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSubject, setFilterSubject] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortOption, setSortOption] = useState('dueDate')

  const userTasks = tasks.filter((task) => task.user?.id === user.id)

  const filteredTasks = useMemo(() => {
    return userTasks
      .filter((task) => {
        const subjectMatch = filterSubject === 'all' || task.subject?.id?.toString() === filterSubject
        const priorityMatch = filterPriority === 'all' || task.priority === filterPriority
        const statusMatch = filterStatus === 'all' || task.status === filterStatus
        const searchMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase())
        return subjectMatch && priorityMatch && statusMatch && searchMatch
      })
      .sort((a, b) => {
        if (sortOption === 'priority') {
          return a.priority.localeCompare(b.priority)
        }
        if (sortOption === 'recent') {
          return new Date(b.createdAt || b.dueDate || 0) - new Date(a.createdAt || a.dueDate || 0)
        }
        if (sortOption === 'dueDate') {
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        }
        return 0
      })
  }, [userTasks, searchQuery, filterSubject, filterPriority, filterStatus, sortOption])

  const handleChange = (event) => {
    const { name, value } = event.target
    setTaskForm((current) => ({ ...current, [name]: value }))
  }

  const resetForm = () => {
    setTaskForm(initialTask)
    setEditing(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const payload = {
      title: taskForm.title,
      description: taskForm.description,
      dueDate: taskForm.dueDate || null,
      priority: taskForm.priority,
      status: taskForm.status,
      user: { id: user.id },
      subject: taskForm.subjectId ? { id: Number(taskForm.subjectId) } : null,
    }

    if (editing) {
      await onUpdateTask(editing.id, payload)
    } else {
      await onCreateTask(payload)
    }
    resetForm()
    setShowForm(false)
  }

  const handleEdit = (task) => {
    setEditing(task)
    setTaskForm({
      title: task.title || '',
      description: task.description || '',
      dueDate: task.dueDate || '',
      priority: task.priority || 'MODERATE',
      status: task.status || 'PENDING',
      subjectId: task.subject?.id?.toString() || '',
    })
    setShowForm(true)
  }

  const getSubjectColor = (subject) => {
    if (!subject) return '#7c3aed'
    return subject.color || {
      Science: '#10b981',
      Mathematics: '#2563eb',
      History: '#ef4444',
    }[subject.name] || '#7c3aed'
  }

  const formatDate = (date) => {
    if (!date) return 'No date'
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <main className="page tasks-page">
      <div className="tasks-header">
        <div>
          <p className="eyebrow">Tasks & subjects</p>
          <h1>My Tasks</h1>
          <p className="subtitle">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button type="button" className="primary-button new-task-button" onClick={() => setShowForm((current) => !current)}>
          + New Task
        </button>
      </div>

      <div className="tasks-controls">
        <div className="search-control">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search tasks..."
          />
        </div>

        <div className="controls-grid">
          <label>
            Subject
            <select value={filterSubject} onChange={(event) => setFilterSubject(event.target.value)}>
              <option value="all">All subjects</option>
              {subjects.filter((subject) => subject.user?.id === user.id).map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select value={filterPriority} onChange={(event) => setFilterPriority(event.target.value)}>
              <option value="all">All priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="MODERATE">Moderate</option>
              <option value="CHILL">Chill</option>
            </select>
          </label>
          <label>
            Status
            <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="PENDING">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Done</option>
            </select>
          </label>
          <label>
            Sort
            <select value={sortOption} onChange={(event) => setSortOption(event.target.value)}>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="recent">Recently Added</option>
            </select>
          </label>
        </div>

        <button type="button" className="secondary-button add-task-control" onClick={() => setShowForm(true)}>
          + Add Task
        </button>
      </div>

      <div className="task-counter">{filteredTasks.length} tasks</div>

      {showForm && (
        <div className="task-form card task-form-panel">
          <div className="task-form-header">
            <div>
              <h2>{editing ? 'Edit task' : 'Create new task'}</h2>
              <p className="task-form-subtitle">Set task details, assign a subject, and choose a priority.</p>
            </div>
            <button type="button" className="text-button" onClick={() => setShowForm(false)}>
              Close
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <label>
              Title
              <input name="title" value={taskForm.title} onChange={handleChange} required placeholder="Task name" />
            </label>
            <label>
              Description
              <textarea
                name="description"
                value={taskForm.description}
                onChange={handleChange}
                rows="3"
                placeholder="Notes or study details"
              />
            </label>
            <div className="form-row">
              <label>
                Subject
                <select name="subjectId" value={taskForm.subjectId} onChange={handleChange}>
                  <option value="">No subject</option>
                  {subjects.filter((subject) => subject.user?.id === user.id).map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Priority
                <select name="priority" value={taskForm.priority} onChange={handleChange}>
                  {Object.entries(priorityLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select name="status" value={taskForm.status} onChange={handleChange}>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Due date
                <input name="dueDate" type="date" value={taskForm.dueDate} onChange={handleChange} />
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editing ? 'Save task' : 'Create task'}
              </button>
              {editing && (
                <button type="button" className="text-button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <section className="task-list-card card">
        <div className="task-list-header">
          <div>
            <h2>Task list</h2>
            <p>Manage everything by subject, priority, and status.</p>
          </div>
        </div>

        <div className="task-cards">
          {filteredTasks.length ? (
            filteredTasks.map((task) => {
              const subject = subjects.find((subjectItem) => subjectItem.id === task.subject?.id)
              const indicatorColor = getSubjectColor(subject)
              const isDone = task.status === 'COMPLETED'
              return (
                <article key={task.id} className={`task-card task-card-${task.status.toLowerCase()}`} style={{ borderLeftColor: indicatorColor }}>
                  <div className="task-card-left">
                    <span className={`task-status-icon status-${task.status.toLowerCase()}`}>{statusIcon[task.status] || '⚪'}</span>
                  </div>
                  <div className="task-card-body">
                    <div className="task-card-title-row">
                      <h3 className={isDone ? 'completed-task' : ''}>{task.title}</h3>
                      <span className={`due-pill due-pill-${task.status.toLowerCase()}`}>{formatDate(task.dueDate)}</span>
                    </div>
                    <div className="task-card-meta">
                      <span className="subject-pill" style={{ background: `${indicatorColor}22`, color: indicatorColor }}>{subject?.name || 'General'}</span>
                      <span className={`priority-pill priority-pill-${task.priority.toLowerCase()}`}>{priorityLabels[task.priority]}</span>
                      <span className={`status-pill status-pill-${task.status.toLowerCase()}`}>{statusLabels[task.status]}</span>
                    </div>
                  </div>
                  <div className="task-card-actions">
                    <button type="button" className="secondary-button" onClick={() => handleEdit(task)}>
                      Edit
                    </button>
                    <button type="button" className="text-button" onClick={() => onDeleteTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              )
            })
          ) : (
            <p className="empty-note">No tasks currently match your search or filters.</p>
          )}
        </div>
      </section>
    </main>
  )
}
