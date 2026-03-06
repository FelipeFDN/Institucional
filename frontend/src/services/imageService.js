import api from './api'

export const imageService = {
  // Faz upload da imagem e retorna a URL salva no servidor
  upload: (file) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post('/imagens/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteByFilename: (filename) => api.delete(`/imagens/deletar/${filename}`),
}
