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

export default function TasksPage({ user, tasks, subjects, onCreateTask, onUpdateTask, onDeleteTask, onCompleteTask, onReloadTasks }) {
  const [taskForm, setTaskForm] = useState(initialTask)
  const [editing, setEditing] = useState(null)
  const [filterSubject, setFilterSubject] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const userTasks = useMemo(() => tasks.filter((task) => task.user?.id === user.id), [tasks, user.id])
  const filteredTasks = useMemo(() => {
    return userTasks.filter((task) => {
      const subjectMatch = filterSubject === 'all' || task.subject?.id?.toString() === filterSubject
      const priorityMatch = filterPriority === 'all' || task.priority === filterPriority
      return subjectMatch && priorityMatch
    })
  }, [userTasks, filterSubject, filterPriority])

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
  }

  const statusLabels = {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
  }

  const countdownText = (dueDate) => {
    if (!dueDate) return 'No deadline'
    const due = new Date(dueDate)
    const diff = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return 'Overdue'
    if (diff === 0) return 'Today'
    return `${diff} day${diff === 1 ? '' : 's'}`
  }

  return (
    <main className="page tasks-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Tasks & subjects</p>
          <h1>Task tracker</h1>
          <p className="subtitle">Create priorities, set due dates, and organize work by subject.</p>
        </div>
        <div className="filter-toolbar">
          <select value={filterSubject} onChange={(event) => setFilterSubject(event.target.value)}>
            <option value="all">All subjects</option>
            {subjects
              .filter((subject) => subject.user?.id === user.id)
              .map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
          </select>
          <select value={filterPriority} onChange={(event) => setFilterPriority(event.target.value)}>
            <option value="all">All priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="MODERATE">Moderate</option>
            <option value="CHILL">Chill</option>
          </select>
          <button type="button" className="secondary-button" onClick={onReloadTasks}>
            Refresh
          </button>
        </div>
      </div>

      <section className="grid-panel">
        <div className="task-form card">
          <h2>{editing ? 'Edit task' : 'Add new task'}</h2>
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
                rows="4"
                placeholder="Notes or study details"
              />
            </label>
            <label>
              Subject
              <select name="subjectId" value={taskForm.subjectId} onChange={handleChange}>
                <option value="">No subject</option>
                {subjects
                  .filter((subject) => subject.user?.id === user.id)
                  .map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
              </select>
            </label>
            <div className="form-row">
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
                Due date
                <input name="dueDate" type="date" value={taskForm.dueDate} onChange={handleChange} />
              </label>
            </div>
            <div className="form-row">
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

        <div className="task-list card wide-card">
          <div className="section-title">
            <h2>Task list</h2>
            <p>{filteredTasks.length} tasks matching your filters</p>
          </div>
          {filteredTasks.length ? (
            <div className="task-grid">
              {filteredTasks.map((task) => (
                <article key={task.id} className={`task-card priority-${task.priority.toLowerCase()}`}>
                  <div className="task-card-top">
                    <span className="task-priority">{priorityLabels[task.priority]}</span>
                    <span className={`task-status ${task.status.toLowerCase()}`}>{statusLabels[task.status]}</span>
                  </div>
                  <h3>{task.title}</h3>
                  <p>{task.description || 'No description yet.'}</p>
                  <div className="task-meta">
                    <span>{task.subject?.name || 'General'}</span>
                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                    <span>{countdownText(task.dueDate)}</span>
                  </div>
                  <div className="task-actions">
                    <button type="button" className="secondary-button" onClick={() => handleEdit(task)}>
                      Edit
                    </button>
                    <button type="button" className="secondary-button" onClick={() => onCompleteTask(task.id)} disabled={task.status === 'COMPLETED'}>
                      Complete
                    </button>
                    <button type="button" className="text-button" onClick={() => onDeleteTask(task.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty-note">No tasks match the current filters. Add a task or select a different subject.</p>
          )}
        </div>
      </section>
    </main>
  )
}
