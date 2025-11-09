import React, { useMemo } from 'react';
import Header from './components/Header';
import LiveTable from './components/LiveTable';
import LivePlan from './components/LivePlan';
import LiveTickerBadge from './components/LiveTickerBadge';
import NewsTeaser from './components/NewsTeaser';
import Roster from './components/Roster';
import { useNuTab } from './hooks/useNuTab';

import './styles/agency.css';

export default function App() {
  const { table, plan, refresh, nextMatch, selfCheck } = useNuTab();

  const nextLine = useMemo(() => {
    if (!nextMatch) return '—';
    const date = nextMatch.SpieldatumTag ?? '';
    const vs = `${nextMatch.HeimTeam_Name_kurz ?? ''} – ${nextMatch.GastTeam_Name_kurz ?? ''}`.trim();
    return `${date} · ${nextMatch.SpieldatumUhrzeit ?? ''} · ${vs}`;
  }, [nextMatch]);

  return (
    <>
      <Header onReload={refresh} />

      <main className="container grid grid-2">
        <section className="card">
          <div className="section-title">
            <h2>Nächstes Spiel</h2>
            <span className="section-sub">{selfCheck} · <span className="muted">{nextLine}</span></span>
          </div>

          <div className="row" style={{justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
            <LiveTickerBadge
              dateISO={nextMatch?.SpieldatumTag}
              time={nextMatch?.SpieldatumUhrzeit}
              meetingId={nextMatch?.Spielnummer}
            />
            <div>
              <label htmlFor="mode" className="kicker" style={{display:'block', marginBottom:6}}>Ansicht</label>
              <select id="mode" name="mode" className="btn" aria-label="Ansicht wählen">
                <option value="full">Normal</option>
                <option value="mini">Mini</option>
              </select>
            </div>
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
                  {(nextMatch?.Tore_Heim != null && nextMatch?.Tore_Gast != null) ? `${nextMatch.Tore_Heim}:${nextMatch.Tore_Gast}` : '—'}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="hr"></div>
          <LiveTable table={table} />
        </section>

        <aside>
          <Roster />
          <NewsTeaser />
          <div className="card" style={{marginTop:12}}>
            <div className="section-title"><h2>Spielplan</h2><span className="section-sub">Aktuell</span></div>
            <LivePlan plan={plan} />
          </div>
        </aside>
      </main>
    </>
  );
}
