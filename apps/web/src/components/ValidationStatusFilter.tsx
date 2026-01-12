import { useState } from 'react';
import { ValidationStatus } from './QuickStatusMenu';

interface ValidationStatusFilterProps {
  selectedStatuses: ValidationStatus[];
  onStatusesChange: (statuses: ValidationStatus[]) => void;
  showFlashedFilter?: boolean;
  showFavoriteFilter?: boolean;
  isFlashedOnly?: boolean;
  isFavoriteOnly?: boolean;
  onFlashedChange?: (value: boolean) => void;
  onFavoriteChange?: (value: boolean) => void;
}

const STATUS_CONFIG: Record<ValidationStatus, { label: string; color: string; icon: string }> = {
  [ValidationStatus.EN_PROJET]: {
    label: 'En projet',
    color: 'bg-yellow-500',
    icon: '🏗️',
  },
  [ValidationStatus.VALIDE]: {
    label: 'Validées',
    color: 'bg-green-500',
    icon: '✅',
  },
};

export const ValidationStatusFilter = ({
  selectedStatuses,
  onStatusesChange,
  showFlashedFilter = false,
  showFavoriteFilter = false,
  isFlashedOnly = false,
  isFavoriteOnly = false,
  onFlashedChange,
  onFavoriteChange,
}: ValidationStatusFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleStatus = (status: ValidationStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusesChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusesChange([...selectedStatuses, status]);
    }
  };

  const activeFiltersCount =
    selectedStatuses.length +
    (isFlashedOnly ? 1 : 0) +
    (isFavoriteOnly ? 1 : 0);

  return (
    <div className="w-full bg-white/60 dark:bg-mono-900 backdrop-blur-md border border-mono-200/50 dark:border-mono-800 rounded-xl shadow-card overflow-hidden">
      {/* Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-mono-600 dark:text-mono-300">
            task_alt
          </span>
          <span className="text-[11px] font-medium text-mono-900 dark:text-white">
            Mes voies
          </span>
          {activeFiltersCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-mono-900 dark:bg-white text-white dark:text-black">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <span className={`material-symbols-outlined text-[18px] text-mono-600 dark:text-mono-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Content - Collapsible */}
      {isOpen && (
        <div className="px-3 pb-3 pt-1 space-y-2">
          {/* Status Filters */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const isSelected = selectedStatuses.includes(status as ValidationStatus);
              return (
                <button
                  key={status}
                  onClick={() => handleToggleStatus(status as ValidationStatus)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isSelected
                      ? `${config.color} text-white shadow-md scale-[1.02]`
                      : 'bg-mono-100 dark:bg-mono-800 text-mono-600 dark:text-mono-300 hover:bg-mono-200 dark:hover:bg-mono-700'
                  }`}
                >
                  <span className="text-sm">{config.icon}</span>
                  <span className="text-[11px] font-medium">{config.label}</span>
                </button>
              );
            })}
          </div>

          {/* Additional Filters */}
          {(showFlashedFilter || showFavoriteFilter) && (
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-mono-200 dark:border-mono-700">
              {showFlashedFilter && (
                <button
                  onClick={() => onFlashedChange?.(!isFlashedOnly)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isFlashedOnly
                      ? 'bg-blue-500 text-white shadow-md scale-[1.02]'
                      : 'bg-mono-100 dark:bg-mono-800 text-mono-600 dark:text-mono-300 hover:bg-mono-200 dark:hover:bg-mono-700'
                  }`}
                >
                  <span className="text-sm">⚡</span>
                  <span className="text-[11px] font-medium">Flash uniquement</span>
                </button>
              )}

              {showFavoriteFilter && (
                <button
                  onClick={() => onFavoriteChange?.(!isFavoriteOnly)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isFavoriteOnly
                      ? 'bg-pink-500 text-white shadow-md scale-[1.02]'
                      : 'bg-mono-100 dark:bg-mono-800 text-mono-600 dark:text-mono-300 hover:bg-mono-200 dark:hover:bg-mono-700'
                  }`}
                >
                  <span className="text-sm">❤️</span>
                  <span className="text-[11px] font-medium">Favorites</span>
                </button>
              )}
            </div>
          )}

          {/* Reset Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                onStatusesChange([]);
                onFlashedChange?.(false);
                onFavoriteChange?.(false);
              }}
              className="mt-2 w-full text-[10px] text-mono-500 dark:text-mono-400 hover:text-mono-900 dark:hover:text-white py-1"
            >
              Réinitialiser
            </button>
          )}
        </div>
      )}
    </div>
  );
};
