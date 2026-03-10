import Carousel from '../../components/Carousel/Carousel'
import HeroCarousel from '../../components/HeroCarousel/HeroCarousel'
import NewsCard from '../../components/NewsCard/NewsCard'
import Loading from '../../components/Loading/Loading'
import { useFetch } from '../../hooks/useFetch'
import { productClassesService } from '../../services/productClassesService'
import { newsService } from '../../services/newsService'
import { highlightService } from '../../services/highlightService'
import styles from './Home.module.css'

export default function Home() {
  const { data: classes, loading: loadingClasses } = useFetch(productClassesService.getAll)
  const { data: news, loading: loadingNews } = useFetch(newsService.getAll)
  const { data: highlights, loading: loadingHighlights } = useFetch(highlightService.getAll)

  return (
    <div>
      {/* ── Hero / Destaques ───────────────────────── */}
      {!loadingHighlights && highlights.length > 0 && (
        <HeroCarousel slides={highlights} />
      )}

      {/* ── Categorias de Produtos ─────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Nossos Produtos</h2>
          <p className={styles.sectionSubtitle}>
            Explore nossa linha completa de produtos organizados por categoria.
            Encontre exatamente o que você precisa com qualidade e variedade garantidas.
          </p>
          {loadingClasses ? (
            <Loading />
          ) : (
            <Carousel items={classes} />
          )}
        </div>
      </section>

      {/* ── Novidades ─────────────────────────────── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Novidades</h2>
          <p className={styles.sectionSubtitle}>
            Fique por dentro das últimas notícias, lançamentos e acontecimentos.
            Publicamos regularmente conteúdo relevante para você.
          </p>
          {loadingNews ? (
            <Loading />
          ) : (
            <div className={styles.grid}>
              {news.slice(0, 3).map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

