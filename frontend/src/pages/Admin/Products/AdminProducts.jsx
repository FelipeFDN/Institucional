import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { productService } from '../../../services/productService'
import { imageService } from '../../../services/imageService'
import Loading from '../../../components/Loading/Loading'
import Modal from '../../../components/Modal/Modal'
import styles from '../Admin.module.css'

const emptyForm = { name: '', description: '', image: null }

export default function AdminProducts() {
  const { data: products, loading, error, refetch } = useFetch(productService.getAll)
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

  const openEdit = (product) => {
    setEditId(product.id)
    setForm({ name: product.name, description: product.description || '', image: null })
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

      if (editId) {
        const updateData = { name: form.name, description: form.description }
        if (image_url) updateData.image_url = image_url
        await productService.update(editId, updateData)
        setMsg('Produto atualizado com sucesso.')
      } else {
        await productService.create({ name: form.name, description: form.description, image_url })
        setMsg('Produto criado com sucesso.')
      }
      setForm(emptyForm)
      setEditId(null)
      refetch()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erro ao salvar produto.')
    } finally {
      setSubmitting(false)
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deseja deletar este produto?')) return
    try {
      await productService.delete(id)
      refetch()
    } catch {
      alert('Erro ao deletar produto.')
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Gerenciar Produtos</h1>
        <button className={styles.btnNew} onClick={openCreate}>+ Novo Produto</button>
      </div>

      {loading ? <Loading /> : error ? <p className={styles.error}>{error}</p> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image_url
                    ? <img src={`${apiUrl}${p.image_url}`} alt={p.name} className={styles.thumb} />
                    : '—'
                  }
                </td>
                <td>{p.name}</td>
                <td>{p.description || '—'}</td>
                <td className={styles.actions}>
                  <button className={styles.btnEdit} onClick={() => openEdit(p)}>Editar</button>
                  <button className={styles.btnDelete} onClick={() => handleDelete(p.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editId ? 'Editar Produto' : 'Novo Produto'}
      >
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.fields}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" required />
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
