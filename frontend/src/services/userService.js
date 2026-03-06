import api from './api'

export const userService = {
  getAll: () => api.get('/usuarios/todos'),
  create: (data) => api.post('/usuarios/cadastro', data),
  update: (id, data) => api.put(`/usuarios/user/${id}`, data),
  delete: (id) => api.delete(`/usuarios/deletar/${id}`),
}
