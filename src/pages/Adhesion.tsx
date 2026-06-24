import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  User, FileText, CheckCircle, Upload, X, Shield, MapPin,
  ChevronRight, ChevronLeft, Eye, EyeOff, AlertCircle, Loader2
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const STEPS = [
  { id: 1, label: 'Identité', icon: User },
  { id: 2, label: 'Coordonnées', icon: MapPin },
  { id: 3, label: 'Document', icon: FileText },
  { id: 4, label: 'Déclaration', icon: CheckCircle },
]

const SEXES = ['Masculin', 'Féminin']
const ETATS_CIVILS = ['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf/Veuve']
const NIVEAUX_ETUDE = ['Primaire', 'Secondaire', 'Graduat', 'Licence', 'Master', 'Doctorat', 'Autre']

interface FormData {
  nom: string
  post_nom: string
  prenom: string
  sexe: string
  lieu_naissance: string
  date_naissance: string
  niveau_etude: string
  district: string
  etat_civil: string
  profession: string
  province_origine: string
  territoire_origine: string
  nationalite: string
  telephone: string
  email: string
  password: string
  commune: string
  quartier: string
  avenue: string
  numero_parcelle: string
  declaration_acceptee: boolean
  cotisation_declaree: string
}

type FieldErrors = Partial<Record<keyof FormData, string>>

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((step, idx) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              current > step.id
                ? 'bg-success-500 text-white'
                : current === step.id
                ? 'bg-primary-700 text-white ring-4 ring-primary-200'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {current > step.id ? <CheckCircle size={18} /> : <step.icon size={18} />}
            </div>
            <span className={`text-xs font-medium mt-1.5 hidden sm:block ${
              current >= step.id ? 'text-primary-700' : 'text-gray-400'
            }`}>{step.label}</span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`h-0.5 w-10 sm:w-20 mx-1 sm:mx-2 transition-all duration-300 mb-5 sm:mb-0 ${
              current > step.id ? 'bg-success-400' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

function InputField({
  label, name, type = 'text', value, onChange, required, placeholder, error,
}: {
  label: string
  name: keyof FormData
  type?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
  error?: string
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-danger-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all ${
            error ? 'border-danger-400 bg-danger-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-danger-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
    </div>
  )
}

function SelectField({
  label, name, value, options, onChange, required, error,
}: {
  label: string
  name: keyof FormData
  value: string
  options: string[]
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  required?: boolean
  error?: string
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-danger-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all ${
          error ? 'border-danger-400 bg-danger-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
        }`}
      >
        <option value="">Sélectionner</option>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
      {error && <p className="text-danger-600 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
    </div>
  )
}

function buildAddress(form: FormData) {
  return [
    form.commune && `Commune ${form.commune.trim()}`,
    form.quartier && `Quartier ${form.quartier.trim()}`,
    form.avenue && `Avenue ${form.avenue.trim()}`,
    form.numero_parcelle && `N° ${form.numero_parcelle.trim()}`,
  ].filter(Boolean).join(', ')
}

function parseCotisationAmount(value: string) {
  const normalized = value.replace(/\s/g, '').replace(',', '.')
  const match = normalized.match(/\d+(\.\d+)?/)
  if (!match) return null
  const amount = Number(match[0])
  return Number.isFinite(amount) && amount > 0 ? amount : null
}

export default function Adhesion() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { user, signUp } = useAuth()

  const [form, setForm] = useState<FormData>({
    nom: '',
    post_nom: '',
    prenom: '',
    sexe: '',
    lieu_naissance: '',
    date_naissance: '',
    niveau_etude: '',
    district: '',
    etat_civil: '',
    profession: '',
    province_origine: '',
    territoire_origine: '',
    nationalite: 'Congolaise',
    telephone: '',
    email: user?.email || '',
    password: '',
    commune: '',
    quartier: '',
    avenue: '',
    numero_parcelle: '',
    declaration_acceptee: false,
    cotisation_declaree: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [createdUserId, setCreatedUserId] = useState<string | null>(user?.id || null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof FormData
    const { value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setFieldErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name as keyof FormData
    const { value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setFieldErrors(prev => ({ ...prev, [name]: '' }))
  }

  const collectRequiredErrors = (fields: Array<keyof FormData>) => {
    const errors: FieldErrors = {}
    fields.forEach(field => {
      const value = form[field]
      if (typeof value === 'string' && !value.trim()) errors[field] = 'Champ requis'
      if (typeof value === 'boolean' && !value) errors[field] = 'Confirmation requise'
    })
    return errors
  }

  const validateRequired = (fields: Array<keyof FormData>) => {
    const errors = collectRequiredErrors(fields)
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep1 = () => validateRequired([
    'nom', 'post_nom', 'prenom', 'sexe', 'lieu_naissance', 'date_naissance', 'nationalite',
  ])

  const validateStep2 = () => {
    const errors = collectRequiredErrors([
      'niveau_etude', 'district', 'etat_civil', 'profession', 'province_origine',
      'territoire_origine', 'telephone', 'commune', 'quartier', 'avenue', 'numero_parcelle', 'email',
    ])
    if (!form.email.trim()) errors.email = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Email invalide'
    if (!user && !form.password) errors.password = 'Mot de passe requis'
    else if (!user && form.password.length < 6) errors.password = 'Au moins 6 caractères'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep4 = () => validateRequired(['declaration_acceptee'])

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else setDragActive(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) validateAndSetFile(dropped)
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    if (picked) validateAndSetFile(picked)
  }

  const validateAndSetFile = (f: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowed.includes(f.type)) {
      setGlobalError('Format invalide. Acceptés : PDF, JPEG, PNG.')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setGlobalError('Fichier trop volumineux (max. 10 Mo).')
      return
    }
    setFile(f)
    setGlobalError(null)
  }

  const handleStep1Submit = () => {
    if (validateStep1()) {
      setGlobalError(null)
      setStep(2)
    }
  }

  const handleStep2Submit = async () => {
    if (!validateStep2()) return
    setLoading(true)
    setGlobalError(null)
    try {
      if (!user) {
        const { error, user: newUser } = await signUp(form.email.trim(), form.password)
        if (error) {
          if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
            setGlobalError('Un compte avec cet email existe déjà. Veuillez vous connecter.')
          } else {
            setGlobalError(error.message || 'Erreur lors de la création du compte.')
          }
          setLoading(false)
          return
        }
        if (newUser) setCreatedUserId(newUser.id)
      }
      setStep(3)
    } catch {
      setGlobalError("Une erreur inattendue s'est produite.")
    }
    setLoading(false)
  }

  const handleStep3Submit = () => {
    if (!file) {
      setGlobalError("Veuillez télécharger votre pièce d'identité.")
      return
    }
    setGlobalError(null)
    setStep(4)
  }

  const handleFinalSubmit = async () => {
    if (!validateStep4()) return
    setLoading(true)
    setGlobalError(null)
    try {
      const userId = createdUserId || user?.id
      if (!userId) {
        setGlobalError('Session expirée. Veuillez recommencer.')
        setLoading(false)
        return
      }

      let documentPath: string | null = null
      let documentNom: string | null = null
      if (file) {
        const ext = file.name.split('.').pop()
        const path = `${userId}/identite_${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('documents')
          .upload(path, file, { upsert: true })
        if (uploadErr) {
          setGlobalError(`Erreur lors de l'envoi du document : ${uploadErr.message}`)
          setLoading(false)
          return
        }
        documentPath = path
        documentNom = file.name
      }

      const cotisationAmount = parseCotisationAmount(form.cotisation_declaree)
      const { error: profileErr } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          nom: form.nom.trim(),
          post_nom: form.post_nom.trim(),
          prenom: form.prenom.trim(),
          sexe: form.sexe,
          lieu_naissance: form.lieu_naissance.trim(),
          date_naissance: form.date_naissance,
          niveau_etude: form.niveau_etude,
          district: form.district.trim(),
          etat_civil: form.etat_civil,
          profession: form.profession.trim(),
          province_origine: form.province_origine.trim(),
          territoire_origine: form.territoire_origine.trim(),
          nationalite: form.nationalite.trim(),
          date_enregistrement: new Date().toISOString().slice(0, 10),
          email: form.email.trim(),
          telephone: form.telephone.trim(),
          adresse: buildAddress(form),
          commune: form.commune.trim(),
          quartier: form.quartier.trim(),
          avenue: form.avenue.trim(),
          numero_parcelle: form.numero_parcelle.trim(),
          ville: form.commune.trim(),
          code_postal: '',
          pays: 'République Démocratique du Congo',
          statut: 'en_attente',
          montant_cotisation: cotisationAmount,
          declaration_acceptee: form.declaration_acceptee,
          cotisation_declaree: form.cotisation_declaree.trim() || null,
          document_path: documentPath,
          document_nom: documentNom,
        })

      if (profileErr) {
        setGlobalError(`Erreur d'enregistrement : ${profileErr.message}`)
        setLoading(false)
        return
      }

      setStep(5)
    } catch {
      setGlobalError("Une erreur inattendue s'est produite.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            <Shield size={12} />
            Adhésion officielle
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary-900 mb-2">
            Rejoindre Congo Espoir
          </h1>
          <p className="text-gray-500 text-base">
            Remplissez la fiche d'identification et joignez votre pièce d'identité.
          </p>
        </div>

        <StepIndicator current={step} />

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-gray-100">
          {globalError && (
            <div className="flex items-start gap-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg p-4 mb-6 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{globalError}</span>
              <button onClick={() => setGlobalError(null)} className="ml-auto shrink-0" aria-label="Fermer">
                <X size={14} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Identité du membre</h2>
              <p className="text-gray-500 text-sm mb-6">Ces informations reprennent les champs de la fiche officielle d'adhésion.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Nom" name="nom" value={form.nom} onChange={handleChange} required error={fieldErrors.nom} />
                <InputField label="Post-nom" name="post_nom" value={form.post_nom} onChange={handleChange} required error={fieldErrors.post_nom} />
                <InputField label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} required error={fieldErrors.prenom} />
                <SelectField label="Sexe" name="sexe" value={form.sexe} options={SEXES} onChange={handleSelectChange} required error={fieldErrors.sexe} />
                <InputField label="Lieu de naissance" name="lieu_naissance" value={form.lieu_naissance} onChange={handleChange} required error={fieldErrors.lieu_naissance} />
                <InputField label="Date de naissance" name="date_naissance" type="date" value={form.date_naissance} onChange={handleChange} required error={fieldErrors.date_naissance} />
                <div className="sm:col-span-2">
                  <InputField label="Nationalité" name="nationalite" value={form.nationalite} onChange={handleChange} required error={fieldErrors.nationalite} />
                </div>
              </div>

              <button
                onClick={handleStep1Submit}
                className="w-full btn-primary mt-8 py-4 text-base justify-center"
              >
                Continuer
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Coordonnées et renseignements</h2>
              <p className="text-gray-500 text-sm mb-6">Indiquez votre adresse, votre origine et les informations de votre compte membre.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField label="Niveau d'étude" name="niveau_etude" value={form.niveau_etude} options={NIVEAUX_ETUDE} onChange={handleSelectChange} required error={fieldErrors.niveau_etude} />
                <SelectField label="État civil" name="etat_civil" value={form.etat_civil} options={ETATS_CIVILS} onChange={handleSelectChange} required error={fieldErrors.etat_civil} />
                <InputField label="District" name="district" value={form.district} onChange={handleChange} required error={fieldErrors.district} />
                <InputField label="Profession" name="profession" value={form.profession} onChange={handleChange} required error={fieldErrors.profession} />
                <InputField label="Province d'origine" name="province_origine" value={form.province_origine} onChange={handleChange} required error={fieldErrors.province_origine} />
                <InputField label="Territoire d'origine" name="territoire_origine" value={form.territoire_origine} onChange={handleChange} required error={fieldErrors.territoire_origine} />
                <InputField label="Commune" name="commune" value={form.commune} onChange={handleChange} required error={fieldErrors.commune} />
                <InputField label="Quartier" name="quartier" value={form.quartier} onChange={handleChange} required error={fieldErrors.quartier} />
                <InputField label="Avenue" name="avenue" value={form.avenue} onChange={handleChange} required error={fieldErrors.avenue} />
                <InputField label="N° de parcelle" name="numero_parcelle" value={form.numero_parcelle} onChange={handleChange} required error={fieldErrors.numero_parcelle} />
                <InputField label="Téléphone" name="telephone" type="tel" value={form.telephone} onChange={handleChange} required error={fieldErrors.telephone} placeholder="+243 ..." />
                <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required error={fieldErrors.email} placeholder="nom@exemple.cd" />
                {!user && (
                  <div className="sm:col-span-2">
                    <InputField label="Mot de passe pour l'espace membre" name="password" type="password" value={form.password} onChange={handleChange} required error={fieldErrors.password} placeholder="Minimum 6 caractères" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3.5 rounded-lg hover:border-gray-300 transition-colors">
                  <ChevronLeft size={16} /> Retour
                </button>
                <button
                  onClick={handleStep2Submit}
                  disabled={loading}
                  className="flex-1 btn-primary py-3.5 justify-center disabled:opacity-60"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Continuer <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Pièce d'identité</h2>
              <p className="text-gray-500 text-sm mb-6">Joignez une carte d'identité, un passeport ou un document officiel équivalent.</p>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-200 ${
                  dragActive
                    ? 'border-primary-500 bg-primary-50'
                    : file
                    ? 'border-success-400 bg-success-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50/50'
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  className="hidden"
                />
                {file ? (
                  <div>
                    <CheckCircle size={36} className="mx-auto text-success-500 mb-3" />
                    <p className="font-semibold text-success-700 mb-1">{file.name}</p>
                    <p className="text-success-600 text-sm">{(file.size / 1024 / 1024).toFixed(2)} Mo</p>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setFile(null) }}
                      className="mt-3 inline-flex items-center gap-1 text-danger-600 text-sm hover:text-danger-800 transition-colors"
                    >
                      <X size={14} /> Changer de fichier
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload size={36} className="mx-auto text-gray-400 mb-3" />
                    <p className="font-semibold text-gray-700 mb-1">Glissez votre fichier ici</p>
                    <p className="text-gray-500 text-sm mb-3">ou cliquez pour choisir un fichier</p>
                    <p className="text-gray-400 text-xs">PDF, JPEG, PNG - Max. 10 Mo</p>
                  </div>
                )}
              </div>

              <div className="bg-primary-50 rounded-lg p-4 mt-4 text-sm text-primary-700">
                <p className="font-semibold mb-1 flex items-center gap-2"><Shield size={14} /> Vérification administrative</p>
                <p className="text-primary-600 text-xs">La pièce d'identité sert uniquement à l'examen de votre demande par les administrateurs habilités.</p>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3.5 rounded-lg hover:border-gray-300 transition-colors">
                  <ChevronLeft size={16} /> Retour
                </button>
                <button onClick={handleStep3Submit} className="flex-1 btn-primary py-3.5 justify-center">
                  Continuer <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Déclaration d'adhésion</h2>
              <p className="text-gray-500 text-sm mb-6">Confirmez librement votre demande. La cotisation immédiate reste optionnelle.</p>

              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 mb-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="declaration_acceptee"
                    checked={form.declaration_acceptee}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    Je déclare adhérer librement au Parti Politique Congo Espoir, accepter ses statuts,
                    son règlement intérieur, sa discipline et sa ligne de conduite. Je certifie que les
                    informations fournies sont exactes.
                  </span>
                </label>
                {fieldErrors.declaration_acceptee && (
                  <p className="text-danger-600 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12} />{fieldErrors.declaration_acceptee}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cotisation déclarée, si disponible</label>
                <input
                  type="text"
                  name="cotisation_declaree"
                  value={form.cotisation_declaree}
                  onChange={handleChange}
                  placeholder="Ex. 5000 FC, à verser plus tard, ou laisser vide"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
                <p className="text-gray-400 text-xs mt-1">
                  Aucun montant prédéfini n'est imposé et l'absence de cotisation immédiate ne bloque pas la demande.
                </p>
              </div>

              <div className="mt-5 bg-primary-50 border border-primary-100 rounded-lg p-4 text-sm text-primary-800">
                <p className="font-semibold mb-2">Résumé du dossier</p>
                <p>{form.prenom} {form.post_nom} {form.nom}</p>
                <p>{buildAddress(form)}</p>
                <p>{form.telephone} · {form.email}</p>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(3)} className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3.5 rounded-lg hover:border-gray-300 transition-colors">
                  <ChevronLeft size={16} /> Retour
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="flex-1 btn-primary py-3.5 justify-center disabled:opacity-60"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Soumettre ma demande <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center animate-fade-in py-4">
              <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-success-500" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-gray-900 mb-3">Demande envoyée</h2>
              <p className="text-gray-500 text-base mb-6 max-w-sm mx-auto">
                Votre dossier d'adhésion a été soumis avec succès. Il sera examiné par l'administration du parti.
              </p>
              <div className="bg-primary-50 rounded-lg p-6 text-left mb-8">
                <h3 className="font-semibold text-primary-900 mb-3">Prochaines étapes</h3>
                <ol className="space-y-2.5">
                  {[
                    "Vérification de la fiche et de la pièce d'identité",
                    'Examen administratif de la demande',
                    'Notification du statut après validation',
                    'Accueil du nouveau membre au sein de Congo Espoir',
                  ].map((item, i) => (
                    <li key={item} className="flex items-start gap-3 text-primary-700 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary-200 text-primary-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/" className="btn-primary py-3.5 px-8 justify-center">Retour à l'accueil</Link>
                <Link to="/actualites" className="inline-flex items-center justify-center gap-2 border-2 border-primary-200 text-primary-700 font-semibold px-8 py-3.5 rounded-lg hover:border-primary-400 transition-colors">
                  Suivre l'actualité
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
