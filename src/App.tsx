import React, { useMemo } from 'react'
import { useNuTab } from './hooks/useNuTab'
import NextMatchCard from './components/NextMatchCard'
import LiveTable from './components/LiveTable'
import LivePlan from './components/LivePlan'
import TeamPanel from './components/TeamPanel'

export default function App() {
  const { table, plan, meta, status, reload } = useNuTab();

  const staleInfo = useMemo(() => {
    if (!meta?.fetchedAt) return null;
    const ageMin = Math.round((Date.now() - new Date(meta.fetchedAt).getTime())/60000);
    return ageMin >= 45 ? `Cache/Fallback · ${ageMin} min alt` : null;
  }, [meta]);

  return (
    <div className="page">
      <header className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1>„Vollgas. Fair. <span style={{color:'var(--asv-red)'}}>ASV.</span>“</h1>
          <div style={{opacity:.8,fontSize:'.9rem'}}>
            Self-Check: {status === 'ok' ? 'nuLiga ok' : 'nuLiga down'} {staleInfo ? `– ${staleInfo}` : ''}
          </div>
        </div>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <button className="btn" onClick={reload}>Neu laden</button>

          {/* A11y: Label + id/name */}
          <div>
            <label htmlFor="density" style={{display:'block',fontSize:'.75rem',opacity:.7}}>Darstellung</label>
            <select id="density" name="density" className="btn" aria-label="Darstellung wählen" title="Darstellung wählen">
              <option value="full">Normal</option>
              <option value="mini">Mini</option>
            </select>
          </div>
        </div>
      </header>

      {/* WOW: Nächstes Spiel mit ICS & Maps */}
      <NextMatchCard plan={plan ?? { rows: [] }} />

      <section className="card">
        <h2>Team & Trainer</h2>
        <TeamPanel />
      </section>

      <section className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>Live-Tabelle</h2>
          {/* kleine Dichte-Umschaltung optional */}
        </div>
        <LiveTable table={table}/>
      </section>

      <section className="card">
        <h2>Spielplan</h2>
        <LivePlan plan={plan}/>
      </section>
    </div>
  )
}
