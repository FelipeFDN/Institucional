import api from './api'

export const productService = {
  getAll: () => api.get('/produtos/todos'),
  getById: (id) => api.get(`/produtos/product/${id}`),
  create: (data) => api.post('/produtosP/create', data),
  update: (id, data) => api.put(`/produtosP/product/${id}`, data),
  delete: (id) => api.delete(`/produtosP/product/${id}`),
}
