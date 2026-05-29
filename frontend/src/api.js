import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const loginUser = (user) => client.post('/users/login', user).then((res) => res.data)
export const registerUser = (user) => client.post('/users/register', user).then((res) => res.data)

export const fetchSubjects = () => client.get('/subjects').then((res) => res.data)
export const createSubject = (subject) => client.post('/subjects', subject).then((res) => res.data)
export const updateSubject = (id, subject) => client.put(`/subjects/${id}`, subject).then((res) => res.data)
export const deleteSubject = (id) => client.delete(`/subjects/${id}`)
export const fetchUsers = () => client.get('/users').then((res) => res.data)

export const fetchTasks = () => client.get('/tasks').then((res) => res.data)
export const createTask = (task) => client.post('/tasks', task).then((res) => res.data)
export const updateTask = (id, task) => client.put(`/tasks/${id}`, task).then((res) => res.data)
export const deleteTask = (id) => client.delete(`/tasks/${id}`)
export const completeTask = (id) => client.patch(`/tasks/${id}/complete`).then((res) => res.data)

export const fetchFocusSessions = () => client.get('/focus').then((res) => res.data)
export const completeFocusSession = (session) => client.post('/focus/complete', session).then((res) => res.data)
export const deleteFocusSession = (id) => client.delete(`/focus/${id}`)
