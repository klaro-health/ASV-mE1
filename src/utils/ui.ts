// src/utils/ui.ts
export const containsClub = (team: string, club?: string) =>
  !!club && String(team||'').toLowerCase().includes(club.toLowerCase());

export const toDdMmYyyy = (x: string) => {
  if (!x) return '—';
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(x)) { const [y,m,d]=x.split('.'); return `${d}.${m}.${y}`; }
  // nuLiga liefert teils "2025.11.16" oder locales → fallback:
  const d = new Date(x);
  return isNaN(+d) ? x : d.toLocaleDateString('de-DE');
};

export const toHm = (x?: string) => (x?.slice(0,5) || x || '—');

export const toDateFromPlan = (dateStr: string, timeStr?: string) => {
  // akzeptiert "2025.11.16" + "12:00" oder ISO
  const normalized = /^\d{4}\.\d{2}\.\d{2}$/.test(dateStr)
    ? dateStr.replace(/\./g,'-')  // "2025-11-16"
    : dateStr;
  const iso = timeStr ? `${normalized}T${timeStr}:00` : normalized;
  const d = new Date(iso);
  return isNaN(+d) ? null : d;
};

export const diffHuman = (target: Date, now = new Date()) => {
  const ms = +target - +now;
  if (ms <= 0) return 'läuft / vorbei';
  const s = Math.floor(ms/1000);
  const d = Math.floor(s/86400);
  const h = Math.floor((s%86400)/3600);
  const m = Math.floor((s%3600)/60);
  return (d?`${d} T `:'') + (h?`${h} h `:'') + `${m} m`;
};
// src/utils/ui.ts (am Ende ergänzen)
export const abbrName = (full: string) => {
  if (!full) return '—';
  const parts = full.trim().split(/\s+/);
  if (parts.length < 2) return full;          // z.B. Einzelname
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() || '';
  return `${first} ${lastInitial}.`;           // "Yuna S."
};
