import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogIn, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Logo from './Logo'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAdmin, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const isHome = location.pathname === '/'
  const isTransparent = isHome && !scrolled && !menuOpen

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const links = [
    { to: '/valeurs', label: 'Nos Valeurs' },
    { to: '/actualites', label: 'Actualités' },
    { to: '/adhesion', label: 'Adhérer' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
    }`}>
      {/* Top stripe - gold accent instead of party colors */}
      <div className="h-1 bg-gold-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size="sm" variant="white" />
            <div>
              <div className={`font-bold text-lg leading-tight tracking-wide transition-colors duration-300 ${
                isTransparent ? 'text-white' : 'text-gray-900'
              }`}>CONGO ESPOIR</div>
              <div className="text-gold-500 text-xs font-medium tracking-widest uppercase">Justice · Patriotisme · Social</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? isTransparent ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-900'
                    : isTransparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    <Shield size={14} />
                    Administration
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                    isTransparent
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <LogOut size={14} />
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/connexion"
                className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                  isTransparent
                    ? 'border border-white/40 hover:border-white text-white'
                    : 'border border-gray-300 hover:border-gray-900 text-gray-800 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <LogIn size={14} />
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-gray-100'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 shadow-lg">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-all duration-200 ${
                location.pathname === link.to
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 bg-gold-500 text-white text-sm font-semibold px-4 py-3 rounded-lg mb-1"
                  >
                    <Shield size={15} />
                    Administration
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 text-gray-600 text-sm px-4 py-3 rounded-lg hover:bg-gray-50"
                >
                  <LogOut size={15} />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                to="/connexion"
                className="flex items-center gap-2 text-gray-800 text-sm font-medium px-4 py-3 rounded-lg border border-gray-300"
              >
                <LogIn size={15} />
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
