import { useState, useEffect } from 'react'

/**
 * Hook genérico para buscar dados de uma função de serviço
 * @param {Function} fetchFn - Função que retorna uma Promise (ex: productService.getAll)
 */
export function useFetch(fetchFn) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetchFn()
      setData(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao carregar dados.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  return { data, loading, error, refetch: fetch }
}
