import { useState } from 'react'
import styles from './Carousel.module.css'

export default function Carousel({ items = [] }) {
  const [current, setCurrent] = useState(0)

  if (!items.length) return null

  const prev = () => setCurrent((c) => (c === 0 ? items.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === items.length - 1 ? 0 : c + 1))

  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '')
  const item = items[current]

  return (
    <div className={styles.carousel}>
      <button className={`${styles.btn} ${styles.btnPrev}`} onClick={prev}>‹</button>

      <div className={styles.slide}>
        {item.image_url && (
          <img
            src={`${apiUrl}${item.image_url}`}
            alt={item.name}
            className={styles.image}
          />
        )}
        <div className={styles.overlay}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      </div>

      <button className={`${styles.btn} ${styles.btnNext}`} onClick={next}>›</button>

      {/* Indicadores */}
      <div className={styles.dots}>
        {items.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.active : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  )
}
