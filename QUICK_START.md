# 🚀 Quick Start - ClimbTracker

Guide de démarrage rapide pour lancer l'application en 5 minutes.

---

## ✅ Prérequis

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker Desktop (pour PostgreSQL et Redis)

---

## 📦 Installation (1 minute)

```bash
# 1. Installer toutes les dépendances
npm install
```

**Note:** Les fichiers `.env` sont déjà créés avec les bonnes valeurs par défaut:
- ✅ `apps/api/.env` - Backend
- ✅ `apps/web/.env` - Frontend
- ✅ `.env` - Racine

---

## 🐳 Démarrer les services (30 secondes)

```bash
# Démarrer PostgreSQL et Redis avec Docker
npm run docker:up

# Attendre 10-15 secondes que les services démarrent
```

**Vérifier que Docker fonctionne:**
```bash
docker ps
# Vous devriez voir: climbtracker-postgres et climbtracker-redis
```

---

## 🗄️ Initialiser la base de données (1 minute)

```bash
# 1. Générer le client Prisma
npm run prisma:generate

# 2. Créer la base de données et appliquer les migrations
npm run prisma:migrate

# 3. Seed avec des utilisateurs de test
npm run seed
```

**Utilisateurs créés:**
- `admin@climbtracker.com` / `password123` (ADMIN)
- `opener@climbtracker.com` / `password123` (OPENER)
- `climber1@climbtracker.com` / `password123` (CLIMBER)
- `climber2@climbtracker.com` / `password123` (CLIMBER)

---

## 🚀 Lancer l'application (30 secondes)

```bash
# Démarrer frontend + backend simultanément
npm run dev
```

**Ou séparément:**
```bash
# Terminal 1 - Backend
npm run dev:api

# Terminal 2 - Frontend
npm run dev:web
```

---

## 🌐 Accéder à l'application

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

---

## 🎯 Tester rapidement

1. Ouvrir http://localhost:5173
2. Se connecter avec `climber1@climbtracker.com` / `password123`
3. Voir le dashboard avec vos informations

**Ou tester l'API directement:**
```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"climber1@climbtracker.com","password":"password123"}'
```

---

## 🛠️ Commandes utiles

```bash
# Arrêter les services Docker
npm run docker:down

# Voir la base de données (interface graphique)
npm run prisma:studio
# Ouvre http://localhost:5555

# Réinitialiser la base de données
npm run prisma:migrate
npm run seed

# Tests (à venir)
npm run test
```

---

## ❌ Problèmes courants

### Docker ne démarre pas
```bash
# Vérifier que Docker Desktop est lancé
docker ps

# Redémarrer les services
npm run docker:down
npm run docker:up
```

### Port 3000 déjà utilisé
```bash
# Modifier le port dans apps/api/.env
PORT=3001

# Puis relancer
npm run dev:api
```

### Port 5173 déjà utilisé
```bash
# Vite utilisera automatiquement le prochain port disponible
# Ou modifier dans apps/web/vite.config.ts
```

### Prisma Client pas généré
```bash
npm run prisma:generate
```

### Base de données ne se connecte pas
```bash
# Vérifier que PostgreSQL tourne
docker ps | grep postgres

# Vérifier les logs
docker logs climbtracker-postgres
```

---

## 📚 Aller plus loin

- **Guide complet:** Voir `P1_COMPLETE.md`
- **Plan de développement:** Voir `PLAN_DEVELOPPEMENT.md`
- **Roadmap:** Voir `ROADMAP.md`
- **Notes techniques:** Voir `NOTES_DEPENDENCIES.md`

---

## 🎉 C'est tout!

Votre application ClimbTracker est maintenant lancée et fonctionnelle!

**Prochaine étape:** Passer au Projet 2 - Gestion des Voies 🧗‍♀️
