import React, { useMemo } from 'react';
import Header from './components/Header';
import LiveTable from './components/LiveTable';
import LivePlan from './components/LivePlan';
import { useNuTab } from './hooks/useNuTab';

import './styles/agency.css';
import './styles/table.css'; // falls schon vorhanden – harmless

export default function App() {
  const { table, plan, refresh, nextMatch, selfCheck } = useNuTab();

  const nextLine = useMemo(() => {
    if (!nextMatch) return '—';
    const date = nextMatch.SpieldatumTag?.replace(/\./g, '-') ?? '';
    const vs = `${nextMatch.HeimTeam_Name_kurz ?? ''} – ${nextMatch.GastTeam_Name_kurz ?? ''}`.replace(/\s–\s$/, '');
    return `${date} · ${nextMatch.SpieldatumUhrzeit ?? ''} · ${vs}`;
  }, [nextMatch]);

  return (
    <>
      <Header onReload={refresh} />

      <main className="container grid grid-2">
        {/* Left: Next match + Tabelle */}
        <section className="card">
          <div className="section-title">
            <h2>Nächstes Spiel</h2>
            <span className="section-sub">
              {selfCheck} · <span className="muted">{nextLine}</span>
            </span>
          </div>

          <table className="table" aria-label="Next Match">
            <thead>
              <tr>
                <th>Datum</th><th>Zeit</th><th>Halle</th><th className="num">Nr.</th>
                <th>Begegnung</th><th className="num">Ergebnis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{nextMatch?.SpieldatumTag ?? '—'}</td>
                <td>{nextMatch?.SpieldatumUhrzeit ?? '—'}</td>
                <td>{nextMatch?.Hallenname ?? nextMatch?.Halle_Kuerzel ?? '—'}</td>
                <td className="num">{nextMatch?.Spielnummer ?? '—'}</td>
                <td className="team">
                  {nextMatch ? `${nextMatch.HeimTeam_Name_kurz ?? '—'} – ${nextMatch.GastTeam_Name_kurz ?? '—'}` : '—'}
                </td>
                <td className="num">
                  {(nextMatch?.Tore_Heim != null && nextMatch?.Tore_Gast != null) ? `${nextMatch!.Tore_Heim}:${nextMatch!.Tore_Gast}` : '—'}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="hr"></div>
          <LiveTable table={table} />
        </section>

        {/* Right: Team & Trainer + Plan */}
        <aside className="card">
          <div className="section-title">
            <h2>Team & Trainer</h2>
            <span className="section-sub">Positions-Chips & Jahrgänge</span>
          </div>

          <div className="row">
            <div className="card" style="padding:12px 14px; flex:1">
              👨‍🏫 <strong>Trainer</strong><br/>Max M.<br/><span className="muted">0151 1234567 · trainer@asv.example</span>
            </div>
            <div className="card" style="padding:12px 14px; flex:1">
              👩‍🏫 <strong>Co-Trainerin</strong><br/>Erika B.<br/><span className="muted">—</span>
            </div>
          </div>

          <div className="hr"></div>
          <LivePlan plan={plan} />
        </aside>
      </main>
    </>
  );
}
