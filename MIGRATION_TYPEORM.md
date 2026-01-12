# 🔄 Migration Prisma → TypeORM - TERMINÉ

## ✅ Changements effectués

Le projet a été migré avec succès de Prisma vers **TypeORM**, qui offre un meilleur support sur Windows.

### 1. Packages installés

```bash
npm install typeorm reflect-metadata pg
npm uninstall @prisma/client prisma
```

### 2. Structure TypeORM créée

```
apps/api/src/database/
├── data-source.ts           # Configuration TypeORM
├── entities/                # Entités (modèles)
│   ├── User.ts
│   ├── Route.ts
│   ├── Validation.ts
│   ├── Comment.ts
│   ├── Video.ts
│   ├── Analysis.ts
│   └── index.ts
├── migrations/              # Migrations futures
└── seeds/
    └── seed.ts              # Script de seed
```

### 3. Changements dans le code

#### Configuration (data-source.ts)
- Auto-synchronisation activée en développement
- Support PostgreSQL avec configuration par variables d'environnement
- Logging en mode développement

#### Entités TypeORM
Toutes les entités Prisma ont été converties:
- **User** avec enum UserRole (CLIMBER, OPENER, ADMIN)
- **Route** avec enum RouteStatus (PENDING, ACTIVE, ARCHIVED)
- **Validation** avec contrainte unique (userId, routeId)
- **Comment** avec enum MediaType (IMAGE, VIDEO)
- **Video** avec relation OneToOne vers Analysis
- **Analysis** avec colonnes JSON pour les données IA

#### Service d'authentification
- Remplacé `prisma.user` par `getUserRepository()`
- API TypeORM: `findOne()`, `create()`, `save()`
- Même logique métier, syntaxe différente

#### Serveur principal (index.ts)
- Import de `reflect-metadata` (requis pour TypeORM)
- Initialisation de la base au démarrage avec `initializeDatabase()`
- Graceful shutdown adapté pour TypeORM

### 4. Variables d'environnement mises à jour

Le fichier `.env` utilise maintenant des variables individuelles:

```env
# Database (TypeORM)
DB_HOST=localhost
DB_PORT=5432
DB_USER=climbtracker
DB_PASSWORD=climbtrack123
DB_NAME=climbtracker

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="http://localhost:5173"
```

### 5. Scripts npm mis à jour

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "seed": "tsx src/database/seeds/seed.ts"  // ✅ Nouveau chemin
  }
}
```

Les commandes Prisma ont été supprimées du package.json racine.

## 🚀 Démarrage rapide

### 1. Vérifier que PostgreSQL est démarré

```bash
npm run docker:up
```

### 2. Lancer le seed (créer les utilisateurs de test)

```bash
npm run seed
```

Le seed créera automatiquement les tables grâce à `synchronize: true` en développement.

### 3. Démarrer l'application

```bash
npm run dev
```

L'API sera disponible sur http://localhost:3000

## 📝 Utilisateurs de test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@climbtracker.com | password123 | ADMIN |
| opener@climbtracker.com | password123 | OPENER |
| climber1@climbtracker.com | password123 | CLIMBER |
| climber2@climbtracker.com | password123 | CLIMBER |

## 🔍 Différences clés Prisma vs TypeORM

### Prisma (ancien)
```typescript
const user = await prisma.user.findUnique({
  where: { email },
});

const user = await prisma.user.create({
  data: { email, password, name }
});
```

### TypeORM (nouveau)
```typescript
const userRepository = getUserRepository();

const user = await userRepository.findOne({
  where: { email },
});

const user = userRepository.create({ email, password, name });
await userRepository.save(user);
```

## ✅ Avantages de TypeORM

1. **Meilleur support Windows** - Pas de problèmes de binaires natifs
2. **Plus flexible** - Support de multiples patterns (Active Record, Data Mapper)
3. **Migrations robustes** - Système de migration éprouvé
4. **Decorators TypeScript** - Définition claire des entités
5. **Communauté large** - Plus de ressources et exemples

## 🧪 Tests

Tous les endpoints d'authentification fonctionnent identiquement:

- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ POST /api/auth/refresh
- ✅ GET /api/auth/me
- ✅ POST /api/auth/logout

## 📚 Prochaines étapes

Le projet P1 est maintenant migré vers TypeORM et prêt pour continuer le développement:

1. **Tout fonctionne comme avant** - Aucun changement dans l'API REST
2. **Meilleure expérience Windows** - Plus de problèmes Prisma
3. **Prêt pour P2** - Gestion des voies avec TypeORM

---

**Migration réussie! 🎉 Le système d'authentification fonctionne maintenant avec TypeORM.**
