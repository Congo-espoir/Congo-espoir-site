import { Link } from 'react-router-dom'
import { Shield, Globe, Heart, BookOpen, Users, Star, Zap, Award, CheckCircle, ArrowRight } from 'lucide-react'
import heroImage from '../medias/hero.jpeg'
import logoImage from '../medias/logo.jpeg'
import secretaryGeneralImage from '../medias/SG_du_partis.jpeg'
import secretaryWithPresidentImage from '../medias/SG_et_president.jpeg'

function PageHero() {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden bg-primary-900">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          <Star size={12} fill="currentColor" />
          Notre identité politique
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Nos valeurs et notre identité
        </h1>
        <p className="text-white/70 text-xl max-w-2xl mx-auto">
          Congo Espoir porte une vision sociale-démocrate fondée sur la justice, le patriotisme
          et l'engagement social au service de la République Démocratique du Congo.
        </p>
      </div>
    </section>
  )
}

function PresentationSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="inline-flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-widest mb-4">
              <div className="w-8 h-px bg-primary-400" />
              Présentation
            </div>
            <h2 className="section-title mb-4">Qui sommes-nous ?</h2>
            <p className="text-gray-600 text-base leading-relaxed mb-4">
              Le Parti Politique CONGO ESPOIR est un parti de la sociale-démocratie, fondé sur l'espoir
              et sur la volonté de ses membres d'œuvrer pour le bien-être social. Il a été créé par
              l'Arrêté ministériel n° 122/2005 du 22 mars 2005, autour de la vision de Maître
              JOSE MPANDA KABANGU, Initiateur et Autorité morale du Parti.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              Notre devise — <strong className="text-primary-800">"Justice, Patriotisme, Social"</strong> — résume l'essence
              de notre engagement envers le peuple congolais et notre vision d'une Nation
              unie, paisible, démocratique et tournée vers la prospérité partagée.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-8 text-white">
            <h3 className="font-serif text-2xl font-bold mb-6 text-gold-400">Notre Mission</h3>
            <p className="text-white/80 text-base leading-relaxed mb-6">
              Construire une République Démocratique du Congo unie, prospère, juste, moderne et démocratique.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle size={18} className="text-gold-400 mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm">Respecter la Constitution, les lois de la RDC et les bonnes mœurs</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={18} className="text-gold-400 mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm">Œuvrer pour la préservation de l'unité nationale et de la souveraineté de l'État</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={18} className="text-gold-400 mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm">Promouvoir la démocratie, les valeurs et les droits humains ainsi que les libertés fondamentales</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={18} className="text-gold-400 mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm">Lutter contre toute forme de violence visant l'accès ou le maintien au pouvoir</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={18} className="text-gold-400 mt-0.5 shrink-0" />
                <p className="text-white/70 text-sm">Veiller à la protection du bien commun, à la justice sociale et à la soumission de tous à la loi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ObjectivesSection() {
  const objectives = [
    {
      icon: Shield,
      color: 'bg-primary-100 text-primary-700',
      number: '01',
      title: 'Unité Nationale',
      description: 'Préserver l\'unité nationale, la paix sociale, l\'intégrité du Territoire National et la souveraineté de l\'État congolais.',
    },
    {
      icon: BookOpen,
      color: 'bg-gold-100 text-gold-700',
      number: '02',
      title: 'Démocratie',
      description: 'Conquérir le pouvoir à tous les niveaux par des voies démocratiques, l\'exercer et le conserver le plus longtemps possible.',
    },
    {
      icon: Globe,
      color: 'bg-success-100 text-success-700',
      number: '03',
      title: 'Société Juste',
      description: 'Promouvoir l\'émergence d\'une société congolaise fondée sur le respect des valeurs humaines universelles.',
    },
    {
      icon: Heart,
      color: 'bg-danger-100 text-danger-700',
      number: '04',
      title: 'Bien-être Social',
      description: 'Veiller à la protection du bien commun, la justice sociale et la soumission de tous à la loi comme règle d\'or de la démocratie.',
    },
    {
      icon: Zap,
      color: 'bg-orange-100 text-orange-700',
      number: '05',
      title: 'Droits Humains',
      description: 'Promouvoir la démocratie, les valeurs et les droits humains ainsi que les libertés fondamentales de chaque citoyen.',
    },
    {
      icon: Award,
      color: 'bg-purple-100 text-purple-700',
      number: '06',
      title: 'Non-violence',
      description: 'Lutter contre toutes formes de violences visant l\'accès et le maintien au pouvoir, pour une transition pacifique.',
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-widest mb-4">
            <div className="w-8 h-px bg-primary-400" />
            Nos objectifs
            <div className="w-8 h-px bg-primary-400" />
          </div>
          <h2 className="section-title">Objectifs Généraux &amp; Spécifiques</h2>
          <p className="section-subtitle">Les priorités qui orientent notre action politique au quotidien</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map(obj => (
            <div key={obj.number} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100 hover:border-primary-200 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${obj.color}`}>
                  <obj.icon size={22} />
                </div>
                <span className="text-5xl font-bold font-serif text-gray-100 group-hover:text-primary-100 transition-colors">{obj.number}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-700 transition-colors">{obj.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{obj.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function InstitutionalSection() {
  const photos = [
    {
      src: secretaryGeneralImage,
      caption: 'Bob Ngoy Ditend — Secrétaire général du Parti Congo Espoir',
      alt: 'Portrait officiel de Bob Ngoy Ditend, Secrétaire général du Parti Congo Espoir',
    },
    {
      src: secretaryWithPresidentImage,
      caption: 'Maître JOSE MPANDA KABANGU — Président National, Initiateur et Autorité morale du Parti Congo Espoir, accompagné de Bob Ngoy Ditend, Secrétaire général',
      alt: 'Maître JOSE MPANDA KABANGU, Président National et Autorité morale du Parti Congo Espoir, accompagné de Bob Ngoy Ditend, Secrétaire général',
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-widest mb-4">
              <div className="w-8 h-px bg-primary-400" />
              Vie institutionnelle
            </div>
            <h2 className="section-title mb-4">Une organisation au service du parti</h2>
            <p className="text-gray-600 leading-relaxed">
              Congo Espoir s'appuie sur ses organes statutaires, ses cadres et ses structures spécialisées
              pour porter son action politique, encadrer ses membres et contribuer au débat national avec
              discipline et sens des responsabilités.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {photos.map(photo => (
              <figure key={photo.caption} className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full aspect-[4/3] object-cover"
                />
                <figcaption className="px-4 py-3 text-sm font-medium text-gray-700">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function EmblemSection() {
  const symbols = [
    { color: 'bg-primary-700', label: 'Le Bleu', meaning: 'Représente la paix' },
    { color: 'bg-white border-2 border-gray-200', label: "L'Étoile Blanche", meaning: 'La nouvelle dynamique qui redonne l\'espoir' },
    { color: 'bg-danger-600', label: 'Le Rouge', meaning: 'Le sang des martyrs' },
    { color: 'bg-gray-400', label: 'Le Balai', meaning: 'Pour nettoyer les mauvaises pratiques' },
    { color: 'bg-gray-500', label: 'La Houe', meaning: 'Le travail' },
    { color: 'bg-gold-500', label: 'Le Jaune', meaning: 'Les richesses de la République Démocratique du Congo' },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-widest mb-4">
              <div className="w-8 h-px bg-primary-400" />
              Symbolique du parti
            </div>
            <h2 className="section-title mb-4">Notre Emblème</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              L'emblème de Congo Espoir est constitué d'un drapeau bleu frappé d'une étoile blanche sur fond rouge,
              au centre duquel se trouvent un balai et une houe. Le fond rouge est entouré d'une bande jaune.
            </p>
            <div className="space-y-3">
              {symbols.map(s => (
                <div key={s.label} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg shrink-0 ${s.color}`} />
                  <div>
                    <span className="font-semibold text-gray-900 text-sm">{s.label} :</span>{' '}
                    <span className="text-gray-600 text-sm">{s.meaning}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual emblem representation */}
          <div className="flex justify-center">
            <figure className="max-w-sm">
              <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-xl">
                <img
                  src={logoImage}
                  alt="Emblème officiel de Congo Espoir"
                  className="w-full aspect-square object-contain"
                />
              </div>
              <figcaption className="mt-4 text-center text-sm text-gray-500">
                Emblème du Parti Politique Congo Espoir
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}

function StructureSection() {
  const structures = [
    {
      category: 'Organes Nationaux',
      color: 'border-primary-500',
      headerColor: 'bg-primary-800',
      items: ['Le Congrès', 'Le Collège des Fondateurs', 'Le Bureau Politique', 'Le Directoire National'],
    },
    {
      category: 'Organes de Base',
      color: 'border-gold-500',
      headerColor: 'bg-gold-600',
      items: ['Les Fédérations'],
    },
    {
      category: 'Structures Spécialisées',
      color: 'border-danger-500',
      headerColor: 'bg-danger-700',
      items: ['La Ligue des Femmes', 'La Ligue des Jeunes', 'La Ligue des Personnes Vivant avec Handicap', 'Le Club de Penseurs', "L'École du Parti"],
    },
  ]

  const memberCategories = [
    { num: '1', label: "L'Initiateur" },
    { num: '2', label: 'Les Membres Fondateurs' },
    { num: '3', label: "Les Membres d'Honneur" },
    { num: '4', label: 'Les Membres Effectifs' },
    { num: '5', label: 'Les Membres Sympathisants' },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Organes */}
          <div>
            <div className="inline-flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-widest mb-4">
              <div className="w-8 h-px bg-primary-400" />
              Organisation interne
            </div>
            <h2 className="section-title mb-6">Organes &amp; Structures</h2>
            <div className="space-y-4">
              {structures.map(s => (
                <div key={s.category} className={`rounded-xl overflow-hidden border-l-4 ${s.color} bg-white shadow-sm`}>
                  <div className={`${s.headerColor} text-white font-semibold text-sm px-5 py-3`}>{s.category}</div>
                  <ul className="px-5 py-3 space-y-1.5">
                    {s.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Member categories + Financing */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-widest mb-4">
                <div className="w-8 h-px bg-primary-400" />
                Catégories
              </div>
              <h2 className="section-title mb-4">Types de Membres</h2>
              <div className="space-y-2">
                {memberCategories.map(m => (
                  <div key={m.num} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary-200 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary-700 text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {m.num}
                    </div>
                    <span className="text-gray-800 font-medium text-sm">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary-900 rounded-2xl p-6 text-white">
              <h3 className="font-serif text-xl font-bold mb-4 text-gold-400">Sources de Financement</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Cotisations', 'Subventions', 'Legs', 'Dons', 'Revenus propres'].map(source => (
                  <div key={source} className="flex items-center gap-2 text-white/70 text-sm">
                    <CheckCircle size={14} className="text-gold-400 shrink-0" />
                    {source}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function JoinConditions() {
  const conditions = [
    'Être congolais',
    'Avoir au moins 18 ans révolus',
    'Être sain d\'esprit, de bonne moralité et jouir de ses droits civiques et politiques',
    'Respecter la discipline et la ligne de conduite du Parti conformément aux statuts et à ses règlements intérieurs',
    'Accepter le projet de société, le programme politique et économique du Parti',
    'Contribuer matériellement ou financièrement à son épanouissement',
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Conditions d'Adhésion</h2>
          <p className="section-subtitle">L'adhésion au Parti est libre et s'opère de façon individuelle.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {conditions.map((c, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="w-6 h-6 rounded-full bg-primary-700 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{c}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/adhesion" className="btn-primary text-base px-10 py-4">
            <Users size={18} />
            Faire ma demande d'adhésion
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Values() {
  return (
    <div>
      <PageHero />
      <PresentationSection />
      <ObjectivesSection />
      <InstitutionalSection />
      <EmblemSection />
      <StructureSection />
      <JoinConditions />
    </div>
  )
}
