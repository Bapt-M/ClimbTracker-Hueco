import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usersAPI, UserPublicProfile, UserStats } from '../lib/api/users';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { BottomNav } from '../components/BottomNav';
import { KiviatChart } from '../components/KiviatChart';
import { ProfileEditForm } from '../components/ProfileEditForm';

export const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const { isDark, toggle } = useDarkMode();

  const [user, setUser] = useState<UserPublicProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const loadUserData = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const [userData, statsData] = await Promise.all([
        usersAPI.getUserById(userId),
        usersAPI.getUserStats(userId),
      ]);

      setUser(userData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 1) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
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

  if (error || !user || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mono-50 dark:bg-black">
        <div className="text-center">
          <p className="text-urgent mb-4">{error || 'Utilisateur non trouvé'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-mono-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold transition-all active:scale-95"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;
  const maxGrade = stats.validationsByGrade.length > 0
    ? stats.validationsByGrade[0].grade
    : '-';

  return (
    <div className="relative min-h-screen flex flex-col w-full max-w-md mx-auto overflow-hidden bg-mono-50 dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-mono-50/90 dark:bg-black/90 backdrop-blur-md border-b border-mono-200 dark:border-mono-800">
        <div className="flex items-center justify-between px-5 pt-12 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-mono-900 dark:text-white">
              {isOwnProfile ? 'My Profile' : 'Profil'}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="px-5 pt-6 flex flex-col gap-6">
          {/* Profile Header */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-mono-200 dark:border-mono-800 bg-mono-900 dark:bg-white flex items-center justify-center">
                <span className="text-white dark:text-black font-bold text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {isOwnProfile && (
                <div className="absolute -bottom-1 -right-1 bg-mono-900 dark:bg-white text-white dark:text-mono-900 rounded-full p-1 border-2 border-white dark:border-black">
                  <span className="material-symbols-outlined text-[14px] block">edit</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-mono-900 dark:text-white leading-none">
                {user.name}
              </h2>
              <p className="text-xs text-mono-500 font-medium">{user.email}</p>
              <div className="flex gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-highlight text-white shadow-glow">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          {isOwnProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="w-full px-4 py-3 bg-mono-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              Edit Profile
            </button>
          )}

          {/* Physical Info */}
          {(user.age || user.height || user.wingspan) && (
            <div className="grid grid-cols-3 gap-3">
              {user.age && (
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 shadow-subtle">
                  <span className="text-2xl font-bold text-mono-900 dark:text-white">
                    {user.age}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-mono-400 tracking-wider mt-0.5">
                    Age
                  </span>
                </div>
              )}
              {user.height && (
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 shadow-subtle">
                  <span className="text-2xl font-bold text-mono-900 dark:text-white">
                    {user.height}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-mono-400 tracking-wider mt-0.5">
                    Taille (cm)
                  </span>
                </div>
              )}
              {user.wingspan && (
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 shadow-subtle">
                  <span className="text-2xl font-bold text-mono-900 dark:text-white">
                    {user.wingspan}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-mono-400 tracking-wider mt-0.5">
                    Envergure (cm)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 shadow-subtle">
              <span className="text-2xl font-bold text-mono-900 dark:text-white">
                {stats.totalValidations}
              </span>
              <span className="text-[10px] uppercase font-bold text-mono-400 tracking-wider mt-0.5">
                Routes
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 shadow-subtle relative overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full"></div>
              <span className="text-2xl font-bold text-accent">{maxGrade}</span>
              <span className="text-[10px] uppercase font-bold text-mono-400 tracking-wider mt-0.5">
                Max Grade
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 shadow-subtle">
              <span className="text-2xl font-bold text-success">
                {stats.totalComments}
              </span>
              <span className="text-[10px] uppercase font-bold text-mono-400 tracking-wider mt-0.5">
                Comments
              </span>
            </div>
          </div>

          {/* Kiviat Chart */}
          <div className="rounded-xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 p-4 shadow-card">
            <KiviatChart userId={user.id} />
          </div>

          {/* Grade Pyramid */}
          {stats.validationsByGrade.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-mono-900 dark:text-white">
                  Grade Pyramid
                </h3>
              </div>
              <div className="rounded-xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 p-4 shadow-card">
                <div className="flex flex-col gap-3">
                  {stats.validationsByGrade.slice(0, 5).map((item, index) => {
                    const percentage = (item.count / stats.totalValidations) * 100;
                    let barColor = 'bg-mono-400 dark:bg-mono-600';

                    if (index === 0) barColor = 'bg-urgent';
                    else if (index === 1) barColor = 'bg-accent';
                    else if (index === 2) barColor = 'bg-highlight';
                    else if (index === 3) barColor = 'bg-success';

                    return (
                      <div key={item.grade} className="flex items-center gap-3">
                        <span className="w-6 text-[10px] font-bold text-mono-500 text-right">
                          {item.grade}
                        </span>
                        <div className="flex-1 h-2 bg-mono-100 dark:bg-mono-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${barColor} rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-4 text-[10px] font-medium text-mono-400">
                          {item.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Recent Sends */}
          {stats.recentValidations.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-mono-900 dark:text-white">
                  Recent Sends
                </h3>
                <span className="text-[10px] font-medium text-mono-400">
                  Ce mois
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {stats.recentValidations.slice(0, 5).map((validation) => (
                  <button
                    key={validation.id}
                    onClick={() => navigate(`/routes/${validation.route.id}`)}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 shadow-sm active:scale-[0.99] transition-transform"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-mono-100 dark:bg-mono-800 border border-mono-200 dark:border-mono-800 flex items-center justify-center">
                      <span className="text-xs font-bold text-mono-900 dark:text-white">
                        {validation.route.grade}
                      </span>
                    </div>
                    <div className="flex-1 text-left overflow-hidden">
                      <h4 className="text-sm font-bold text-mono-900 dark:text-white truncate">
                        {validation.route.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-mono-500 mt-0.5">
                        <span>{validation.route.sector}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-mono-400"></span>
                        <span>{formatDate(validation.validatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="material-symbols-outlined text-[16px] text-success fill-1">
                        check_circle
                      </span>
                      <span className="text-[9px] font-bold uppercase text-success tracking-wide">
                        Sent
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Edit Profile Modal */}
      {isEditingProfile && isOwnProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-mono-900 rounded-2xl shadow-xl">
            <div className="p-6">
              <ProfileEditForm
                user={user as any}
                onSuccess={() => {
                  setIsEditingProfile(false);
                  loadUserData();
                }}
                onCancel={() => setIsEditingProfile(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
