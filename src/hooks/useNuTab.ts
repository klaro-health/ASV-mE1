import { useEffect, useState } from 'react'

type NuTabType = 'table'|'plan'

const tryMirrors = async (cfg:any, type:NuTabType) => {
  if (!cfg) throw new Error('cfg missing')
  const encoded = encodeURIComponent(cfg.groupUrl)
  for (const base of (cfg.mirrors as string[])) {
    try {
      const url = `${base}?url=${encoded}&type=${type}`
      const r = await fetch(url, { cache: 'no-store', mode: 'cors' })
      if (!r.ok) throw new Error(String(r.status))
      const j = await r.json()
      if (j && Object.keys(j).length) return j
    } catch {}
  }
  throw new Error('mirrors down')
}

export function useNuTab(cfg:any){
  const [table,setTable]=useState<any>(null)
  const [plan,setPlan]=useState<any>(null)
  const [mirrorsOk,setOk]=useState<boolean|null>(null)
  const [stamp,setStamp]=useState<string>('lädt …')

  useEffect(()=>{ if(!cfg) return
    const cacheKey=cfg.cacheKey || 'asv_me1_cache'
    const readCache=(k:string)=>{ try{ const o=JSON.parse(localStorage.getItem(cacheKey)||'{}'); return o[k]||null }catch{return null} }
    const writeCache=(k:string,v:any)=>{ try{ const o=JSON.parse(localStorage.getItem(cacheKey)||'{}'); o[k]=v; localStorage.setItem(cacheKey,JSON.stringify(o)) }catch{} }

    const load = async ()=>{
      setStamp(new Date().toLocaleTimeString('de-DE'))
      try{
        const [t,p] = await Promise.all([tryMirrors(cfg,'table'), tryMirrors(cfg,'plan')])
        setTable(t); setPlan(p); setOk(true); writeCache('table',t); writeCache('plan',p)
      }catch{
        const t=readCache('table'); const p=readCache('plan')
        if (t||p){ setTable(t); setPlan(p); setOk(false) } else { setOk(false) }
      }
    }
    load()
  },[cfg])

  return { table, plan, mirrorsOk, stamp }
}
