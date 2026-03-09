import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { newsService } from '../../../services/newsService'
import { imageService } from '../../../services/imageService'
import Loading from '../../../components/Loading/Loading'
import Modal from '../../../components/Modal/Modal'
import styles from '../Admin.module.css'

const emptyForm = { tittle: '', description: '', body: '', image: null }

export default function AdminNews() {
  const { data: news, loading, error, refetch } = useFetch(newsService.getAll)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [editImages, setEditImages] = useState([])   // NewsImages jÃ¡ salvas
  const [newImages, setNewImages] = useState([])      // arquivos a enviar
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '')

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }))
  }

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm)
    setEditImages([])
    setNewImages([])
    setMsg(null)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditId(item.id)
    setForm({ tittle: item.tittle, description: item.description || '', body: item.body || '', image: null })
    setEditImages([])
    setNewImages([])
    setMsg(null)
    // Busca imagens jÃ¡ associadas
    newsService.getById(item.id).then(({ data }) => {
      setEditImages(data.images || [])
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    if (submitting || uploading) return
    setModalOpen(false)
    setEditId(null)
    setForm(emptyForm)
    setEditImages([])
    setNewImages([])
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

      const payload = { tittle: form.tittle, description: form.description, body: form.body }
      if (image_url) payload.image_url = image_url

      let savedId = editId
      if (editId) {
        await newsService.update(editId, payload)
      } else {
        const { data } = await newsService.create(payload)
        savedId = data.id
      }

      // Envia imagens extras se houver
      if (newImages.length > 0) {
        setUploading(true)
        await newsService.addImages(savedId, newImages)
        setUploading(false)
      }

      setMsg(editId ? 'NotÃ­cia atualizada com sucesso.' : 'NotÃ­cia criada com sucesso.')
      setForm(emptyForm)
      setEditId(null)
      setNewImages([])
      refetch()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erro ao salvar notÃ­cia.')
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

  const handleDeleteImage = async (imageId) => {
    if (!confirm('Remover esta imagem?')) return
    try {
      await newsService.deleteImage(editId, imageId)
      setEditImages((imgs) => imgs.filter((i) => i.id !== imageId))
    } catch {
      alert('Erro ao remover imagem.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deseja deletar esta notÃ­cia?')) return
    try {
      await newsService.delete(id)
      refetch()
    } catch {
      alert('Erro ao deletar notÃ­cia.')
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Gerenciar NotÃ­cias</h1>
        <button className={styles.btnNew} onClick={openCreate}>+ Nova NotÃ­cia</button>
      </div>

      {loading ? <Loading /> : error ? <p className={styles.error}>{error}</p> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>TÃ­tulo</th>
              <th>DescriÃ§Ã£o</th>
              <th>AÃ§Ãµes</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id}>
                <td>{item.tittle}</td>
                <td>{item.description || 'â€”'}</td>
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
        title={editId ? 'Editar NotÃ­cia' : 'Nova NotÃ­cia'}
      >
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.fields}>
            <input name="tittle" value={form.tittle} onChange={handleChange} placeholder="TÃ­tulo" required />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="DescriÃ§Ã£o curta (subtÃ­tulo)" rows={3} />
            <textarea name="body" value={form.body} onChange={handleChange} placeholder="Texto completo da notÃ­cia" rows={8} />

            <label className={styles.fieldLabel}>Banner (imagem principal)</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} />

            <label className={styles.fieldLabel}>Imagens adicionais</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setNewImages(Array.from(e.target.files))}
            />
            {newImages.length > 0 && (
              <p className={styles.hint}>{newImages.length} imagem(ns) selecionada(s)</p>
            )}
          </div>

          {/* Imagens jÃ¡ salvas (sÃ³ no modo ediÃ§Ã£o) */}
          {editId && editImages.length > 0 && (
            <div className={styles.imageGrid}>
              {editImages.map((img) => (
                <div key={img.id} className={styles.imageThumbWrap}>
                  <img src={`${apiUrl}${img.image_url}`} alt="" className={styles.imageThumb} />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={() => handleDeleteImage(img.id)}
                  >âœ•</button>
                </div>
              ))}
            </div>
          )}

          {msg && <p className={styles.msg}>{msg}</p>}
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnSave} disabled={submitting || uploading}>
              {uploading ? 'Enviando imagens...' : submitting ? 'Salvando...' : editId ? 'Atualizar' : 'Criar'}
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