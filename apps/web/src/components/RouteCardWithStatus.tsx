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
  const getDifficultyColor = (difficulty: string): string => {
    const difficultyColorMap: Record<string, string> = {
      'Vert': '#86efac',
      'Vert clair': '#22c55e',
      'Bleu clair': '#7dd3fc',
      'Bleu': '#3b82f6',
      'Bleu foncé': '#a855f7',
      'Jaune': '#eab308',
      'Orange clair': '#f97316',
      'Orange': '#ef4444',
      'Orange foncé': '#dc2626',
      'Rouge': '#dc2626',
      'Violet': '#a855f7',
      'Noir': '#1f2937',
    };

    return difficultyColorMap[difficulty] || '#9ca3af';
  };

  // Get status badge
  const getStatusBadge = () => {
    if (!currentValidation) return null;

    let color = '';
    let icon = '';

    if (currentValidation.isFavorite) {
      color = 'bg-pink-500';
      icon = '❤';
    } else if (currentValidation.status === ValidationStatus.VALIDE) {
      if (currentValidation.isFlashed) {
        color = 'bg-blue-500';
        icon = '⚡';
      } else {
        color = 'bg-green-500';
        icon = '✓';
      }
    } else {
      color = 'bg-yellow-500';
      icon = '⏳';
    }

    return (
      <div className={`absolute top-1.5 left-1.5 ${color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md`}>
        {icon}
      </div>
    );
  };

  const isValide = currentValidation?.status === ValidationStatus.VALIDE;

  return (
    <>
      <div
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressCancel}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onTouchCancel={handlePressCancel}
        className="group relative flex flex-col gap-2 rounded-xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl p-2 shadow-card border border-mono-200/50 dark:border-mono-800 active:scale-[0.98] transition-transform duration-200 cursor-pointer select-none"
      >
        {/* Image */}
        <div className="relative aspect-[5/4] w-full rounded-lg overflow-hidden bg-mono-100 dark:bg-mono-800">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${route.mainPhoto})` }}
          ></div>

          {/* Status Badge */}
          {getStatusBadge()}

          {/* Difficulty Color Badge */}
          <div className="absolute bottom-1.5 right-1.5">
            <div
              className="w-6 h-6 rounded shadow-md border-2 border-white/50"
              style={{ backgroundColor: getDifficultyColor(route.difficulty) }}
            />
          </div>

          {/* Validations Count */}
          {route.validationsCount !== undefined && route.validationsCount > 0 && (
            <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {route.validationsCount} ✓
            </div>
          )}

          {/* Hold Color Indicator */}
          {route.holdColorHex && (
            <div className="absolute bottom-1.5 left-1.5 pointer-events-none">
              <HoldColorIndicator holdColorHex={route.holdColorHex} size={40} className="drop-shadow-lg" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-0.5 px-0.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-mono-900 dark:text-white leading-tight truncate">
              {route.name}
            </h3>
            <MiniGymLayout sector={route.sector} />
          </div>
          <div className="flex items-end justify-between gap-2 mt-1">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 text-[10px] text-mono-500 font-medium">
                <span className="material-symbols-outlined text-[14px]">edit</span>
                <span className="truncate">{route.opener.name}</span>
              </div>
              <div className="text-[10px] text-mono-600 dark:text-mono-400 font-semibold mt-0.5">
                {route.difficulty} · {route.holdColorCategory}
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
          className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-10 ${
            isValide
              ? 'bg-green-500 text-white scale-100'
              : 'bg-white/90 dark:bg-mono-800/90 backdrop-blur-sm border-2 border-mono-300 dark:border-mono-600 text-mono-600 dark:text-mono-300 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:scale-110'
          } ${isValidating ? 'opacity-50 cursor-wait' : 'active:scale-95'}`}
          title={isValide ? 'Retirer la validation' : 'Valider la voie'}
        >
          {isValidating ? (
            <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
          ) : (
            <span className="material-symbols-outlined text-[18px]">
              {isValide ? 'check' : 'check'}
            </span>
          )}
        </button>

        {/* Long Press Hint */}
        <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-50 transition-opacity duration-200">
          <span className="text-[8px] text-mono-500 dark:text-mono-400 font-medium">
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
