# ALONU - Plateforme d'Artisans

Plateforme de mise en relation avec des artisans locaux vérifiés au Togo.

## Installation

Installer les dépendances avec pnpm :

```bash
pnpm install
```

## Développement

Démarrer le serveur de développement :

```bash
pnpm dev
```

L'application sera accessible sur `http://localhost:5173`

## Build

Créer une version de production :

```bash
pnpm build
```

## Prévisualisation

Prévisualiser le build de production :

```bash
pnpm preview
```

## Structure du Projet

- `/src/pages/` - Pages principales de l'application
  - `Index.tsx` - Page d'accueil avec carousel et catégories
  - `CategoriesArtisans.tsx` - Page de recherche d'artisans par catégorie
  - `ArtisanProfile.tsx` - Page de profil détaillé d'un artisan
  - `Login.tsx` - Page de connexion

- `/src/components/` - Composants réutilisables
  - `/ui/` - Composants UI de base (Button, Card, Input, etc.)
  - `/layout/` - Composants de mise en page (Footer, etc.)

- `/src/contexts/` - Contextes React (AuthContext)
- `/src/hooks/` - Hooks personnalisés
- `/src/lib/` - Utilitaires

## Technologies

- **React 18** avec TypeScript
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Radix UI** - Composants UI accessibles
- **Lucide React** - Icônes
- **React Icons** - Icônes sociales

## Couleurs de la Marque

- Primary (Orange): `#FF6A00`
- Secondary (Bleu): `#0052CC`
- Accent (Vert): `#00C48C`
- Logo (Vert foncé): `#006E4F`











