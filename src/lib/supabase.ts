import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type MemberStatus = 'en_attente' | 'valide' | 'rejete'
export type ArticleCategory = 'actualite' | 'communique' | 'evenement'

export interface Profile {
  id: string
  nom: string
  post_nom: string | null
  prenom: string
  sexe: string | null
  lieu_naissance: string | null
  date_naissance: string | null
  niveau_etude: string | null
  district: string | null
  etat_civil: string | null
  profession: string | null
  province_origine: string | null
  territoire_origine: string | null
  nationalite: string | null
  date_enregistrement: string | null
  email: string
  telephone: string
  adresse: string
  commune: string | null
  quartier: string | null
  avenue: string | null
  numero_parcelle: string | null
  ville: string
  code_postal: string
  pays: string
  statut: MemberStatus
  montant_cotisation: number | null
  declaration_acceptee: boolean | null
  cotisation_declaree: string | null
  document_path: string | null
  document_nom: string | null
  notes_admin: string | null
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  titre: string
  resume: string
  contenu: string
  image_url: string
  auteur: string
  categorie: ArticleCategory
  publie: boolean
  source_name: string | null
  source_url: string | null
  published_at: string | null
  media_type: 'image' | 'video' | string | null
  video_url: string | null
  verified: boolean | null
  created_at: string
  updated_at: string
}
