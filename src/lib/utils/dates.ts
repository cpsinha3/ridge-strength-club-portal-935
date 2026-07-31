const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getDayName(dow: number) { return DAY_NAMES[dow]; }
export function getDayShort(dow: number) { return DAY_SHORT[dow]; }

export function getWeekDates(): { date: string; dow: number; label: string; isToday: boolean }[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dow = d.getDay();
    return {
      date: dateStr,
      dow,
      label: `${DAY_SHORT[dow]} ${d.getMonth() + 1}/${d.getDate()}`,
      isToday: dateStr === today.toISOString().split('T')[0],
    };
  });
}

export function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

export function todayDow() {
  return new Date().getDay();
}
