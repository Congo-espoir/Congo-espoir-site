/*
# Membership form fields and verified news seed

Adds the fields present in the official Congo Espoir membership form,
keeps contributions optional, extends articles with source metadata,
depublishes existing generated articles, and seeds verified party news.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS post_nom text DEFAULT '',
  ADD COLUMN IF NOT EXISTS sexe text DEFAULT '',
  ADD COLUMN IF NOT EXISTS lieu_naissance text DEFAULT '',
  ADD COLUMN IF NOT EXISTS niveau_etude text DEFAULT '',
  ADD COLUMN IF NOT EXISTS district text DEFAULT '',
  ADD COLUMN IF NOT EXISTS etat_civil text DEFAULT '',
  ADD COLUMN IF NOT EXISTS profession text DEFAULT '',
  ADD COLUMN IF NOT EXISTS province_origine text DEFAULT '',
  ADD COLUMN IF NOT EXISTS territoire_origine text DEFAULT '',
  ADD COLUMN IF NOT EXISTS nationalite text DEFAULT 'Congolaise',
  ADD COLUMN IF NOT EXISTS date_enregistrement date,
  ADD COLUMN IF NOT EXISTS commune text DEFAULT '',
  ADD COLUMN IF NOT EXISTS quartier text DEFAULT '',
  ADD COLUMN IF NOT EXISTS avenue text DEFAULT '',
  ADD COLUMN IF NOT EXISTS numero_parcelle text DEFAULT '',
  ADD COLUMN IF NOT EXISTS declaration_acceptee boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS cotisation_declaree text DEFAULT '';

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS source_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS source_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS media_type text DEFAULT 'image',
  ADD COLUMN IF NOT EXISTS video_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS articles_verified_idx ON articles(verified);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON articles(published_at DESC);

UPDATE articles
SET publie = false
WHERE COALESCE(verified, false) = false;

INSERT INTO articles (
  id,
  titre,
  resume,
  contenu,
  image_url,
  auteur,
  categorie,
  publie,
  source_name,
  source_url,
  published_at,
  media_type,
  video_url,
  verified,
  created_at,
  updated_at
) VALUES
(
  '9d53a4f9-90e1-4a13-bd15-fb34c7d92840',
  'Congo Espoir dépose ses propositions sur les réformes institutionnelles',
  'Une délégation conduite par le Secrétaire général Bob Ngoy Ditend a remis les propositions du parti au professeur André Mbata, Secrétaire permanent de l’Union Sacrée de la Nation.',
  'Le jeudi 4 juin 2026, une délégation du Parti Politique Congo Espoir a été reçue au siège de l’Union Sacrée de la Nation à Kinshasa. Conduite par le Secrétaire général Bob Ngoy Ditend, elle comprenait notamment Baudouin Kabala Nguama, président de la Commission interdisciplinaire chargée de l’élaboration des propositions relatives à la révision ou au changement de la Constitution, ainsi que des cadres, des représentants des jeunes et des femmes du parti.

Les échanges avec le professeur André Mbata, Secrétaire permanent de l’Union Sacrée de la Nation, ont porté sur les propositions élaborées par Congo Espoir dans le cadre du débat national sur les réformes institutionnelles. Le parti a présenté les innovations contenues dans son document et a réaffirmé sa volonté de contribuer à une réflexion responsable sur l’avenir institutionnel du pays.

La rencontre s’est tenue dans un climat cordial et constructif. Congo Espoir inscrit cette démarche dans sa ligne politique : participer aux débats publics avec des propositions structurées, au service de la gouvernance, de la stabilité et du développement national.',
  '/actualites/bob-ditend-chez-mbata.jpg',
  'Congo Espoir',
  'actualite',
  true,
  '',
  '',
  '2026-06-07 00:00:00+00',
  'image',
  '',
  true,
  '2026-06-07 00:00:00+00',
  now()
),
(
  '8c4a885a-9e1f-456a-b4b0-26f5b2ce0a75',
  'À Isiro, Congo Espoir défend une réforme jugée nécessaire',
  'Dans le Haut-Uele, des cadres de Congo Espoir ont rappelé que la révision constitutionnelle est une démarche prévue par la loi et utile pour adapter les institutions aux réalités du pays.',
  'Le mercredi 18 mars 2026 à Isiro, chef-lieu de la province du Haut-Uele, Congo Espoir a pris part au débat public sur la réforme constitutionnelle. Dans ce contexte, les cadres du parti ont défendu une approche responsable, attachée aux procédures prévues par la loi et aux intérêts supérieurs de la Nation.

Pour Congo Espoir, l’évaluation de la Constitution après près de deux décennies d’application doit permettre de corriger certaines limites et de renforcer l’efficacité des institutions. Cette position s’inscrit dans une volonté de préserver la stabilité politique, la continuité de l’action publique et la capacité de l’État à répondre aux réalités actuelles du pays.

Le parti rappelle que les réformes institutionnelles peuvent être menées en parallèle avec les efforts pour la paix, la sécurité et le développement. À Isiro comme ailleurs, Congo Espoir entend contribuer au débat avec discipline, patriotisme et sens des responsabilités.',
  '/actualites/jose-mpanda-isiro.png',
  'Congo Espoir',
  'actualite',
  true,
  '',
  '',
  '2026-03-21 00:00:00+00',
  'image',
  '',
  true,
  '2026-03-21 00:00:00+00',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  titre = EXCLUDED.titre,
  resume = EXCLUDED.resume,
  contenu = EXCLUDED.contenu,
  image_url = EXCLUDED.image_url,
  auteur = EXCLUDED.auteur,
  categorie = EXCLUDED.categorie,
  publie = EXCLUDED.publie,
  source_name = EXCLUDED.source_name,
  source_url = EXCLUDED.source_url,
  published_at = EXCLUDED.published_at,
  media_type = EXCLUDED.media_type,
  video_url = EXCLUDED.video_url,
  verified = EXCLUDED.verified,
  updated_at = now();
