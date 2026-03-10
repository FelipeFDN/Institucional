import api from './api'

export const highlightService = {
  getAll: () => api.get('/destaques/todos'),
  getAllAdmin: () => api.get('/destaquesP/todos'),
  create: (data) => api.post('/destaquesP/create', data),
  update: (id, data) => api.put(`/destaquesP/highlight/${id}`, data),
  delete: (id) => api.delete(`/destaquesP/highlight/${id}`),
}
