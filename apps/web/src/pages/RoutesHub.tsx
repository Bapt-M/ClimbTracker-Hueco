import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routesAPI, Route, RouteFilters } from '../lib/api/routes';
import { useAuth } from '../hooks/useAuth';
import { BottomNav } from '../components/BottomNav';
import { RouteCardWithStatus } from '../components/RouteCardWithStatus';
import { GymLayoutFilter } from '../components/GymLayoutFilter';
import { ValidationStatusFilter } from '../components/ValidationStatusFilter';
import { GradeFilter } from '../components/GradeFilter';
import { HoldColorFilter } from '../components/HoldColorFilter';
import { DateFilter } from '../components/DateFilter';
import { ValidationStatus } from '../components/QuickStatusMenu';

export const RoutesHub = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedHoldColors, setSelectedHoldColors] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ValidationStatus[]>([]);
  const [userValidations, setUserValidations] = useState<any[]>([]);
  const [isFavoriteOnly, setIsFavoriteOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
  const [dateTo, setDateTo] = useState<string | undefined>(undefined);
  const [filters, setFilters] = useState<RouteFilters>({
    page: 1,
    limit: 100,
    status: ['ACTIVE'],
    sortField: 'openedAt',
    sortOrder: 'DESC',
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
      setFilters((prev) => ({ ...prev, difficulty: selectedGrades, page: 1 }));
    } else {
      setFilters((prev) => {
        const { difficulty, ...rest } = prev;
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

  // Sync date filters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      openedAtFrom: dateFrom,
      openedAtTo: dateTo,
      page: 1,
    }));
  }, [dateFrom, dateTo]);

  // Filter routes by validation status and favorites
  useEffect(() => {
    let filtered = routes;

    // Filter by validation status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((route) => {
        const validation = userValidations.find((v) => v.routeId === route.id);
        return validation && selectedStatuses.includes(validation.status);
      });
    }

    // Filter by favorites
    if (isFavoriteOnly) {
      filtered = filtered.filter((route) => {
        const validation = userValidations.find((v) => v.routeId === route.id);
        return validation && validation.isFavorite;
      });
    }

    setFilteredRoutes(filtered);
  }, [routes, selectedStatuses, isFavoriteOnly, userValidations]);

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

  const handleFavoriteChange = (value: boolean) => {
    setIsFavoriteOnly(value);
  };

  const handleDateChange = (from: string | undefined, to: string | undefined) => {
    setDateFrom(from);
    setDateTo(to);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const activeFiltersCount = selectedSectors.length + selectedGrades.length + selectedHoldColors.length + selectedStatuses.length + (isFavoriteOnly ? 1 : 0) + (dateFrom || dateTo ? 1 : 0);

  // Group routes by date
  const groupedRoutes = useMemo(() => {
    const groups: { [key: string]: Route[] } = {};

    filteredRoutes.forEach((route) => {
      const date = route.openedAt ? new Date(route.openedAt).toISOString().split('T')[0] : 'unknown';
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(route);
    });

    // Sort dates in descending order (most recent first)
    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    return sortedDates.map((date) => ({
      date,
      routes: groups[date],
    }));
  }, [filteredRoutes]);

  // Format date for display
  const formatDateHeader = (dateStr: string) => {
    if (dateStr === 'unknown') return 'Date inconnue';

    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Aujourd'hui";
    if (isYesterday) return 'Hier';

    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col w-full max-w-md mx-auto overflow-hidden bg-cream">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 pt-12 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-hold-blue flex items-center justify-center border-2 border-climb-dark shadow-neo-sm -rotate-3">
                <span className="material-symbols-outlined text-white text-[20px] rotate-3">explore</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-climb-dark">
                Exploration
              </h1>
            </div>
            <div className="flex items-center gap-1.5 mt-1 ml-12">
              <span className="w-2 h-2 rounded-full bg-hold-green animate-pulse"></span>
              <p className="text-[11px] font-bold text-climb-dark/60 uppercase tracking-widest">
                {filteredRoutes.length} voies actives
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-hold-pink text-white border-2 border-climb-dark shadow-neo transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="flex w-full items-center rounded-2xl bg-white border-2 border-climb-dark shadow-neo h-12">
            <div className="flex items-center justify-center pl-4 pr-2 text-hold-blue">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              className="flex w-full bg-transparent border-none focus:ring-0 text-climb-dark placeholder:text-climb-dark/40 text-sm py-2 pl-0 font-bold"
              placeholder="Rechercher une voie..."
              type="text"
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 mr-2 rounded-xl transition-all relative ${showFilters || activeFiltersCount > 0 ? 'bg-hold-pink text-white' : 'text-climb-dark/40 hover:text-climb-dark hover:bg-hold-pink/10'}`}
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-hold-yellow text-climb-dark text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-6 pb-4 space-y-4">
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
            />

            {/* Validation Status Filter */}
            <ValidationStatusFilter
              selectedStatuses={selectedStatuses}
              onStatusesChange={handleStatusesChange}
              showFavoriteFilter={true}
              isFavoriteOnly={isFavoriteOnly}
              onFavoriteChange={handleFavoriteChange}
            />

            {/* Date Filter */}
            <DateFilter
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateChange={handleDateChange}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-hold-pink border-r-transparent"></div>
            <p className="mt-4 text-climb-dark/60 font-bold">Chargement...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 px-5">
            <p className="text-climb-dark font-bold mb-4">{error}</p>
            <button
              onClick={loadRoutes}
              className="btn-neo-primary"
            >
              Réessayer
            </button>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="neo-card p-8 inline-block">
              <span className="material-symbols-outlined text-[48px] text-climb-dark/30 mb-4">
                search_off
              </span>
              <p className="text-climb-dark/60 font-bold">
                {selectedStatuses.length > 0 ? 'Aucune voie avec ces statuts' : 'Aucune voie trouvée'}
              </p>
            </div>
          </div>
        ) : (
          <div className="px-6 pt-2 pb-8 space-y-6">
            {groupedRoutes.map(({ date, routes: dateRoutes }) => (
              <div key={date}>
                {/* Date Separator */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border-2 border-climb-dark/20">
                    <span className="material-symbols-outlined text-hold-blue text-[16px]">
                      calendar_today
                    </span>
                    <span className="text-sm font-extrabold text-climb-dark capitalize">
                      {formatDateHeader(date)}
                    </span>
                    <span className="text-xs font-bold text-climb-dark/50">
                      ({dateRoutes.length})
                    </span>
                  </div>
                  <div className="flex-1 h-0.5 bg-climb-dark/10 rounded-full"></div>
                </div>

                {/* Routes Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {dateRoutes.map((route) => (
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB Button for OPENER/ADMIN */}
      {(user?.role === 'OPENER' || user?.role === 'ADMIN') && (
        <Link
          to="/routes/create"
          className="fixed z-50 bottom-28 right-6 h-14 w-14 rounded-full bg-hold-pink text-white border-2 border-climb-dark shadow-neo flex items-center justify-center hover:scale-105 active:scale-95 active:shadow-none transition-all duration-300"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </Link>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
