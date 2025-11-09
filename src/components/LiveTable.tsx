import React from 'react';

export type TableRow = {
  Platz?: number;
  Team_Kurzname?: string;
  Spiele?: number;
  SpieleGewonnen?: number;
  SpieleUnentschieden?: number;
  SpieleVerloren?: number;
  PlusTore?: number;
  MinusTore?: number;
  DiffTore?: number;
  PlusPunkte?: number;
  MinusPunkte?: number;
  points?: number; // fallback
};

export default function LiveTable({ table }: { table?: { rows?: TableRow[] } | null }) {
  const rows = table?.rows ?? [];
  if (!rows.length) {
    return <div role="status" aria-live="polite" className="muted">Keine Tabellendaten.</div>;
  }
  return (
    <div>
      <div className="section-h">
        <h2>Live-Tabelle</h2>
        <span className="chip-neutral"> automatisch aus nuLiga</span>
      </div>

      <table className="table" aria-label="Ligatabelle">
        <thead>
          <tr>
            <th className="num">Rang</th>
            <th> Mannschaft </th>
            <th className="num">Sp.</th>
            <th className="num">S</th>
            <th className="num">U</th>
            <th className="num">N</th>
            <th className="num">Tore</th>
            <th className="num">+ / −</th>
            <th className="num">Punkte</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const tore = `${r.PlusTore ?? 0}:${r.MinusTore ?? 0}`;
            const diff = r.DiffTore ?? ((r.PlusTore ?? 0) - (r.MinusTore ?? 0));
            const punkte = r.PlusPunkte != null && r.MinusPunkte != null
              ? `${r.PlusPunkte}:${r.MinusPunkte}` : (r.points ?? 0);

            const chipClass = diff > 0 ? 'chip-pos' : diff < 0 ? 'chip-neg' : 'chip-neutral';
            return (
              <tr key={i}>
                <td className="num">{r.Platz ?? i+1}</td>
                <td className="team">{r.Team_Kurzname ?? '—'}</td>
                <td className="num">{r.Spiele ?? 0}</td>
                <td className="num">{r.SpieleGewonnen ?? 0}</td>
                <td className="num">{r.SpieleUnentschieden ?? 0}</td>
                <td className="num">{r.SpieleVerloren ?? 0}</td>
                <td className="num">{tore}</td>
                <td className="num"><span className={chipClass}>{diff > 0 ? `+${diff}` : `${diff}`}</span></td>
                <td className="num">{punkte}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
