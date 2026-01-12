import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { routesAPI, RouteCreateInput } from '../lib/api/routes';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { ImageUpload } from '../components/ImageUpload';
import { ColorPickerOnImage } from '../components/ColorPickerOnImage';
import { RouteTypeSelector } from '../components/RouteTypeSelector';
import { GymLayoutSelector } from '../components/GymLayoutSelector';
import { uploadRoutePhoto } from '../lib/upload';
import { categorizeHexColor } from '../lib/utils/colorUtils';

const DIFFICULTY_OPTIONS = [
  'Vert',
  'Vert clair',
  'Bleu clair',
  'Bleu foncé',
  'Violet',
  'Rose',
  'Rouge',
  'Orange',
  'Jaune',
  'Blanc',
  'Gris',
  'Noir',
];

export const CreateRoute = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDark, toggle } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    name: '',
    difficulty: 'Bleu clair',
    holdColorHex: '',
    holdColorCategory: '',
    sector: '',
    description: '',
    tips: '',
    mainPhoto: '',
    openingVideo: '',
    routeTypes: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.mainPhoto) {
      setError('Le nom et la photo principale sont obligatoires');
      return;
    }

    if (!formData.holdColorHex) {
      setError('Veuillez sélectionner la couleur des prises sur la photo');
      return;
    }

    if (!formData.holdColorCategory) {
      setError('Erreur de catégorisation de la couleur');
      return;
    }

    if (!formData.sector) {
      setError('Veuillez sélectionner le secteur sur le plan');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const route = await routesAPI.createRoute({
        ...formData,
        description: formData.description || undefined,
        tips: formData.tips || undefined,
        openingVideo: formData.openingVideo || undefined,
        routeTypes: formData.routeTypes.length > 0 ? formData.routeTypes : undefined,
      });

      navigate(`/routes/${route.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create route');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      const url = await uploadRoutePhoto(file);
      setFormData({ ...formData, mainPhoto: url });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload photo');
    }
  };

  const handleColorSelect = (hexColor: string) => {
    const category = categorizeHexColor(hexColor);
    setFormData({
      ...formData,
      holdColorHex: hexColor,
      holdColorCategory: category,
    });
  };

  const handleSectorSelect = (sector: string) => {
    setFormData({ ...formData, sector });
  };

  const handleRouteTypesChange = (types: string[]) => {
    setFormData({ ...formData, routeTypes: types });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen flex flex-col w-full max-w-md mx-auto overflow-hidden bg-mono-50 dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-mono-50/90 dark:bg-black/90 backdrop-blur-md border-b border-mono-200 dark:border-mono-800">
        <div className="flex items-center justify-between px-5 pt-12 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-mono-200 dark:hover:bg-mono-800 transition-colors"
            >
              <span className="material-symbols-outlined text-mono-900 dark:text-white">
                arrow_back
              </span>
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-mono-900 dark:text-white">
                Créer une voie
              </h1>
              <p className="text-[10px] font-medium text-mono-500 uppercase tracking-wider">
                ClimbTracker
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="relative p-2 rounded-full hover:bg-mono-200 dark:hover:bg-mono-800 transition-colors"
            >
              <span className="material-symbols-outlined text-mono-900 dark:text-white text-[22px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="relative p-2 rounded-full hover:bg-mono-200 dark:hover:bg-mono-800 transition-colors"
            >
              <span className="material-symbols-outlined text-mono-900 dark:text-white text-[22px]">
                logout
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-5 py-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-urgent/10 border border-urgent/20 rounded-xl text-urgent text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl p-5 border border-mono-200 dark:border-mono-800 shadow-card">
            <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
              Nom de la voie *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-mono-200 dark:border-mono-800 bg-white/70 dark:bg-mono-900 backdrop-blur-xl text-mono-900 dark:text-white placeholder:text-mono-400 focus:outline-none focus:border-mono-400 dark:focus:border-mono-600 transition-colors"
              placeholder="Ex: La Dalle du Débutant"
            />
          </div>

          {/* Difficulty */}
          <div className="rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl p-5 border border-mono-200 dark:border-mono-800 shadow-card">
            <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
              Grade de difficulté (couleur de cotation) *
            </label>
            <p className="text-xs text-mono-500 mb-2">
              Couleur attribuée par l'ouvreur pour indiquer le niveau
            </p>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-mono-200 dark:border-mono-800 bg-white/70 dark:bg-mono-900 backdrop-blur-xl text-mono-900 dark:text-white focus:outline-none focus:border-mono-400 dark:focus:border-mono-600 transition-colors"
            >
              {DIFFICULTY_OPTIONS.map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl p-5 border border-mono-200 dark:border-mono-800 shadow-card">
            <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-mono-200 dark:border-mono-800 bg-white/70 dark:bg-mono-900 backdrop-blur-xl text-mono-900 dark:text-white placeholder:text-mono-400 resize-none focus:outline-none focus:border-mono-400 dark:focus:border-mono-600 transition-colors"
              placeholder="Décrivez la voie, les types de mouvements, la difficulté..."
            ></textarea>
          </div>

          {/* Tips */}
          <div className="rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl p-5 border border-mono-200 dark:border-mono-800 shadow-card">
            <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
              Conseils
            </label>
            <textarea
              name="tips"
              value={formData.tips}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-mono-200 dark:border-mono-800 bg-white/70 dark:bg-mono-900 backdrop-blur-xl text-mono-900 dark:text-white placeholder:text-mono-400 resize-none focus:outline-none focus:border-mono-400 dark:focus:border-mono-600 transition-colors"
              placeholder="Conseils pour réussir la voie..."
            ></textarea>
          </div>

          {/* Photo Upload */}
          <div className="rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl p-5 border border-mono-200 dark:border-mono-800 shadow-card">
            <ImageUpload
              onUpload={handlePhotoUpload}
              currentImage={formData.mainPhoto}
              label="Photo principale de la voie *"
              maxSize={10}
            />
          </div>

          {/* Color Picker - Only shown after photo is uploaded */}
          {formData.mainPhoto && (
            <div className="rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl p-5 border border-mono-200 dark:border-mono-800 shadow-card">
              <ColorPickerOnImage
                imageUrl={formData.mainPhoto}
                onColorSelect={handleColorSelect}
                selectedColor={formData.holdColorHex}
                colorCategory={formData.holdColorCategory}
              />
            </div>
          )}

          {/* Gym Layout Selector */}
          <div className="rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl p-5 border border-mono-200 dark:border-mono-800 shadow-card">
            <GymLayoutSelector
              onSectorSelect={handleSectorSelect}
              selectedSector={formData.sector}
            />
          </div>

          {/* Route Types */}
          <div className="rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl p-5 border border-mono-200 dark:border-mono-800 shadow-card">
            <RouteTypeSelector
              selectedTypes={formData.routeTypes}
              onChange={handleRouteTypesChange}
            />
          </div>

          {/* Video URL */}
          <div className="rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl p-5 border border-mono-200 dark:border-mono-800 shadow-card">
            <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
              Vidéo d'ouverture (URL YouTube, optionnel)
            </label>
            <input
              type="url"
              name="openingVideo"
              value={formData.openingVideo}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-mono-200 dark:border-mono-800 bg-white/70 dark:bg-mono-900 backdrop-blur-xl text-mono-900 dark:text-white placeholder:text-mono-400 focus:outline-none focus:border-mono-400 dark:focus:border-mono-600 transition-colors"
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="flex-1 bg-mono-100 dark:bg-mono-800 text-mono-900 dark:text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-card disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:bg-mono-200 dark:hover:bg-mono-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-mono-900 dark:bg-white text-white dark:text-black font-semibold py-4 px-6 rounded-xl transition-all shadow-card disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? 'Création...' : 'Créer la voie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
