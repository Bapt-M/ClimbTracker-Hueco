import { LeaderboardUser } from '../lib/api/leaderboard';

interface CurrentUserRankCardProps {
  userRank: LeaderboardUser | null;
  onShowDetails?: (userId: string, userName: string) => void;
}

export const CurrentUserRankCard = ({ userRank, onShowDetails }: CurrentUserRankCardProps) => {
  if (!userRank) {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-sm z-30">
        <div className="bg-white/95 dark:bg-mono-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-mono-200 dark:border-mono-800 text-center">
          <p className="text-sm font-medium text-black dark:text-white">
            Complétez votre première voie pour entrer au classement!
          </p>
        </div>
      </div>
    );
  }

  const handleDetailsClick = () => {
    if (onShowDetails) {
      onShowDetails(userRank.userId, userRank.name);
    }
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-sm z-30 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white/95 dark:bg-mono-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-mono-200 dark:border-mono-800 flex items-center justify-between">
        {/* Rank Circle */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-mono-200 dark:bg-mono-800 flex items-center justify-center">
            <span className="text-xs font-black text-black dark:text-white">
              {userRank.rank}
            </span>
          </div>

          {/* Info */}
          <div>
            <p className="text-[10px] font-bold text-mono-600 dark:text-mono-400 uppercase tracking-tight">
              Ton Rang Actuel
            </p>
            <p className="text-sm font-bold text-black dark:text-white">
              {(userRank.points ?? 0).toLocaleString()} points
            </p>
          </div>
        </div>

        {/* Details Button */}
        <button
          onClick={handleDetailsClick}
          className="bg-highlight text-white text-[10px] font-black px-3 py-2 rounded-lg uppercase hover:bg-highlight-hover transition-colors"
        >
          Détails
        </button>
      </div>
    </div>
  );
};
