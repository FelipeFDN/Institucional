import api from './api'

export const newsService = {
  getAll: () => api.get('/noticias/todos'),
  getById: (id) => api.get(`/noticias/news/${id}`),
  create: (data) => api.post('/noticiasP/create', data),
  update: (id, data) => api.put(`/noticiasP/news/${id}`, data),
  delete: (id) => api.delete(`/noticiasP/news/${id}`),
  addImages: (id, files) => {
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))
    return api.post(`/noticiasP/news/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteImage: (newsId, imageId) => api.delete(`/noticiasP/news/${newsId}/images/${imageId}`),
}
