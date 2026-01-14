import { LeaderboardUser } from '../lib/api/leaderboard';
import { getDifficultyColor } from '../utils/gradeColors';

interface LeaderboardUserCardProps {
  user: LeaderboardUser;
  isCurrentUser?: boolean;
  onShowDetails?: (userId: string, userName: string) => void;
}

export const LeaderboardUserCard = ({ user, isCurrentUser = false, onShowDetails }: LeaderboardUserCardProps) => {
  const validatedColor = user.validatedGrade ? getDifficultyColor(user.validatedGrade) : null;

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShowDetails) {
      onShowDetails(user.userId, user.name);
    }
  };

  return (
    <div
      className={`group flex items-center gap-4 rounded-2xl p-3 pr-4 border transition-all ${
        isCurrentUser
          ? 'bg-mono-100 dark:bg-mono-800/50 border-mono-300 dark:border-mono-700'
          : 'bg-white dark:bg-mono-900 border-mono-100 dark:border-mono-800 hover:border-mono-300 dark:hover:border-mono-700'
      }`}
    >
      {/* Rank Number */}
      <div className="w-6 text-center">
        <span
          className={`text-sm font-bold transition-colors ${
            isCurrentUser
              ? 'text-mono-900 dark:text-white'
              : 'text-mono-400 group-hover:text-white'
          }`}
        >
          {user.rank}
        </span>
      </div>

      {/* Avatar */}
      <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-mono-200 dark:bg-mono-800">
        {user.avatar ? (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${user.avatar})` }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="material-symbols-outlined text-mono-500">person</span>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <h3 className="text-mono-900 dark:text-white text-sm font-bold leading-none">
            {user.name}
          </h3>
          {isCurrentUser && (
            <span className="text-[8px] bg-highlight text-white px-1 py-0.5 rounded font-bold uppercase">
              Moi
            </span>
          )}
        </div>
        <p className="text-[10px] text-mono-500 font-medium mt-1">
          {(user.points ?? 0).toLocaleString()} pts • {user.totalValidations ?? 0} voies
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex flex-col items-end">
          {user.validatedGrade && validatedColor ? (
            <span className="text-xs font-bold" style={{ color: validatedColor.hex }}>
              {user.validatedGrade}
            </span>
          ) : (
            <span className="text-xs font-bold text-mono-500">-</span>
          )}
          {(user.flashRate ?? 0) > 0 && (
            <div className="flex gap-0.5 mt-1">
              {Array.from({ length: Math.min(3, Math.ceil((user.flashRate ?? 0) / 33)) }).map((_, i) => (
                <div key={i} className="h-1 w-3 bg-accent rounded-full"></div>
              ))}
            </div>
          )}
        </div>

        {/* Details Button */}
        {onShowDetails && (
          <button
            onClick={handleDetailsClick}
            className="px-2 py-1 text-[10px] font-bold text-mono-600 dark:text-mono-400 hover:text-accent dark:hover:text-accent border border-mono-300 dark:border-mono-700 rounded-lg transition-all active:scale-95"
          >
            Détails
          </button>
        )}
      </div>
    </div>
  );
};
