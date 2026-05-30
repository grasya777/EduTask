import { useMemo, useState } from 'react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Input from '../components/ui/Input.jsx'
import TextArea from '../components/ui/TextArea.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'

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
}

const statusColor = {
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  PENDING: 'bg-slate-100 text-slate-700',
}

export default function TasksPage({ user, tasks, subjects, onCreateTask, onUpdateTask, onDeleteTask, onCompleteTask }) {
  const [taskForm, setTaskForm] = useState(initialTask)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const userTasks = tasks.filter((task) => task.user?.id === user.id)

  const filteredTasks = useMemo(
    () => userTasks.filter((task) => {
      const query = searchQuery.toLowerCase()
      return task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)
    }),
    [userTasks, searchQuery],
  )

  const subjectOptions = useMemo(
    () => subjects.filter((subject) => subject.user?.id === user.id),
    [subjects, user.id],
  )

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

  const formatDate = (date) => {
    if (!date) return 'No date'
    return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  return (
    <main className="space-y-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-500">Tasks</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Manage your study queue</h1>
            <p className="mt-2 text-slate-600">Create and track tasks with priority, deadlines, and subjects in a single place.</p>
          </div>
          <Button variant="primary" onClick={() => setShowForm((current) => !current)}>
            {showForm ? 'Hide form' : 'Add task'}
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <p className="text-sm text-slate-500">{filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'}</p>
        </div>
      </section>

      {showForm && (
        <Card className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">{editing ? 'Edit task' : 'New task'}</h2>
              <p className="text-sm text-slate-500">Fill in the details and save your study goal.</p>
            </div>
            <Button variant="secondary" onClick={() => { resetForm(); setShowForm(false) }}>Cancel</Button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <Input label="Title" name="title" value={taskForm.title} onChange={handleChange} placeholder="Task title" required />
            <Input label="Due date" name="dueDate" type="date" value={taskForm.dueDate} onChange={handleChange} />
            <TextArea label="Description" name="description" value={taskForm.description} onChange={handleChange} placeholder="Add notes or instructions" />
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Subject</span>
                <select
                  name="subjectId"
                  value={taskForm.subjectId}
                  onChange={handleChange}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                >
                  <option value="">No subject</option>
                  {subjectOptions.map((subject) => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Priority</span>
                <select
                  name="priority"
                  value={taskForm.priority}
                  onChange={handleChange}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                >
                  {Object.entries(priorityLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Status</span>
                <select
                  name="status"
                  value={taskForm.status}
                  onChange={handleChange}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-900 transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                >
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" variant="primary" className="w-full sm:w-auto">{editing ? 'Save changes' : 'Add task'}</Button>
              {editing && (
                <Button type="button" variant="danger" onClick={() => { resetForm(); setShowForm(false) }}>Discard</Button>
              )}
            </div>
          </form>
        </Card>
      )}

      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Create your first task to start organizing your study sessions and deadlines."
          action={<Button variant="primary" onClick={() => setShowForm(true)}>Add your first task</Button>}
        />
      ) : (
        <Card className="space-y-2">
          <div className="mb-4 pb-4 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-700">{filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'}</p>
          </div>
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const taskSubject = subjectOptions.find((subject) => subject.id === task.subject?.id)
              const isDone = task.status === 'COMPLETED'
              return (
                <div key={task.id} className={`group flex items-start gap-3 rounded-2xl p-4 transition ${isDone ? 'bg-emerald-50' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onCompleteTask(task.id)}
                    className="mt-1 h-5 w-5 cursor-pointer rounded accent-emerald-600"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-slate-950 ${isDone ? 'line-through text-slate-500' : ''}`}>{task.title}</h3>
                        {task.description && (
                          <p className={`text-sm mt-1 ${isDone ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{task.description}</p>
                        )}
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-200 text-slate-700 whitespace-nowrap">{formatDate(task.dueDate)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-700">{taskSubject?.name || 'No subject'}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-700">{priorityLabels[task.priority]}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button type="button" className="text-sky-600 hover:text-sky-800 text-sm font-semibold" onClick={() => handleEdit(task)}>Edit</button>
                    <button type="button" className="text-rose-600 hover:text-rose-800 text-sm font-semibold" onClick={() => onDeleteTask(task.id)}>Delete</button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </main>
  )
}

