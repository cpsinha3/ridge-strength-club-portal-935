import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import db from '@/lib/shared/kliv-database.js';
import { formatDate } from '@/lib/utils/dates';
import StatCard from '@/components/StatCard';
import StreakBadge from '@/components/StreakBadge';
import TierBadge from '@/components/TierBadge';
import EmptyState from '@/components/EmptyState';
import { PageSkeleton } from '@/components/LoadingSkeleton';
import { Flame, Ticket, CalendarCheck, History, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyActivity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [membership, setMembership] = useState<any>(null);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [memArr, cis, cls] = await Promise.all([
          db.query('memberships', { member_id: `eq.${user.userUuid}` }),
          db.query('check_ins', {
            member_id: `eq.${user.userUuid}`,
            order: '_created_at.desc',
            limit: '50',
          }),
          db.query('classes', { select: '_row_id,name' }),
        ]);
        setMembership(memArr[0] || null);
        setCheckIns(cis);
        setClasses(cls);
      } catch (err) {
        console.log('Failed to load activity:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // Calculate streak (consecutive weeks with at least 1 check-in)
  const calculateStreak = () => {
    if (checkIns.length === 0) return 0;
    const now = new Date();
    const getWeekNumber = (d: Date) => {
      const start = new Date(d.getFullYear(), 0, 1);
      const diff = d.getTime() - start.getTime();
      return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
    };

    const weekSet = new Set(
      checkIns.map(ci => {
        const d = new Date(ci._created_at * 1000);
        return `${d.getFullYear()}-${getWeekNumber(d)}`;
      })
    );

    let streak = 0;
    let checkDate = new Date(now);
    for (let i = 0; i < 52; i++) {
      const key = `${checkDate.getFullYear()}-${getWeekNumber(checkDate)}`;
      if (weekSet.has(key)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 7);
      } else {
        break;
      }
    }
    return streak;
  };

  const classMap = Object.fromEntries(classes.map((c: any) => [c._row_id, c.name]));
  const streak = calculateStreak();
  const thisMonthCount = checkIns.filter(ci => {
    const d = new Date(ci._created_at * 1000);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const pagedCheckIns = checkIns.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(checkIns.length / PAGE_SIZE);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-chalk">My Activity</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
        {membership && <TierBadge tier={membership.tier} />}
      </div>

      {streak > 0 && <StreakBadge weeks={streak} />}

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
        <StatCard
          icon={CalendarCheck}
          label="This Month"
          value={thisMonthCount}
          sub="check-ins"
        />
        <StatCard
          icon={Flame}
          label="Streak"
          value={`${streak}w`}
          sub="consecutive weeks"
        />
        {membership?.tier === '8pack' && (
          <StatCard
            icon={Ticket}
            label="Credits Left"
            value={membership.credits_remaining}
            sub="of 8 this cycle"
          />
        )}
        {membership?.tier === 'unlimited' && (
          <StatCard
            icon={Ticket}
            label="Plan"
            value="∞"
            sub="Unlimited access"
          />
        )}
      </div>

      {/* Check-in history */}
      <div>
        <h2 className="text-sm font-semibold text-chalk mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-ember" /> Check-in History
        </h2>
        {checkIns.length === 0 ? (
          <EmptyState
            icon={Dumbbell}
            title="No check-ins yet"
            description="Get started by exploring the customer management system."
            action={{ label: 'Go to Customers', onClick: () => navigate('/customers') }}
          />
        ) : (
          <>
            <div className="space-y-2">
              {pagedCheckIns.map((ci: any) => (
                <div
                  key={ci._row_id}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md bg-card border border-border animate-fade-in"
                >
                  <div>
                    <p className="text-sm font-medium text-chalk">
                      {ci.class_id ? classMap[ci.class_id] || 'Class' : 'Open Gym'}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(ci._created_at)}</p>
                  </div>
                  <TierBadge tier={ci.tier} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 rounded text-xs font-medium bg-carbon-lighter text-chalk-dim hover:text-chalk disabled:opacity-30 transition-colors"
                >
                  Prev
                </button>
                <span className="text-xs text-muted-foreground">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 rounded text-xs font-medium bg-carbon-lighter text-chalk-dim hover:text-chalk disabled:opacity-30 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
