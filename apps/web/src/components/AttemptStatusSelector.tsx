import { useState } from 'react';

export enum AttemptStatus {
  WORKING = 'WORKING',
  ATTEMPT_2 = 'ATTEMPT_2',
  ATTEMPT_3 = 'ATTEMPT_3',
  ATTEMPT_5 = 'ATTEMPT_5',
  COMPLETED = 'COMPLETED',
  FLASHED = 'FLASHED',
  FAVORITE = 'FAVORITE',
}

const STATUS_LABELS: Record<AttemptStatus, string> = {
  [AttemptStatus.WORKING]: 'En projet',
  [AttemptStatus.ATTEMPT_2]: '2ème essai',
  [AttemptStatus.ATTEMPT_3]: '3ème essai',
  [AttemptStatus.ATTEMPT_5]: '5ème essai',
  [AttemptStatus.COMPLETED]: 'Réussie',
  [AttemptStatus.FLASHED]: 'First-tried',
  [AttemptStatus.FAVORITE]: 'Favorite',
};

const STATUS_COLORS: Record<AttemptStatus, string> = {
  [AttemptStatus.WORKING]: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
  [AttemptStatus.ATTEMPT_2]: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700',
  [AttemptStatus.ATTEMPT_3]: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700',
  [AttemptStatus.ATTEMPT_5]: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700',
  [AttemptStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
  [AttemptStatus.FLASHED]: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
  [AttemptStatus.FAVORITE]: 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900 dark:text-pink-200 dark:border-pink-700',
};

interface AttemptStatusSelectorProps {
  currentStatus?: AttemptStatus;
  onStatusChange: (status: AttemptStatus) => Promise<void>;
}

export const AttemptStatusSelector = ({
  currentStatus,
  onStatusChange,
}: AttemptStatusSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusSelect = async (status: AttemptStatus) => {
    setLoading(true);
    try {
      await onStatusChange(status);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
          ${currentStatus ? STATUS_COLORS[currentStatus] : 'bg-mono-100 text-mono-800 border-mono-300 dark:bg-mono-800 dark:text-mono-200 dark:border-mono-600'}
        `}
        disabled={loading}
      >
        {currentStatus ? STATUS_LABELS[currentStatus] : 'Set Status'}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 bg-white dark:bg-mono-900 border-2 border-mono-200 dark:border-mono-800 rounded-xl shadow-lg overflow-hidden">
          {Object.values(AttemptStatus).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusSelect(status)}
              className={`
                w-full px-4 py-2 text-left text-sm hover:bg-mono-100 dark:hover:bg-mono-800 transition-colors
                ${currentStatus === status ? 'font-semibold bg-mono-50 dark:bg-mono-850' : ''}
              `}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
