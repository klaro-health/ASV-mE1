// src/hooks/useNuTab.ts
import { useEffect, useMemo, useState } from 'react'

type TableData = { rows: any[] }
type PlanData  = { rows: any[] }

async function getJSON<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { cache: 'no-store' })
    if (!r.ok) return null
    return await r.json() as T
  } catch { return null }
}

export function useNuTab() {
  const [table, setTable] = useState<TableData|null>(null)
  const [plan,  setPlan]  = useState<PlanData|null>(null)
  const [status, setStatus] = useState<'loading'|'ok'|'fallback'>('loading')

  useEffect(() => {
    (async () => {
      // 1) Primär: Snapshots aus /public
      const t = await getJSON<TableData>('snapshot.table.json')
      const p = await getJSON<PlanData>('snapshot.plan.json')
      if (t?.rows?.length || p?.rows?.length) {
        setTable(t||{rows:[]}); setPlan(p||{rows:[]}); setStatus('ok'); return
      }
      // 2) Fallback: statische Demo (falls nichts da)
      const demoT = await getJSON<TableData>('demo.table.json')
      const demoP = await getJSON<PlanData>('demo.plan.json')
      setTable(demoT||{rows:[]}); setPlan(demoP||{rows:[]}); setStatus('fallback')
    })()
  }, [])

  const nextGame = useMemo(() => {
    const rows = plan?.rows ?? []
    const upcoming = rows
      .filter((g:any)=>!g.Tore_Heim && !g.Tore_Gast)
      .map((g:any)=> {
        const ts = Date.parse(`${g.SpieldatumTag}T${(g.SpieldatumUhrzeit||'00:00')}:00`)
        return { ...g, ts }
      })
      .filter(g=>!isNaN(g.ts))
      .sort((a,b)=>a.ts - b.ts)[0]
    return upcoming || null
  }, [plan])

  return { table, plan, nextGame, status }
}