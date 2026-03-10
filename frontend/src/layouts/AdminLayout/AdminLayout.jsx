import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './AdminLayout.module.css'

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span>Painel Admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          <NavLink to="/admin/usuarios" className={({ isActive }) => isActive ? styles.active : ''}>
            👤 Usuários
          </NavLink>
          <NavLink to="/admin/produtos" className={({ isActive }) => isActive ? styles.active : ''}>
            📦 Produtos
          </NavLink>
          <NavLink to="/admin/classes" className={({ isActive }) => isActive ? styles.active : ''}>
            🏷️ Classes de Produtos
          </NavLink>
          <NavLink to="/admin/noticias" className={({ isActive }) => isActive ? styles.active : ''}>
            📰 Notícias
          </NavLink>
          <NavLink to="/admin/destaques" className={({ isActive }) => isActive ? styles.active : ''}>
            🌟 Destaques
          </NavLink>
        </nav>
        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.backBtn}>
            🏠 Ver site
          </Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
