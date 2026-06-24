/*
# Congo Espoir - Initial Schema

## Summary
Creates the full database schema for the Congo Espoir political party website.

## New Tables

### admin_roles
Marks auth.users as administrators. Created first so other tables can reference it.
- user_id (uuid, primary key, references auth.users)
- created_at (timestamptz)

### profiles
Stores membership application data linked to auth.users.
- id, nom, prenom, date_naissance, email, telephone, adresse, ville, code_postal, pays
- statut: 'en_attente' | 'valide' | 'rejete'
- montant_cotisation, document_path, document_nom, notes_admin
- created_at, updated_at

### articles
News articles with publication control.
- id, titre, resume, contenu, image_url, auteur, categorie, publie
- created_at, updated_at

## Security
RLS enabled on all tables with proper ownership and admin bypass policies.
*/

-- Admin roles table (must be created first, referenced in other policies)
CREATE TABLE IF NOT EXISTS admin_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_roles_select" ON admin_roles;
CREATE POLICY "admin_roles_select" ON admin_roles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "admin_roles_insert" ON admin_roles;
CREATE POLICY "admin_roles_insert" ON admin_roles FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid()));

DROP POLICY IF EXISTS "admin_roles_delete" ON admin_roles;
CREATE POLICY "admin_roles_delete" ON admin_roles FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles ar WHERE ar.user_id = auth.uid()));

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom text NOT NULL DEFAULT '',
  prenom text NOT NULL DEFAULT '',
  date_naissance date,
  email text NOT NULL DEFAULT '',
  telephone text DEFAULT '',
  adresse text DEFAULT '',
  ville text DEFAULT '',
  code_postal text DEFAULT '',
  pays text DEFAULT 'Congo (RDC)',
  statut text NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'valide', 'rejete')),
  montant_cotisation numeric(10, 2),
  document_path text,
  document_nom text,
  notes_admin text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    auth.uid() = id OR
    EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  resume text DEFAULT '',
  contenu text DEFAULT '',
  image_url text DEFAULT '',
  auteur text DEFAULT 'Congo Espoir',
  categorie text DEFAULT 'actualite' CHECK (categorie IN ('actualite', 'communique', 'evenement')),
  publie boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "articles_select_published" ON articles;
CREATE POLICY "articles_select_published" ON articles FOR SELECT
  TO anon, authenticated
  USING (publie = true OR EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "articles_insert_admin" ON articles;
CREATE POLICY "articles_insert_admin" ON articles FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "articles_update_admin" ON articles;
CREATE POLICY "articles_update_admin" ON articles FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "articles_delete_admin" ON articles;
CREATE POLICY "articles_delete_admin" ON articles FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()));

-- Indexes
CREATE INDEX IF NOT EXISTS articles_publie_idx ON articles(publie);
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS profiles_statut_idx ON profiles(statut);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles(created_at DESC);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
