import React, { useMemo } from 'react';

type PlanRow = {
  date?: string;        // YYYY-MM-DD oder YYYY.MM.DD
  time?: string;        // HH:MM
  hallCode?: string;
  hallName?: string;
  matchNo?: string;
  home?: string;
  away?: string;
  score?: string;
  reportUrl?: string;
  courtUrl?: string;
};

function toIso(date?: string, time?: string) {
  // akzeptiert 2025-11-16 oder 2025.11.16
  if (!date) return null;
  const d = date.replace(/\./g, '-');
  const t = time ?? '00:00';
  const iso = `${d}T${t}:00`;
  return new Date(iso);
}

function pad(n: number) { return n < 10 ? `0${n}` : `${n}`; }

function buildIcs(match: PlanRow) {
  const dt = toIso(match.date, match.time);
  const start = dt ? `${dt.getUTCFullYear()}${pad(dt.getUTCMonth()+1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z` : '';
  const endTs = dt ? new Date(dt.getTime() + 60*60*1000) : null; // 60 min
  const end = endTs ? `${endTs.getUTCFullYear()}${pad(endTs.getUTCMonth()+1)}${pad(endTs.getUTCDate())}T${pad(endTs.getUTCHours())}${pad(endTs.getUTCMinutes())}00Z` : '';

  const summary = `${match.home ?? ''} – ${match.away ?? ''}`.trim();
  const location = match.hallName ? `${match.hallName}${match.hallCode ? ' ('+match.hallCode+')' : ''}` : '';
  const descParts = [
    match.reportUrl ? `Spielbericht: ${match.reportUrl}` : '',
    match.courtUrl ? `Halleninfo: ${match.courtUrl}` : '',
    match.matchNo ? `Nr.: ${match.matchNo}` : ''
  ].filter(Boolean);

  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ASV mE1//Schedule//DE
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${(match.matchNo ?? '')}-${Date.now()}@asv-me1
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${summary}
LOCATION:${location}
DESCRIPTION:${descParts.join('\\n')}
END:VEVENT
END:VCALENDAR`;

  return new Blob([ics], { type: 'text/calendar;charset=utf-8' });
}

function mapHref(hallName?: string) {
  if (!hallName) return undefined;
  // Universeller Fallback: Google Maps query
  const q = encodeURIComponent(hallName);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export default function NextMatchCard({ plan }: { plan: { rows?: PlanRow[] } }) {
  const next = useMemo(() => {
    const rows = plan?.rows ?? [];
    const future = rows
      .map(r => ({ r, dt: toIso(r.date, r.time) }))
      .filter(x => x.dt && x.dt.getTime() - Date.now() > -90*60*1000) // noch nicht >90m vorbei
      .sort((a,b) => (a.dt!.getTime() - b.dt!.getTime()));
    return future[0]?.r ?? null;
  }, [plan]);

  if (!next) return null;

  const handleIcs = () => {
    const blob = buildIcs(next);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'asv-me1-naechstes-spiel.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="card next-match">
      <header className="card-h">
        <h2>Nächstes Spiel</h2>
        {next.matchNo && <span className="tag">#{next.matchNo}</span>}
      </header>

      <div className="grid g2">
        <div>
          <div className="k">Datum</div>
          <div className="v">{(next.date ?? '').replace(/\./g,'-')}</div>
        </div>
        <div>
          <div className="k">Zeit</div>
          <div className="v">{next.time ?? '—'}</div>
        </div>
        <div>
          <div className="k">Halle</div>
          <div className="v">{next.hallName ?? next.hallCode ?? '—'}</div>
        </div>
        <div>
          <div className="k">Begegnung</div>
          <div className="v">{next.home} – {next.away}</div>
        </div>
      </div>

      <div className="actions">
        <button className="btn primary" onClick={handleIcs} aria-label="Zum Kalender hinzufügen">Kalender</button>
        {mapHref(next.hallName) && (
          <a className="btn" href={mapHref(next.hallName)} target="_blank" rel="noreferrer" aria-label="Halle in Karten öffnen">Karte</a>
        )}
        {next.reportUrl && (
          <a className="btn" href={next.reportUrl} target="_blank" rel="noreferrer" aria-label="nuLiga Spielbericht">nuLiga</a>
        )}
      </div>
    </section>
  );
}