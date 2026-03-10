import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from './HeroCarousel.module.css'

export default function HeroCarousel({ slides = [] }) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  const prev = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
  }

  // Autoplay
  useEffect(() => {
    if (slides.length <= 1 || paused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [slides.length, paused, next])

  if (!slides.length) return null

  const slide = slides[current]
  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || ''

  return (
    <div
      className={styles.hero}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`${styles.slide} ${i === current ? styles.active : ''}`}
          style={{
            backgroundImage: s.image_url
              ? `url(${apiUrl}${s.image_url})`
              : 'none',
          }}
        />
      ))}

      {/* Overlay escuro */}
      <div className={styles.overlay} />

      {/* Conteúdo central */}
      <div className={styles.content}>
        {slide.tittle && <h1 className={styles.title}>{slide.tittle}</h1>}
        {slide.description && <p className={styles.description}>{slide.description}</p>}
        {slide.redirect_url && (
          <Link
            to={slide.redirect_url.startsWith('http') ? slide.redirect_url : slide.redirect_url}
            className={styles.cta}
            {...(slide.redirect_url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            Saiba mais
          </Link>
        )}
      </div>

      {/* Setas de navegação */}
      {slides.length > 1 && (
        <>
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Anterior">
            ‹
          </button>
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Próximo">
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
