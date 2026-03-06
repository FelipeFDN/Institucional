import Carousel from '../../components/Carousel/Carousel'
import NewsCard from '../../components/NewsCard/NewsCard'
import Loading from '../../components/Loading/Loading'
import { useFetch } from '../../hooks/useFetch'
import { productService } from '../../services/productService'
import { newsService } from '../../services/newsService'
import styles from './Home.module.css'

export default function Home() {
  const { data: products, loading: loadingProducts } = useFetch(productService.getAll)
  const { data: news, loading: loadingNews } = useFetch(newsService.getAll)

  return (
    <div>
      {/* Carrossel de produtos */}
      <section className={styles.hero}>
        
        <div className={styles.carouselContainer}>
          {loadingProducts ? <Loading /> : <Carousel items={products} />}
        </div>
      </section>

      {/* Seção de novidades */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Novidades</h2>
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
