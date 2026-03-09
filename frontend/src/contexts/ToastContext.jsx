import { createContext, useCallback, useContext, useState } from 'react'
import Toast from '../components/Toast/Toast'

const ToastContext = createContext(null)

/**
 * Provê a função `toast(message, type?)` para qualquer filho.
 * Renderiza a pilha de toasts no canto inferior direito.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => remove(t.id)}
        />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
