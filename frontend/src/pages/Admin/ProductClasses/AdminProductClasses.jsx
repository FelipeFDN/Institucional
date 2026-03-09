import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { productClassesService } from '../../../services/productClassesService'
import { imageService } from '../../../services/imageService'
import Loading from '../../../components/Loading/Loading'
import Modal from '../../../components/Modal/Modal'
import ImagePicker from '../../../components/ImagePicker/ImagePicker'
import { useToast } from '../../../contexts/ToastContext'
import styles from '../Admin.module.css'

const emptyForm = { name: '', image: null, currentImageUrl: null }

export default function AdminProductClasses() {
  const { data: classes, loading, error, refetch } = useFetch(productClassesService.getAll)
  const toast = useToast()
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
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
    setMsg(null)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditId(item.id)
    setForm({
      name: item.tittle,
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

      const payload = { name: form.name }
      if (image_url) payload.image_url = image_url
      if (!image_url && form.currentImageUrl === null && editId) payload.image_url = null

      if (editId) {
        await productClassesService.update(editId, payload)
        toast('Classe atualizada com sucesso.')
      } else {
        await productClassesService.create(payload)
        toast('Classe criada com sucesso.')
      }
      refetch()
      closeModal()
    } catch (err) {
      toast(err.response?.data?.message || 'Erro ao salvar classe.', 'error')
      setMsg(err.response?.data?.message || 'Erro ao salvar classe.')
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deseja deletar esta classe?')) return
    try {
      await productClassesService.delete(id)
      toast('Classe deletada.')
      refetch()
    } catch {
      toast('Erro ao deletar classe.', 'error')
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Classes de Produtos</h1>
        <button className={styles.btnNew} onClick={openCreate}>+ Nova Classe</button>
      </div>

      {loading ? <Loading /> : error ? <p className={styles.error}>{error}</p> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id}>
                <td>
                  {c.image_url
                    ? <img src={`${apiUrl}${c.image_url}`} alt={c.tittle} className={styles.thumb} />
                    : '—'
                  }
                </td>
                <td>{c.tittle}</td>
                <td className={styles.actions}>
                  <button className={styles.btnEdit} onClick={() => openEdit(c)}>Editar</button>
                  <button className={styles.btnDelete} onClick={() => handleDelete(c.id)}>Deletar</button>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Nenhuma classe cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editId ? 'Editar Classe' : 'Nova Classe'}
      >
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.fields}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nome da classe" required />
          </div>

          <ImagePicker
            label="Imagem da classe (opcional)"
            currentUrl={form.currentImageUrl}
            file={form.image}
            onChange={(f) => setForm((prev) => ({ ...prev, image: f }))}
            onRemoveCurrent={() => setForm((prev) => ({ ...prev, currentImageUrl: null }))}
          />
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
