# Notes sur les Dépendances

## Dépendances IA retirées temporairement

Les packages suivants ont été **retirés** du `apps/web/package.json` car ils ne sont nécessaires que pour les **Projets 7-8 (Intelligence Artificielle)** et causaient des erreurs d'installation:

- `@mediapipe/pose`
- `@mediapipe/hands`
- `@tensorflow/tfjs`

### Pourquoi?

1. **MVP d'abord**: Les Projets 1-4 (MVP) n'utilisent pas l'IA
2. **Versions obsolètes**: Les packages MediaPipe ont été dépréciés
3. **Installation sans erreurs**: Permet de démarrer le développement immédiatement

---

## Quand ajouter les dépendances IA?

### Pour le Projet 7 (Détection des Prises)

Utiliser **TensorFlow.js** et **OpenCV.js** à la place de MediaPipe:

```bash
cd apps/web
npm install @tensorflow/tfjs @tensorflow/tfjs-core opencv.js
```

Ou utiliser les alternatives modernes:

```bash
npm install @tensorflow/tfjs @tensorflow-models/coco-ssd
```

### Pour le Projet 8 (Analyse Mouvement)

Utiliser **MediaPipe via CDN** plutôt que npm (recommandé):

```html
<!-- Dans apps/web/index.html -->
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" crossorigin="anonymous"></script>
```

Ou utiliser la nouvelle version:

```bash
npm install @mediapipe/tasks-vision
```

---

## Alternative: Utiliser @google/mediapipe

Pour les Projets 7-8, vous pouvez également utiliser:

```bash
npm install @google/mediapipe
```

---

## Dépendances actuelles par projet

### Projets 1-4 (MVP) ✅
- React, React Router, Zustand
- Axios, React Query
- Tailwind CSS, Lucide React
- date-fns

### Projet 5-6 (Enrichissement)
Ajouter:
```bash
npm install @tanstack/react-table recharts
npm install socket.io-client  # Pour real-time
```

### Projet 7 (Détection Prises)
Ajouter:
```bash
npm install @tensorflow/tfjs opencv.js
```

### Projet 8 (Analyse Mouvement)
Ajouter:
```bash
npm install @mediapipe/tasks-vision
# OU utiliser CDN (voir ci-dessus)
```

---

## Installation actuelle (Projet 1)

Pour installer les dépendances actuelles sans erreur:

```bash
# Depuis la racine du projet
npm install

# Ou installer uniquement le frontend
cd apps/web
npm install
```

Toutes les dépendances nécessaires pour les Projets 1-4 sont maintenant installables sans erreur!

---

**Note:** Les exemples de code IA dans CLAUDE.md restent valides, mais les imports devront être adaptés selon les packages choisis lors de l'implémentation des Projets 7-8.
