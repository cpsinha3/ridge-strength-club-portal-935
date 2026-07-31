import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  weeks: number;
}

export default function StreakBadge({ weeks }: StreakBadgeProps) {
  if (weeks <= 0) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ember/10 border border-ember/20">
      <Flame className="w-3.5 h-3.5 text-ember" />
      <span className="text-xs font-semibold text-ember">
        {weeks} week{weeks !== 1 ? 's' : ''} straight
      </span>
    </div>
  );
}
