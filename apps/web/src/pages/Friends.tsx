import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { BottomNav } from '../components/BottomNav';
import {
  friendshipsAPI,
  FriendshipWithUser,
  UserSearchResult,
  FriendshipStatus,
} from '../lib/api/friendships';

type TabType = 'friends' | 'requests' | 'search';

export const Friends = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDark, toggle } = useDarkMode();

  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [friends, setFriends] = useState<FriendshipWithUser[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendshipWithUser[]>([]);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'friends') {
      loadFriends();
    } else if (activeTab === 'requests') {
      loadPendingRequests();
    }
  }, [activeTab]);

  const loadFriends = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await friendshipsAPI.getFriends();
      setFriends(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Impossible de charger les amis');
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await friendshipsAPI.getPendingRequests();
      setPendingRequests(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Impossible de charger les demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await friendshipsAPI.searchUsers(searchTerm);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      await friendshipsAPI.sendFriendRequest(userId);
      // Rafraîchir les résultats
      await handleSearch();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de l\'envoi de la demande');
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      await friendshipsAPI.acceptFriendRequest(friendshipId);
      await loadPendingRequests();
      await loadFriends();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de l\'acceptation');
    }
  };

  const handleRejectRequest = async (friendshipId: string) => {
    try {
      await friendshipsAPI.rejectFriendRequest(friendshipId);
      await loadPendingRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors du rejet');
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer cet ami ?')) return;

    try {
      await friendshipsAPI.removeFriend(friendshipId);
      await loadFriends();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen flex flex-col w-full max-w-md mx-auto overflow-hidden bg-mono-50 dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-mono-50/90 dark:bg-black/90 backdrop-blur-md border-b border-mono-200 dark:border-mono-800">
        <div className="flex items-center justify-between px-6 pt-12 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-mono-900 dark:text-white">
              Amis
            </h1>
            <p className="text-xs font-medium text-mono-500 mt-0.5 uppercase tracking-wide">
              ClimbTracker
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
            onClick={() => setActiveTab('friends')}
            className={`relative pb-2 text-sm font-${
              activeTab === 'friends' ? 'bold' : 'medium'
            } ${
              activeTab === 'friends'
                ? 'text-mono-900 dark:text-white'
                : 'text-mono-400 hover:text-mono-600 dark:hover:text-mono-200'
            }`}
          >
            Mes Amis
            {activeTab === 'friends' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mono-900 dark:bg-white rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`relative pb-2 text-sm font-${
              activeTab === 'requests' ? 'bold' : 'medium'
            } ${
              activeTab === 'requests'
                ? 'text-mono-900 dark:text-white'
                : 'text-mono-400 hover:text-mono-600 dark:hover:text-mono-200'
            }`}
          >
            Demandes
            {pendingRequests.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-accent text-black text-[10px] font-bold rounded-full">
                {pendingRequests.length}
              </span>
            )}
            {activeTab === 'requests' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mono-900 dark:bg-white rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`relative pb-2 text-sm font-${
              activeTab === 'search' ? 'bold' : 'medium'
            } ${
              activeTab === 'search'
                ? 'text-mono-900 dark:text-white'
                : 'text-mono-400 hover:text-mono-600 dark:hover:text-mono-200'
            }`}
          >
            Rechercher
            {activeTab === 'search' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-mono-900 dark:bg-white rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6 pb-32 gap-3 overflow-y-auto no-scrollbar">
        {/* Search Tab */}
        {activeTab === 'search' && (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-mono-900 border border-mono-200 dark:border-mono-800 text-mono-900 dark:text-white placeholder-mono-400 focus:outline-none focus:border-accent"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-mono-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-mono-900 dark:border-white border-r-transparent"></div>
              </div>
            ) : searchResults.length === 0 && searchTerm ? (
              <div className="text-center py-12">
                <p className="text-mono-500">Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-mono-900 border border-mono-200 dark:border-mono-800"
                  >
                    <div className="h-10 w-10 rounded-full bg-mono-200 dark:bg-mono-800 flex items-center justify-center shrink-0">
                      <span className="text-mono-900 dark:text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-mono-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="text-xs text-mono-500">{user.email}</p>
                    </div>
                    {user.friendshipStatus === null && (
                      <button
                        onClick={() => handleSendRequest(user.id)}
                        className="px-3 py-1.5 bg-accent text-black text-xs font-bold rounded-lg transition-all active:scale-95"
                      >
                        Ajouter
                      </button>
                    )}
                    {user.friendshipStatus === FriendshipStatus.PENDING && (
                      <span className="px-3 py-1.5 bg-mono-200 dark:bg-mono-800 text-mono-600 dark:text-mono-400 text-xs font-bold rounded-lg">
                        {user.isRequester ? 'Envoyée' : 'En attente'}
                      </span>
                    )}
                    {user.friendshipStatus === FriendshipStatus.ACCEPTED && (
                      <span className="px-3 py-1.5 bg-success/20 text-success text-xs font-bold rounded-lg">
                        Ami
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pending Requests Tab */}
        {activeTab === 'requests' && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-mono-900 dark:border-white border-r-transparent"></div>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-mono-500">Aucune demande en attente</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-mono-900 border border-mono-200 dark:border-mono-800"
                  >
                    <div className="h-10 w-10 rounded-full bg-mono-200 dark:bg-mono-800 flex items-center justify-center shrink-0">
                      <span className="text-mono-900 dark:text-white font-bold">
                        {request.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-mono-900 dark:text-white">
                        {request.user.name}
                      </h3>
                      <p className="text-xs text-mono-500">{request.user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="p-2 bg-success text-white rounded-lg transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="p-2 bg-urgent text-white rounded-lg transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-mono-900 dark:border-white border-r-transparent"></div>
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-mono-500 mb-4">Vous n'avez pas encore d'amis</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="px-4 py-2 bg-mono-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold transition-all active:scale-95"
                >
                  Rechercher des amis
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {friends.map((friendship) => (
                  <div
                    key={friendship.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-mono-900 border border-mono-200 dark:border-mono-800"
                  >
                    <div className="h-10 w-10 rounded-full bg-mono-200 dark:bg-mono-800 flex items-center justify-center shrink-0">
                      <span className="text-mono-900 dark:text-white font-bold">
                        {friendship.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-mono-900 dark:text-white">
                        {friendship.user.name}
                      </h3>
                      <p className="text-xs text-mono-500">{friendship.user.email}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(friendship.id)}
                      className="p-2 text-urgent hover:bg-urgent/10 rounded-lg transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">person_remove</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-urgent text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
