import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/routes') {
      return location.pathname === '/routes';
    }
    if (path.startsWith('/users/')) {
      return location.pathname.startsWith('/users/');
    }
    if (path === '/leaderboard') {
      return location.pathname === '/leaderboard';
    }
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 z-50 w-full max-w-md bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-mono-200 dark:border-mono-800 pb-6 pt-2">
      <div className="grid grid-cols-4 h-12">
        {/* Explore */}
        <Link
          to="/routes"
          className="group flex flex-col items-center justify-center gap-1 relative"
        >
          {isActive('/routes') && (
            <div className="absolute -top-2 h-0.5 w-8 bg-mono-900 dark:bg-white rounded-full"></div>
          )}
          <span className={`material-symbols-outlined text-[22px] ${isActive('/routes') ? 'text-mono-900 dark:text-white fill-1' : 'text-mono-400'}`}>
            explore
          </span>
          <span className={`text-[10px] ${isActive('/routes') ? 'font-bold text-mono-900 dark:text-white' : 'font-medium text-mono-400'}`}>
            Explore
          </span>
        </Link>

        {/* Leaderboard */}
        <Link
          to="/leaderboard"
          className="group flex flex-col items-center justify-center gap-1 relative"
        >
          {isActive('/leaderboard') && (
            <div className="absolute -top-2 h-0.5 w-8 bg-mono-900 dark:bg-white rounded-full"></div>
          )}
          <span className={`material-symbols-outlined text-[22px] ${isActive('/leaderboard') ? 'text-mono-900 dark:text-white fill-1' : 'text-mono-400'}`}>
            leaderboard
          </span>
          <span className={`text-[10px] ${isActive('/leaderboard') ? 'font-bold text-mono-900 dark:text-white' : 'font-medium text-mono-400'}`}>
            Classement
          </span>
        </Link>

        {/* Profile */}
        <Link
          to={user ? `/users/${user.id}` : '/'}
          className="group flex flex-col items-center justify-center gap-1 relative"
        >
          {isActive(`/users/${user?.id}`) && (
            <div className="absolute -top-2 h-0.5 w-8 bg-mono-900 dark:bg-white rounded-full"></div>
          )}
          <span className={`material-symbols-outlined text-[22px] ${isActive(`/users/${user?.id}`) ? 'text-mono-900 dark:text-white fill-1' : 'text-mono-400'}`}>
            person
          </span>
          <span className={`text-[10px] ${isActive(`/users/${user?.id}`) ? 'font-bold text-mono-900 dark:text-white' : 'font-medium text-mono-400'}`}>
            Profile
          </span>
        </Link>

        {/* Analytics / Dashboard */}
        <Link
          to="/"
          className="group flex flex-col items-center justify-center gap-1 relative"
        >
          {isActive('/') && (
            <div className="absolute -top-2 h-0.5 w-8 bg-mono-900 dark:bg-white rounded-full"></div>
          )}
          <span className={`material-symbols-outlined text-[22px] ${isActive('/') ? 'text-mono-900 dark:text-white fill-1' : 'text-mono-400'}`}>
            bar_chart
          </span>
          <span className={`text-[10px] ${isActive('/') ? 'font-bold text-mono-900 dark:text-white' : 'font-medium text-mono-400'}`}>
            Analytics
          </span>
        </Link>
      </div>
    </div>
  );
};
