import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routesAPI, Route, RouteFilters } from '../lib/api/routes';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { BottomNav } from '../components/BottomNav';
import { RouteCardWithStatus } from '../components/RouteCardWithStatus';
import { GymLayoutFilter } from '../components/GymLayoutFilter';
import { ValidationStatusFilter } from '../components/ValidationStatusFilter';
import { GradeFilter } from '../components/GradeFilter';
import { HoldColorFilter } from '../components/HoldColorFilter';
import { ValidationStatus } from '../components/QuickStatusMenu';

const COLORS = ['yellow', 'red', 'blue', 'green', 'black', 'white', 'purple', 'orange', 'pink', 'grey'];
const SECTORS = ['A', 'B', 'C', 'D'];

const COLOR_CLASSES: Record<string, string> = {
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  black: 'bg-gray-900',
  white: 'bg-gray-100 border border-gray-300',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  grey: 'bg-gray-500',
};

export const RoutesHub = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggle } = useDarkMode();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedHoldColors, setSelectedHoldColors] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ValidationStatus[]>([]);
  const [userValidations, setUserValidations] = useState<any[]>([]);
  const [filters, setFilters] = useState<RouteFilters>({
    page: 1,
    limit: 20,
    status: ['ACTIVE'],
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, [filters]);

  // Load user validations
  useEffect(() => {
    loadUserValidations();
  }, []);

  // Sync selectedSectors with filters
  useEffect(() => {
    if (selectedSectors.length > 0) {
      setFilters((prev) => ({ ...prev, sector: selectedSectors, page: 1 }));
    } else {
      setFilters((prev) => {
        const { sector, ...rest } = prev;
        return { ...rest, page: 1 };
      });
    }
  }, [selectedSectors]);

  // Sync selectedGrades with filters
  useEffect(() => {
    if (selectedGrades.length > 0) {
      setFilters((prev) => ({ ...prev, grade: selectedGrades, page: 1 }));
    } else {
      setFilters((prev) => {
        const { grade, ...rest } = prev;
        return { ...rest, page: 1 };
      });
    }
  }, [selectedGrades]);

  // Sync selectedHoldColors with filters
  useEffect(() => {
    if (selectedHoldColors.length > 0) {
      setFilters((prev) => ({ ...prev, holdColorCategory: selectedHoldColors, page: 1 }));
    } else {
      setFilters((prev) => {
        const { holdColorCategory, ...rest } = prev;
        return { ...rest, page: 1 };
      });
    }
  }, [selectedHoldColors]);

  // Filter routes by validation status
  useEffect(() => {
    if (selectedStatuses.length === 0) {
      setFilteredRoutes(routes);
    } else {
      const filtered = routes.filter((route) => {
        const validation = userValidations.find((v) => v.routeId === route.id);
        return validation && selectedStatuses.includes(validation.status);
      });
      setFilteredRoutes(filtered);
    }
  }, [routes, selectedStatuses, userValidations]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await routesAPI.getRoutes(filters);
      setRoutes(result.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  const loadUserValidations = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('http://localhost:3000/api/validations/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;

      const validations = await response.json();
      if (Array.isArray(validations)) {
        setUserValidations(validations);
      }
    } catch (error) {
      console.error('Failed to load user validations:', error);
    }
  };

  const handleFilterChange = (key: keyof RouteFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleSectorsChange = (sectors: string[]) => {
    setSelectedSectors(sectors);
  };

  const handleGradesChange = (grades: string[]) => {
    setSelectedGrades(grades);
  };

  const handleHoldColorsChange = (colors: string[]) => {
    setSelectedHoldColors(colors);
  };

  const handleStatusesChange = (statuses: ValidationStatus[]) => {
    setSelectedStatuses(statuses);
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
          <div>
            <h1 className="text-xl font-bold tracking-tight text-mono-900 dark:text-white">
              Exploration
            </h1>
            <p className="text-[10px] font-medium text-mono-500 uppercase tracking-wider">
              ClimbTracker
            </p>
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

        {/* Search Bar */}
        <div className="px-5 py-1">
          <div className="group flex w-full items-center rounded-xl bg-white/60 dark:bg-mono-900 backdrop-blur-md border border-mono-200/50 dark:border-mono-800 focus-within:border-mono-400 dark:focus-within:border-mono-600 transition-all shadow-subtle h-10">
            <div className="flex items-center justify-center pl-3 pr-2 text-mono-400">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </div>
            <input
              className="flex w-full bg-transparent border-none focus:ring-0 text-mono-900 dark:text-white placeholder:text-mono-400 text-sm py-2 pl-0 font-medium"
              placeholder="Rechercher une voie..."
              type="text"
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 mr-1 text-mono-400 hover:text-mono-900 dark:hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-5 py-3 space-y-3">
            {/* Grade Filter */}
            <GradeFilter
              selectedGrades={selectedGrades}
              onGradesChange={handleGradesChange}
            />

            {/* Hold Color Filter */}
            <HoldColorFilter
              selectedColors={selectedHoldColors}
              onColorsChange={handleHoldColorsChange}
            />

            {/* Gym Layout Filter */}
            <GymLayoutFilter
              selectedSectors={selectedSectors}
              onSectorsChange={handleSectorsChange}
              isDark={isDark}
            />

            {/* Validation Status Filter */}
            <ValidationStatusFilter
              selectedStatuses={selectedStatuses}
              onStatusesChange={handleStatusesChange}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-mono-900 dark:border-white border-r-transparent"></div>
            <p className="mt-4 text-mono-500">Chargement...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 px-5">
            <p className="text-mono-900 dark:text-white mb-4">{error}</p>
            <button
              onClick={loadRoutes}
              className="px-4 py-2 bg-mono-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold transition-all active:scale-95"
            >
              Réessayer
            </button>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-mono-500">
              {selectedStatuses.length > 0 ? 'Aucune voie avec ces statuts' : 'Aucune voie trouvée'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4 pt-2 pb-8">
            {filteredRoutes.map((route) => (
              <RouteCardWithStatus
                key={route.id}
                route={route}
                onStatusChange={() => {
                  loadRoutes();
                  loadUserValidations();
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB Button for OPENER/ADMIN */}
      {(user?.role === 'OPENER' || user?.role === 'ADMIN') && (
        <Link
          to="/routes/create"
          className="fixed z-50 bottom-24 right-5 h-12 w-12 rounded-full bg-highlight text-white shadow-glow flex items-center justify-center hover:bg-highlight-hover hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <span className="material-symbols-outlined text-[24px]">add</span>
        </Link>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
