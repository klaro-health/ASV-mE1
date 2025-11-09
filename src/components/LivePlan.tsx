import React, { useMemo } from 'react';

export type PlanRow = {
  SpieldatumTag?: string;      // YYYY.MM.DD oder YYYY-MM-DD
  SpieldatumUhrzeit?: string;  // HH:MM
  Halle_Kuerzel?: string;
  Hallenname?: string;
  Spielnummer?: string;
  HeimTeam_Name_kurz?: string;
  GastTeam_Name_kurz?: string;
  Tore_Heim?: number;
  Tore_Gast?: number;
  ReportURL?: string;
};

function norm(d?: string) { return (d ?? '').replace(/\./g, '-'); }

export default function LivePlan({ plan }: { plan?: { rows?: PlanRow[] } | null }) {
  const groups = useMemo(() => {
    const rows = (plan?.rows ?? []).slice().sort((a,b) =>
      new Date(`${norm(a.SpieldatumTag)}T${a.SpieldatumUhrzeit??'00:00'}`).getTime()
      - new Date(`${norm(b.SpieldatumTag)}T${b.SpieldatumUhrzeit??'00:00'}`).getTime()
    );
    const byDay = new Map<string, PlanRow[]>();
    for (const r of rows) {
      const key = norm(r.SpieldatumTag) || 'TBD';
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key)!.push(r);
    }
    return [...byDay.entries()];
  }, [plan]);

  if (!groups.length) return <div className="muted">Kein Spielplan verfügbar.</div>;

  return (
    <div>
      <div className="section-h">
        <h2>Spielplan</h2>
        <span className="chip-neutral"> gruppiert nach Datum </span>
      </div>

      {groups.map(([day, rows]) => (
        <div key={day}>
          <div className="day-h">{day}</div>
          <table className="table" aria-label={`Spieltag ${day}`}>
            <thead>
              <tr>
                <th style={{width:80}}>Zeit</th>
                <th> Halle </th>
                <th style={{width:80}}>Nr.</th>
                <th>Heim</th>
                <th>Gast</th>
                <th className="num">Ergebnis</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.SpieldatumUhrzeit ?? '—'}</td>
                  <td>{r.Hallenname ?? r.Halle_Kuerzel ?? '—'}</td>
                  <td className="num">{r.Spielnummer ?? '—'}</td>
                  <td className="team">{r.HeimTeam_Name_kurz ?? '—'}</td>
                  <td className="team">{r.GastTeam_Name_kurz ?? '—'}</td>
                  <td className="num">
                    {r.Tore_Heim != null && r.Tore_Gast != null ? `${r.Tore_Heim}:${r.Tore_Gast}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
