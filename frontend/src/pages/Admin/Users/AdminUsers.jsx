import { useState } from 'react'
import { useFetch } from '../../../hooks/useFetch'
import { userService } from '../../../services/userService'
import Loading from '../../../components/Loading/Loading'
import Modal from '../../../components/Modal/Modal'
import styles from '../Admin.module.css'

const emptyForm = { name: '', email: '', password: '' }

export default function AdminUsers() {
  const { data: users, loading, error, refetch } = useFetch(userService.getAll)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState(null)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm)
    setMsg(null)
    setModalOpen(true)
  }

  const openEdit = (user) => {
    setEditId(user.id)
    setForm({ name: user.name, email: user.email, password: '' })
    setMsg(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (submitting) return
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
      if (editId) {
        await userService.update(editId, { name: form.name, email: form.email })
        setMsg('Usuário atualizado com sucesso.')
      } else {
        await userService.create(form)
        setMsg('Usuário criado com sucesso.')
      }
      setForm(emptyForm)
      setEditId(null)
      refetch()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erro ao salvar usuário.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deseja deletar este usuário?')) return
    try {
      await userService.delete(id)
      refetch()
    } catch {
      alert('Erro ao deletar usuário.')
    }
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Gerenciar Usuários</h1>
        <button className={styles.btnNew} onClick={openCreate}>+ Novo Usuário</button>
      </div>

      {loading ? <Loading /> : error ? <p className={styles.error}>{error}</p> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className={styles.actions}>
                  <button className={styles.btnEdit} onClick={() => openEdit(u)}>Editar</button>
                  <button className={styles.btnDelete} onClick={() => handleDelete(u.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editId ? 'Editar Usuário' : 'Novo Usuário'}
      >
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.fields}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Nome" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            {!editId && (
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Senha" required />
            )}
          </div>
          {msg && <p className={styles.msg}>{msg}</p>}
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnSave} disabled={submitting}>
              {submitting ? 'Salvando...' : editId ? 'Atualizar' : 'Criar'}
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