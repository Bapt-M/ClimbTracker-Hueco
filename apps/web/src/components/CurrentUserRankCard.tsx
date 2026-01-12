import { LeaderboardUser } from '../lib/api/leaderboard';

interface CurrentUserRankCardProps {
  userRank: LeaderboardUser | null;
}

export const CurrentUserRankCard = ({ userRank }: CurrentUserRankCardProps) => {
  if (!userRank) {
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-sm z-30">
        <div className="bg-mono-900/95 dark:bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-mono-800 dark:border-mono-200 text-center">
          <p className="text-sm font-medium text-white dark:text-black">
            Complétez votre première voie pour entrer au classement!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-sm z-30 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-mono-900/95 dark:bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-mono-800 dark:border-mono-200 flex items-center justify-between">
        {/* Rank Circle */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-mono-800 dark:bg-mono-200 flex items-center justify-center">
            <span className="text-xs font-black text-white dark:text-black">
              {userRank.rank}
            </span>
          </div>

          {/* Info */}
          <div>
            <p className="text-[10px] font-bold text-mono-400 dark:text-mono-600 uppercase tracking-tight">
              Ton Rang Actuel
            </p>
            <p className="text-sm font-bold text-white dark:text-black">
              {(userRank.points ?? 0).toLocaleString()} points
            </p>
          </div>
        </div>

        {/* Details Button */}
        <button className="bg-highlight text-white text-[10px] font-black px-3 py-2 rounded-lg uppercase hover:bg-highlight-hover transition-colors">
          Détails
        </button>
      </div>
    </div>
  );
};
