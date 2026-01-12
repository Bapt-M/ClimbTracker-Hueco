import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { routesAPI, Route } from '../lib/api/routes';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { ValidationButton } from '../components/ValidationButton';
import { CommentList } from '../components/CommentList';
import { CommentForm } from '../components/CommentForm';
import { AttemptStatusSelector } from '../components/AttemptStatusSelector';
import { RouteCompletionCount } from '../components/RouteCompletionCount';
import { MiniGymLayout } from '../components/MiniGymLayout';
import { ImageViewer } from '../components/ImageViewer';
import { EditRouteModal } from '../components/EditRouteModal';
import { HoldColorIndicator } from '../components/HoldColorIndicator';

export const RouteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggle } = useDarkMode();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentRefresh, setCommentRefresh] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadRoute();
    }
  }, [id]);

  const loadRoute = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await routesAPI.getRouteById(id);
      setRoute(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load route');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Êtes-vous sûr de vouloir supprimer cette voie ?')) return;

    try {
      await routesAPI.deleteRoute(id);
      navigate('/routes');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete route');
    }
  };

  const handleStatusChange = async (status: 'PENDING' | 'ACTIVE' | 'ARCHIVED') => {
    if (!id) return;

    try {
      const updated = await routesAPI.updateRouteStatus(id, status);
      setRoute(updated);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAttemptStatusChange = async (status: any) => {
    // This function will be called by AttemptStatusSelector
    // The actual validation update will be handled by the component
    // We just need to refresh the route data after status change
    await loadRoute();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mono-50 dark:bg-black">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-mono-900 dark:border-white border-r-transparent"></div>
          <p className="mt-4 text-mono-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mono-50 dark:bg-black">
        <div className="text-center">
          <p className="text-mono-900 dark:text-white mb-4">{error || 'Route not found'}</p>
          <Link
            to="/routes"
            className="inline-block px-4 py-2 bg-mono-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold transition-all active:scale-95"
          >
            Retour aux voies
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = user?.id === route.openerId || user?.role === 'ADMIN';
  const canDelete = user?.role === 'ADMIN';
  const canChangeStatus = user?.role === 'ADMIN';

  return (
    <div className="relative min-h-screen flex flex-col w-full max-w-md mx-auto overflow-hidden bg-mono-50 dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-mono-50/90 dark:bg-black/90 backdrop-blur-md border-b border-mono-200 dark:border-mono-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            to="/routes"
            className="p-2 -ml-2 rounded-full hover:bg-mono-200 dark:hover:bg-mono-800 transition-colors text-mono-900 dark:text-white"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-full hover:bg-mono-200 dark:hover:bg-mono-800 transition-colors"
            >
              <span className="material-symbols-outlined text-mono-900 dark:text-white text-[22px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 -mr-2 rounded-full hover:bg-mono-200 dark:hover:bg-mono-800 transition-colors"
            >
              <span className="material-symbols-outlined text-mono-900 dark:text-white text-[22px]">
                logout
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Hero Image */}
        <div
          className="relative w-full aspect-[4/3] bg-mono-200 dark:bg-mono-800 cursor-pointer group"
          onClick={() => setIsViewerOpen(true)}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${route.mainPhoto})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          {/* Zoom indicator */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-[20px]">zoom_in</span>
            <span className="text-sm font-medium">Cliquer pour agrandir</span>
          </div>

          {/* Hold Color Indicator */}
          {route.holdColorHex && (
            <div className="absolute top-4 left-4 pointer-events-none">
              <HoldColorIndicator holdColorHex={route.holdColorHex} size={64} className="drop-shadow-xl" />
            </div>
          )}

          <div className="absolute bottom-0 left-0 w-full p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {route.name}
              </h1>
              <div className="rounded-lg border-2 border-white/30 bg-white/30 dark:bg-black/30 backdrop-blur-sm p-2">
                <MiniGymLayout sector={route.sector} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-mono-300 text-sm font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">edit</span>
                {route.opener.name}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-5 py-6 grid grid-cols-3 gap-3 border-b border-mono-200 dark:border-mono-800 bg-white dark:bg-mono-900/30">
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-800 shadow-sm">
            <span className="text-[10px] text-mono-500 uppercase font-bold tracking-wider mb-1">
              Grade
            </span>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl font-extrabold text-mono-900 dark:text-white">
                {route.difficulty}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-800 shadow-sm">
            <span className="text-[10px] text-mono-500 uppercase font-bold tracking-wider mb-1">
              Validations
            </span>
            <span className="text-2xl font-extrabold text-mono-900 dark:text-white">
              {route.validationsCount || 0}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-mono-50 dark:bg-mono-900 border border-mono-200 dark:border-mono-800 shadow-sm">
            <span className="text-[10px] text-mono-500 uppercase font-bold tracking-wider mb-1">
              Commentaires
            </span>
            <span className="text-2xl font-extrabold text-mono-900 dark:text-white">
              {route.commentsCount || 0}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-5 py-6 space-y-8">
          {/* Completion Count */}
          <div>
            <RouteCompletionCount routeId={route.id} />
          </div>

          {/* About */}
          {route.description && (
            <div>
              <h2 className="text-lg font-bold text-mono-900 dark:text-white mb-2">
                À propos de cette voie
              </h2>
              <p className="text-sm text-mono-600 dark:text-mono-400 leading-relaxed font-light">
                {route.description}
              </p>
            </div>
          )}

          {/* Tips */}
          {route.tips && (
            <div className="rounded-2xl bg-highlight/10 border border-highlight/30 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-highlight text-[20px] fill-1">
                  tips_and_updates
                </span>
                <h3 className="text-sm font-bold text-highlight tracking-wide uppercase">
                  Conseils
                </h3>
              </div>
              <p className="text-xs text-mono-700 dark:text-mono-300 font-medium leading-relaxed">
                {route.tips}
              </p>
            </div>
          )}

          {/* Admin Actions */}
          {(canEdit || canDelete || canChangeStatus) && (
            <div>
              <h2 className="text-lg font-bold text-mono-900 dark:text-white mb-4">
                Actions Admin
              </h2>
              <div className="space-y-3">
                {canChangeStatus && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange('PENDING')}
                      className="flex-1 px-4 py-2 bg-white dark:bg-mono-900 border border-mono-200 dark:border-mono-800 text-mono-900 dark:text-white rounded-xl font-semibold hover:border-mono-400 dark:hover:border-mono-600 transition-all active:scale-95 text-sm"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusChange('ACTIVE')}
                      className="flex-1 px-4 py-2 bg-success text-white rounded-xl font-semibold transition-all active:scale-95 text-sm"
                    >
                      Activer
                    </button>
                    <button
                      onClick={() => handleStatusChange('ARCHIVED')}
                      className="flex-1 px-4 py-2 bg-white dark:bg-mono-900 border border-mono-200 dark:border-mono-800 text-mono-900 dark:text-white rounded-xl font-semibold hover:border-mono-400 dark:hover:border-mono-600 transition-all active:scale-95 text-sm"
                    >
                      Archiver
                    </button>
                  </div>
                )}

                {canEdit && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="w-full px-4 py-2 bg-mono-900 dark:bg-white text-white dark:text-black text-center rounded-xl font-semibold transition-all active:scale-95"
                  >
                    Modifier
                  </button>
                )}

                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 bg-urgent/10 border border-urgent/20 text-urgent rounded-xl font-semibold transition-all active:scale-95"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-mono-900 dark:text-white">
                Commentaires
              </h2>
            </div>

            {/* Comment Form */}
            <div className="mb-6">
              <CommentForm
                routeId={route.id}
                onCommentCreated={() => setCommentRefresh((prev) => prev + 1)}
              />
            </div>

            {/* Comment List */}
            <CommentList routeId={route.id} refreshTrigger={commentRefresh} />
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 z-50 w-full max-w-md bg-white/95 dark:bg-black/80 backdrop-blur-xl border-t border-mono-200 dark:border-mono-800 px-5 py-4">
        <div className="flex gap-3">
          <button className="h-12 w-12 shrink-0 rounded-xl bg-mono-100 dark:bg-mono-800 text-mono-900 dark:text-white hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors flex items-center justify-center border border-transparent dark:border-mono-800">
            <span className="material-symbols-outlined text-[22px]">add_a_photo</span>
          </button>
          <div className="flex-1">
            <ValidationButton
              routeId={route.id}
              validationCount={route.validationsCount || 0}
              onValidationChange={loadRoute}
            />
          </div>
        </div>
      </div>

      {/* Image Viewer */}
      <ImageViewer
        imageUrl={route.mainPhoto}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />

      {/* Edit Modal */}
      {route && (
        <EditRouteModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          route={route}
          onRouteUpdated={loadRoute}
        />
      )}
    </div>
  );
};
