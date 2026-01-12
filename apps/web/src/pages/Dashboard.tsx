import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { BottomNav } from '../components/BottomNav';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, checkAuth } = useAuth();
  const { isDark, toggle } = useDarkMode();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              Analytics
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
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-5 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-mono-900 dark:text-white mb-2">
            Prêt à grimper,
            <br />
            <span className="text-mono-500">{user?.name.split(' ')[0]} ?</span>
          </h2>
        </div>

        {/* User Info Card */}
        <div className="rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl p-5 border border-mono-200/50 dark:border-mono-800 shadow-card mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 rounded-full bg-mono-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-2xl">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-mono-900 dark:text-white">
                {user?.name}
              </h3>
              <p className="text-sm text-mono-500">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-mono-200 dark:border-mono-800">
            <span className="material-symbols-outlined text-highlight text-[14px]">
              verified_user
            </span>
            <p className="text-xs font-medium text-mono-500">
              Connecté en tant que {user?.role}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 shadow-sm">
            <span className="text-[10px] text-mono-500 uppercase font-bold tracking-wider mb-1">
              Validations
            </span>
            <span className="text-2xl font-extrabold text-mono-900 dark:text-white">
              0
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 shadow-sm">
            <span className="text-[10px] text-mono-500 uppercase font-bold tracking-wider mb-1">
              Voies
            </span>
            <span className="text-2xl font-extrabold text-mono-900 dark:text-white">
              0
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 shadow-sm">
            <span className="text-[10px] text-mono-500 uppercase font-bold tracking-wider mb-1">
              Niveau
            </span>
            <span className="text-2xl font-extrabold text-mono-900 dark:text-white">
              -
            </span>
          </div>
        </div>

        {/* About Card */}
        <div className="rounded-2xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl p-5 border border-mono-200/50 dark:border-mono-800 shadow-card">
          <h3 className="text-lg font-bold text-mono-900 dark:text-white mb-3">
            ClimbTracker
          </h3>
          <p className="text-sm text-mono-600 dark:text-mono-400 leading-relaxed font-light mb-4">
            Application de suivi d'escalade. Phase 3 (Fonctionnalités Sociales) terminée.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-success text-sm fill-1">
                check_circle
              </span>
              <span className="text-xs text-mono-600 dark:text-mono-400">
                Authentification
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-success text-sm fill-1">
                check_circle
              </span>
              <span className="text-xs text-mono-600 dark:text-mono-400">
                Gestion des voies
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-success text-sm fill-1">
                check_circle
              </span>
              <span className="text-xs text-mono-600 dark:text-mono-400">
                Validations & Commentaires
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
