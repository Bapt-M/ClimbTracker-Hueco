import { useState, useEffect } from 'react';
import { Route, routesAPI } from '../lib/api/routes';
import { ImageUpload } from './ImageUpload';
import { ColorPickerOnImage } from './ColorPickerOnImage';
import { GymLayoutSelector } from './GymLayoutSelector';
import { uploadRoutePhoto } from '../lib/upload';
import { categorizeHexColor } from '../lib/utils/colorUtils';

interface EditRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route;
  onRouteUpdated: () => void;
}

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

export const EditRouteModal = ({ isOpen, onClose, route, onRouteUpdated }: EditRouteModalProps) => {
  const [formData, setFormData] = useState({
    name: route.name,
    difficulty: route.difficulty,
    sector: route.sector,
    description: route.description || '',
    tips: route.tips || '',
    mainPhoto: route.mainPhoto,
    holdColorHex: route.holdColorHex,
    holdColorCategory: route.holdColorCategory,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: route.name,
        difficulty: route.difficulty,
        sector: route.sector,
        description: route.description || '',
        tips: route.tips || '',
        mainPhoto: route.mainPhoto,
        holdColorHex: route.holdColorHex,
        holdColorCategory: route.holdColorCategory,
      });
      setError(null);
    }
  }, [isOpen, route]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (file: File) => {
    try {
      const url = await uploadRoutePhoto(file);
      setFormData({ ...formData, mainPhoto: url });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'upload de la photo');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await routesAPI.updateRoute(route.id, formData);
      onRouteUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-mono-900 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-mono-900 border-b border-mono-200 dark:border-mono-800 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-mono-900 dark:text-white">
            Modifier la voie
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
            disabled={loading}
          >
            <span className="material-symbols-outlined text-mono-600 dark:text-mono-300">
              close
            </span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
              Nom de la voie
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-mono-50 dark:bg-mono-800 border border-mono-200 dark:border-mono-700 rounded-xl text-mono-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-highlight"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
              Grade de difficulté (couleur de cotation)
            </label>
            <p className="text-xs text-mono-500 mb-2">
              Couleur attribuée par l'ouvreur pour indiquer le niveau
            </p>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-mono-50 dark:bg-mono-800 border border-mono-200 dark:border-mono-700 rounded-xl text-mono-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-highlight"
            >
              {DIFFICULTY_OPTIONS.map((diff) => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          {/* Sector */}
          <div>
            <GymLayoutSelector
              onSectorSelect={handleSectorSelect}
              selectedSector={formData.sector}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-mono-50 dark:bg-mono-800 border border-mono-200 dark:border-mono-700 rounded-xl text-mono-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-highlight resize-none"
              placeholder="Description de la voie..."
            />
          </div>

          {/* Tips */}
          <div>
            <label className="block text-sm font-semibold text-mono-900 dark:text-white mb-2">
              Conseils
            </label>
            <textarea
              name="tips"
              value={formData.tips}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-mono-50 dark:bg-mono-800 border border-mono-200 dark:border-mono-700 rounded-xl text-mono-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-highlight resize-none"
              placeholder="Conseils pour réussir cette voie..."
            />
          </div>

          {/* Photo Upload */}
          <div>
            <ImageUpload
              onUpload={handlePhotoUpload}
              currentImage={formData.mainPhoto}
              label="Photo principale de la voie"
              maxSize={10}
            />
          </div>

          {/* Color Picker - Only shown after photo is uploaded */}
          {formData.mainPhoto && (
            <div>
              <ColorPickerOnImage
                imageUrl={formData.mainPhoto}
                onColorSelect={handleColorSelect}
                selectedColor={formData.holdColorHex}
                colorCategory={formData.holdColorCategory}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-mono-100 dark:bg-mono-800 text-mono-900 dark:text-white rounded-xl font-semibold hover:bg-mono-200 dark:hover:bg-mono-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-highlight text-white rounded-xl font-semibold hover:bg-highlight-hover transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
