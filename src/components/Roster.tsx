import React, { useEffect, useState } from 'react';

type Profiles = { trainers:{name:string;role:string}[]; players:string[] };

export default function Roster(){
  const [data,setData] = useState<Profiles>({trainers:[],players:[]});
  useEffect(()=>{
    fetch(`${import.meta.env.BASE_URL}profiles.json?${Date.now()}`)
      .then(r=>r.json()).then(setData).catch(()=>{});
  },[]);

  return (
    <div className="card">
      <div className="section-title">
        <h2>Team & Trainer</h2>
        <span className="section-sub">{data.players.length} Spieler · {data.trainers.length} Trainer</span>
      </div>
      <div className="row">
        {data.trainers.map(t=>(
          <div key={t.name} className="card" style={{padding:'10px 12px', flex:'1 1 180px'}}>
            <strong>{t.name}</strong><br/>
            <span className="muted">{t.role}</span>
          </div>
        ))}
      </div>
      <div className="hr" />
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:10}}>
        {data.players.map(p=>(
          <div key={p} className="card" style={{padding:'8px 10px'}}>
            <span className="team">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
