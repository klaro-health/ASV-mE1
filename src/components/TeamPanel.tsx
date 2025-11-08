import React, { useEffect, useMemo, useState } from 'react'
import { abbrName } from '../utils/ui'

export default function TeamPanel(){
  const [p,setP]=useState<any>(null)
  const [filter,setFilter]=useState<string>('all')

  useEffect(()=>{ 
    const url = `${import.meta.env.BASE_URL}profiles.json`
    fetch(url).then(r=>r.json()).then(setP).catch(()=>setP({coaches:[],players:[]}))
  },[])

  const players = useMemo(()=> {
    const list = (p?.players||[]).slice().sort((a:any,b:any)=> (a.num||999)-(b.num||999))
    if (filter==='all') return list
    return list.filter((x:any)=> (x.pos||'').toLowerCase().includes(filter))
  },[p,filter])

  if(!p) return <div className="skel" style={{height:18}}/>

  return (
    <>
      <h3>👥 Team & Trainer</h3>
      <div className="teamgrid">
        {(p.coaches||[]).map((c:any,i:number)=>(
          <div className="player" key={'c'+i}>
            <div className="num">🧑‍🏫 {c.role}</div>
            <div style={{fontWeight:900}}>{abbrName(c.name)}</div>
            {c.phone && <div className="meta">{c.phone}</div>}
            {c.mail && <div className="meta"><a href={`mailto:${c.mail}`}>{c.mail}</a></div>}
          </div>
        ))}
      </div>

      <div className="toolbar" style={{marginTop:8}}>
        <select className="btn" value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">Alle Positionen</option>
          <option value="tor">Tor</option>
          <option value="feld">Feld</option>
        </select>
      </div>

      <div className="teamgrid" style={{marginTop:'.8rem'}}>
        {(p.players||[]).map((x:any,i:number)=>(
          <div className="player" key={i}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div className="num">#{x.num||'–'}</div>
              <div style={{fontWeight:900}}>{abbrName(x.name)}</div>
            </div>
            <div className="meta" style={{marginTop:'.35rem'}}>
              {(x.pos||'—')} · {(x.hand||'—')} · {(x.year||'2015/16')}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

