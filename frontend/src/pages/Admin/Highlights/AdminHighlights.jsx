import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { highlightService } from '../../../services/highlightService'
import { imageService } from '../../../services/imageService'
import Loading from '../../../components/Loading/Loading'
import Modal from '../../../components/Modal/Modal'
import ImagePicker from '../../../components/ImagePicker/ImagePicker'
import { useToast } from '../../../contexts/ToastContext'
import { getApiUrl } from '../../../utils/apiUrl'
import styles from '../Admin.module.css'

const emptyForm = {
  tittle: '',
  description: '',
  redirect_url: '',
  order: 0,
  active: true,
  image: null,
  currentImageUrl: null,
}

export default function AdminHighlights() {
  const { data: highlights, loading, error, refetch } = useFetch(highlightService.getAllAdmin)
  const toast = useToast()
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState(null)

  const apiUrl = getApiUrl()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm)
    setMsg(null)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditId(item.id)
    setForm({
      tittle: item.tittle || '',
      description: item.description || '',
      redirect_url: item.redirect_url || '',
      order: item.order ?? 0,
      active: item.active ?? true,
      image: null,
      currentImageUrl: item.image_url ? `${apiUrl}${item.image_url}` : null,
    })
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

      const payload = {
        tittle: form.tittle || null,
        description: form.description || null,
        redirect_url: form.redirect_url || null,
        order: Number(form.order) || 0,
        active: form.active,
      }
      if (image_url) payload.image_url = image_url
      if (!image_url && form.currentImageUrl === null && editId) payload.image_url = null

      if (editId) {
        await highlightService.update(editId, payload)
        toast('Destaque atualizado com sucesso.')
      } else {
        await highlightService.create(payload)
        toast('Destaque criado com sucesso.')
      }
      refetch()
      closeModal()
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao salvar destaque.'
      toast(message, 'error')
      setMsg(message)
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deseja deletar este destaque?')) return
    try {
      await highlightService.delete(id)
      toast('Destaque deletado.')
      refetch()
    } catch {
      toast('Erro ao deletar destaque.', 'error')
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Destaques (Carrossel)</h1>
        <button className={styles.btnNew} onClick={openCreate}>+ Novo Destaque</button>
      </div>

      {loading ? <Loading /> : error ? <p className={styles.error}>{error}</p> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Título</th>
              <th>Descrição</th>
              <th>Link</th>
              <th>Ordem</th>
              <th>Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {highlights.map((h) => (
              <tr key={h.id}>
                <td>
                  {h.image_url
                    ? <img src={`${apiUrl}${h.image_url}`} alt={h.tittle || ''} className={styles.thumb} />
                    : '—'
                  }
                </td>
                <td>{h.tittle || '—'}</td>
                <td>{h.description || '—'}</td>
                <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {h.redirect_url || '—'}
                </td>
                <td>{h.order}</td>
                <td>{h.active ? '✅' : '❌'}</td>
                <td className={styles.actions}>
                  <button className={styles.btnEdit} onClick={() => openEdit(h)}>Editar</button>
                  <button className={styles.btnDelete} onClick={() => handleDelete(h.id)}>Deletar</button>
                </td>
              </tr>
            ))}
            {highlights.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  Nenhum destaque cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editId ? 'Editar Destaque' : 'Novo Destaque'}
      >
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.fields}>
            <input
              name="tittle"
              value={form.tittle}
              onChange={handleChange}
              placeholder="Título (exibido sobre a imagem)"
            />
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descrição / subtítulo"
            />
            <input
              name="redirect_url"
              value={form.redirect_url}
              onChange={handleChange}
              placeholder="Link do botão (ex: /produtos ou https://...)"
            />
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
                <span className={styles.fieldLabel}>Ordem de exibição</span>
                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  min={0}
                  style={{ width: '100%' }}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '1.25rem' }}>
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  style={{ width: 16, height: 16 }}
                />
                <span className={styles.fieldLabel}>Ativo</span>
              </label>
            </div>
          </div>

          <ImagePicker
            label="Imagem de fundo do slide"
            currentUrl={form.currentImageUrl}
            file={form.image}
            onChange={(f) => setForm((prev) => ({ ...prev, image: f }))}
            onRemoveCurrent={() => setForm((prev) => ({ ...prev, currentImageUrl: null }))}
          />

          {msg && <p className={styles.msg} style={{ color: 'var(--danger)' }}>{msg}</p>}
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
