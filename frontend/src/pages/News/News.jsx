import NewsCard from '../../components/NewsCard/NewsCard'
import Loading from '../../components/Loading/Loading'
import { useFetch } from '../../hooks/useFetch'
import { newsService } from '../../services/newsService'
import styles from './News.module.css'

export default function News() {
  const { data: news, loading, error } = useFetch(newsService.getAll)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Novidades</h1>

        {loading && <Loading />}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className={styles.grid}>
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        )}

        {!loading && !news.length && (
          <p className={styles.empty}>Nenhuma novidade encontrada.</p>
        )}
      </div>
    </div>
  )
}
