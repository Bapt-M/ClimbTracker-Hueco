import { useState, useEffect } from 'react';
import { leaderboardAPI, UserValidationDetails } from '../lib/api/leaderboard';
import { getDifficultyColor } from '../utils/gradeColors';

interface UserValidationDetailsModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

export const UserValidationDetailsModal = ({
  userId,
  userName,
  onClose,
}: UserValidationDetailsModalProps) => {
  const [details, setDetails] = useState<UserValidationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDetails();
  }, [userId]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leaderboardAPI.getUserValidationDetails(userId);
      setDetails(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Impossible de charger les détails');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-mono-900 rounded-2xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-mono-900 border-b border-mono-200 dark:border-mono-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-mono-900 dark:text-white">
                Détails du classement
              </h2>
              <p className="text-sm text-mono-500 mt-1">{userName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
            >
              <span className="material-symbols-outlined text-mono-900 dark:text-white">
                close
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-mono-900 dark:border-white border-r-transparent"></div>
              <p className="mt-4 text-mono-500">Chargement des détails...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-urgent mb-4">{error}</p>
              <button
                onClick={loadDetails}
                className="px-4 py-2 bg-mono-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold transition-all active:scale-95"
              >
                Réessayer
              </button>
            </div>
          ) : details ? (
            <>
              {/* Total Points */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-highlight to-accent text-white">
                <p className="text-sm font-bold uppercase tracking-wider opacity-90">
                  Score Total
                </p>
                <p className="text-3xl font-black mt-1">
                  {details.totalPoints.toLocaleString()} pts
                </p>
                <p className="text-xs opacity-75 mt-2">
                  {details.validations.length} voies validées (6 derniers mois)
                </p>
              </div>

              {/* Formula Explanation */}
              <div className="mb-6 p-4 rounded-xl bg-mono-50 dark:bg-mono-800 border border-mono-200 dark:border-mono-700">
                <p className="text-xs font-bold text-mono-900 dark:text-white mb-2">
                  Formule de calcul :
                </p>
                <p className="text-xs text-mono-600 dark:text-mono-400">
                  Points = <span className="font-bold text-accent">Grade de base</span> ×{' '}
                  <span className="font-bold text-highlight">Difficulté de la voie</span> ×{' '}
                  <span className="font-bold text-success">Multiplicateur d'essais</span>
                </p>
              </div>

              {/* Validations List */}
              <div className="space-y-3">
                {details.validations.map((validation) => {
                  const difficultyColor = getDifficultyColor(validation.difficulty);

                  return (
                    <div
                      key={validation.routeId}
                      className="p-4 rounded-xl bg-white dark:bg-mono-900 border border-mono-200 dark:border-mono-800"
                    >
                      {/* Route Info */}
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center border-2"
                          style={{
                            backgroundColor: difficultyColor.hex,
                            borderColor: difficultyColor.hex,
                          }}
                        >
                          <span className="text-xs font-bold text-white drop-shadow">
                            {validation.difficulty}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-mono-900 dark:text-white">
                            {validation.routeName}
                          </h3>
                          <p className="text-xs text-mono-500 mt-0.5">
                            {validation.sector} •{' '}
                            {validation.isFlashed ? (
                              <span className="text-accent font-bold">Flash</span>
                            ) : (
                              `${validation.attempts} essai${validation.attempts > 1 ? 's' : ''}`
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-mono-900 dark:text-white">
                            {validation.totalPoints}
                          </p>
                          <p className="text-[9px] text-mono-500 uppercase font-bold">pts</p>
                        </div>
                      </div>

                      {/* Calculation Details */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-mono-200 dark:border-mono-800">
                        <div className="text-center">
                          <p className="text-[9px] text-mono-500 uppercase font-bold mb-1">
                            Grade de base
                          </p>
                          <p className="text-sm font-bold text-accent">
                            {validation.basePoints}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] text-mono-500 uppercase font-bold mb-1">
                            Diff. voie
                          </p>
                          <p className="text-sm font-bold text-highlight">
                            ×{validation.routeDifficultyFactor}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] text-mono-500 uppercase font-bold mb-1">
                            Essais
                          </p>
                          <p className="text-sm font-bold text-success">
                            ×{validation.attemptsMultiplier}
                          </p>
                        </div>
                      </div>

                      {/* Formula Result */}
                      <div className="mt-3 pt-3 border-t border-mono-200 dark:border-mono-800">
                        <p className="text-[10px] text-mono-500 text-center">
                          {validation.basePoints} × {validation.routeDifficultyFactor} ×{' '}
                          {validation.attemptsMultiplier} ={' '}
                          <span className="font-bold text-mono-900 dark:text-white">
                            {validation.totalPoints} points
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {details.validations.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-mono-500">Aucune validation dans les 6 derniers mois</p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
