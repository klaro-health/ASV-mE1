// scripts/scrape-nuliga.mjs
import fs from 'fs/promises'

const CFG  = 'public/config.json'
const OUTT = 'public/snapshot.table.json'
const OUTP = 'public/snapshot.plan.json'
const UA = 'Mozilla/5.0 (compatible; ASV-mE1-scraper/1.0)'

const clean = s => String(s)
  .replace(/<br\s*\/?>/gi,' ')
  .replace(/<[^>]+>/g,' ')
  .replace(/\s+/g,' ')
  .replace(/&nbsp;/g,' ')
  .trim()

const num = x => {
  const n = parseInt(String(x).replace(/[^\d\-]/g,''),10)
  return isNaN(n) ? 0 : n
}

const normDate = x => {
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(x)) {
    const [d,m,y] = x.split('.'); return `${y}.${m}.${d}`
  }
  return x
}

function parseTable(html){
  const tables = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi) || []
  let best = []
  for (const tbl of tables){
    if (!/Rang|Platz/i.test(tbl) || !/(Mannschaft|Team)/i.test(tbl)) continue
    const rows = [...tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>m[1])
    const out = []
    for (const r of rows){
      const c = [...r.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>clean(m[1]))
      if (c.length < 5) continue
      const o = {
        Platz: num(c[1] || c[0]),
        Team_Kurzname: c.find(x=>x && x.length>0 && !/^\d/.test(x)) || ''
      }
      // typische nuLiga-Köpfe abdecken
      const tore = c.find(x=>/\d+\s*:\s*\d+/.test(x)) || ''
      const [gf,ga] = tore.split(':').map(num)
      o.PlusTore = gf||0; o.MinusTore = ga||0
      const diff = c.find(x=>/^[+\-]?\d+$/.test(x)); if (diff!=null) o.DiffTore = num(diff)
      const ptsC = c.slice().reverse().find(x=>/^\d+\s*:\s*\d+$/.test(x) || /^\d+$/.test(x)) || ''
      if (ptsC.includes(':')) {
        const [pp,mp] = ptsC.split(':').map(num); o.PlusPunkte=pp; o.MinusPunkte=mp
      } else { o.points = num(ptsC) }
      const sp = c.find(x=>/^\d+$/.test(x)) ; if (sp) o.Spiele = num(sp)
      // wins/draws/losses grob heuristisch:
      const nums = c.map(num).filter(n=>Number.isFinite(n))
      if (!o.Spiele && nums.length>=4) o.Spiele = nums[1]
      o.SpieleGewonnen = o.SpieleGewonnen ?? 0
      o.SpieleUnentschieden = o.SpieleUnentschieden ?? 0
      o.SpieleVerloren = o.SpieleVerloren ?? 0

      if (o.Platz && o.Team_Kurzname) out.push(o)
    }
    if (out.length > best.length) best = out
  }
  return { rows: best }
}

function parsePlan(html){
  const tables = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi) || []
  let best = []
  for (const tbl of tables){
    if (!/(Spielplan|Heimmannschaft|Gastmannschaft|Zeit)/i.test(tbl)) continue
    const rows = [...tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>m[1])
    const out = []
    for (const r of rows){
      const c = [...r.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>clean(m[1]))
      if (c.length < 4) continue
      const obj = {}
      const date = c.find(x=>/^\d{2}\.\d{2}\.\d{4}$/.test(x))
      const time = c.find(x=>/^\d{1,2}:\d{2}$/.test(x))
      const hall = c.find(x=>/Halle|Sporthalle|Viersen|Süchteln|Lank|Krefeld|Vorst/i.test(x)) || ''
      const nr   = c.find(x=>/^\d{2,}$/.test(x)) || ''
      const score= c.find(x=>/^\d+\s*:\s*\d+$/.test(x)) || ''
      // Heimmannschaft / Gastmannschaft:
      let hi = c.findIndex(x=>/Heimmannschaft/i.test(x))
      if (hi === -1) hi = c.findIndex(x=>/^[A-ZÄÖÜa-zäöü].+/.test(x))
      const home = c[6] || c[5] || c[hi+0] || ''
      const away = c[7] || c[6] || c[hi+1] || ''

      if (date) obj.SpieldatumTag = normDate(date)
      if (time) obj.SpieldatumUhrzeit = time
      if (hall) obj.Halle_Kuerzel = hall
      if (nr)   obj.Spielnummer = nr
      if (home) obj.HeimTeam_Name_kurz = home
      if (away) obj.GastTeam_Name_kurz = away
      if (score){ const [h,a]=score.split(':').map(num); obj.Tore_Heim=h; obj.Tore_Gast=a }

      if (Object.keys(obj).length) out.push(obj)
    }
    if (out.length > best.length) best = out
  }
  return { rows: best }
}

const cfg = JSON.parse(await fs.readFile(CFG, 'utf8'))
if (!cfg.groupUrl) { console.error('groupUrl fehlt in public/config.json'); process.exit(1) }

const res = await fetch(cfg.groupUrl, { headers: { 'User-Agent': UA }})
if (!res.ok) { console.error('nuLiga upstream', res.status); process.exit(2) }
const html = await res.text()

const table = parseTable(html)
const plan  = parsePlan(html)

// nur schreiben, wenn wirklich Inhalte gefunden wurden
if (table.rows?.length) await fs.writeFile(OUTT, JSON.stringify(table, null, 2))
if (plan.rows?.length)  await fs.writeFile(OUTP, JSON.stringify(plan,  null, 2))

console.log(`✅ snapshots aktualisiert: table=${table.rows?.length||0}, plan=${plan.rows?.length||0}`)
