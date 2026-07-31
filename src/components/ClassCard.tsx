import { formatTime } from '@/lib/utils/dates';
import { Clock, Users, Loader2 } from 'lucide-react';

interface ClassCardProps {
  cls: {
    _row_id: number;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    capacity: number;
    instructor_name?: string;
  };
  rsvpCount: number;
  userRsvp: { _row_id: number; status: string } | null;
  onRsvp: () => void;
  onCancel: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function ClassCard({ cls, rsvpCount, userRsvp, onRsvp, onCancel, loading, disabled }: ClassCardProps) {
  const spotsLeft = cls.capacity - rsvpCount;
  const isFull = spotsLeft <= 0;
  const isConfirmed = userRsvp?.status === 'confirmed';
  const isWaitlisted = userRsvp?.status === 'waitlisted';

  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:border-ember/30 transition-all group animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-chalk group-hover:text-ember transition-colors truncate">
            {cls.name}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(cls.start_time)} – {formatTime(cls.end_time)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {rsvpCount}/{cls.capacity}
            </span>
          </div>
          {cls.instructor_name && (
            <p className="text-xs text-chalk-dim mt-1">Coach {cls.instructor_name.split(' ')[0]}</p>
          )}
        </div>

        <div className="flex-shrink-0">
          {isConfirmed ? (
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-ember/10 text-ember border border-ember/20 hover:bg-ember/20 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : '✓ Going'}
            </button>
          ) : isWaitlisted ? (
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Waitlisted'}
            </button>
          ) : (
            <button
              onClick={onRsvp}
              disabled={loading || disabled || isFull}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-ember text-white hover:bg-ember-glow transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : isFull ? 'Full' : 'RSVP'}
            </button>
          )}
        </div>
      </div>

      {spotsLeft > 0 && spotsLeft <= 3 && !userRsvp && (
        <p className="text-[11px] text-ember mt-2 font-medium">{spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left</p>
      )}
    </div>
  );
}
