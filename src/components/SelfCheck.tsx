import React from 'react'
export default function SelfCheck({ stamp, mirrorsOk }:{stamp:string, mirrorsOk:boolean|null}){
  const txt = mirrorsOk===null ? 'Warte auf nuTab …'
           : mirrorsOk ? 'nuTab OK'
           : 'nuTab down – Cache/Fallback'
  return <div className="meta">Self-Check: {txt} · {stamp}</div>
}
