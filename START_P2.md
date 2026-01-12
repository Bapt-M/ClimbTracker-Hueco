# 🚀 Démarrage Rapide - Projet 2

## ✅ Prérequis
- Docker Desktop démarré (PostgreSQL + Redis)
- `docker ps` devrait montrer `climbtracker-postgres` et `climbtracker-redis`

## 🎯 Démarrage

### Option 1 : Utiliser 2 terminaux séparés (RECOMMANDÉ)

**Terminal 1 - Backend:**
```bash
cd apps/api
npm start
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev
```

### Option 2 : Build + Start

```bash
# Terminal 1 - Backend
cd apps/api
npm run build
npm start

# Terminal 2 - Frontend
cd apps/web
npm run dev
```

## 📱 Accès

- **Frontend:** http://localhost:5174 (ou 5173)
- **API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

## 👤 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| ADMIN | admin@climbtracker.com | password123 |
| OPENER | opener@climbtracker.com | password123 |
| CLIMBER | climber1@climbtracker.com | password123 |

## 🧗 Fonctionnalités à tester

### En tant que CLIMBER
1. Aller sur `/routes` - Voir les 8 voies de test
2. Utiliser la recherche et les filtres
3. Cliquer sur une carte pour voir le détail
4. Voir la vidéo sur "Toit Challenge"

### En tant que OPENER
1. Se connecter avec `opener@climbtracker.com`
2. Cliquer "Créer une voie" dans le Dashboard
3. Remplir le formulaire
4. **Note:** Upload nécessite Cloudinary (voir ci-dessous)

### En tant que ADMIN
1. Se connecter avec `admin@climbtracker.com`
2. Aller sur une voie PENDING ("Nouvelle Création")
3. Changer le statut en ACTIVE
4. Tester la suppression d'une voie

## ⚙️ Configuration Cloudinary (Optionnel)

Pour tester l'upload de photos/vidéos :

1. Créer un compte gratuit sur [cloudinary.com](https://cloudinary.com)
2. Copier vos credentials
3. Éditer `apps/api/.env` :

```env
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"
```

4. Redémarrer le backend

**Sans Cloudinary :** Tout fonctionne sauf l'upload (liste, détails, filtres, etc. OK)

## 🐛 Problèmes courants

### Le backend ne démarre pas
```bash
# Solution 1 : Vérifier Docker
docker ps

# Solution 2 : Rebuild
cd apps/api
npm run build
npm start

# Solution 3 : Vérifier .env
cat apps/api/.env
```

### Port déjà utilisé
```bash
# Trouver et tuer le processus
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou changer le port dans apps/api/.env
PORT=3001
```

### Erreur connexion database
```bash
# Redémarrer Docker
npm run docker:down
npm run docker:up

# Attendre 15 secondes puis relancer le backend
```

## ✅ Vérification

Si tout fonctionne :
- ✅ http://localhost:3000/health retourne `{"status":"ok"}`
- ✅ http://localhost:5174 affiche la page de login
- ✅ Après login, vous voyez le Dashboard
- ✅ `/routes` affiche 8 voies

## 🎉 C'est parti !

Le Projet 2 est 100% fonctionnel. Bon test ! 🧗‍♂️
