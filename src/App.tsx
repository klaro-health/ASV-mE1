import React, { useEffect, useMemo, useState } from 'react'
import { useNuTab } from './hooks/useNuTab'
import LiveTable from './components/LiveTable'
import LivePlan from './components/LivePlan'
import TeamPanel from './components/TeamPanel'
import SelfCheck from './components/SelfCheck'

export default function App() {
  const [cfg, setCfg] = useState<any>(null)
  useEffect(()=>{ fetch('/ASV-mE1/config.json').then(r=>r.json()).then(setCfg) },[])
  const { table, plan, stamp, mirrorsOk } = useNuTab(cfg)

  const next = useMemo(()=> {
    if (!plan?.rows?.length) return null
    const open = plan.rows.find((r:any)=>!(r.score||'').includes(':'))
    return open || null
  }, [plan])

  return (
    <div className="wrap">
      <header className="nav">
        <div className="brand"><div className="logo" /><div>ASV Süchteln · mE1 · Live</div></div>
        <div className="controls">
          <a className="btn" href={cfg?.groupUrl} target="_blank" rel="noreferrer">nuLiga</a>
          <button className="btn" onClick={()=>location.reload()}>Neu laden</button>
        </div>
      </header>

      <main className="container">
        <section className="grid hero">
          <div className="card pad">
            <h1>„Vollgas. Fair. <span className="accent">ASV.</span>“</h1>
            <SelfCheck stamp={stamp} mirrorsOk={mirrorsOk} />
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

      <footer className="footer">© 2025 ASV Einigkeit Süchteln – mE1 · PWA · iPhone-ready</footer>
    </div>
  )
}
