# 🧗 ClimbTracker - Application de suivi d'escalade

> **Mise à jour importante:** Le projet utilise maintenant **TypeORM** au lieu de Prisma pour un meilleur support Windows.

## 📋 Description

Application web pour salle d'escalade permettant aux ouvreurs de documenter leurs voies et à la communauté de partager leurs réussites, conseils et progressions.

## ✨ Statut du projet

- ✅ **Phase 1 (P1)**: Authentification & Infrastructure - **TERMINÉ**
- ⏳ **Phase 2 (P2)**: Gestion des Voies - En attente
- ⏳ **Phase 3 (P3)**: Fonctionnalités IA - En attente

## 🛠️ Stack technique

### Backend
- **Node.js 20+** avec Express
- **TypeScript** pour la sécurité des types
- **TypeORM** comme ORM (✨ migration de Prisma)
- **PostgreSQL** pour la base de données
- **JWT** pour l'authentification
- **Zod** pour la validation

### Frontend
- **React 18+** avec Vite
- **TypeScript**
- **Tailwind CSS** + shadcn/ui
- **Zustand** pour le state management
- **React Router v6**
- **Axios** pour les requêtes API

### Infrastructure
- **Docker** pour PostgreSQL et Redis
- **Docker Compose** pour l'orchestration

## 🚀 Démarrage rapide

### Prérequis
- Node.js 20+
- Docker Desktop
- npm ou yarn

### Installation

1. **Cloner le repo**
```bash
git clone <repo-url>
cd ClimbTracker-Hueco
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer PostgreSQL avec Docker**
```bash
npm run docker:up
```

4. **Créer les tables et seed la base**
```bash
npm run seed
```

5. **Lancer l'application**
```bash
npm run dev
```

L'application sera disponible sur:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health check: http://localhost:3000/health

## 👥 Comptes de test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@climbtracker.com | password123 | ADMIN |
| opener@climbtracker.com | password123 | OPENER |
| climber1@climbtracker.com | password123 | CLIMBER |
| climber2@climbtracker.com | password123 | CLIMBER |

## 📁 Structure du projet

```
ClimbTracker-Hueco/
├── apps/
│   ├── api/                    # Backend Express + TypeORM
│   │   └── src/
│   │       ├── database/       # Entités TypeORM et seeds
│   │       ├── controllers/    # Contrôleurs
│   │       ├── services/       # Logique métier
│   │       ├── routes/         # Routes Express
│   │       ├── middlewares/    # Auth, validation, etc.
│   │       └── utils/          # Utilitaires
│   │
│   └── web/                    # Frontend React
│       └── src/
│           ├── components/     # Composants React
│           ├── pages/          # Pages
│           ├── stores/         # Zustand stores
│           ├── hooks/          # Custom hooks
│           └── lib/            # Client API
│
├── docker-compose.yml          # Configuration Docker
└── package.json                # Scripts racine
```

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev              # Lancer backend + frontend
npm run dev:api          # Lancer uniquement le backend
npm run dev:web          # Lancer uniquement le frontend

# Base de données
npm run seed             # Créer les utilisateurs de test
npm run docker:up        # Démarrer PostgreSQL et Redis
npm run docker:down      # Arrêter les services Docker

# Build
npm run build            # Build backend + frontend
npm run build:api        # Build uniquement backend
npm run build:web        # Build uniquement frontend

# Tests
npm test                 # Lancer tous les tests
```

## 📚 Documentation

- [**DEMARRAGE_TYPEORM.md**](DEMARRAGE_TYPEORM.md) - Guide de démarrage détaillé
- [**MIGRATION_TYPEORM.md**](MIGRATION_TYPEORM.md) - Détails de la migration Prisma → TypeORM
- [**P1_COMPLETE.md**](P1_COMPLETE.md) - Fonctionnalités Phase 1
- [**PLAN_DEVELOPPEMENT.md**](PLAN_DEVELOPPEMENT.md) - Roadmap complète
- [**TROUBLESHOOTING_WINDOWS.md**](TROUBLESHOOTING_WINDOWS.md) - Guide Windows

## 🆕 Changements récents (2026-01-03)

### Migration Prisma → TypeORM

Le projet a été migré de Prisma vers TypeORM pour résoudre les problèmes de compatibilité Windows.

**Avantages:**
- ✅ Meilleur support Windows (pas de binaires natifs)
- ✅ Installation plus fluide
- ✅ Flexibilité accrue
- ✅ Même API REST (aucun changement côté client)

**Ce qui a changé:**
- Remplacement de Prisma par TypeORM
- Nouvelle structure dans `apps/api/src/database/`
- Variables d'environnement mises à jour
- Scripts npm simplifiés

**Ce qui n'a PAS changé:**
- Endpoints API (identiques)
- Frontend (aucune modification)
- Fonctionnalités (100% préservées)
- Utilisateurs et rôles

## 🎯 Fonctionnalités actuelles (P1)

### Authentification complète
- ✅ Inscription avec email/password
- ✅ Connexion avec JWT
- ✅ Refresh tokens automatique
- ✅ Rôles: CLIMBER, OPENER, ADMIN
- ✅ Récupération mot de passe
- ✅ Routes protégées

### API REST
- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ POST /api/auth/refresh
- ✅ GET /api/auth/me
- ✅ POST /api/auth/logout

### Interface utilisateur
- ✅ Page de connexion
- ✅ Page d'inscription
- ✅ Dashboard protégé
- ✅ Navigation responsive
- ✅ Gestion d'erreurs

## 🚧 Prochaines fonctionnalités (P2)

- Gestion des voies d'escalade (CRUD)
- Upload de photos et vidéos
- Système de validation
- Commentaires
- Filtres et recherche
- Statistiques utilisateur

## 🐛 Troubleshooting

### Erreur de connexion à la base de données

```bash
# Vérifier que Docker est lancé
docker ps

# Redémarrer les services
npm run docker:down
npm run docker:up
```

### Port déjà utilisé

Modifiez le port dans `apps/api/.env`:
```env
PORT=3001
```

### Problèmes TypeORM

```bash
# Réinstaller les dépendances
cd apps/api
npm install
```

## 📞 Support

Pour toute question ou problème:
1. Consultez [TROUBLESHOOTING_WINDOWS.md](TROUBLESHOOTING_WINDOWS.md)
2. Vérifiez [DEMARRAGE_TYPEORM.md](DEMARRAGE_TYPEORM.md)
3. Créez une issue sur GitHub

## 📄 Licence

MIT

---

**Développé avec ❤️ pour la communauté d'escalade**
