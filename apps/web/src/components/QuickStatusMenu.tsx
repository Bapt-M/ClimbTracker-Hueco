import { useState } from 'react';
import axios from 'axios';

export enum ValidationStatus {
  EN_PROJET = 'EN_PROJET',
  VALIDE = 'VALIDE',
}

interface ValidationData {
  id?: string;
  status: ValidationStatus;
  attempts: number;
  isFlashed: boolean;
  isFavorite: boolean;
}

interface QuickStatusMenuProps {
  routeId: string;
  routeName: string;
  currentValidation?: ValidationData;
  onClose: () => void;
  onStatusChange?: () => void;
}

export const QuickStatusMenu = ({
  routeId,
  routeName,
  currentValidation,
  onClose,
  onStatusChange,
}: QuickStatusMenuProps) => {
  const [loading, setLoading] = useState(false);
  const [showAttemptsMenu, setShowAttemptsMenu] = useState(false);

  const handleStatusUpdate = async (newData: Partial<ValidationData>) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      if (!token) {
        alert('Vous devez être connecté pour valider une voie');
        return;
      }

      if (currentValidation?.id) {
        // Update existing validation
        await axios.put(
          `http://localhost:3000/api/validations/${currentValidation.id}`,
          newData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        // Try to create new validation
        try {
          await axios.post(
            `http://localhost:3000/api/validations`,
            {
              routeId,
              ...newData,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
        } catch (createError: any) {
          // If validation already exists (409), fetch it and update it
          if (createError.response?.status === 409) {
            const validationsResponse = await axios.get(
              'http://localhost:3000/api/validations/user',
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const existingValidation = validationsResponse.data.find(
              (v: any) => v.route.id === routeId
            );

            if (existingValidation) {
              await axios.put(
                `http://localhost:3000/api/validations/${existingValidation.id}`,
                newData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
            } else {
              throw createError;
            }
          } else {
            throw createError;
          }
        }
      }

      onStatusChange?.();
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setLoading(false);
    }
  };

  const handleSetEnProjet = () => {
    handleStatusUpdate({
      status: ValidationStatus.EN_PROJET,
      attempts: 1,
      isFlashed: false,
      isFavorite: currentValidation?.isFavorite || false,
    });
  };

  const handleSetValide = (attempts: number, isFlashed: boolean) => {
    handleStatusUpdate({
      status: ValidationStatus.VALIDE,
      attempts,
      isFlashed,
      isFavorite: currentValidation?.isFavorite || false,
    });
  };

  const handleToggleFavorite = () => {
    if (!currentValidation?.id) {
      // Create as favorite
      handleStatusUpdate({
        status: ValidationStatus.EN_PROJET,
        attempts: 1,
        isFlashed: false,
        isFavorite: true,
      });
    } else {
      // Toggle favorite - preserve all other fields
      handleStatusUpdate({
        status: currentValidation.status,
        attempts: currentValidation.attempts,
        isFlashed: currentValidation.isFlashed,
        isFavorite: !currentValidation.isFavorite,
      });
    }
  };

  const handleRemove = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      if (!token || !currentValidation?.id) return;

      await axios.delete(
        `http://localhost:3000/api/validations/${currentValidation.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onStatusChange?.();
      onClose();
    } catch (error) {
      console.error('Failed to remove validation:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const isEnProjet = currentValidation?.status === ValidationStatus.EN_PROJET;
  const isValide = currentValidation?.status === ValidationStatus.VALIDE;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-climb-dark/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-cream rounded-3xl border-2 border-climb-dark shadow-neo-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b-2 border-climb-dark/20">
          <h3 className="text-lg font-extrabold text-climb-dark truncate">
            {routeName}
          </h3>
          <p className="text-xs text-climb-dark/60 font-bold mt-1">
            Gérez votre progression sur cette voie
          </p>
        </div>

        {/* Status Options */}
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {/* En Projet */}
          <button
            onClick={handleSetEnProjet}
            disabled={loading}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all cursor-pointer border-2 ${
              isEnProjet && !currentValidation?.isFavorite
                ? 'bg-hold-orange text-white border-climb-dark shadow-neo'
                : 'bg-white text-climb-dark border-climb-dark/20 hover:border-climb-dark'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="material-symbols-outlined text-2xl">
              schedule
            </span>
            <span className="flex-1 text-left font-extrabold">
              En projet
            </span>
            {isEnProjet && !currentValidation?.isFavorite && (
              <span className="material-symbols-outlined text-xl fill-1">check</span>
            )}
          </button>

          {/* Validé Menu */}
          {!showAttemptsMenu ? (
            <button
              onClick={() => setShowAttemptsMenu(true)}
              disabled={loading}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all cursor-pointer border-2 ${
                isValide
                  ? 'bg-hold-green text-white border-climb-dark shadow-neo'
                  : 'bg-white text-climb-dark border-climb-dark/20 hover:border-climb-dark'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="material-symbols-outlined text-2xl">
                check_circle
              </span>
              <span className="flex-1 text-left font-extrabold">
                {isValide
                  ? `Validé (${currentValidation.isFlashed ? 'Flash' : `${currentValidation.attempts} essai${currentValidation.attempts > 1 ? 's' : ''}`})`
                  : 'Validé'}
              </span>
              <span className="material-symbols-outlined text-xl">
                {isValide ? 'check' : 'chevron_right'}
              </span>
            </button>
          ) : (
            <div className="space-y-2 bg-white p-3 rounded-2xl border-2 border-climb-dark">
              <button
                onClick={() => setShowAttemptsMenu(false)}
                className="w-full flex items-center gap-2 p-2 text-sm text-climb-dark/60 hover:text-climb-dark font-bold"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
                <span>Retour</span>
              </button>

              {/* Flash */}
              <button
                onClick={() => handleSetValide(1, true)}
                disabled={loading}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border-2 ${
                  isValide && currentValidation?.isFlashed
                    ? 'bg-hold-yellow text-climb-dark border-climb-dark shadow-neo-sm'
                    : 'bg-cream text-climb-dark border-climb-dark/20 hover:border-climb-dark'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="material-symbols-outlined text-xl fill-1">bolt</span>
                <span className="flex-1 text-left font-bold text-sm">
                  Flash (1er essai)
                </span>
              </button>

              {/* 2 essais */}
              <button
                onClick={() => handleSetValide(2, false)}
                disabled={loading}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border-2 ${
                  isValide && currentValidation?.attempts === 2 && !currentValidation?.isFlashed
                    ? 'bg-hold-green text-white border-climb-dark shadow-neo-sm'
                    : 'bg-cream text-climb-dark border-climb-dark/20 hover:border-climb-dark'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="material-symbols-outlined text-xl">looks_two</span>
                <span className="flex-1 text-left font-bold text-sm">2 essais</span>
              </button>

              {/* 3 essais */}
              <button
                onClick={() => handleSetValide(3, false)}
                disabled={loading}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border-2 ${
                  isValide && currentValidation?.attempts === 3 && !currentValidation?.isFlashed
                    ? 'bg-hold-orange text-white border-climb-dark shadow-neo-sm'
                    : 'bg-cream text-climb-dark border-climb-dark/20 hover:border-climb-dark'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="material-symbols-outlined text-xl">looks_3</span>
                <span className="flex-1 text-left font-bold text-sm">3 essais</span>
              </button>

              {/* 4 essais */}
              <button
                onClick={() => handleSetValide(4, false)}
                disabled={loading}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border-2 ${
                  isValide && currentValidation?.attempts === 4
                    ? 'bg-hold-purple text-white border-climb-dark shadow-neo-sm'
                    : 'bg-cream text-climb-dark border-climb-dark/20 hover:border-climb-dark'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="material-symbols-outlined text-xl">looks_4</span>
                <span className="flex-1 text-left font-bold text-sm">4 essais</span>
              </button>

              {/* 5+ essais */}
              <button
                onClick={() => handleSetValide(5, false)}
                disabled={loading}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer border-2 ${
                  isValide && currentValidation?.attempts >= 5
                    ? 'bg-hold-pink text-white border-climb-dark shadow-neo-sm'
                    : 'bg-cream text-climb-dark border-climb-dark/20 hover:border-climb-dark'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="material-symbols-outlined text-xl">looks_5</span>
                <span className="flex-1 text-left font-bold text-sm">5+ essais</span>
              </button>
            </div>
          )}

          {/* Favorite Toggle */}
          <button
            onClick={handleToggleFavorite}
            disabled={loading}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all cursor-pointer border-2 ${
              currentValidation?.isFavorite
                ? 'bg-hold-pink text-white border-climb-dark shadow-neo'
                : 'bg-white text-climb-dark border-climb-dark/20 hover:border-climb-dark'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className={`material-symbols-outlined text-2xl ${currentValidation?.isFavorite ? 'fill-1' : ''}`}>
              favorite
            </span>
            <span className="flex-1 text-left font-extrabold">
              Favorite
            </span>
            {currentValidation?.isFavorite && (
              <span className="material-symbols-outlined text-xl fill-1">check</span>
            )}
          </button>

          {/* Remove Status Option */}
          {currentValidation?.id && (
            <button
              onClick={handleRemove}
              disabled={loading}
              className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all cursor-pointer bg-hold-pink/10 hover:bg-hold-pink/20 text-hold-pink border-2 border-hold-pink/30 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <span className="material-symbols-outlined text-2xl">
                delete
              </span>
              <span className="flex-1 text-left font-extrabold">
                Retirer de mes voies
              </span>
            </button>
          )}
        </div>

        {/* Close Button */}
        <div className="p-4 border-t-2 border-climb-dark/20">
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-extrabold text-climb-dark/60 hover:text-climb-dark transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};
