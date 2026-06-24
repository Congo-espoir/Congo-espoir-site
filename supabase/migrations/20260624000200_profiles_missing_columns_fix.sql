/*
# Ensure profile address fields exist and avoid schema mismatch

This migration is intentionally idempotent and safe to run on an existing
Supabase database that may not yet have applied the previous profile schema update.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS date_enregistrement date,
  ADD COLUMN IF NOT EXISTS commune text DEFAULT '',
  ADD COLUMN IF NOT EXISTS quartier text DEFAULT '',
  ADD COLUMN IF NOT EXISTS avenue text DEFAULT '',
  ADD COLUMN IF NOT EXISTS numero_parcelle text DEFAULT '',
  ADD COLUMN IF NOT EXISTS declaration_acceptee boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS cotisation_declaree text DEFAULT '';
