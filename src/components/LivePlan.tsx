import React, { useMemo } from 'react'

export default function LivePlan({ plan, nextOnly=false, cfg }:{plan:any, nextOnly?:boolean, cfg?:any}){
  const rows = useMemo(()=> (plan?.rows || plan?.matches || plan?.plan || []), [plan])
  if (!rows.length) return <div className="skel" style={{height:18}}/>

  const data = nextOnly ? rows.filter((r:any)=>!(r.score||'').includes(':')).slice(0,1) : rows

  return (
    <div className="table">
      <table>
        <thead><tr><th>Datum</th><th>Zeit</th><th>Halle</th><th>Nr.</th><th style={{textAlign:'left'}}>Begegnung</th><th>Ergebnis</th></tr></thead>
        <tbody>
          {data.map((r:any,i:number)=>{
            const date = r.SpieldatumTag || r.date || ''
            const time = r.SpieldatumUhrzeit || r.time || (r.Spieldatum ? String(r.Spieldatum).slice(11,16) : '')
            const hall = r.Halle_Name_kurz || r.hall || r.Halle_Kuerzel || ''
            const nr   = r.Spielnummer || r.no || ''
            const home = r.HeimTeam_Name_kurz || r.home || ''
            const away = r.GastTeam_Name_kurz || r.away || ''
            const res  = (r.Tore_Heim!=null && r.Tore_Gast!=null) ? `${r.Tore_Heim}:${r.Tore_Gast}` : (r.score || '')
            const maps = `https://maps.apple.com/?q=${encodeURIComponent(hall+' Viersen')}`
            return (
              <tr key={i}>
                <td>{toDdMmYyyy(date)}</td><td>{time}</td><td><a className="btn" href={maps} target="_blank" rel="noreferrer">{hall||'—'}</a></td>
                <td>{nr}</td><td style={{textAlign:'left'}}>{home} – {away}</td><td>{res}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function toDdMmYyyy(x:string){
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(x)){ const [y,m,d]=x.split('.'); return `${d}.${m}.${y}` }
  return x || '—'
}
