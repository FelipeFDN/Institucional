import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { newsService } from '../../../services/newsService'
import { imageService } from '../../../services/imageService'
import Loading from '../../../components/Loading/Loading'
import Modal from '../../../components/Modal/Modal'
import styles from '../Admin.module.css'

const emptyForm = { tittle: '', description: '', image: null }

export default function AdminNews() {
  const { data: news, loading, error, refetch } = useFetch(newsService.getAll)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState(null)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }))
  }

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm)
    setMsg(null)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditId(item.id)
    setForm({ tittle: item.tittle, description: item.description || '', image: null })
    setMsg(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (submitting || uploading) return
    setModalOpen(false)
    setEditId(null)
    setForm(emptyForm)
    setMsg(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg(null)
    try {
      let image_url = null

      if (form.image) {
        setUploading(true)
        const { data } = await imageService.upload(form.image)
        image_url = data.url
        setUploading(false)
      }

      const payload = { tittle: form.tittle, description: form.description }
      if (image_url) payload.image_url = image_url

      if (editId) {
        await newsService.update(editId, payload)
        setMsg('Notícia atualizada com sucesso.')
      } else {
        await newsService.create(payload)
        setMsg('Notícia criada com sucesso.')
      }
      setForm(emptyForm)
      setEditId(null)
      refetch()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erro ao salvar notícia.')
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deseja deletar esta notícia?')) return
    try {
      await newsService.delete(id)
      refetch()
    } catch {
      alert('Erro ao deletar notícia.')
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Gerenciar Notícias</h1>
        <button className={styles.btnNew} onClick={openCreate}>+ Nova Notícia</button>
      </div>

      {loading ? <Loading /> : error ? <p className={styles.error}>{error}</p> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Título</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id}>
                <td>{item.tittle}</td>
                <td>{item.description || '—'}</td>
                <td className={styles.actions}>
                  <button className={styles.btnEdit} onClick={() => openEdit(item)}>Editar</button>
                  <button className={styles.btnDelete} onClick={() => handleDelete(item.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editId ? 'Editar Notícia' : 'Nova Notícia'}
      >
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.fields}>
            <input name="tittle" value={form.tittle} onChange={handleChange} placeholder="Título" required />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descrição" rows={4} />
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
          </div>
          {msg && <p className={styles.msg}>{msg}</p>}
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnSave} disabled={submitting || uploading}>
              {uploading ? 'Enviando imagem...' : submitting ? 'Salvando...' : editId ? 'Atualizar' : 'Criar'}
            </button>
            <button type="button" className={styles.btnCancel} onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}