import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import Loading from '../../components/Loading/Loading'
import { useFetch } from '../../hooks/useFetch'
import { productService } from '../../services/productService'
import { productClassesService } from '../../services/productClassesService'
import styles from './Products.module.css'

export default function Products() {
  const { data: products, loading: loadingProducts, error: errorProducts } = useFetch(productService.getAll)
  const { data: classes, loading: loadingClasses } = useFetch(productClassesService.getAll)
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeClass, setActiveClass] = useState(null)

  // Sincroniza o filtro com o query param ?classe=
  useEffect(() => {
    const classeParam = searchParams.get('classe')
    setActiveClass(classeParam || null)
  }, [searchParams])

  const handleFilter = (id) => {
    if (id) setSearchParams({ classe: id })
    else setSearchParams({})
    setActiveClass(id)
  }

  const loading = loadingProducts || loadingClasses
  const error = errorProducts

  const filtered = activeClass
    ? products.filter((p) => p.class === activeClass)
    : products

  const sections = activeClass
    ? [{ classObj: classes.find((c) => c.id === activeClass), items: filtered }].filter(s => s.classObj)
    : classes.map((c) => ({
        classObj: c,
        items: products.filter((p) => p.class === c.id),
      })).filter((s) => s.items.length > 0)

  const unclassified = products.filter((p) => !p.class)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Nossos Produtos</h1>

        {loading && <Loading />}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className={styles.layout}>
            {/* Sidebar lateral esquerda */}
            {classes.length > 0 && (
              <aside className={styles.sidebar}>
                <h3 className={styles.sidebarTitle}>Categorias</h3>
                <ul className={styles.filterList}>
                  <li>
                    <button
                      className={`${styles.filterBtn} ${activeClass === null ? styles.active : ''}`}
                      onClick={() => handleFilter(null)}
                    >
                      Todos os produtos
                    </button>
                  </li>
                  {classes.map((c) => (
                    <li key={c.id}>
                      <button
                        className={`${styles.filterBtn} ${activeClass === c.id ? styles.active : ''}`}
                        onClick={() => handleFilter(c.id)}
                      >
                        {c.tittle}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            {/* Conteúdo principal */}
            <div className={styles.content}>
              {/* Seções por classe */}
              {sections.map(({ classObj, items }) => (
                <section key={classObj.id} className={styles.section}>
                  <h2 className={styles.sectionTitle}>{classObj.tittle}</h2>
                  <div className={styles.grid}>
                    {items.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              ))}

              {/* Produtos sem classe (só "Todos") */}
              {!activeClass && unclassified.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Outros</h2>
                  <div className={styles.grid}>
                    {unclassified.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              )}

              {!products.length && (
                <p className={styles.empty}>Nenhum produto encontrado.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}