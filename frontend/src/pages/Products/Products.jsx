import ProductCard from '../../components/ProductCard/ProductCard'
import Loading from '../../components/Loading/Loading'
import { useFetch } from '../../hooks/useFetch'
import { productService } from '../../services/productService'
import styles from './Products.module.css'

export default function Products() {
  const { data: products, loading, error } = useFetch(productService.getAll)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Nossos Produtos</h1>

        {loading && <Loading />}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && !products.length && (
          <p className={styles.empty}>Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  )
}
