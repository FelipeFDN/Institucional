import api from './api'

export const newsService = {
  getAll: () => api.get('/noticias/todos'),
  getById: (id) => api.get(`/noticias/news/${id}`),
  create: (data) => api.post('/noticiasP/create', data),
  update: (id, data) => api.put(`/noticiasP/news/${id}`, data),
  delete: (id) => api.delete(`/noticiasP/news/${id}`),
}
