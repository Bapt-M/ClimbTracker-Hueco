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
        // Create new validation
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
      // Toggle favorite
      handleStatusUpdate({
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-mono-900 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-mono-200 dark:border-mono-800">
          <h3 className="text-lg font-bold text-mono-900 dark:text-white truncate">
            {routeName}
          </h3>
          <p className="text-xs text-mono-500 mt-1">
            Gérez votre progression sur cette voie
          </p>
        </div>

        {/* Status Options */}
        <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
          {/* En Projet */}
          <button
            onClick={handleSetEnProjet}
            disabled={loading}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl transition-all
              ${isEnProjet && !currentValidation?.isFavorite
                ? 'bg-yellow-500 text-yellow-50 shadow-md scale-105'
                : 'bg-mono-50 dark:bg-mono-800 hover:bg-mono-100 dark:hover:bg-mono-700'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <span className={`material-symbols-outlined text-2xl ${
              isEnProjet && !currentValidation?.isFavorite ? '' : 'text-mono-600 dark:text-mono-400'
            }`}>
              work
            </span>
            <span className={`flex-1 text-left font-semibold ${
              isEnProjet && !currentValidation?.isFavorite ? '' : 'text-mono-900 dark:text-white'
            }`}>
              En projet
            </span>
            {isEnProjet && !currentValidation?.isFavorite && (
              <span className="material-symbols-outlined text-xl">check</span>
            )}
          </button>

          {/* Validé Menu */}
          {!showAttemptsMenu ? (
            <button
              onClick={() => setShowAttemptsMenu(true)}
              disabled={loading}
              className={`
                w-full flex items-center gap-3 p-3 rounded-xl transition-all
                ${isValide
                  ? 'bg-green-500 text-green-50 shadow-md scale-105'
                  : 'bg-mono-50 dark:bg-mono-800 hover:bg-mono-100 dark:hover:bg-mono-700'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <span className={`material-symbols-outlined text-2xl ${
                isValide ? '' : 'text-mono-600 dark:text-mono-400'
              }`}>
                check_circle
              </span>
              <span className={`flex-1 text-left font-semibold ${
                isValide ? '' : 'text-mono-900 dark:text-white'
              }`}>
                {isValide
                  ? `Validé (${currentValidation.isFlashed ? 'Flash' : `${currentValidation.attempts} essai${currentValidation.attempts > 1 ? 's' : ''}`})`
                  : 'Validé'}
              </span>
              <span className={`material-symbols-outlined text-xl ${
                isValide ? '' : 'text-mono-600 dark:text-mono-400'
              }`}>
                {isValide ? 'check' : 'chevron_right'}
              </span>
            </button>
          ) : (
            <div className="space-y-2 bg-mono-100 dark:bg-mono-800 p-2 rounded-xl">
              <button
                onClick={() => setShowAttemptsMenu(false)}
                className="w-full flex items-center gap-2 p-2 text-sm text-mono-600 dark:text-mono-400 hover:text-mono-900 dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
                <span>Retour</span>
              </button>

              {/* Flash */}
              <button
                onClick={() => handleSetValide(1, true)}
                disabled={loading}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all
                  ${isValide && currentValidation?.isFlashed
                    ? 'bg-blue-500 text-blue-50 shadow-md'
                    : 'bg-white dark:bg-mono-900 hover:bg-mono-50 dark:hover:bg-mono-800'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span className={`material-symbols-outlined text-xl ${
                  isValide && currentValidation?.isFlashed ? '' : 'text-mono-600 dark:text-mono-400'
                }`}>
                  flash_on
                </span>
                <span className={`flex-1 text-left font-medium text-sm ${
                  isValide && currentValidation?.isFlashed ? '' : 'text-mono-900 dark:text-white'
                }`}>
                  Flash (1er essai)
                </span>
              </button>

              {/* 2 essais */}
              <button
                onClick={() => handleSetValide(2, false)}
                disabled={loading}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all
                  ${isValide && currentValidation?.attempts === 2
                    ? 'bg-green-500 text-green-50 shadow-md'
                    : 'bg-white dark:bg-mono-900 hover:bg-mono-50 dark:hover:bg-mono-800'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span className={`material-symbols-outlined text-xl ${
                  isValide && currentValidation?.attempts === 2 ? '' : 'text-mono-600 dark:text-mono-400'
                }`}>
                  looks_two
                </span>
                <span className={`flex-1 text-left font-medium text-sm ${
                  isValide && currentValidation?.attempts === 2 ? '' : 'text-mono-900 dark:text-white'
                }`}>
                  2 essais
                </span>
              </button>

              {/* 3 essais */}
              <button
                onClick={() => handleSetValide(3, false)}
                disabled={loading}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all
                  ${isValide && currentValidation?.attempts === 3
                    ? 'bg-orange-500 text-orange-50 shadow-md'
                    : 'bg-white dark:bg-mono-900 hover:bg-mono-50 dark:hover:bg-mono-800'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span className={`material-symbols-outlined text-xl ${
                  isValide && currentValidation?.attempts === 3 ? '' : 'text-mono-600 dark:text-mono-400'
                }`}>
                  looks_3
                </span>
                <span className={`flex-1 text-left font-medium text-sm ${
                  isValide && currentValidation?.attempts === 3 ? '' : 'text-mono-900 dark:text-white'
                }`}>
                  3 essais
                </span>
              </button>

              {/* 5+ essais */}
              <button
                onClick={() => handleSetValide(5, false)}
                disabled={loading}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all
                  ${isValide && currentValidation?.attempts >= 5
                    ? 'bg-red-500 text-red-50 shadow-md'
                    : 'bg-white dark:bg-mono-900 hover:bg-mono-50 dark:hover:bg-mono-800'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <span className={`material-symbols-outlined text-xl ${
                  isValide && currentValidation?.attempts >= 5 ? '' : 'text-mono-600 dark:text-mono-400'
                }`}>
                  looks_5
                </span>
                <span className={`flex-1 text-left font-medium text-sm ${
                  isValide && currentValidation?.attempts >= 5 ? '' : 'text-mono-900 dark:text-white'
                }`}>
                  5+ essais
                </span>
              </button>
            </div>
          )}

          {/* Favorite Toggle */}
          <button
            onClick={handleToggleFavorite}
            disabled={loading}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl transition-all
              ${currentValidation?.isFavorite
                ? 'bg-pink-500 text-pink-50 shadow-md scale-105'
                : 'bg-mono-50 dark:bg-mono-800 hover:bg-mono-100 dark:hover:bg-mono-700'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <span className={`material-symbols-outlined text-2xl ${
              currentValidation?.isFavorite ? 'fill-icon' : 'text-mono-600 dark:text-mono-400'
            }`}>
              favorite
            </span>
            <span className={`flex-1 text-left font-semibold ${
              currentValidation?.isFavorite ? '' : 'text-mono-900 dark:text-white'
            }`}>
              Favorite
            </span>
            {currentValidation?.isFavorite && (
              <span className="material-symbols-outlined text-xl">check</span>
            )}
          </button>

          {/* Remove Status Option */}
          {currentValidation?.id && (
            <button
              onClick={handleRemove}
              disabled={loading}
              className="w-full flex items-center gap-3 p-3 rounded-xl transition-all bg-urgent/10 hover:bg-urgent/20 text-urgent border border-urgent/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              <span className="material-symbols-outlined text-2xl">
                delete
              </span>
              <span className="flex-1 text-left font-semibold">
                Retirer de mes voies
              </span>
            </button>
          )}
        </div>

        {/* Close Button */}
        <div className="p-3 border-t border-mono-200 dark:border-mono-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-semibold text-mono-600 dark:text-mono-400 hover:text-mono-900 dark:hover:text-white transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};
