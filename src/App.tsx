import React, { useEffect, useMemo, useState } from 'react'
import { useNuTab } from './hooks/useNuTab'
import LiveTable from './components/LiveTable'
import LivePlan from './components/LivePlan'
import TeamPanel from './components/TeamPanel'
import SelfCheck from './components/SelfCheck'
import Countdown from './components/Countdown'
import { toDateFromPlan } from './utils/ui'
import './styles.css'

export default function App() {
  const [cfg, setCfg] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}config.json`
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(`config ${r.status}`); return r.json() })
      .then(setCfg)
      .catch(e => setErr(String(e)))
  }, [])

  const { table, plan, stamp, mirrorsOk } = useNuTab(cfg)

  const next = useMemo(() => {
    const rows = plan?.rows || plan?.matches || []
    return rows.find((r:any)=>!(r.score||'').includes(':')) || null
  }, [plan])

  const nextKickoff = useMemo(() => {
    if(!next) return null
    const date = next.SpieldatumTag || next.date || ''
    const time = next.SpieldatumUhrzeit || next.time || (next.Spieldatum ? String(next.Spieldatum).slice(11,16) : '')
    const iso = /^\d{4}\.\d{2}\.\d{2}$/.test(date) ? date.replace(/\./g,'-') : date
    const d = new Date(time ? `${iso}T${time}:00` : iso)
    return isNaN(+d) ? null : d
  }, [next])

  return (
    <div className="wrap">
      <header className="nav">
        <div className="brand"><div className="logo" /><div>ASV Süchteln · mE1 · Live</div></div>
        <div className="controls">
          {cfg?.groupUrl && <a className="btn" href={cfg.groupUrl} target="_blank" rel="noreferrer">nuLiga</a>}
          <button className="btn" onClick={()=>location.reload()}>Neu laden</button>
        </div>
      </header>

      <main className="container">
        {err && <div className="card pad">⚠️ Konfiguration nicht gefunden: {err}</div>}

        <section className="grid hero">
          <div className="card pad">
            <h1>„Vollgas. Fair. <span className="accent">ASV.</span>“</h1>
            <SelfCheck stamp={stamp} mirrorsOk={mirrorsOk} />
            {next && (
              <div style={{margin:'8px 0 12px'}}>
                <div className="meta">Nächstes Spiel in <Countdown until={nextKickoff} /></div>
                <div className="meta" style={{marginTop:4}}>
                  {next.HeimTeam_Name_kurz || next.home} – {next.GastTeam_Name_kurz || next.away}
                </div>
              </div>
            )}
            <LivePlan plan={plan} nextOnly cfg={cfg} />
          </div>
          <div className="card pad">
            <TeamPanel />
          </div>
        </section>

        <section className="card pad">
          <h3>🏆 Live-Tabelle</h3>
          <LiveTable table={table} club={cfg?.club}/>
        </section>

        <section className="card pad">
          <h3>📅 Spielplan</h3>
          <LivePlan plan={plan} cfg={cfg}/>
        </section>
      </main>

      <footer className="footer">© 2025 ASV Einigkeit Süchteln – mE1</footer>
    </div>
  )
}
