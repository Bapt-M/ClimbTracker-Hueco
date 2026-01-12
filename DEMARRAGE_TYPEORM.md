# 🚀 Guide de Démarrage - ClimbTracker avec TypeORM

## ✅ Migration terminée

Le projet P1 a été migré avec succès de Prisma vers TypeORM pour un meilleur support Windows.

## 📋 Prérequis

- Node.js 20+
- Docker Desktop (pour PostgreSQL)
- Un terminal (PowerShell, CMD, ou Git Bash)

## 🎯 Démarrage rapide (3 étapes)

### 1️⃣ Démarrer Docker Desktop

**Important:** Avant de continuer, assurez-vous que Docker Desktop est démarré sur Windows.

Ensuite, lancez PostgreSQL:

```bash
npm run docker:up
```

Attendez 10-15 secondes que PostgreSQL soit prêt.

### 2️⃣ Créer les tables et utilisateurs de test

```bash
npm run seed
```

Cette commande va:
- ✅ Se connecter à PostgreSQL
- ✅ Créer automatiquement toutes les tables (synchronize: true)
- ✅ Insérer 4 utilisateurs de test
- ✅ Fermer la connexion

Vous devriez voir:
```
🔄 Initializing database connection...
✅ Database connected
🌱 Seeding users...
✅ Created user: admin@climbtracker.com
✅ Created user: opener@climbtracker.com
✅ Created user: climber1@climbtracker.com
✅ Created user: climber2@climbtracker.com
🎉 Seed completed successfully!
```

### 3️⃣ Lancer l'application

```bash
npm run dev
```

Cela démarre:
- 🔧 Backend API sur http://localhost:3000
- 🎨 Frontend React sur http://localhost:5173

Vous devriez voir:
```
✅ Database connection established successfully
🚀 Server running on http://localhost:3000
📊 Environment: development
🔍 Health check: http://localhost:3000/health
```

## 🧪 Tester l'application

### Option 1: Interface Web

1. Ouvrez http://localhost:5173
2. Cliquez sur "Se connecter"
3. Utilisez un compte de test:
   - Email: `climber1@climbtracker.com`
   - Password: `password123`
4. Vous devriez être redirigé vers le dashboard

### Option 2: API directement (cURL)

```bash
# Test health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"climber1@climbtracker.com\",\"password\":\"password123\"}"
```

## 👥 Utilisateurs de test disponibles

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@climbtracker.com | password123 | ADMIN |
| opener@climbtracker.com | password123 | OPENER |
| climber1@climbtracker.com | password123 | CLIMBER |
| climber2@climbtracker.com | password123 | CLIMBER |

## 🛠️ Commandes utiles

```bash
# Démarrer l'app (backend + frontend)
npm run dev

# Démarrer uniquement le backend
npm run dev:api

# Démarrer uniquement le frontend
npm run dev:web

# Relancer le seed (réinitialiser les utilisateurs)
npm run seed

# Arrêter Docker
npm run docker:down

# Redémarrer Docker
npm run docker:down && npm run docker:up
```

## 🐛 Troubleshooting

### Erreur: "Cannot connect to database"

```bash
# Vérifier que PostgreSQL est démarré
docker ps

# Vous devriez voir climbtracker-postgres
# Si non, démarrer Docker:
npm run docker:up
```

### Erreur: "Users already exist"

C'est normal! Le seed ne recrée pas les utilisateurs s'ils existent déjà.

Pour réinitialiser complètement la base:
```bash
# Arrêter et supprimer le volume
npm run docker:down
docker volume rm climbtracker_postgres_data

# Redémarrer
npm run docker:up
npm run seed
```

### Port 3000 ou 5173 déjà utilisé

Modifiez le port dans `.env`:
```env
PORT=3001
```

### Erreur TypeScript

```bash
# Réinstaller les dépendances
cd apps/api
npm install
cd ../..
```

## 📊 Vérifier que tout fonctionne

### 1. Base de données

```bash
# Vérifier les tables créées
docker exec -it climbtracker-postgres psql -U climbtracker -d climbtracker -c "\dt"
```

Vous devriez voir:
- users
- routes
- validations
- comments
- videos
- analyses

### 2. API Endpoints

Tous ces endpoints doivent fonctionner:

- ✅ GET /health - Health check
- ✅ POST /api/auth/register - Inscription
- ✅ POST /api/auth/login - Connexion
- ✅ POST /api/auth/refresh - Refresh token
- ✅ GET /api/auth/me - Utilisateur actuel
- ✅ POST /api/auth/logout - Déconnexion

### 3. Frontend

- ✅ Page login: http://localhost:5173/login
- ✅ Page register: http://localhost:5173/register
- ✅ Dashboard (protégé): http://localhost:5173/

## 🎉 Prochaines étapes

Le projet P1 est maintenant opérationnel avec TypeORM!

Vous pouvez:
1. ✅ Tester l'authentification complète
2. ✅ Vérifier que tout persiste correctement
3. 🚀 Passer au Projet P2 - Gestion des Voies

## 📚 Documentation

- `MIGRATION_TYPEORM.md` - Détails de la migration Prisma → TypeORM
- `P1_COMPLETE.md` - Fonctionnalités du Projet 1
- `PLAN_DEVELOPPEMENT.md` - Roadmap complète

---

**Bon développement! 🧗‍♂️**
