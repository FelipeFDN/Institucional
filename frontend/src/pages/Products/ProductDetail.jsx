import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { productService } from '../../services/productService'
import Loading from '../../components/Loading/Loading'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL?.replace('/api', '')

  useEffect(() => {
    productService.getById(id)
      .then(({ data }) => setProduct(data))
      .catch(() => setError('Produto não encontrado.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className={styles.page}><Loading /></div>
  if (error) return <div className={styles.page}><p className={styles.error}>{error}</p></div>

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link to="/produtos" className={styles.back}>← Voltar aos produtos</Link>

        <div className={styles.content}>
          {product.image_url && (
            <div className={styles.imageWrapper}>
              <img src={`${apiUrl}${product.image_url}`} alt={product.name} />
            </div>
          )}

          <div className={styles.info}>
            <h1>{product.name}</h1>
            {product.description && (
              <p className={styles.description}>{product.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
