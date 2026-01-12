# 🧗 ClimbTracker - Document de Développement

## 📋 Vue d'ensemble du projet

Application web pour salle d'escalade permettant aux ouvreurs de documenter leurs voies et à la communauté de partager leurs réussites, conseils et progressions. L'application intègre des fonctionnalités d'IA pour la reconnaissance des prises et l'analyse des mouvements.

### Objectifs principaux
1. Créer un hub centralisé pour toutes les voies de la salle
2. Faciliter le partage de conseils et vidéos entre grimpeurs
3. Analyser automatiquement les performances via IA
4. Améliorer l'expérience des grimpeurs débutants et confirmés

## 🏗️ Architecture Technique

### Stack recommandé
```
Frontend:
- React 18+ avec TypeScript
- Vite comme bundler
- Tailwind CSS + shadcn/ui
- React Query (TanStack Query)
- React Router v6
- TensorFlow.js pour l'IA côté client

Backend:
- Node.js 20+ avec Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis pour le cache
- Bull pour les queues de jobs

Services:
- Cloudinary ou AWS S3 pour le stockage média
- JWT pour l'authentification
- MediaPipe pour l'analyse de mouvement
- OpenCV.js pour la détection des prises
```

## 📁 Structure du Projet
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

## 🗄️ Modèle de Données

### Schema Prisma
```prisma
// prisma/schema.prisma

model User {
  id            String      @id @default(cuid())
  email         String      @unique
  name          String
  role          Role        @default(CLIMBER)
  avatar        String?
  bio           String?
  createdAt     DateTime    @default(now())
  
  routes        Route[]     @relation("RouteOpener")
  validations   Validation[]
  comments      Comment[]
  videos        Video[]
}

enum Role {
  CLIMBER
  OPENER
  ADMIN
}

model Route {
  id            String      @id @default(cuid())
  name          String
  grade         String      // 4a, 5b+, 6c, etc.
  color         String
  sector        String
  description   String?
  tips          String?
  
  openerId      String
  opener        User        @relation("RouteOpener", fields: [openerId], references: [id])
  
  mainPhoto     String
  openingVideo  String?
  
  status        RouteStatus @default(PENDING)
  openedAt      DateTime
  closedAt      DateTime?
  
  holdMapping   Json?       // Données de détection des prises
  
  validations   Validation[]
  comments      Comment[]
  analyses      Analysis[]
}

enum RouteStatus {
  PENDING
  ACTIVE
  ARCHIVED
}

model Validation {
  id            String      @id @default(cuid())
  userId        String
  routeId       String
  validatedAt   DateTime    @default(now())
  personalNote  String?
  
  user          User        @relation(fields: [userId], references: [id])
  route         Route       @relation(fields: [routeId], references: [id])
  
  @@unique([userId, routeId])
}

model Comment {
  id            String      @id @default(cuid())
  content       String
  userId        String
  routeId       String
  createdAt     DateTime    @default(now())
  
  mediaUrl      String?
  mediaType     MediaType?
  
  user          User        @relation(fields: [userId], references: [id])
  route         Route       @relation(fields: [routeId], references: [id])
}

enum MediaType {
  IMAGE
  VIDEO
}

model Video {
  id            String      @id @default(cuid())
  url           String
  thumbnailUrl  String
  userId        String
  routeId       String
  uploadedAt    DateTime    @default(now())
  
  user          User        @relation(fields: [userId], references: [id])
  analysis      Analysis?
}

model Analysis {
  id            String      @id @default(cuid())
  videoId       String      @unique
  routeId       String
  
  poseData      Json        // Données MediaPipe
  globalScore   Float
  detailScores  Json
  suggestions   Json
  highlights    Json        // Timestamps des moments clés
  
  createdAt     DateTime    @default(now())
  
  video         Video       @relation(fields: [videoId], references: [id])
  route         Route       @relation(fields: [routeId], references: [id])
}
```

## 🎯 Fonctionnalités MVP (Phase 1)

### 1. Authentification
- [ ] Inscription/Connexion (email/password)
- [ ] Rôles : Grimpeur, Ouvreur, Admin
- [ ] JWT avec refresh token
- [ ] Récupération mot de passe

### 2. Gestion des voies
- [ ] CRUD voies (ouvreurs)
- [ ] Upload photo principale
- [ ] Upload vidéo d'ouverture
- [ ] Workflow de validation admin
- [ ] Archivage automatique

### 3. Interface utilisateur
- [ ] Hub des voies avec filtres
- [ ] Page détail voie
- [ ] Système de validation simple
- [ ] Commentaires texte

### 4. API Endpoints essentiels
```typescript
// Routes publiques
GET    /api/routes                 // Liste des voies
GET    /api/routes/:id             // Détail d'une voie
GET    /api/routes/:id/comments    // Commentaires

// Routes authentifiées
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

// Routes grimpeur
POST   /api/routes/:id/validate    // Valider une voie
POST   /api/routes/:id/comment     // Commenter
DELETE /api/routes/:id/validate    // Annuler validation

// Routes ouvreur
POST   /api/routes                 // Créer une voie
PUT    /api/routes/:id             // Modifier
POST   /api/upload/photo           // Upload photo
POST   /api/upload/video           // Upload vidéo

// Routes admin
PUT    /api/routes/:id/status      // Changer statut
DELETE /api/routes/:id             // Supprimer
```

## 🚀 Fonctionnalités Phase 2 - Engagement Communautaire

### 1. Médias enrichis
- [ ] Upload vidéos/photos par utilisateurs
- [ ] Galerie par voie
- [ ] Compression automatique
- [ ] Génération de thumbnails

### 2. Recherche avancée
- [ ] Filtres multiples (grade, secteur, date, popularité)
- [ ] Recherche textuelle
- [ ] Tri personnalisé
- [ ] Historique de recherche

### 3. Notifications
- [ ] Nouvelle voie dans grade préféré
- [ ] Réponse à commentaire
- [ ] Notification push (PWA)

### 4. Profil enrichi
- [ ] Statistiques personnelles
- [ ] Graphiques de progression
- [ ] Calendrier d'activité
- [ ] Partage profil

## 🤖 Fonctionnalités Phase 3 - Intelligence Artificielle

### 1. Détection des prises
```javascript
// lib/ai/hold-detection.ts

export class HoldDetector {
  private model: tf.GraphModel;
  
  async detectHolds(imageUrl: string): Promise<Hold[]> {
    // 1. Charger et préprocesser l'image
    const image = await this.loadImage(imageUrl);
    
    // 2. Segmentation par couleur HSV
    const colorSegments = this.segmentByColor(image);
    
    // 3. Détection de contours
    const contours = this.detectContours(colorSegments);
    
    // 4. Classification des prises
    const holds = await this.classifyHolds(contours);
    
    // 5. Post-traitement
    return this.postProcess(holds);
  }
  
  private segmentByColor(image: ImageData): Segment[] {
    // Conversion RGB -> HSV
    // Seuillage par couleur de prise
    // Morphologie pour nettoyer
  }
  
  private classifyHolds(contours: Contour[]): Hold[] {
    // Classification : jug, crimp, sloper, pinch, pocket
    // Taille estimée
    // Orientation
  }
}

interface Hold {
  id: string;
  position: { x: number; y: number };
  boundingBox: BBox;
  type: 'jug' | 'crimp' | 'sloper' | 'pinch' | 'pocket';
  color: string;
  confidence: number;
}
```

### 2. Analyse de mouvement MediaPipe
```javascript
// lib/ai/movement-analysis.ts

export class MovementAnalyzer {
  private pose: Pose;
  private hands: Hands;
  
  async analyzeClimbing(videoUrl: string): Promise<ClimbingAnalysis> {
    const frames = await this.extractFrames(videoUrl);
    const poseData: PoseFrame[] = [];
    
    for (const frame of frames) {
      // Détection pose complète
      const pose = await this.pose.process(frame);
      const hands = await this.hands.process(frame);
      
      poseData.push({
        timestamp: frame.timestamp,
        skeleton: pose.poseLandmarks,
        hands: hands.multiHandLandmarks,
        metrics: this.calculateMetrics(pose, previousPose)
      });
    }
    
    return {
      globalScore: this.calculateGlobalScore(poseData),
      fluidity: this.analyzeFluidity(poseData),
      technique: this.analyzeTechnique(poseData),
      efficiency: this.analyzeEfficiency(poseData),
      suggestions: this.generateSuggestions(poseData)
    };
  }
  
  private calculateMetrics(current: Pose, previous: Pose): Metrics {
    return {
      centerOfGravity: this.calculateCOG(current),
      jointAngles: this.calculateAngles(current),
      velocity: this.calculateVelocity(current, previous),
      stability: this.calculateStability(current)
    };
  }
  
  private generateSuggestions(data: PoseFrame[]): Suggestion[] {
    const suggestions = [];
    
    // Analyse des patterns sous-optimaux
    if (this.detectOvergripping(data)) {
      suggestions.push({
        timestamp: this.findTimestamp(),
        type: 'technique',
        message: 'Relâchez votre prise, vous sur-serrez',
        priority: 'medium'
      });
    }
    
    if (this.detectPoorHipPosition(data)) {
      suggestions.push({
        timestamp: this.findTimestamp(),
        type: 'posture',
        message: 'Rapprochez vos hanches du mur',
        priority: 'high'
      });
    }
    
    return suggestions;
  }
}
```

### 3. Pipeline de traitement
```javascript
// workers/video-processor.ts

export class VideoProcessor {
  async processClimbingVideo(jobData: VideoJob) {
    try {
      // 1. Download video
      const videoPath = await this.downloadVideo(jobData.videoUrl);
      
      // 2. Extract metadata
      const metadata = await this.extractMetadata(videoPath);
      
      // 3. Stabilization
      const stabilized = await this.stabilizeVideo(videoPath);
      
      // 4. Hold detection on key frame
      const holds = await this.detectHolds(stabilized);
      
      // 5. Movement analysis
      const analysis = await this.analyzeMovement(stabilized, holds);
      
      // 6. Generate highlights
      const highlights = await this.generateHighlights(analysis);
      
      // 7. Save results
      await this.saveAnalysis({
        videoId: jobData.videoId,
        routeId: jobData.routeId,
        analysis,
        highlights
      });
      
      // 8. Notify user
      await this.notifyComplete(jobData.userId);
      
    } catch (error) {
      await this.handleError(error, jobData);
    }
  }
}
```

## 📊 Système de scoring IA
```javascript
// Critères et pondération

const scoringCriteria = {
  fluidity: {
    weight: 0.30,
    factors: [
      'smoothTransitions',    // Pas de mouvements saccadés
      'constantRhythm',       // Vitesse régulière
      'noHesitation'         // Pas d'hésitations
    ]
  },
  
  technique: {
    weight: 0.25,
    factors: [
      'footWork',            // Utilisation optimale des pieds
      'hipPosition',         // Hanches proches du mur
      'armExtension',        // Bras tendus quand possible
      'bodyRotation'         // Rotations appropriées
    ]
  },
  
  precision: {
    weight: 0.20,
    factors: [
      'firstTryHolds',       // Prises du premier coup
      'stableFeet',          // Pieds bien placés
      'noReadjustments'      // Pas de repositionnements
    ]
  },
  
  endurance: {
    weight: 0.15,
    factors: [
      'restOptimization',    // Repos aux bons endroits
      'speedVariation',      // Gestion du rythme
      'muscleEfficiency'     // Économie musculaire
    ]
  },
  
  creativity: {
    weight: 0.10,
    factors: [
      'alternativeBeta',     // Solutions originales
      'dynamicMoves',        // Mouvements dynamiques maîtrisés
      'problemSolving'       // Adaptation aux difficultés
    ]
  }
};
```

## 🛠️ Scripts de développement
```json
// package.json scripts

{
  "scripts": {
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:web\"",
    "dev:api": "cd apps/api && npm run dev",
    "dev:web": "cd apps/web && npm run dev",
    "build": "npm run build:api && npm run build:web",
    "prisma:generate": "cd apps/api && npx prisma generate",
    "prisma:migrate": "cd apps/api && npx prisma migrate dev",
    "prisma:studio": "cd apps/api && npx prisma studio",
    "test": "npm run test:api && npm run test:web",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "seed": "cd apps/api && npm run seed"
  }
}
```

## 🚦 Workflow Git
```bash
# Branches
main          # Production
develop       # Développement
feature/*     # Nouvelles fonctionnalités
fix/*         # Corrections de bugs
release/*     # Préparation release

# Flow type
git checkout develop
git checkout -b feature/hold-detection
# ... développement ...
git add .
git commit -m "feat: add hold detection algorithm"
git push origin feature/hold-detection
# Pull request vers develop
```

## 📝 TODO Liste Phase 1 (MVP)

### Semaine 1-2 : Setup & Auth
- [ ] Initialiser le monorepo
- [ ] Setup Prisma + PostgreSQL
- [ ] Créer les modèles de base
- [ ] Implémenter auth JWT
- [ ] Pages login/register
- [ ] Guards et middlewares

### Semaine 3-4 : CRUD Voies
- [ ] API routes CRUD
- [ ] Upload média (Cloudinary/S3)
- [ ] Interface ouvreur
- [ ] Workflow de validation
- [ ] Page hub des voies
- [ ] Page détail voie

### Semaine 5-6 : Fonctionnalités sociales
- [ ] Système de validation
- [ ] Commentaires
- [ ] Profils utilisateur
- [ ] Filtres et recherche
- [ ] Statistiques basiques

### Semaine 7-8 : Polish & Deploy
- [ ] Responsive design
- [ ] Optimisation performances
- [ ] Tests E2E critiques
- [ ] Documentation API
- [ ] Déploiement (Vercel/Railway)
- [ ] Monitoring (Sentry)

## 🔧 Variables d'environnement
```env
# .env.example

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/climbtracker"
REDIS_URL="redis://localhost:6379"

# Auth
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# Media Storage
CLOUDINARY_URL="cloudinary://..."
# OR
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="..."

# AI Services
MEDIAPIPE_API_KEY="..."
TENSORFLOW_MODEL_URL="..."

# Frontend
VITE_API_URL="http://localhost:3000"
VITE_WS_URL="ws://localhost:3000"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="..."
SMTP_PASSWORD="..."
```

## 🎨 Design System
```javascript
// Configuration Tailwind suggérée

const colors = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    900: '#1e3a8a'
  },
  grade: {
    veryEasy: '#86efac',      // Vert clair - V-easy/VB (3-4a Bleau) - Débutant
    easy: '#22c55e',          // Vert foncé - V0 (4b-4c Bleau) - Débutant+
    easyPlus: '#7dd3fc',      // Bleu clair - V1 (5a-5b Bleau) - Intermédiaire-
    intermediate: '#3b82f6',  // Bleu foncé - V2 (5c-6a Bleau) - Intermédiaire
    intermediatePlus: '#a855f7', // Violet - V3 (6a+-6b Bleau) - Intermédiaire+
    advanced: '#ec4899',      // Rose - V4 (6b+-6c Bleau) - Confirmé-
    advancedPlus: '#ef4444',  // Rouge - V4-V5 (6c-6c+ Bleau) - Confirmé
    confirmed: '#f97316',     // Orange - V5 (7a Bleau) - Confirmé+
    expert: '#eab308',        // Jaune - V5-V6 (7a-7b Bleau) - Avancé
    veryExpert: '#e5e7eb',    // Blanc - V6-V7 (7b+-7c Bleau) - Expert
    extreme: '#6b7280'        // Gris - V8-V9 (7c+-8a Bleau) - Expert+
  },
  holds: {
    yellow: '#fbbf24',
    red: '#dc2626',
    blue: '#2563eb',
    green: '#16a34a',
    black: '#1f2937',
    white: '#f3f4f6',
    purple: '#9333ea',
    orange: '#ea580c'
  }
};
```

## 📚 Ressources & Documentation

### APIs & Libraries
- [Prisma Docs](https://www.prisma.io/docs)
- [MediaPipe](https://mediapipe.dev/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html)
- [Cloudinary](https://cloudinary.com/documentation)

### Références Escalade
- Système de cotation français
- Types de prises standards
- Mouvements techniques de base

## 🔍 Monitoring & Analytics
```javascript
// Services recommandés

- Sentry: Tracking d'erreurs
- Posthog: Analytics produit
- Grafana: Monitoring infrastructure
- LogRocket: Session replay
```

## 💡 Idées futures

1. **Mode compétition** : Contests avec classements
2. **AR Preview** : Visualisation en réalité augmentée
3. **Social features** : Follow, like, share
4. **Coaching IA** : Programme personnalisé
5. **Hardware** : Capteurs sur les prises
6. **Intégration** : Moonboard, Kilterboard
7. **Gamification** : Badges, achievements
8. **Abonnements** : Features premium
9. **Multi-salles** : Réseau de salles
10. **Export** : Données pour coaches

## 🎯 Commandes pour démarrer
```bash
# Cloner et installer
git clone [repo-url]
cd climb-tracker
npm install

# Setup base de données
docker-compose up -d postgres redis
npm run prisma:migrate
npm run prisma:seed

# Lancer le développement
npm run dev

# Accès
# Frontend: http://localhost:5173
# API: http://localhost:3000
# Prisma Studio: http://localhost:5555
```

---

*Ce document est le guide central pour le développement de ClimbTracker. Il doit être mis à jour régulièrement au fur et à mesure de l'avancement du projet.*