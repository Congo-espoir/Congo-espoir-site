import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Values from './pages/Values'
import News from './pages/News'
import NewsArticle from './pages/NewsArticle'
import Adhesion from './pages/Adhesion'
import Admin from './pages/Admin'
import Login from './pages/Login'
import { ReactNode } from 'react'

function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-700 border-t-transparent" />
      </div>
    )
  }

  if (!user) return <Navigate to="/connexion" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/valeurs" element={<Layout><Values /></Layout>} />
      <Route path="/actualites" element={<Layout><News /></Layout>} />
      <Route path="/actualites/:id" element={<Layout><NewsArticle /></Layout>} />
      <Route path="/adhesion" element={<Layout><Adhesion /></Layout>} />
      <Route path="/connexion" element={<Layout><Login /></Layout>} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <Layout><Admin /></Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
