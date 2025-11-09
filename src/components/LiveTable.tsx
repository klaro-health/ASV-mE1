// src/components/LiveTable.tsx
import React, { useMemo, useState } from 'react'

export type TableLike = {
  rows?: any[]
  teams?: any[]
  table?: any[]
}

export default function LiveTable({ table, club }:{ table: TableLike, club?: string }) {
  const [mode, setMode] = useState<'full'|'mini'>('full')
  const rows = useMemo(() => (table?.rows || table?.teams || table?.table || []), [table])

  if (!rows.length) return <div className="skel" style={{height:18}}/>

  const thead =
    mode === 'full'
      ? (
        <tr>
          <th>Rang</th><th style={{textAlign:'left'}}>Mannschaft</th>
          <th>Sp.</th><th>S</th><th>U</th><th>N</th>
          <th>Tore</th><th>+/-</th><th>Punkte</th>
        </tr>
      )
      : (
        <tr>
          <th>Rang</th><th style={{textAlign:'left'}}>Mannschaft</th><th>Punkte</th>
        </tr>
      )

  return (
    <>
      <div className="toolbar">
        <label htmlFor="viewMode" className="sr-only">Tabellenansicht</label>
        <select
          id="viewMode"
          name="viewMode"
          title="Tabellenansicht"
          aria-label="Tabellenansicht"
          className="btn"
          value={mode}
          onChange={e => setMode(e.target.value as any)}
        >
          <option value="full">Normal</option>
          <option value="mini">Mini</option>
        </select>
      </div>

      <div className="table">
        <table>
          <thead>{thead}</thead>
          <tbody>
            {rows.map((r:any, i:number) => {
              const rank = r.Platz ?? r.rank ?? r.position ?? (i+1)
              const team = r.Team_Kurzname ?? r.team ?? r.name ?? ''
              const gp   = r.Spiele ?? r.played ?? r.matches ?? 0
              const w    = r.SpieleGewonnen ?? r.wins ?? 0
              const d    = r.SpieleUnentschieden ?? r.draws ?? 0
              const l    = r.SpieleVerloren ?? r.losses ?? 0
              const gf   = r.PlusTore ?? r.goalsFor ?? 0
              const ga   = r.MinusTore ?? r.goalsAgainst ?? 0
              const diffN = (r.DiffTore ?? r.goalDiff ?? (gf - ga)) as number
              const diff  = (diffN >= 0 ? '+' : '') + diffN
              const pts   = (r.PlusPunkte!=null && r.MinusPunkte!=null)
                ? `${r.PlusPunkte}:${r.MinusPunkte}` : (r.points ?? '')

              const trClass =
                `${i<3?'top3':''} ${(club && String(team).toLowerCase().includes(club.toLowerCase()))?'me':''}`

              return mode==='full' ? (
                <tr key={i} className={trClass}>
                  <td>{rank}</td><td className="team"><span>{team}</span></td>
                  <td>{gp}</td><td>{w}</td><td>{d}</td><td>{l}</td>
                  <td>{gf}:{ga}</td>
                  <td className={`diff ${diffN>=0?'pos':'neg'}`}>{diff}</td>
                  <td>{pts}</td>
                </tr>
              ) : (
                <tr key={i} className={trClass}>
                  <td>{rank}</td><td className="team"><span>{team}</span></td><td>{pts}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
