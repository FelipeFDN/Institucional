import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Footer.module.css'

export default function Footer() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.info}>
          <h3>Institucional</h3>
          <p>Sua empresa de confiança</p>
        </div>

        <div className={styles.contact}>
          <h4>Contato</h4>
          <p>📞 (11) 99999-9999</p>
          <p>✉️ contato@empresa.com.br</p>
          <p>📍 Rua Exemplo, 123 – São Paulo, SP</p>
        </div>

        <div className={styles.social}>
          <h4>Redes Sociais</h4>
          <div className={styles.socialLinks}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>

        <div className={styles.admin}>
          <h4>Acesso</h4>
          {isAuthenticated ? (
            <>
              <Link to="/admin" className={styles.btnAdmin}>Painel Admin</Link>
              <button className={styles.btnLogout} onClick={logout}>Sair</button>
            </>
          ) : (
            <Link to="/login" className={styles.btnAdmin}>Área Restrita</Link>
          )}
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Institucional. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
