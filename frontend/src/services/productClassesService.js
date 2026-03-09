import api from './api'

export const productClassesService = {
  getAll: () => api.get('/classes/todos'),
  getById: (id) => api.get(`/classes/class/${id}`),
  create: (data) => api.post('/classesP/create', data),
  update: (id, data) => api.put(`/classesP/product/${id}`, data),
  delete: (id) => api.delete(`/classesP/product/${id}`),
}
