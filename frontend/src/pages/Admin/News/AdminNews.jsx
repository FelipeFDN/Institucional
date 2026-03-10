import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { newsService } from '../../../services/newsService'
import { imageService } from '../../../services/imageService'
import Loading from '../../../components/Loading/Loading'
import Modal from '../../../components/Modal/Modal'
import ImagePicker from '../../../components/ImagePicker/ImagePicker'
import { useToast } from '../../../contexts/ToastContext'
import { getApiUrl } from '../../../utils/apiUrl'
import styles from '../Admin.module.css'

const emptyForm = { tittle: '', description: '', body: '', image: null, currentImageUrl: null }

export default function AdminNews() {
  const { data: news, loading, error, refetch } = useFetch(newsService.getAll)
  const toast = useToast()
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [editImages, setEditImages] = useState([])
  const [newImages, setNewImages] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState(null)

  const apiUrl = getApiUrl()

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
    setForm({
      tittle: item.tittle,
      description: item.description || '',
      body: item.body || '',
      image: null,
      currentImageUrl: item.image_url ? `${apiUrl}${item.image_url}` : null,
    })
    setEditImages([])
    setNewImages([])
    setMsg(null)
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
      if (!image_url && form.currentImageUrl === null && editId) payload.image_url = null

      let savedId = editId
      if (editId) {
        await newsService.update(editId, payload)
      } else {
        const { data } = await newsService.create(payload)
        savedId = data.id
      }

      if (newImages.length > 0) {
        setUploading(true)
        await newsService.addImages(savedId, newImages)
        setUploading(false)
      }

      refetch()
      toast(editId ? 'Notícia atualizada com sucesso.' : 'Notícia criada com sucesso.')
      closeModal()
    } catch (err) {
      toast(err.response?.data?.message || 'Erro ao salvar notícia.', 'error')
      setMsg(err.response?.data?.message || 'Erro ao salvar notícia.')
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
      toast('Imagem removida.')
    } catch {
      toast('Erro ao remover imagem.', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deseja deletar esta notícia?')) return
    try {
      await newsService.delete(id)
      toast('Notícia deletada.')
      refetch()
    } catch {
      toast('Erro ao deletar notícia.', 'error')
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
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descrição curta (subtítulo)" rows={3} />
            <textarea name="body" value={form.body} onChange={handleChange} placeholder="Texto completo da notícia" rows={8} />
          </div>

          <ImagePicker
            label="Banner (imagem principal)"
            currentUrl={form.currentImageUrl}
            file={form.image}
            onChange={(f) => setForm((prev) => ({ ...prev, image: f }))}
            onRemoveCurrent={() => setForm((prev) => ({ ...prev, currentImageUrl: null }))}
          />

          {/* Imagens adicionais da galeria */}
          <div style={{ marginTop: '1rem' }}>
            {editImages.length > 0 && (
              <>
                <span className={styles.fieldLabel}>Galeria atual</span>
                <div className={styles.imageGrid} style={{ marginTop: '0.4rem' }}>
                  {editImages.map((img) => (
                    <div key={img.id} className={styles.imageThumbWrap}>
                      <img src={`${apiUrl}${img.image_url}`} alt="" className={styles.imageThumb} />
                      <button
                        type="button"
                        className={styles.removeImageBtn}
                        onClick={() => handleDeleteImage(img.id)}
                      >✕</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <ImagePicker
              label="Adicionar à galeria"
              files={newImages}
              onChange={(files) => setNewImages(files)}
              multiple
            />
          </div>

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