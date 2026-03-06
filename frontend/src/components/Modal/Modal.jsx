import { useEffect } from 'react'
import styles from './Modal.module.css'

export default function Modal({ isOpen, onClose, title, children }) {
  // Fecha com ESC
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Trava o scroll do body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  )
}
