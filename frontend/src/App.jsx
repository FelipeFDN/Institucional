import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

// Layouts
import PublicLayout from './layouts/PublicLayout/PublicLayout'
import AdminLayout from './layouts/AdminLayout/AdminLayout'

// Páginas públicas
import Home from './pages/Home/Home'
import Products from './pages/Products/Products'
import ProductDetail from './pages/Products/ProductDetail'
import News from './pages/News/News'
import NewsDetail from './pages/News/NewsDetail'
import About from './pages/About/About'
import Login from './pages/Login/Login'

// Páginas admin
import AdminUsers from './pages/Admin/Users/AdminUsers'
import AdminProducts from './pages/Admin/Products/AdminProducts'
import AdminProductClasses from './pages/Admin/ProductClasses/AdminProductClasses'
import AdminNews from './pages/Admin/News/AdminNews'
import AdminHighlights from './pages/Admin/Highlights/AdminHighlights'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
          {/* Rotas Públicas */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/produtos/:id" element={<ProductDetail />} />
            <Route path="/novidades" element={<News />} />
            <Route path="/novidades/:id" element={<NewsDetail />} />
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
            <Route path="classes" element={<AdminProductClasses />} />
            <Route path="noticias" element={<AdminNews />} />
            <Route path="destaques" element={<AdminHighlights />} />
          </Route>
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
