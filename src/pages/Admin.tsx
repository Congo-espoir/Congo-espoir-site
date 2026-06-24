import { useState, useEffect } from 'react'
import {
  Users, CheckCircle, XCircle, Clock, Search, Eye, Download, Filter,
  RefreshCw, AlertCircle, Loader2, ExternalLink, ChevronDown
} from 'lucide-react'
import { supabase, Profile, MemberStatus } from '../lib/supabase'

const STATUS_LABELS: Record<MemberStatus, string> = {
  en_attente: 'En attente',
  valide: 'Validé',
  rejete: 'Refusé',
}

const STATUS_STYLES: Record<MemberStatus, string> = {
  en_attente: 'badge-pending',
  valide: 'badge-validated',
  rejete: 'badge-rejected',
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-bold font-serif text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  )
}

interface MemberRowProps {
  profile: Profile
  onAction: (id: string, status: MemberStatus, notes?: string) => void
  onViewDoc: (path: string, nom: string) => void
}

function MemberRow({ profile, onAction, onViewDoc }: MemberRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes] = useState(profile.notes_admin || '')
  const [actionLoading, setActionLoading] = useState(false)
  const fullName = [profile.prenom, profile.post_nom, profile.nom].filter(Boolean).join(' ')
  const cotisation = profile.cotisation_declaree?.trim()
    || (profile.montant_cotisation ? `${profile.montant_cotisation.toLocaleString('fr-FR')} FC` : 'Non renseignée')

  const handleAction = async (status: MemberStatus) => {
    setActionLoading(true)
    await onAction(profile.id, status, notes)
    setActionLoading(false)
  }

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
        <td className="px-4 py-4">
          <div>
            <p className="font-semibold text-gray-900 text-sm">{fullName || profile.email}</p>
            <p className="text-gray-400 text-xs">{profile.email}</p>
          </div>
        </td>
        <td className="px-4 py-4 hidden md:table-cell">
          <p className="text-gray-700 text-sm">{profile.telephone || '—'}</p>
          <p className="text-gray-400 text-xs">{profile.commune || profile.ville || '—'}</p>
        </td>
        <td className="px-4 py-4">
          <span className={STATUS_STYLES[profile.statut]}>
            {STATUS_LABELS[profile.statut]}
          </span>
        </td>
        <td className="px-4 py-4 hidden lg:table-cell text-sm text-gray-600">
          {cotisation}
        </td>
        <td className="px-4 py-4 hidden lg:table-cell text-xs text-gray-400">
          {new Date(profile.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            {profile.document_path && (
              <button
                onClick={() => onViewDoc(profile.document_path!, profile.document_nom || 'document')}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                title="Voir le document"
              >
                <Eye size={16} />
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className={`p-2 rounded-lg transition-colors ${expanded ? 'bg-gray-200 text-gray-700' : 'text-gray-400 hover:bg-gray-100'}`}
              title="Actions"
            >
              <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-blue-50/50 border-b border-gray-100">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_auto] gap-4 items-start">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Fiche d'adhésion</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {[
                    ['Sexe', profile.sexe],
                    ['Naissance', [profile.lieu_naissance, profile.date_naissance].filter(Boolean).join(', ')],
                    ["Niveau d'étude", profile.niveau_etude],
                    ['État civil', profile.etat_civil],
                    ['Profession', profile.profession],
                    ['District', profile.district],
                    ['Origine', [profile.province_origine, profile.territoire_origine].filter(Boolean).join(' / ')],
                    ['Nationalité', profile.nationalite],
                    ['Adresse complète', profile.adresse],
                    ['Commune / Quartier', [profile.commune, profile.quartier].filter(Boolean).join(' / ')],
                    ['Avenue', profile.avenue],
                    ['N° de parcelle', profile.numero_parcelle],
                    ['Déclaration', profile.declaration_acceptee ? 'Acceptée' : 'Non confirmée'],
                    ['Cotisation', cotisation],
                    ['Enregistré le', profile.date_enregistrement ? new Date(profile.date_enregistrement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non renseigné'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span className="text-gray-500">{label} : </span>
                      <span className="font-medium text-gray-800">{value || 'Non renseigné'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Notes administratives</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Ajouter des notes sur ce dossier..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                />
              </div>
              <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                <button
                  onClick={() => handleAction('valide')}
                  disabled={profile.statut === 'valide' || actionLoading}
                  className="flex items-center gap-1.5 bg-success-600 hover:bg-success-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  Valider
                </button>
                <button
                  onClick={() => handleAction('rejete')}
                  disabled={profile.statut === 'rejete' || actionLoading}
                  className="flex items-center gap-1.5 bg-danger-600 hover:bg-danger-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                  Refuser
                </button>
                <button
                  onClick={() => handleAction('en_attente')}
                  disabled={profile.statut === 'en_attente' || actionLoading}
                  className="flex items-center gap-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  <Clock size={14} />
                  En attente
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function Admin() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<MemberStatus | ''>('')
  const [docModal, setDocModal] = useState<{ url: string; nom: string } | null>(null)

  const loadProfiles = async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) {
      setError(`Impossible de charger les membres: ${err.message}`)
    } else {
      setProfiles(data || [])
    }
    setLoading(false)
  }

  useEffect(() => { loadProfiles() }, [])

  const handleAction = async (id: string, status: MemberStatus, notes?: string) => {
    const { error: err } = await supabase
      .from('profiles')
      .update({ statut: status, notes_admin: notes || null })
      .eq('id', id)
    if (err) {
      setError(`Erreur: ${err.message}`)
    } else {
      setProfiles(prev => prev.map(p => p.id === id ? { ...p, statut: status, notes_admin: notes || null } : p))
    }
  }

  const handleViewDoc = async (path: string, nom: string) => {
    const { data, error: err } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, 60)
    if (err || !data?.signedUrl) {
      setError('Impossible de charger le document.')
      return
    }
    setDocModal({ url: data.signedUrl, nom })
  }

  const filtered = profiles.filter(p => {
    const matchSearch = !search || (
      `${p.nom} ${p.post_nom || ''} ${p.prenom} ${p.email}`.toLowerCase().includes(search.toLowerCase())
    )
    const matchStatus = !statusFilter || p.statut === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total: profiles.length,
    en_attente: profiles.filter(p => p.statut === 'en_attente').length,
    valide: profiles.filter(p => p.statut === 'valide').length,
    rejete: profiles.filter(p => p.statut === 'rejete').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-3xl font-bold text-white mb-1">Administration</h1>
          <p className="text-white/60">Gestion des demandes d'adhésion au parti Congo Espoir</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total demandes" value={stats.total} icon={Users} color="bg-gray-100 text-gray-700" />
          <StatCard label="En attente" value={stats.en_attente} icon={Clock} color="bg-gold-100 text-gold-700" />
          <StatCard label="Validées" value={stats.valide} icon={CheckCircle} color="bg-success-100 text-success-700" />
          <StatCard label="Refusées" value={stats.rejete} icon={XCircle} color="bg-danger-100 text-danger-700" />
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-xl p-4 mb-6 text-sm">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-danger-500 hover:text-danger-700">×</button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as MemberStatus | '')}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="valide">Validé</option>
                <option value="rejete">Refusé</option>
              </select>
              <button
                onClick={loadProfiles}
                className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-100 px-4 py-2.5 rounded-xl text-sm transition-colors"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Actualiser
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-700 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Users size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Aucun résultat trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Membre</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Cotisation déclarée</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(profile => (
                    <MemberRow
                      key={profile.id}
                      profile={profile}
                      onAction={handleAction}
                      onViewDoc={handleViewDoc}
                    />
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
                {filtered.length} résultat{filtered.length > 1 ? 's' : ''} sur {profiles.length} au total
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document modal */}
      {docModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{docModal.nom}</h3>
              <div className="flex gap-2 shrink-0">
                <a
                  href={docModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                >
                  <ExternalLink size={14} />
                  Ouvrir
                </a>
                <a
                  href={docModal.url}
                  download={docModal.nom}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                >
                  <Download size={14} />
                  Télécharger
                </a>
                <button
                  onClick={() => setDocModal(null)}
                  className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {docModal.nom.toLowerCase().endsWith('.pdf') ? (
                <iframe src={docModal.url} className="w-full h-96 rounded-xl border border-gray-200" title="Document" />
              ) : (
                <img
                  src={docModal.url}
                  alt={docModal.nom}
                  className="max-w-full max-h-[70vh] mx-auto rounded-xl object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
