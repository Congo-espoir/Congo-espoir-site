import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Calendar, User, ArrowRight, Tag, ExternalLink } from 'lucide-react'
import { supabase, Article } from '../lib/supabase'
import fallbackNewsImage from '../medias/actualites/bob-ditend-chez-mbata.jpg'

const CATEGORIES = [
  { value: '', label: 'Tout' },
  { value: 'actualite', label: 'Actualités' },
  { value: 'communique', label: 'Communiqués' },
  { value: 'evenement', label: 'Événements' },
]

const categoryColors: Record<string, string> = {
  actualite: 'bg-gray-100 text-gray-700',
  communique: 'bg-gold-100 text-gold-700',
  evenement: 'bg-red-100 text-red-700',
}

const categoryBadgeColors: Record<string, string> = {
  actualite: 'bg-gray-800',
  communique: 'bg-gold-500',
  evenement: 'bg-red-600',
}

const categoryLabels: Record<string, string> = {
  actualite: 'Actualité',
  communique: 'Communiqué',
  evenement: 'Événement',
}

const formatArticleDate = (article: Article, options: Intl.DateTimeFormatOptions) =>
  new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR', options)

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link to={`/actualites/${article.id}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 card-hover">
      <div className="aspect-[16/9] overflow-hidden relative">
        <img
          src={article.image_url || fallbackNewsImage}
          alt={article.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1.5 rounded-full ${categoryBadgeColors[article.categorie] || 'bg-primary-600'}`}>
          {categoryLabels[article.categorie] || article.categorie}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
          {article.titre}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">{article.resume}</p>
        <div className="flex items-center justify-between gap-3 text-xs text-gray-400 border-t border-gray-100 pt-3 mt-auto">
          <div className="flex items-center gap-1.5">
            <User size={12} />
            <span>{article.auteur}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>{formatArticleDate(article, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Link
      to={`/actualites/${article.id}`}
      className="group relative rounded-2xl overflow-hidden shadow-xl block mb-8 card-hover"
    >
      <div className="aspect-[21/9] relative overflow-hidden">
        <img
          src={article.image_url || fallbackNewsImage}
          alt={article.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <span className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-3 ${categoryBadgeColors[article.categorie] || 'bg-primary-600'}`}>
            {categoryLabels[article.categorie] || article.categorie}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2">{article.titre}</h2>
          <p className="text-white/70 text-sm max-w-3xl line-clamp-2 mb-3">{article.resume}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5 text-white/70">
              <Calendar size={14} />
              {formatArticleDate(article, { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-2 text-gold-400 font-semibold">
              Lire l'article complet <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function News() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      let query = supabase
        .from('articles')
        .select('*')
        .eq('publie', true)
        .eq('verified', true)
        .order('published_at', { ascending: false })

      if (category) query = query.eq('categorie', category)

      const { data, error: err } = await query
      if (err) {
        setError('Impossible de charger les articles.')
      } else {
        setArticles(data || [])
      }
      setLoading(false)
    }
    load()
  }, [category])

  const filtered = search
    ? articles.filter(a =>
        a.titre.toLowerCase().includes(search.toLowerCase()) ||
        a.resume.toLowerCase().includes(search.toLowerCase())
      )
    : articles

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div>
      {/* Hero */}
      <section className="pt-24 pb-10 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gold-100 text-gold-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <Tag size={12} />
            Publications officielles
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-3">Actualités</h1>
          <p className="text-gray-500 text-lg">Toutes les nouvelles du parti, communiqués officiels et événements</p>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-gray-50"
            />
          </div>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  category === cat.value
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-700 border-t-transparent" />
            </div>
          ) : error ? (
            <div className="text-center py-24">
              <p className="text-danger-600 font-medium">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <Search size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Aucun article trouvé</p>
              <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <>
              {featured && !search && <FeaturedArticle article={featured} />}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(search ? filtered : rest).map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
