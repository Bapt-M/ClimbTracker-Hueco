import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { BottomNav } from '../components/BottomNav';
import { LeaderboardTopUser } from '../components/LeaderboardTopUser';
import { LeaderboardUserCard } from '../components/LeaderboardUserCard';
import { CurrentUserRankCard } from '../components/CurrentUserRankCard';
import { UserValidationDetailsModal } from '../components/UserValidationDetailsModal';
import { leaderboardAPI, LeaderboardUser } from '../lib/api/leaderboard';

type TabType = 'global' | 'friends';

export const Leaderboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggle } = useDarkMode();

  const [activeTab, setActiveTab] = useState<TabType>('global');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page] = useState(1);
  const [limit] = useState(50);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');

  useEffect(() => {
    loadLeaderboard();
    loadCurrentUserRank();
  }, [activeTab, page]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await leaderboardAPI.getLeaderboard({
        tab: activeTab,
        page,
        limit,
      });
      setUsers(result.users);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Impossible de charger le classement');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentUserRank = async () => {
    try {
      const rank = await leaderboardAPI.getCurrentUserRank();
      setCurrentUserRank(rank);
    } catch (err) {
      // User might not have any validations yet
      setCurrentUserRank(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleShowDetails = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedUserId(null);
    setSelectedUserName('');
  };

  const topUser = users.length > 0 ? users[0] : null;
  const otherUsers = users.slice(1);

  return (
    <div className="relative min-h-screen flex flex-col w-full max-w-md mx-auto overflow-hidden bg-mono-50 dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-mono-50/90 dark:bg-black/90 backdrop-blur-md border-b border-mono-200 dark:border-mono-800">
        <div className="flex items-center justify-between px-6 pt-12 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-mono-900 dark:text-white">
              Classement
            </h1>
            <p className="text-xs font-medium text-mono-500 mt-0.5 uppercase tracking-wide">
              Saison Hiver • ClimbTracker
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-full hover:bg-mono-200 dark:hover:bg-mono-800 transition-colors"
            >
              <span className="material-symbols-outlined text-mono-900 dark:text-white text-[24px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-mono-200 dark:hover:bg-mono-800 transition-colors"
            >
              <span className="material-symbols-outlined text-mono-900 dark:text-white text-[24px]">
                logout
              </span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pb-2 gap-6 border-b border-transparent">
          <button
            onClick={() => setActiveTab('global')}
            className={`relative pb-2 text-sm font-${
              activeTab === 'global' ? 'bold' : 'medium'
            } ${
              activeTab === 'global'
                ? 'text-mono-900 dark:text-white'
                : 'text-mono-400 hover:text-mono-600 dark:hover:text-mono-200'
            }`}
          >
            Global
            {activeTab === 'global' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mono-900 dark:bg-white rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`relative pb-2 text-sm font-${
              activeTab === 'friends' ? 'bold' : 'medium'
            } ${
              activeTab === 'friends'
                ? 'text-mono-900 dark:text-white'
                : 'text-mono-400 hover:text-mono-600 dark:hover:text-mono-200'
            }`}
          >
            Amis
            {activeTab === 'friends' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mono-900 dark:bg-white rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6 pb-32 gap-3 overflow-y-auto no-scrollbar">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-mono-900 dark:border-white border-r-transparent"></div>
            <p className="mt-4 text-mono-500">Chargement du classement...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 px-5">
            <p className="text-mono-900 dark:text-white mb-4">{error}</p>
            <button
              onClick={loadLeaderboard}
              className="px-4 py-2 bg-mono-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold transition-all active:scale-95"
            >
              Réessayer
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 px-6">
            {activeTab === 'friends' ? (
              <>
                <p className="text-mono-500 mb-4">
                  Vous n'avez pas encore d'amis ou ils n'ont pas de validations
                </p>
                <button
                  onClick={() => navigate('/friends')}
                  className="px-4 py-2 bg-mono-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold transition-all active:scale-95"
                >
                  Gérer mes amis
                </button>
              </>
            ) : (
              <p className="text-mono-500">Aucun utilisateur classé pour le moment</p>
            )}
          </div>
        ) : (
          <>
            {/* Top User */}
            {topUser && <LeaderboardTopUser user={topUser} />}

            {/* Other Users */}
            <div className="space-y-2">
              {otherUsers.map((userData) => (
                <LeaderboardUserCard
                  key={userData.userId}
                  user={userData}
                  isCurrentUser={userData.userId === user?.id}
                  onShowDetails={handleShowDetails}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Current User Rank Card */}
      {!loading && <CurrentUserRankCard userRank={currentUserRank} onShowDetails={handleShowDetails} />}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Details Modal */}
      {showDetailsModal && selectedUserId && (
        <UserValidationDetailsModal
          userId={selectedUserId}
          userName={selectedUserName}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};
