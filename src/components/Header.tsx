// src/components/Header.tsx
import React from 'react'

type Props = {
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

export default function Header({ title = "ASV Süchteln · mE1", subtitle = "Regionsoberliga · Saison 2025/26", children }: Props) {
  return (
    <header
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: 16,
        borderRadius: 16
      }}
    >
      <img
        src="/ASV-mE1/public/icon-192.png"
        alt="ASV mE1"
        width={48}
        height={48}
        style={{ borderRadius: 12 }}
        onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.display='none' }}
      />
      <div style={{ flex: 1 }}>
        <h1 style={{ margin: 0, fontSize: 22, lineHeight: 1.2 }}>{title}</h1>
        <div style={{ opacity: .75, marginTop: 4 }}>{subtitle}</div>
      </div>

      {/* A11y: beschriftetes Select statt „namenlos“ */}
      <div>
        <label htmlFor="viewMode">Ansicht</label>
        <select id="viewMode" name="viewMode" className="btn" aria-label="Ansicht wählen">
          <option value="full">Normal</option>
          <option value="mini">Mini</option>
        </select>
      </div>

      {children}
    </header>
  )
}

