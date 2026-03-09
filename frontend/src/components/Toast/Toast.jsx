import { useEffect, useState } from 'react'
import styles from './Toast.module.css'

/**
 * Toast — notificação temporária no canto da tela.
 * Props:
 *  - message : string
 *  - type    : 'success' | 'error'
 *  - onClose : () => void  (chamado ao fim da animação)
 */
export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Começa a sair depois de 3s
    const hideTimer = setTimeout(() => setVisible(false), 3000)
    // Remove do DOM depois da animação de saída (300ms)
    const removeTimer = setTimeout(() => onClose(), 3300)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [onClose])

  return (
    <div className={`${styles.toast} ${styles[type]} ${visible ? styles.show : styles.hide}`}>
      <span className={styles.icon}>
        {type === 'success' ? '✓' : '✕'}
      </span>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={() => { setVisible(false); setTimeout(onClose, 300) }}>
        ✕
      </button>
    </div>
  )
}
