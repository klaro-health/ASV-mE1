// src/components/NewsTeaser.tsx
import React, { useEffect, useState } from 'react'

type Item = { title: string; link: string; pubDate?: string }
type Props = { items?: Item[]; max?: number; headline?: string }

export default function NewsTeaser({ items, max = 3, headline = 'Schlagzeilen' }: Props) {
  const [news, setNews] = useState<Item[]>(items || [])

  // Fallback: lokale Datei news.json (liegt in public/)
  useEffect(() => {
    if (news.length) return
    fetch(`${import.meta.env.BASE_URL}news.json`)
      .then(r => (r.ok ? r.json() : []))
      .then((j: Item[]) => Array.isArray(j) ? setNews(j.slice(0, max)) : undefined)
      .catch(() => {})
  }, [news.length, max])

  if (!news.length) return null

  return (
    <section className="card" aria-labelledby="news-headline" style={{ padding: 16 }}>
      <h2 id="news-headline" style={{ marginTop: 0 }}>{headline}</h2>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {news.slice(0, max).map((n, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            <a href={n.link} target="_blank" rel="noreferrer">{n.title}</a>
            {n.pubDate && <span style={{ opacity: .6, marginLeft: 8 }}>· {n.pubDate}</span>}
          </li>
        ))}
      </ul>
    </section>
  )
}

