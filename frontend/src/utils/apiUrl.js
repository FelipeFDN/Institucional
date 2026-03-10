/**
 * Retorna a URL base do servidor (sem /api e sem aspas acidentais do .env).
 * Uso: import { getApiUrl } from '../../utils/apiUrl'
 */
export const getApiUrl = () => {
  const raw = import.meta.env.VITE_API_URL || ''
  return raw.replace('/api', '').replace(/^['"]|['"]$/g, '').trim()
}
