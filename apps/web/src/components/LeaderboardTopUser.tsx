import { LeaderboardUser } from '../lib/api/leaderboard';

interface LeaderboardTopUserProps {
  user: LeaderboardUser;
}

export const LeaderboardTopUser = ({ user }: LeaderboardTopUserProps) => {
  return (
    <div className="mb-4 relative overflow-hidden rounded-3xl bg-mono-900 border border-mono-800 p-6 flex flex-col items-center gap-4 group cursor-pointer shadow-glow-accent">
      {/* Top 1 Badge */}
      <div className="absolute top-4 right-4 bg-accent text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
        Top 1
      </div>

      {/* Avatar */}
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-2 border-accent p-1">
          {user.avatar ? (
            <div
              className="h-full w-full rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${user.avatar})` }}
            />
          ) : (
            <div className="h-full w-full rounded-full bg-mono-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-mono-400 text-[32px]">
                person
              </span>
            </div>
          )}
        </div>
        {/* Medal Icon */}
        <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-accent rounded-full flex items-center justify-center border-2 border-mono-900">
          <span className="material-symbols-outlined text-black text-[16px] fill-1">
            military_tech
          </span>
        </div>
      </div>

      {/* User Info */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-white leading-tight">{user.name}</h2>
        <p className="text-mono-400 text-xs font-medium">
          {user.points.toLocaleString()} pts • {user.totalValidations} voies
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-2 w-full mt-2">
        <div className="flex-1 bg-mono-800 rounded-xl p-3 text-center border border-mono-700">
          <p className="text-[10px] text-mono-500 font-bold uppercase">Niveau Moy.</p>
          <p className="text-sm font-bold text-white">{user.averageGrade.toFixed(1)}</p>
        </div>
        <div className="flex-1 bg-mono-800 rounded-xl p-3 text-center border border-mono-700">
          <p className="text-[10px] text-mono-500 font-bold uppercase">Flash Rate</p>
          <p className="text-sm font-bold text-success">{user.flashRate.toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
};
