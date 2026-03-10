import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productClassesService } from '../../services/productClassesService'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [classes, setClasses] = useState([])

  useEffect(() => {
    productClassesService.getAll()
      .then(({ data }) => setClasses(data))
      .catch(() => {})
  }, [])

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src="/logotipo.png" alt="Logotipo" className={styles.logoImg} />
          <span>Institucional</span>
        </Link>

        {/* Botão hamburguer para mobile */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          ☰
        </button>

        {/* Links de navegação */}
        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>

          {/* Dropdown Produtos */}
          <li className={styles.dropdown}>
            <Link to="/produtos" onClick={() => setMenuOpen(false)}>
              Produtos <span className={styles.caret}>▾</span>
            </Link>
            {classes.length > 0 && (
              <ul className={styles.dropdownMenu}>
                <li>
                  <Link to="/produtos" onClick={() => setMenuOpen(false)}>
                    Todos os produtos
                  </Link>
                </li>
                {classes.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/produtos?classe=${c.id}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {c.tittle}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li><Link to="/novidades" onClick={() => setMenuOpen(false)}>Novidades</Link></li>
          <li><Link to="/sobre" onClick={() => setMenuOpen(false)}>Sobre Nós</Link></li>
        </ul>

        {/* Ações à direita */}
        <div className={styles.actions}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
        </div>
      </div>
    </nav>
  )
}
