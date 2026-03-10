import { Link } from 'react-router-dom'
import { getApiUrl } from '../../utils/apiUrl'
import styles from './NewsCard.module.css'

export default function NewsCard({ news }) {
  const apiUrl = getApiUrl()
  let date = ''
  if (news.created_at) {
    const d = new Date(news.created_at)
    date = isNaN(d.getTime())
      ? ''
      : d.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
  }

  return (
    <Link to={`/novidades/${news.id}`} className={styles.card}>
      {news.image_url && (
        <img src={`${apiUrl}${news.image_url}`} alt={news.tittle} className={styles.image} />
      )}
      <div className={styles.body}>
        <span className={styles.date}>{date}</span>
        <h3>{news.tittle}</h3>
        <p>{news.description}</p>
      </div>
    </Link>
  )
}
