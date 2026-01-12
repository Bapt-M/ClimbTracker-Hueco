import { useState, useEffect } from 'react';
import { validationsAPI } from '../lib/api/validations';
import { useAuth } from '../hooks/useAuth';

interface ValidationButtonProps {
  routeId: string;
  validationCount: number;
  onValidationChange?: () => void;
}

export const ValidationButton = ({
  routeId,
  validationCount,
  onValidationChange,
}: ValidationButtonProps) => {
  const { user } = useAuth();
  const [hasValidated, setHasValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(validationCount);

  useEffect(() => {
    if (user) {
      checkValidation();
    }
  }, [routeId, user]);

  const checkValidation = async () => {
    if (!user) return;

    try {
      const result = await validationsAPI.checkUserValidation(routeId);
      setHasValidated(result.hasValidated);
    } catch (error) {
      console.error('Failed to check validation:', error);
    }
  };

  const handleToggleValidation = async () => {
    if (!user || loading) return;

    try {
      setLoading(true);

      if (hasValidated) {
        // Remove validation
        await validationsAPI.deleteValidation(routeId);
        setHasValidated(false);
        setCount((prev) => Math.max(0, prev - 1));
      } else {
        // Add validation
        await validationsAPI.createValidation(routeId);
        setHasValidated(true);
        setCount((prev) => prev + 1);
      }

      if (onValidationChange) {
        onValidationChange();
      }
    } catch (error: any) {
      console.error('Failed to toggle validation:', error);
      alert(error.response?.data?.message || 'Failed to update validation');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Don't show button if not logged in
  }

  return (
    <button
      onClick={handleToggleValidation}
      disabled={loading}
      className={`flex-1 h-12 flex items-center justify-center gap-2 px-6 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        hasValidated
          ? 'bg-success text-white'
          : 'bg-mono-900 dark:bg-white text-white dark:text-black'
      }`}
    >
      <span className="material-symbols-outlined text-[20px]">
        {hasValidated ? 'check_circle' : 'add_circle'}
      </span>
      <span className="text-sm">
        {hasValidated ? `Validée (${count})` : `Valider (${count})`}
      </span>
    </button>
  );
};
