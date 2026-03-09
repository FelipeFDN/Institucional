import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { newsService } from '../../services/newsService'
import Loading from '../../components/Loading/Loading'
import styles from './NewsDetail.module.css'

export default function NewsDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '')

  useEffect(() => {
    newsService.getById(id)
      .then(({ data }) => setItem(data))
      .catch(() => setError('Notícia não encontrada.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className={styles.page}><Loading /></div>
  if (error) return <div className={styles.page}><p className={styles.error}>{error}</p></div>

  const date = item.created_at
    ? new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : ''

  const extraImages = item.images || []

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/novidades" className={styles.back}>← Voltar às novidades</Link>

        <article className={styles.article}>
          {/* Banner */}
          {item.image_url && (
            <div className={styles.imageWrapper}>
              <img src={`${apiUrl}${item.image_url}`} alt={item.tittle} />
            </div>
          )}

          <header className={styles.header}>
            {date && <span className={styles.date}>{date}</span>}
            <h1>{item.tittle}</h1>
            {item.description && (
              <p className={styles.description}>{item.description}</p>
            )}
          </header>

          {item.body && (
            <div className={styles.body}>
              {item.body.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}

          {/* Imagens adicionais */}
          {extraImages.length > 0 && (
            <div className={styles.gallery}>
              {extraImages.map((img) => (
                <div key={img.id} className={styles.galleryItem}>
                  <img src={`${apiUrl}${img.image_url}`} alt="" />
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
