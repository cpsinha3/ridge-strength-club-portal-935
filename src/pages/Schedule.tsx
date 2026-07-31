import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import db from '@/lib/shared/kliv-database.js';
import { getWeekDates, getTodayStr } from '@/lib/utils/dates';
import ClassCard from '@/components/ClassCard';
import { ScheduleSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function Schedule() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [classes, setClasses] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [allRsvps, setAllRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const weekDates = getWeekDates();
  const selectedDay = weekDates.find(d => d.date === selectedDate);
  const selectedDow = selectedDay?.dow ?? new Date().getDay();

  const fetchData = useCallback(async () => {
    try {
      const [cls, userRsvps, dateRsvps] = await Promise.all([
        db.query('classes', {
          select: '_row_id,name,description,start_time,end_time,capacity,day_of_week,instructor_id',
          day_of_week: `eq.${selectedDow}`,
          order: 'start_time.asc',
        }),
        db.query('rsvps', {
          member_id: `eq.${user?.userUuid}`,
          class_date: `eq.${selectedDate}`,
          status: 'neq.cancelled',
        }),
        db.query('rsvps', {
          class_date: `eq.${selectedDate}`,
          status: 'eq.confirmed',
        }),
      ]);

      // Fetch instructor names
      const instructorIds = [...new Set(cls.map((c: any) => c.instructor_id).filter(Boolean))];
      let instructors: any[] = [];
      if (instructorIds.length > 0) {
        instructors = await db.query('instructors', {
          _row_id: `in.(${instructorIds.join(',')})`,
        });
      }

      const instructorMap = Object.fromEntries(instructors.map((i: any) => [i._row_id, i.name]));
      const enriched = cls.map((c: any) => ({
        ...c,
        instructor_name: instructorMap[c.instructor_id] || '',
      }));

      setClasses(enriched);
      setRsvps(userRsvps);
      setAllRsvps(dateRsvps);
    } catch (err) {
      console.log('Failed to fetch schedule:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDow, selectedDate, user?.userUuid]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const handleRsvp = async (classId: number) => {
    setActionLoading(classId);
    try {
      await db.insert('rsvps', {
        class_id: classId,
        member_id: user?.userUuid,
        class_date: selectedDate,
        status: 'confirmed',
      });
      toast.success('RSVP confirmed!');
      await fetchData();
    } catch (err) {
      console.log('RSVP failed:', err);
      toast.error('Could not RSVP. Try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (classId: number) => {
    const userRsvp = rsvps.find((r: any) => r.class_id === classId);
    if (!userRsvp) return;
    setActionLoading(classId);
    try {
      await db.delete('rsvps', { _row_id: `eq.${userRsvp._row_id}` });
      toast('RSVP cancelled');
      await fetchData();
    } catch (err) {
      console.log('Cancel failed:', err);
      toast.error('Could not cancel. Try again.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-chalk">Class Schedule</h1>
        <p className="text-sm text-muted-foreground mt-1">This week at Ridge Strength Club</p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {weekDates.map(d => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`flex-shrink-0 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              d.date === selectedDate
                ? 'bg-ember text-white'
                : d.isToday
                  ? 'bg-ember/10 text-ember border border-ember/20'
                  : 'bg-carbon-lighter text-chalk-dim hover:text-chalk hover:bg-carbon-lighter/80'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Classes */}
      {loading ? (
        <ScheduleSkeleton />
      ) : classes.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No classes this day"
          description="Check another day or come in for open gym."
        />
      ) : (
        <div className="grid gap-3">
          {classes.map(cls => {
            const userRsvp = rsvps.find((r: any) => r.class_id === cls._row_id);
            const rsvpCount = allRsvps.filter((r: any) => r.class_id === cls._row_id).length;
            return (
              <ClassCard
                key={cls._row_id}
                cls={cls}
                rsvpCount={rsvpCount}
                userRsvp={userRsvp}
                onRsvp={() => handleRsvp(cls._row_id)}
                onCancel={() => handleCancel(cls._row_id)}
                loading={actionLoading === cls._row_id}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
