# ClimbTracker

Application web pour salle d'escalade permettant aux ouvreurs de documenter leurs voies et à la communauté de partager leurs réussites, conseils et progressions. L'application intègre des fonctionnalités d'IA pour la reconnaissance des prises et l'analyse des mouvements.

## 🚀 Démarrage Rapide

**Nouveau ici?** Suivez le guide [QUICK_START.md](./QUICK_START.md) pour lancer l'application en 5 minutes!

**Sur Windows?** ✅ La base de données est déjà configurée! Voir [DATABASE_SETUP_COMPLETE.md](./DATABASE_SETUP_COMPLETE.md)

**Projet 1 terminé!** Consultez [P1_COMPLETE.md](./P1_COMPLETE.md) pour tester le système d'authentification.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Stack Technique](#stack-technique)
- [Structure du Projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Développement](#développement)
- [Base de données](#base-de-données)
- [Scripts disponibles](#scripts-disponibles)
- [Variables d'environnement](#variables-denvironnement)
- [Documentation](#documentation)

## Fonctionnalités

### Phase 1 - MVP
- Authentification utilisateur (grimpeur, ouvreur, admin)
- Gestion CRUD des voies d'escalade
- Upload de photos et vidéos
- Système de validation des voies
- Commentaires et partage de conseils
- Hub des voies avec filtres

### Phase 2 - Engagement Communautaire
- Galerie de médias par voie
- Recherche avancée et filtres
- Notifications
- Profil utilisateur enrichi avec statistiques

### Phase 3 - Intelligence Artificielle
- Détection automatique des prises (Computer Vision)
- Analyse de mouvement avec MediaPipe
- Suggestions techniques personnalisées
- Scoring automatique des performances

## Stack Technique

### Frontend
- **React 18+** avec TypeScript
- **Vite** comme bundler
- **Tailwind CSS** + shadcn/ui
- **React Query** (TanStack Query)
- **React Router v6**
- **TensorFlow.js** pour l'IA côté client

### Backend
- **Node.js 20+** avec Express
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Redis** pour le cache
- **Bull** pour les queues de jobs

### Services
- **Cloudinary** ou **AWS S3** pour le stockage média
- **JWT** pour l'authentification
- **MediaPipe** pour l'analyse de mouvement
- **OpenCV.js** pour la détection des prises

## Structure du Projet

```
climb-tracker/
├── apps/
│   ├── web/                 # Application React
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   │   ├── ai/      # Modules IA
│   │   │   │   └── api/     # Client API
│   │   │   └── utils/
│   │   └── public/
│   │
│   └── api/                 # Backend Express
│       ├── src/
│       │   ├── routes/
│       │   ├── controllers/
│       │   ├── services/
│       │   │   ├── ai/      # Services IA
│       │   │   └── media/   # Traitement média
│       │   ├── middlewares/
│       │   ├── prisma/
│       │   └── workers/     # Jobs asynchrones
│       └── uploads/
│
├── packages/
│   ├── shared/              # Code partagé
│   └── ui/                  # Composants UI réutilisables
│
└── docker-compose.yml
```

## Prérequis

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker** & **Docker Compose** (pour PostgreSQL et Redis)
- **Git**

## Installation

1. **Cloner le dépôt**
```bash
git clone <repository-url>
cd ClimbTracker-Hueco
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

4. **Démarrer les services Docker**
```bash
npm run docker:up
```

5. **Initialiser la base de données**
```bash
npm run prisma:migrate
npm run seed
```

## Développement

### Démarrer le serveur de développement

```bash
# Démarrer frontend + backend simultanément
npm run dev

# Ou séparément:
npm run dev:web    # Frontend sur http://localhost:5173
npm run dev:api    # Backend sur http://localhost:3000
```

### Accès aux services

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (après `npm run prisma:studio`)

## Base de données

### Migrations Prisma

```bash
# Créer une nouvelle migration
npm run prisma:migrate

# Générer le client Prisma
npm run prisma:generate

# Ouvrir Prisma Studio (interface graphique)
npm run prisma:studio
```

### Seeding

```bash
npm run seed
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre frontend + backend |
| `npm run dev:web` | Démarre uniquement le frontend |
| `npm run dev:api` | Démarre uniquement le backend |
| `npm run build` | Build frontend + backend |
| `npm run prisma:generate` | Génère le client Prisma |
| `npm run prisma:migrate` | Exécute les migrations |
| `npm run prisma:studio` | Ouvre Prisma Studio |
| `npm run docker:up` | Démarre PostgreSQL et Redis |
| `npm run docker:down` | Arrête les containers Docker |
| `npm run seed` | Seed la base de données |
| `npm run test` | Lance les tests |

## Variables d'environnement

Voir le fichier `.env.example` pour la liste complète des variables requises.

### Variables essentielles

```env
# Database
DATABASE_URL="postgresql://climbtracker:password@localhost:5432/climbtracker"
REDIS_URL="redis://localhost:6379"

# Auth
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# Media Storage (Cloudinary)
CLOUDINARY_URL="cloudinary://..."
```

## Documentation

- Voir [CLAUDE.md](./CLAUDE.md) pour la documentation technique complète
- Voir les commentaires dans le code pour plus de détails
- Consulter la documentation des APIs utilisées

## Contribution

1. Créer une branche feature: `git checkout -b feature/ma-fonctionnalite`
2. Commiter les changements: `git commit -m "feat: ajout de ma fonctionnalité"`
3. Pousser vers la branche: `git push origin feature/ma-fonctionnalite`
4. Ouvrir une Pull Request

## Licence

MIT
