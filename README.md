# Congo Espoir

Application front-end React + TypeScript pour le site "Congo Espoir".
Le projet utilise Vite, Tailwind CSS et Supabase pour les données, l'authentification et le stockage.

## Structure principale

- `src/`
  - `App.tsx` : point d'entrée de l'application React.
  - `main.tsx` : bootstrap React avec Vite.
  - `src/lib/supabase.ts` : création du client Supabase à partir des variables d'environnement.
  - `src/pages/` : pages principales (`Home`, `News`, `NewsArticle`, `Adhesion`, `Admin`, `Login`, `Values`).
  - `src/components/` : composants réutilisables (`Navbar`, `Footer`, `Logo`).
  - `src/contexts/AuthContext.tsx` : contexte d'authentification Supabase.

- `public/` : ressources publiques, dont des médias pour les actualités.
- `supabase/migrations/` : migrations SQL pour la base de données Supabase.

## Environnement

Ce projet attend ces variables dans un fichier `.env` à la racine :

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Dans `src/lib/supabase.ts`, ces variables sont utilisées pour initialiser le client Supabase. Si elles sont manquantes, l'application lèvera une erreur.

## Commandes utiles

```bash
npm install
npm run dev
npm run build
npm run preview
npm run supabase:migrate
```

- `npm run dev` : lance le serveur de développement Vite.
- `npm run build` : compile l'application pour la production.
- `npm run preview` : prévisualise la build production localement.
- `npm run supabase:migrate` : pousse les migrations locales vers Supabase.

## Supabase

Le projet est conçu pour communiquer avec un projet Supabase distant via les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`.

- Les migrations sont stockées dans `supabase/migrations/`.
- Le CLI Supabase local peut être lié à un projet distant pour exécuter `supabase db push`.
- En production, le site utilisera le projet Supabase défini par les variables d'environnement.

## Déploiement

1. Configurer les variables d'environnement du service d'hébergement.
2. Vérifier que `VITE_SUPABASE_URL` pointe vers le bon projet Supabase.
3. Vérifier que `VITE_SUPABASE_ANON_KEY` est une clé anonyme valide.
4. Exécuter `npm run build`.

> Important : l'application hôte doit utiliser les mêmes variables d'environnement que celles attendues localement. Si ces valeurs changent, l'application se connectera à un autre projet Supabase.

## Fonctionnalités principales

- Liste et affichage d'actualités.
- Page de demande d'adhésion avec formulaire d'inscription détaillé.
- Upload de documents d'adhésion vers Supabase Storage.
- Page d'administration pour valider ou rejeter les adhésions.
- Authentification gérée par Supabase.

## Notes

- Le projet est privé (`private: true`).
- Le code TypeScript et React utilise React Router pour la navigation.
- Tailwind CSS est configuré via `tailwind.config.js` et `postcss.config.js`.

## À améliorer

- Ajouter des tests unitaires ou d'intégration.
- Ajouter une documentation des tables Supabase et des schémas.
- Mettre en place un processus de déploiement continu.
