import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getApiUrl } from '../../utils/apiUrl'
import styles from './Carousel.module.css'

/**
 * Carrossel de categorias — exibe múltiplos cards lado a lado.
 * Cada item: { id, tittle, image_url }
 */
export default function Carousel({ items = [] }) {
  const [offset, setOffset] = useState(0)

  // Quantos cards visiveis de acordo com a tela (CSS faz isso via scroll,
  // mas controlamos o passo de navegação)
  const STEP = 3

  if (!items.length) return null

  const canPrev = offset > 0
  const canNext = offset + STEP < items.length

  const prev = () => setOffset((o) => Math.max(0, o - STEP))
  const next = () => setOffset((o) => Math.min(items.length - STEP, o + STEP))

  const apiUrl = getApiUrl()

  // Slida o array visivel
  const visible = items.slice(offset, offset + STEP + 2) // renderiza alguns extras p/ transição suave

  return (
    <div className={styles.wrapper}>
      {/* Seta esquerda */}
      <button
        className={`${styles.arrow} ${styles.arrowLeft} ${!canPrev ? styles.hidden : ''}`}
        onClick={prev}
        aria-label="Anterior"
      >
        ‹
      </button>

      {/* Track deslizante */}
      <div className={styles.track}>
        <div
          className={styles.inner}
          style={{ transform: `translateX(calc(-${offset} * (var(--card-width) + var(--gap))))` }}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/produtos?classe=${item.id}`}
              className={styles.card}
            >
              <div className={styles.imageWrap}>
                {item.image_url ? (
                  <img
                    src={`${apiUrl}${item.image_url}`}
                    alt={item.tittle}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.placeholder}>
                    <span>📦</span>
                  </div>
                )}
                <div className={styles.cardOverlay} />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{item.tittle}</h3>
                <span className={styles.cardLink}>Ver produtos →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Seta direita */}
      <button
        className={`${styles.arrow} ${styles.arrowRight} ${!canNext ? styles.hidden : ''}`}
        onClick={next}
        aria-label="Próximo"
      >
        ›
      </button>

      {/* Dots de paginação */}
      {items.length > STEP && (
        <div className={styles.dots}>
          {Array.from({ length: Math.ceil(items.length / STEP) }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${Math.floor(offset / STEP) === i ? styles.dotActive : ''}`}
              onClick={() => setOffset(Math.min(i * STEP, items.length - STEP))}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
