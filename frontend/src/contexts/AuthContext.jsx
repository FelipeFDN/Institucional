import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verifica se há token salvo ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setUser({ token })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await authService.login(email, password)
    localStorage.setItem('token', data.token)
    setUser({ token: data.token, ...data.user })
    return data
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro do AuthProvider')
  return context
}
