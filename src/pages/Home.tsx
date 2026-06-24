import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight, Users, BookOpen, Heart, Star, Shield, Globe } from 'lucide-react'
import { supabase, Article } from '../lib/supabase'
import heroImage from '../medias/hero.jpeg'
import leaderImage from '../medias/IMG-20230714-WA0346.jpg (1).jpeg'
import fallbackNewsImage from '../medias/actualites/bob-ditend-chez-mbata.jpg'

const displayDate = (article: Article, options: Intl.DateTimeFormatOptions) =>
  new Date(article.published_at || article.created_at).toLocaleDateString('fr-FR', options)

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 pt-40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-gold-500/90 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <Star size={12} fill="white" />
            Justice · Patriotisme · Social
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            L'Espoir au<br />
            <span className="text-gold-400">Service du Congo</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-8 max-w-2xl">
            Construire une République Démocratique du Congo unie, prospère, juste, moderne et démocratique.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/adhesion" className="btn-gold text-base px-8 py-4">
              <Users size={18} />
              Adhérer au parti
            </Link>
            <Link to="/valeurs" className="btn-secondary text-base px-8 py-4">
              <BookOpen size={18} />
              Découvrir nos valeurs
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  )
}

function NewsCarousel({ articles }: { articles: Article[] }) {
  const [current, setCurrent] = useState(0)

  const prev = useCallback(() => setCurrent(c => (c === 0 ? articles.length - 1 : c - 1)), [articles.length])
  const next = useCallback(() => setCurrent(c => (c === articles.length - 1 ? 0 : c + 1)), [articles.length])

  useEffect(() => {
    if (articles.length === 0) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next, articles.length])

  if (articles.length === 0) return null

  const article = articles[current]
  const categoryLabels: Record<string, string> = {
    actualite: 'Actualité',
    communique: 'Communiqué',
    evenement: 'Événement',
  }
  const categoryColors: Record<string, string> = {
    actualite: 'bg-gray-800',
    communique: 'bg-gold-500',
    evenement: 'bg-red-600',
  }

  return (
    <section className="bg-white py-16 md:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title">Dernières Actualités</h2>
            <p className="section-subtitle mb-0">Restez informés des activités du parti</p>
          </div>
          <Link to="/actualites" className="hidden md:flex items-center gap-2 text-gray-800 hover:text-gray-600 font-semibold text-sm transition-colors">
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured article */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-lg group card-hover">
            <div className="aspect-[16/9] relative overflow-hidden">
              <img
                src={article.image_url || fallbackNewsImage}
                alt={article.titre}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-3 ${categoryColors[article.categorie] || 'bg-gray-800'}`}>
                  {categoryLabels[article.categorie] || article.categorie}
                </span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
                  {article.titre}
                </h3>
                <p className="text-white/70 text-sm line-clamp-2 mb-3">{article.resume}</p>
                <Link to={`/actualites/${article.id}`} className="text-gold-400 text-sm font-semibold hover:text-gold-300 flex items-center gap-1">
                  Lire la suite <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            {/* Carousel controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4">
              <button onClick={prev} className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-colors">
                <ChevronLeft size={18} />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4">
              <button onClick={next} className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
            {/* Dots */}
            <div className="absolute bottom-4 right-6 flex gap-1.5">
              {articles.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? 'bg-gold-400 w-5 h-2' : 'bg-white/50 w-2 h-2'}`}
                />
              ))}
            </div>
          </div>

          {/* Side articles */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {articles.slice(0, 3).map((a, i) => (
              <Link
                key={a.id}
                to={`/actualites/${a.id}`}
                className={`flex gap-3 rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 group ${i === current ? 'ring-2 ring-gray-200' : ''}`}
              >
                <div className="w-24 h-24 shrink-0 overflow-hidden">
                  <img
                    src={a.image_url || fallbackNewsImage}
                    alt={a.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="py-3 pr-3 flex flex-col justify-center">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white inline-block w-fit mb-1 ${categoryColors[a.categorie] || 'bg-gray-800'}`}>
                    {categoryLabels[a.categorie] || a.categorie}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors">{a.titre}</p>
                  <p className="text-xs text-gray-500 mt-1">{displayDate(a, { day: 'numeric', month: 'long' })}</p>
                </div>
              </Link>
            ))}
            <Link to="/actualites" className="flex items-center justify-center gap-2 text-gray-800 border-2 border-gray-200 hover:border-gray-800 hover:bg-gray-800 hover:text-white font-semibold text-sm py-3 rounded-xl transition-all duration-200 mt-auto">
              Toutes les actualités <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function LeaderSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={leaderImage}
                alt="Fondateur du parti"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gray-900 text-white rounded-2xl p-5 shadow-xl hidden lg:block">
              <div className="text-4xl font-bold font-serif text-gold-400">2005</div>
              <div className="text-sm text-white/70 mt-1">Année de fondation</div>
            </div>
            <div className="absolute -top-4 -left-4 bg-gold-500 text-white rounded-2xl p-4 shadow-xl hidden lg:block">
              <Star size={28} fill="white" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-widest mb-4">
              <div className="w-8 h-px bg-gold-500" />
              Mot du Fondateur
            </div>
            <h2 className="section-title mb-6">
              Un Parti au Service<br />du Peuple Congolais
            </h2>
            <div className="relative pl-6 border-l-4 border-gold-500 mb-6">
              <p className="text-lg text-gray-600 leading-relaxed italic">
                "Congo Espoir est né de la volonté profonde d'œuvrer pour le bien-être social de notre peuple.
                Nous croyons en une République Démocratique du Congo unie, juste et prospère,
                bâtie sur les valeurs de justice, de patriotisme et de solidarité sociale."
              </p>
            </div>
            <div className="mb-6">
              <p className="font-bold text-gray-900 text-lg">Maître JOSE MPANDA KABANGU</p>
              <p className="text-gray-500 text-sm font-medium">Initiateur et Autorité Morale du Parti</p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
              {[
                { label: 'Provinces', value: '26+' },
                { label: 'Membres', value: '50K+' },
                { label: 'Fédérations', value: '150+' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold font-serif text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ValuesTeaser() {
  const values = [
    {
      icon: Shield,
      color: 'bg-primary-100 text-primary-700',
      title: 'Justice',
      desc: 'Défendre l\'égalité de tous devant la loi et garantir les droits fondamentaux de chaque citoyen.',
    },
    {
      icon: Globe,
      color: 'bg-gold-100 text-gold-700',
      title: 'Patriotisme',
      desc: 'Préserver l\'unité nationale, la souveraineté et l\'intégrité du territoire congolais.',
    },
    {
      icon: Heart,
      color: 'bg-danger-100 text-danger-700',
      title: 'Social',
      desc: 'Promouvoir le bien-être de tous les Congolais par des politiques sociales inclusives et équitables.',
    },
    {
      icon: BookOpen,
      color: 'bg-success-100 text-success-700',
      title: 'Démocratie',
      desc: 'Conquérir et exercer le pouvoir uniquement par des voies démocratiques et pacifiques.',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50/50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-widest mb-4">
            <div className="w-8 h-px bg-gold-500" />
            Ce en quoi nous croyons
            <div className="w-8 h-px bg-gold-500" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">Nos Valeurs Fondamentales</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Les principes qui guident chacune de nos actions au service du peuple congolais.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {values.map(v => (
            <div key={v.title} className="bg-white rounded-2xl p-6 transition-all duration-300 group border border-gray-100 hover:border-gray-200 hover:shadow-lg">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${v.color}`}>
                <v.icon size={22} />
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/valeurs" className="inline-flex items-center gap-2 border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200">
            Découvrir notre programme <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function JoinCTA() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-widest mb-4">
          <div className="w-8 h-px bg-gold-500" />
          Rejoignez le mouvement
          <div className="w-8 h-px bg-gold-500" />
        </div>
        <h2 className="section-title mb-4">Devenez Membre de Congo Espoir</h2>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          L'adhésion au parti est libre et s'opère de façon individuelle.
          Rejoignez des milliers de Congolais qui croient en un avenir meilleur.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/adhesion" className="btn-gold text-base px-10 py-4">
            <Users size={18} />
            Adhérer maintenant
          </Link>
          <Link to="/valeurs" className="btn-outline-dark text-base px-10 py-4">
            <BookOpen size={18} />
            Notre programme
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Être Congolais', icon: Globe },
            { label: '18 ans minimum', icon: Users },
            { label: 'Bonne moralité', icon: Shield },
            { label: 'Partager nos valeurs', icon: Heart },
          ].map(c => (
            <div key={c.label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center">
                <c.icon size={18} />
              </div>
              <p className="text-sm text-gray-600 font-medium">{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    supabase
      .from('articles')
      .select('*')
      .eq('publie', true)
      .eq('verified', true)
      .order('published_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setArticles(data)
      })
  }, [])

  return (
    <div>
      <HeroSection />
      <NewsCarousel articles={articles} />
      <LeaderSection />
      <ValuesTeaser />
      <JoinCTA />
    </div>
  )
}
