# Handball Team – Modern PWA (Vanilla JS)

Sportliche, schnelle, SEO-starke Site im Stil der coolsten US-Teams.
Features: PWA (Offline, Install-Prompt), Live-Daten (nuLiga), Countdown,
Formkurve (SVG), Filter (Top-3 / nur Team), News-Feed (RSS), Dark/Light,
Web Share, Jubel-Button mit Sound, Humor.

## Schnellstart (lokal)
1) Repo klonen
2) Einen lokalen Static Server starten (empfohlen):
   - Node: `npx http-server public -p 8080` oder `npx serve public`
   - Python: `cd public && python -m http.server 8080`
3) Öffnen: http://localhost:8080

> Tipp: Service Worker funktioniert nur via `http://` oder `https://`.

## Konfiguration
`/src/config.js`:
- Teamname, Vereinsfilter (`clubFilter` = "ASV"),
- nuLiga-URLs (`tableUrl`, `scheduleUrl`), `mode` ("json" oder "html"),
- optional `corsProxy` (z. B. "https://r.jina.ai/http://..."),
- News RSS-URL (optional), Logo-Text / Slogan etc.

## nuLiga / CORS
- **Direkt** abrufen, wenn erlaubt (JSON oder HTML).
- Falls CORS blockiert → `corsProxy` setzen **ODER** iFrame-Fallback nutzen.
- Fallback-Button erscheint automatisch, wenn Response `opaque` ist.

## Deploy auf GitHub Pages
- Repo pushen.
- In GitHub: Settings → Pages → Source: „GitHub Actions (recommended)“
- Workflow `.github/workflows/pages.yml` ist enthalten.
- Site läuft dann unter `https://<user>.github.io/<repo>/`.

> Wenn dein Repo ein **Unterpfad** ist, funktioniert alles „out of the box“,
  da `manifest.webmanifest` `start_url: "."` nutzt.

## Anpassen
- Farben/Branding: `styles.css` (CSS-Variablen) & `config.js`
- Texte/Humor: `index.html` (Hero) & `config.js.branding`
- Team/Trainer: `src/data/roster.json`

## Lizenz
MIT. Viel Spaß – „Fair. Vollgas. ASV!“

