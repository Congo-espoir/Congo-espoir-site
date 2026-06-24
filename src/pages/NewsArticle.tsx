import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Calendar, User, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { supabase, Article } from '../lib/supabase'
import fallbackNewsImage from '../medias/actualites/bob-ditend-chez-mbata.jpg'

const categoryBadgeColors: Record<string, string> = {
  actualite: 'bg-gray-600',
  communique: 'bg-gold-500',
  evenement: 'bg-danger-600',
}
const categoryLabels: Record<string, string> = {
  actualite: 'Actualité',
  communique: 'Communiqué',
  evenement: 'Événement',
}

const formatArticleDate = (article: Article, options: Intl.DateTimeFormatOptions) =>
  new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR', options)

export default function NewsArticle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [related, setRelated] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) { navigate('/actualites'); return }

    const load = async () => {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('publie', true)
        .eq('verified', true)
        .maybeSingle()

      if (err || !data) {
        setError('Article introuvable.')
      } else {
        setArticle(data)
        const { data: rel } = await supabase
          .from('articles')
          .select('*')
          .eq('publie', true)
          .eq('verified', true)
          .eq('categorie', data.categorie)
          .neq('id', id)
          .order('published_at', { ascending: false })
          .limit(3)
        setRelated(rel || [])
      }
      setLoading(false)
    }
    load()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-transparent" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
        <p className="text-danger-600 font-medium mb-4">{error || 'Article introuvable'}</p>
        <Link to="/actualites" className="btn-primary">
          <ArrowLeft size={16} /> Retour aux actualités
        </Link>
      </div>
    )
  }

  return (
    <article className="bg-white">
      {/* Hero image */}
      <div className="relative h-[50vh] min-h-[300px] overflow-hidden mt-16">
        {article.media_type === 'video' && article.video_url ? (
          <iframe
            src={article.video_url}
            title={article.titre}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            src={article.image_url || fallbackNewsImage}
            alt={article.titre}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 pb-8">
          <span className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-3 ${categoryBadgeColors[article.categorie] || 'bg-gray-600'}`}>
            {categoryLabels[article.categorie] || article.categorie}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">{article.titre}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link to="/actualites" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium mb-8 transition-colors">
          <ArrowLeft size={16} /> Toutes les actualités
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <User size={14} className="text-gray-500" />
            <span className="font-medium text-gray-700">{article.auteur}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-gray-500" />
            <span>{formatArticleDate(article, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          {article.contenu.split('\n').map((paragraph, i) => (
            paragraph.trim() ? <p key={i} className="mb-4">{paragraph}</p> : null
          ))}
        </div>

        {/* Share / CTA */}
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-800 font-semibold mb-3">Soutenez Congo Espoir</p>
          <p className="text-gray-600 text-sm mb-4">Rejoignez le mouvement et contribuez à la construction d'une RDC meilleure.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/adhesion" className="btn-primary text-sm py-2.5 px-5">
              Adhérer au parti
            </Link>
            <Link to="/actualites" className="inline-flex items-center gap-2 text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors">
              Autres actualités <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Articles similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(a => (
                <Link
                  key={a.id}
                  to={`/actualites/${a.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={a.image_url || fallbackNewsImage}
                      alt={a.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">{a.titre}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatArticleDate(a, { day: 'numeric', month: 'short' })}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
