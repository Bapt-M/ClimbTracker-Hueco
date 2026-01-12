# 🔧 Dépannage Windows - Problème Prisma

## Problème rencontré

```
Error: P1000: Authentication failed against database server
the provided database credentials for `(not available)` are not valid.
```

Le message `(not available)` suggère que Prisma ne peut pas parser correctement l'URL de connexion sur Windows.

---

## ✅ Solution 1: Utiliser PowerShell au lieu de Git Bash

Git Bash peut avoir des problèmes avec les URLs et chemins sur Windows.

```powershell
# Ouvrir PowerShell en tant qu'administrateur
cd C:\Users\bapti\Desktop\ClimbTracker\ClimbTracker-Hueco

# Essayer la migration
npm run prisma:migrate
```

---

## ✅ Solution 2: Créer les tables manuellement via SQL

```bash
# 1. Générer le SQL de migration
cd apps/api
npx prisma migrate dev --create-only --name init

# 2. Appliquer manuellement le SQL
docker exec -i climbtracker-postgres psql -U climbtracker -d climbtracker < prisma/migrations/XXXXXXXX_init/migration.sql

# 3. Marquer comme appliqué
npx prisma migrate resolve --applied init
```

---

## ✅ Solution 3: Utiliser db push (sans migrations)

Au lieu des migrations, utilisez `db push` qui est plus simple:

```bash
cd apps/api
npx prisma db push --skip-generate
npx prisma generate
```

---

## ✅ Solution 4: Exécuter SQL directement

Créez les tables manuellement:

```bash
# Se connecter à PostgreSQL
docker exec -it climbtracker-postgres psql -U climbtracker -d climbtracker

# Puis exécuter le SQL suivant:
```

```sql
-- Créer les enums
CREATE TYPE "Role" AS ENUM ('CLIMBER', 'OPENER', 'ADMIN');
CREATE TYPE "RouteStatus" AS ENUM ('PENDING', 'ACTIVE', 'ARCHIVED');
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- Créer la table users
CREATE TABLE "users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'CLIMBER',
  "avatar" TEXT,
  "bio" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Créer la table routes
CREATE TABLE "routes" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "grade" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  "sector" TEXT NOT NULL,
  "description" TEXT,
  "tips" TEXT,
  "openerId" TEXT NOT NULL,
  "mainPhoto" TEXT NOT NULL,
  "openingVideo" TEXT,
  "status" "RouteStatus" NOT NULL DEFAULT 'PENDING',
  "openedAt" TIMESTAMP(3) NOT NULL,
  "closedAt" TIMESTAMP(3),
  "holdMapping" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("openerId") REFERENCES "users"("id")
);

-- Créer la table validations
CREATE TABLE "validations" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "routeId" TEXT NOT NULL,
  "validatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "personalNote" TEXT,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE CASCADE,
  UNIQUE ("userId", "routeId")
);

-- Créer la table comments
CREATE TABLE "comments" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "content" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "routeId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "mediaUrl" TEXT,
  "mediaType" "MediaType",
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE CASCADE
);

-- Créer la table videos
CREATE TABLE "videos" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "url" TEXT NOT NULL,
  "thumbnailUrl" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "routeId" TEXT NOT NULL,
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Créer la table analyses
CREATE TABLE "analyses" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "videoId" TEXT NOT NULL UNIQUE,
  "routeId" TEXT NOT NULL,
  "poseData" JSONB NOT NULL,
  "globalScore" DOUBLE PRECISION NOT NULL,
  "detailScores" JSONB NOT NULL,
  "suggestions" JSONB NOT NULL,
  "highlights" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE CASCADE,
  FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE CASCADE
);
```

Puis générer le client Prisma:

```bash
cd apps/api
npx prisma generate
```

---

## ✅ Solution 5: Modifier le schema temporairement

Retirez temporairement le mot de passe de l'URL:

```prisma
// apps/api/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://climbtracker@localhost:5432/climbtracker"
}
```

Puisque PostgreSQL est configuré avec `trust`, le mot de passe n'est pas nécessaire.

---

## 🧪 Vérifier que tout fonctionne

Après avoir créé les tables (quelle que soit la méthode), vérifiez:

```bash
# 1. Vérifier les tables
docker exec climbtracker-postgres psql -U climbtracker -d climbtracker -c "\dt"

# 2. Générer le client Prisma
cd apps/api
npx prisma generate

# 3. Seed la base
npm run seed

# 4. Lancer l'app
npm run dev
```

---

## 📞 Si rien ne fonctionne

Utilisez une base de données locale PostgreSQL installée directement sur Windows au lieu de Docker, ou utilisez un service cloud gratuit comme:

- **Supabase** (gratuit): https://supabase.com
- **Railway** (gratuit): https://railway.app
- **Neon** (gratuit): https://neon.tech

Puis changez la DATABASE_URL dans `.env` pour pointer vers ce service.

---

**Note:** Ce problème semble spécifique à Windows + Docker + Git Bash. Sur Linux/Mac, les commandes Prisma fonctionnent normalement.
