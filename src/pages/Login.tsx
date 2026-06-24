import { useState, ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, Eye, EyeOff, AlertCircle, Loader2, UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/Logo'

export default function Login() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { signIn, signUp, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/', { replace: true })
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return }

    setLoading(true)
    setError(null)
    setSuccess(null)

    if (mode === 'signin') {
      const { error: err } = await signIn(email, password)
      if (err) {
        setError(
          err.message?.includes('Invalid login credentials')
            ? 'Email ou mot de passe incorrect.'
            : err.message || 'Erreur de connexion.'
        )
      } else {
        navigate('/')
      }
    } else {
      const { error: err } = await signUp(email, password)
      if (err) {
        setError(
          err.message?.includes('already registered')
            ? 'Un compte avec cet email existe déjà.'
            : err.message || 'Erreur lors de l\'inscription.'
        )
      } else {
        setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.')
        setMode('signin')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gold-500" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-danger-500" />
        </div>

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <Logo size="md" variant="white" />
          <div>
            <div className="text-white font-bold text-xl">CONGO ESPOIR</div>
            <div className="text-gold-400 text-xs tracking-widest uppercase">Justice · Patriotisme · Social</div>
          </div>
        </Link>

        <div className="relative z-10">
          <blockquote className="text-white/80 text-xl leading-relaxed italic mb-6">
            "L'adhésion au Congo Espoir, c'est choisir de bâtir un avenir meilleur pour notre République Démocratique du Congo."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-0.5 bg-gold-400" />
            <p className="text-gold-400 text-sm font-semibold">Maître JOSE MPANDA KABANGU</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          {[
            { value: '2005', label: 'Fondé en' },
            { value: '26+', label: 'Provinces' },
            { value: '50K+', label: 'Membres' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold font-serif text-gold-400">{stat.value}</div>
              <div className="text-white/50 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Logo size="lg" />
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h1 className="font-serif text-2xl font-bold text-gray-900 mb-1">
              {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {mode === 'signin'
                ? 'Accédez à votre espace membre Congo Espoir.'
                : 'Créez votre compte pour suivre votre adhésion.'}
            </p>

            {/* Tab switcher */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => { setMode('signin'); setError(null); setSuccess(null) }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === 'signin' ? 'bg-white text-primary-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LogIn size={14} className="inline mr-1.5" />
                Se connecter
              </button>
              <button
                onClick={() => { setMode('signup'); setError(null); setSuccess(null) }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === 'signup' ? 'bg-white text-primary-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserPlus size={14} className="inline mr-1.5" />
                S'inscrire
              </button>
            </div>

            {success && (
              <div className="flex items-center gap-2 bg-success-50 border border-success-200 text-success-700 rounded-xl p-4 mb-4 text-sm">
                <AlertCircle size={15} className="shrink-0" />
                {success}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 bg-danger-50 border border-danger-200 text-danger-700 rounded-xl p-4 mb-4 text-sm">
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Adresse email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setError(null) }}
                  required
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); setError(null) }}
                    required
                    placeholder="Votre mot de passe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 justify-center text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : (mode === 'signin' ? <LogIn size={18} /> : <UserPlus size={18} />)}
                {mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-6">
              Vous souhaitez rejoindre le parti ?{' '}
              <Link to="/adhesion" className="text-primary-600 hover:text-primary-800 font-semibold transition-colors">
                Faire une demande d'adhésion
              </Link>
            </p>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            © {new Date().getFullYear()} Congo Espoir · Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  )
}
