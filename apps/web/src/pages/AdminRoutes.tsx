import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { routesAPI, Route } from '../lib/api/routes';
import { useAuth } from '../hooks/useAuth';
import { BottomNav } from '../components/BottomNav';
import { EditRouteModal } from '../components/EditRouteModal';

export const AdminRoutes = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'ARCHIVED'>('ALL');
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'ADMIN') {
      navigate('/routes');
      return;
    }
    loadRoutes();
  }, [filter, user, navigate]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const filters: any = { limit: 100, page: 1 };
      if (filter !== 'ALL') {
        filters.status = [filter];
      } else {
        filters.status = ['PENDING', 'ACTIVE', 'ARCHIVED'];
      }
      const result = await routesAPI.getRoutes(filters);
      setRoutes(result.data);
    } catch (error) {
      console.error('Failed to load routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (routeId: string, newStatus: 'PENDING' | 'ACTIVE' | 'ARCHIVED') => {
    try {
      await routesAPI.updateRouteStatus(routeId, newStatus);
      loadRoutes();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (routeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette voie ?')) {
      return;
    }
    try {
      await routesAPI.deleteRoute(routeId);
      loadRoutes();
    } catch (error) {
      console.error('Failed to delete route:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      PENDING: { color: 'bg-yellow-500', label: 'En attente' },
      ACTIVE: { color: 'bg-green-500', label: 'Active' },
      ARCHIVED: { color: 'bg-gray-500', label: 'Archivée' },
    };
    const { color, label } = config[status] || config.PENDING;
    return (
      <span className={`${color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
        {label}
      </span>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col w-full max-w-md mx-auto overflow-hidden bg-cream">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-mono-200">
        <div className="flex items-center justify-between px-5 pt-12 pb-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-mono-900">
              Admin - Voies
            </h1>
            <p className="text-[10px] font-medium text-mono-500 uppercase tracking-wider">
              Gestion des voies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="relative p-2 rounded-full hover:bg-mono-200 transition-colors"
            >
              <span className="material-symbols-outlined text-mono-900 text-[22px]">
                logout
              </span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-5 pb-3">
          {['ALL', 'PENDING', 'ACTIVE', 'ARCHIVED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === status
                  ? 'bg-mono-900 text-white'
                  : 'bg-mono-200 text-mono-600'
              }`}
            >
              {status === 'ALL' ? 'Toutes' : status === 'PENDING' ? 'En attente' : status === 'ACTIVE' ? 'Actives' : 'Archivées'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-5 py-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="material-symbols-outlined animate-spin text-4xl text-mono-400">
              progress_activity
            </span>
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-mono-300 mb-4">
              route
            </span>
            <p className="text-mono-500">
              Aucune voie trouvée
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {routes.map((route) => (
              <div
                key={route.id}
                className="bg-white/70 backdrop-blur-xl p-4 rounded-xl border border-mono-200/50 shadow-card"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  {/* Image */}
                  <div
                    className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${route.mainPhoto})` }}
                  >
                    <div className="w-full h-full bg-gradient-to-t from-black/30 to-transparent rounded-lg flex items-end justify-end p-1">
                      <div
                        className="w-5 h-5 rounded border-2 border-white/80"
                        style={{ backgroundColor: getDifficultyColor(route.difficulty) }}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-mono-900 leading-tight">
                        {route.name}
                      </h3>
                      {getStatusBadge(route.status)}
                    </div>
                    <div className="text-[11px] text-mono-600 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">palette</span>
                        <span>{route.difficulty} · {route.gradeLabel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        <span>{route.opener.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>{route.validationsCount || 0} validations</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/routes/${route.id}`)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-mono-100 hover:bg-mono-200 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-mono-600">
                      visibility
                    </span>
                    <span className="text-[11px] font-semibold text-mono-900">
                      Voir
                    </span>
                  </button>

                  <button
                    onClick={() => setEditingRoute(route)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-mono-100 hover:bg-mono-200 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-mono-600">
                      edit
                    </span>
                    <span className="text-[11px] font-semibold text-mono-900">
                      Modifier
                    </span>
                  </button>

                  {route.status === 'PENDING' && (
                    <button
                      onClick={() => handleStatusChange(route.id, 'ACTIVE')}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        check
                      </span>
                      <span className="text-[11px] font-semibold">
                        Approuver
                      </span>
                    </button>
                  )}

                  {route.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleStatusChange(route.id, 'ARCHIVED')}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        archive
                      </span>
                      <span className="text-[11px] font-semibold">
                        Archiver
                      </span>
                    </button>
                  )}

                  {route.status === 'ARCHIVED' && (
                    <button
                      onClick={() => handleStatusChange(route.id, 'ACTIVE')}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        unarchive
                      </span>
                      <span className="text-[11px] font-semibold">
                        Restaurer
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(route.id)}
                    className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Edit Modal */}
      {editingRoute && (
        <EditRouteModal
          isOpen={!!editingRoute}
          onClose={() => setEditingRoute(null)}
          route={editingRoute}
          onRouteUpdated={() => {
            loadRoutes();
            setEditingRoute(null);
          }}
        />
      )}
    </div>
  );
};
