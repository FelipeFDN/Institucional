export const getApiUrl = () => {
  const raw = import.meta.env.VITE_API_URL || ''
  return raw.replace('/api', '').replace(/^['""]|['""]$/g, '').trim()
}
