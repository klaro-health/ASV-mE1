import React, { useEffect, useState } from 'react'

export default function TeamPanel(){
  const [p,setP]=useState<any>(null)
  useEffect(()=>{ fetch('/ASV-mE1/profiles.json').then(r=>r.json()).then(setP) },[])
  if(!p) return <div className="skel" style={{height:18}}/>
  return (
    <>
      <h3>👥 Team & Trainer</h3>
      <div className="teamgrid">
        {(p.coaches||[]).map((c:any,i:number)=>(
          <div className="player" key={'c'+i}>
            <div className="num">🧑‍🏫 {c.role}</div>
            <div style={{fontWeight:900}}>{c.name}</div>
          </div>
        ))}
      </div>
      <div className="teamgrid" style={{marginTop:'.8rem'}}>
        {(p.players||[]).map((x:any,i:number)=>(
          <div className="player" key={i}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div className="num">#{x.num||'–'}</div>
              <div style={{fontWeight:900}}>{x.name}</div>
            </div>
            <div className="meta" style={{marginTop:'.35rem'}}>{x.pos||'—'} · {x.hand||'—'} · Jg. 2015/16</div>
          </div>
        ))}
      </div>
    </>
  )
}
