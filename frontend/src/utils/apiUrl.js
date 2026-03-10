/**
 * Retorna a URL base para montar caminhos de imagem (/uploads/...).
 *
 * As imagens são sempre referenciadas com URL relativa (/uploads/arquivo.jpg).
 * O proxy é resolvido por:
 *   - Docker local  → nginx.conf faz proxy de /uploads/* para backend:3000
 *   - Vercel        → vercel.json faz rewrite de /uploads/* para o Render
 */
export const getApiUrl = () => ''
