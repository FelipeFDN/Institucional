import { Link } from 'react-router-dom'
import { getApiUrl } from '../../utils/apiUrl'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const apiUrl = getApiUrl()

  return (
    <Link to={`/produtos/${product.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        {product.image_url ? (
          <img src={`${apiUrl}${product.image_url}`} alt={product.name} />
        ) : (
          <div className={styles.noImage}>Sem imagem</div>
        )}
      </div>
      <div className={styles.body}>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
      </div>
    </Link>
  )
}
