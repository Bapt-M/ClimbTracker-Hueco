import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route } from '../lib/api/routes';
import { QuickStatusMenu, ValidationStatus } from './QuickStatusMenu';
import { MiniGymLayout } from './MiniGymLayout';
import { HoldColorIndicator } from './HoldColorIndicator';
import axios from 'axios';

interface ValidationData {
  id: string;
  status: ValidationStatus;
  attempts: number;
  isFlashed: boolean;
  isFavorite: boolean;
}

interface RouteCardWithStatusProps {
  route: Route;
  onStatusChange?: () => void;
}

export const RouteCardWithStatus = ({ route, onStatusChange }: RouteCardWithStatusProps) => {
  const navigate = useNavigate();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [currentValidation, setCurrentValidation] = useState<ValidationData | undefined>();
  const [isValidating, setIsValidating] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const pressStartTime = useRef<number>(0);

  useEffect(() => {
    fetchCurrentValidation();
  }, [route.id]);

  const fetchCurrentValidation = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('http://localhost:3000/api/validations/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;

      const validations = await response.json();

      if (!Array.isArray(validations)) {
        console.error('Unexpected response format:', validations);
        return;
      }

      const validation = validations.find((v: any) => v.routeId === route.id);
      if (validation) {
        setCurrentValidation({
          id: validation.id,
          status: validation.status,
          attempts: validation.attempts,
          isFlashed: validation.isFlashed,
          isFavorite: validation.isFavorite,
        });
      } else {
        setCurrentValidation(undefined);
      }
    } catch (error) {
      console.error('Failed to fetch validation status:', error);
    }
  };

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    pressStartTime.current = Date.now();

    longPressTimer.current = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      setShowStatusMenu(true);
    }, 500);
  };

  const handlePressEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    const pressDuration = Date.now() - pressStartTime.current;

    if (pressDuration < 500 && !showStatusMenu) {
      navigate(`/routes/${route.id}`);
    }
  };

  const handlePressCancel = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleStatusMenuClose = () => {
    setShowStatusMenu(false);
    onStatusChange?.();
  };

  const handleQuickValidate = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      setIsValidating(true);
      const token = localStorage.getItem('accessToken');

      if (!token) {
        alert('Vous devez être connecté pour valider une voie');
        return;
      }

      const isCurrentlyValide = currentValidation?.status === ValidationStatus.VALIDE;

      if (currentValidation?.id && isCurrentlyValide) {
        // Remove validation
        await axios.delete(
          `http://localhost:3000/api/validations/${currentValidation.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentValidation(undefined);
      } else if (currentValidation?.id) {
        // Update to VALIDE
        await axios.put(
          `http://localhost:3000/api/validations/${currentValidation.id}`,
          {
            status: ValidationStatus.VALIDE,
            attempts: 1,
            isFlashed: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setCurrentValidation({
          ...currentValidation,
          status: ValidationStatus.VALIDE,
          attempts: 1,
          isFlashed: false,
        });
      } else {
        // Create new validation as VALIDE
        const response = await axios.post(
          `http://localhost:3000/api/validations`,
          {
            routeId: route.id,
            status: ValidationStatus.VALIDE,
            attempts: 1,
            isFlashed: false,
            isFavorite: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data?.data?.validation) {
          const newValidation = response.data.data.validation;
          setCurrentValidation({
            id: newValidation.id,
            status: newValidation.status,
            attempts: newValidation.attempts,
            isFlashed: newValidation.isFlashed,
            isFavorite: newValidation.isFavorite,
          });
        }
      }

      onStatusChange?.();
    } catch (error) {
      console.error('Failed to quick validate:', error);
      alert('Erreur lors de la validation');
    } finally {
      setIsValidating(false);
    }
  };

  // Get difficulty color based on difficulty color name
  const getDifficultyColor = (difficulty: string): { color: string; bg: string; light: string } => {
    const difficultyColorMap: Record<string, { color: string; bg: string; light: string }> = {
      'Vert': { color: '#22c55e', bg: '#22c55e20', light: '#dcfce7' },
      'Vert clair': { color: '#86efac', bg: '#86efac20', light: '#f0fdf4' },
      'Bleu clair': { color: '#7dd3fc', bg: '#7dd3fc20', light: '#e0f2fe' },
      'Bleu': { color: '#3b82f6', bg: '#3b82f620', light: '#dbeafe' },
      'Bleu foncé': { color: '#3b82f6', bg: '#3b82f620', light: '#dbeafe' },
      'Jaune': { color: '#eab308', bg: '#eab30820', light: '#fef9c3' },
      'Orange clair': { color: '#f97316', bg: '#f9731620', light: '#ffedd5' },
      'Orange': { color: '#f97316', bg: '#f9731620', light: '#ffedd5' },
      'Orange foncé': { color: '#ea580c', bg: '#ea580c20', light: '#fed7aa' },
      'Rouge': { color: '#ef4444', bg: '#ef444420', light: '#fee2e2' },
      'Rose': { color: '#ec4899', bg: '#ec489920', light: '#fce7f3' },
      'Violet': { color: '#a855f7', bg: '#a855f720', light: '#f3e8ff' },
      'Blanc': { color: '#e5e7eb', bg: '#e5e7eb20', light: '#f9fafb' },
      'Gris': { color: '#6b7280', bg: '#6b728020', light: '#f3f4f6' },
      'Noir': { color: '#1f2937', bg: '#1f293720', light: '#f3f4f6' },
    };

    return difficultyColorMap[difficulty] || { color: '#9ca3af', bg: '#9ca3af20', light: '#f3f4f6' };
  };

  // Get status badge
  const getStatusBadge = () => {
    if (!currentValidation) return null;

    let bgColor = '';
    let icon = '';
    let textColor = 'text-white';

    if (currentValidation.isFavorite) {
      bgColor = 'bg-hold-pink';
      icon = 'favorite';
    } else if (currentValidation.status === ValidationStatus.VALIDE) {
      if (currentValidation.isFlashed) {
        bgColor = 'bg-hold-yellow';
        textColor = 'text-climb-dark';
        icon = 'bolt';
      } else {
        bgColor = 'bg-hold-green';
        icon = 'check';
      }
    } else {
      bgColor = 'bg-hold-orange';
      icon = 'schedule';
    }

    return (
      <div className={`absolute top-2 left-2 ${bgColor} ${textColor} w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white`}>
        <span className="material-symbols-outlined text-[14px] fill-1">{icon}</span>
      </div>
    );
  };

  const isValide = currentValidation?.status === ValidationStatus.VALIDE;
  const difficultyColors = getDifficultyColor(route.difficulty);

  return (
    <>
      <div
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressCancel}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressCancel}
        className="group relative flex flex-col gap-2 rounded-3xl p-2 border-2 border-climb-dark shadow-neo active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-200 cursor-pointer select-none"
        style={{ backgroundColor: difficultyColors.light }}
      >
        {/* Image */}
        <div className="relative aspect-[5/4] w-full rounded-2xl overflow-hidden bg-white">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${route.mainPhoto})` }}
          ></div>

          {/* Status Badge */}
          {getStatusBadge()}

          {/* Difficulty Color Badge */}
          <div className="absolute bottom-2 right-2">
            <div
              className="w-8 h-8 rounded-xl shadow-md border-2 border-white flex items-center justify-center"
              style={{ backgroundColor: difficultyColors.color }}
            >
              <span className="text-white text-[10px] font-extrabold drop-shadow-sm">
                {route.difficulty.substring(0, 2)}
              </span>
            </div>
          </div>

          {/* Validations Count */}
          {route.validationsCount !== undefined && route.validationsCount > 0 && (
            <div className="absolute top-2 right-2 bg-climb-dark/80 backdrop-blur-sm text-white text-[10px] font-extrabold px-2 py-1 rounded-full">
              {route.validationsCount} <span className="material-symbols-outlined text-[10px] fill-1">check</span>
            </div>
          )}

          {/* Hold Color Indicator */}
          {route.holdColorHex && (
            <div className="absolute bottom-2 left-2 pointer-events-none">
              <HoldColorIndicator holdColorHex={route.holdColorHex} size={40} className="drop-shadow-lg" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1 px-1 pb-1 bg-white rounded-xl p-2 -mt-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-climb-dark leading-tight truncate">
              {route.name}
            </h3>
            <MiniGymLayout sector={route.sector} />
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 text-[10px] text-climb-dark/50 font-bold">
                <span className="material-symbols-outlined text-[12px]">edit</span>
                <span className="truncate">{route.opener.name}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className="text-[11px] font-extrabold px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: difficultyColors.bg, color: difficultyColors.color }}
                >
                  {route.difficulty}
                </span>
                <span className="text-[10px] text-climb-dark/50 font-bold">
                  {route.holdColorCategory}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Validate Button */}
        <button
          onClick={handleQuickValidate}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          disabled={isValidating}
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 z-10 border-2 border-climb-dark shadow-neo-sm ${
            isValide
              ? 'bg-hold-green text-white'
              : 'bg-white text-climb-dark hover:bg-hold-green hover:text-white'
          } ${isValidating ? 'opacity-50 cursor-wait' : 'active:scale-95'}`}
          title={isValide ? 'Retirer la validation' : 'Valider la voie'}
        >
          {isValidating ? (
            <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined text-[18px] fill-1">
              {isValide ? 'check' : 'check'}
            </span>
          )}
        </button>

        {/* Long Press Hint */}
        <div className="absolute bottom-1 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[8px] text-climb-dark/40 font-bold uppercase tracking-wide">
            Appui long
          </span>
        </div>
      </div>

      {/* Status Menu Modal */}
      {showStatusMenu && (
        <QuickStatusMenu
          routeId={route.id}
          routeName={route.name}
          currentValidation={currentValidation}
          onClose={handleStatusMenuClose}
          onStatusChange={() => {
            fetchCurrentValidation();
            onStatusChange?.();
          }}
        />
      )}
    </>
  );
};
