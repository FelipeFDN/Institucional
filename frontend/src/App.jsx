import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

// Layouts
import PublicLayout from './layouts/PublicLayout/PublicLayout'
import AdminLayout from './layouts/AdminLayout/AdminLayout'

// Páginas públicas
import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import News from './pages/News/News'
import About from './pages/About/About'
import Login from './pages/Login/Login'

// Páginas admin
import AdminUsers from './pages/Admin/Users/AdminUsers'
import AdminProducts from './pages/Admin/Products/AdminProducts'
import AdminNews from './pages/Admin/News/AdminNews'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/novidades" element={<News />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Rotas Privadas (Admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/produtos" replace />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="produtos" element={<AdminProducts />} />
            <Route path="noticias" element={<AdminNews />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
