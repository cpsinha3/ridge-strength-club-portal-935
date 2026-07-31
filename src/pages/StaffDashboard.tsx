import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import db from '@/lib/shared/kliv-database.js';
import { getTodayStr, formatTime, todayDow } from '@/lib/utils/dates';
import TierBadge from '@/components/TierBadge';
import StatCard from '@/components/StatCard';
import EmptyState from '@/components/EmptyState';
import { PageSkeleton } from '@/components/LoadingSkeleton';
import { Users, CalendarCheck, UserPlus, Search, CheckCircle2, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';

export default function StaffDashboard() {
  const { isStaff } = useAuth();
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [todayRsvps, setTodayRsvps] = useState<any[]>([]);
  const [todayCheckIns, setTodayCheckIns] = useState<any[]>([]);
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  const today = getTodayStr();

  const fetchData = useCallback(async () => {
    try {
      const [cls, rsvps, cis, mems] = await Promise.all([
        db.query('classes', {
          day_of_week: `eq.${todayDow()}`,
          order: 'start_time.asc',
        }),
        db.query('rsvps', {
          class_date: `eq.${today}`,
          status: 'eq.confirmed',
        }),
        db.query('check_ins', {
          order: '_created_at.desc',
          limit: '50',
        }),
        db.query('memberships', { order: 'member_name.asc' }),
      ]);

      // Get instructors
      const instructorIds = [...new Set(cls.map((c: any) => c.instructor_id).filter(Boolean))];
      let instructors: any[] = [];
      if (instructorIds.length > 0) {
        instructors = await db.query('instructors', {
          _row_id: `in.(${instructorIds.join(',')})`,
        });
      }
      const instructorMap = Object.fromEntries(instructors.map((i: any) => [i._row_id, i.name]));

      setTodayClasses(cls.map((c: any) => ({ ...c, instructor_name: instructorMap[c.instructor_id] || '' })));
      setTodayRsvps(rsvps);
      setTodayCheckIns(cis.filter((ci: any) => {
        const d = new Date(ci._created_at * 1000).toISOString().split('T')[0];
        return d === today;
      }));
      setMemberships(mems);
    } catch (err) {
      console.log('Staff data fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCheckIn = async (memberId: string, classId?: number) => {
    const mem = memberships.find(m => m.member_id === memberId);
    try {
      await db.insert('check_ins', {
        member_id: memberId,
        class_id: classId || null,
        tier: mem?.tier || 'dropin',
      });
      toast.success('Checked in!');
      fetchData();
    } catch (err) {
      console.log('Check-in failed:', err);
      toast.error('Check-in failed');
    }
  };

  const filteredMembers = memberships.filter(m => {
    const matchSearch = !search || (m.member_name || '').toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === 'all' || m.tier === tierFilter;
    return matchSearch && matchTier;
  });

  if (!isStaff) {
    return (
      <EmptyState icon={Users} title="Staff Only" description="You don't have staff access." />
    );
  }

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-chalk">Staff Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Today's RSVPs" value={todayRsvps.length} />
        <StatCard icon={CheckCircle2} label="Checked In" value={todayCheckIns.length} />
        <StatCard icon={Users} label="Active Members" value={memberships.filter(m => m.status === 'active').length} />
        <StatCard icon={Dumbbell} label="Today's Classes" value={todayClasses.length} />
      </div>

      {/* Today's classes with rosters */}
      <div>
        <h2 className="text-sm font-semibold text-chalk mb-3">Today's Floor</h2>
        {todayClasses.length === 0 ? (
          <p className="text-sm text-muted-foreground">No classes scheduled today.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {todayClasses.map(cls => {
              const classRsvps = todayRsvps.filter((r: any) => r.class_id === cls._row_id);
              const classCheckIns = todayCheckIns.filter((ci: any) => ci.class_id === cls._row_id);
              return (
                <div key={cls._row_id} className="rounded-lg border border-border bg-card p-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-chalk text-sm">{cls.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(cls.start_time)}
                    </span>
                  </div>
                  {cls.instructor_name && (
                    <p className="text-xs text-chalk-dim mb-2">Coach {cls.instructor_name.split(' ')[0]}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span>{classRsvps.length} RSVP'd</span>
                    <span>{classCheckIns.length} checked in</span>
                    <span>{cls.capacity - classRsvps.length} spots open</span>
                  </div>
                  {/* RSVP list with check-in buttons */}
                  {classRsvps.length > 0 && (
                    <div className="space-y-1">
                      {classRsvps.map((rsvp: any) => {
                        const mem = memberships.find(m => m.member_id === rsvp.member_id);
                        const isCheckedIn = classCheckIns.some((ci: any) => ci.member_id === rsvp.member_id);
                        return (
                          <div key={rsvp._row_id} className="flex items-center justify-between px-2 py-1.5 rounded bg-carbon-lighter">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-chalk">{mem?.member_name || 'Member'}</span>
                              {mem && <TierBadge tier={mem.tier} />}
                            </div>
                            {isCheckedIn ? (
                              <span className="text-[10px] text-emerald-400 font-medium">✓ In</span>
                            ) : (
                              <button
                                onClick={() => handleCheckIn(rsvp.member_id, cls._row_id)}
                                className="text-[10px] px-2 py-0.5 rounded bg-ember text-white font-medium hover:bg-ember-glow transition-colors"
                              >
                                Check In
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Member list */}
      <div>
        <h2 className="text-sm font-semibold text-chalk mb-3">Members</h2>
        <div className="flex gap-2 mb-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full h-9 pl-9 pr-3 rounded-md bg-carbon-lighter border border-border text-chalk text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ember/50"
            />
          </div>
          <select
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value)}
            className="h-9 px-3 rounded-md bg-carbon-lighter border border-border text-chalk text-sm focus:outline-none focus:ring-2 focus:ring-ember/50"
          >
            <option value="all">All Tiers</option>
            <option value="unlimited">Unlimited</option>
            <option value="8pack">8-Pack</option>
            <option value="dropin">Drop-in</option>
          </select>
        </div>

        <div className="space-y-1">
          {filteredMembers.map(m => (
            <div
              key={m._row_id}
              className="flex items-center justify-between px-3 py-2.5 rounded-md bg-card border border-border hover:border-ember/20 transition-colors animate-fade-in"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-carbon-lighter flex items-center justify-center">
                  <UserPlus className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-chalk">{m.member_name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{m.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TierBadge tier={m.tier} />
                {m.tier === '8pack' && (
                  <span className="text-xs text-muted-foreground">{m.credits_remaining} left</span>
                )}
              </div>
            </div>
          ))}
          {filteredMembers.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No members match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}
