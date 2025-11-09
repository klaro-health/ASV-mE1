// Minimaler nuLiga-Scraper (ohne externe Pakete)
// Liest public/config.json (groupUrl) und schreibt JSON-Snapshots in public/

import fs from 'fs/promises';

const CFG = 'public/config.json';
const OUT_T = 'public/snapshot.table.json';
const OUT_P = 'public/snapshot.plan.json';
const UA = 'Mozilla/5.0 (compatible; ASV-mE1-scraper/1.1)';

const clean = s => String(s).replace(/<br\s*\/?>/gi,' ')
  .replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')
  .replace(/&nbsp;/g,' ').trim();

const num = x => {
  if (x == null) return 0;
  const n = parseInt(String(x).replace(/[^\d\-]/g,''),10);
  return Number.isFinite(n) ? n : 0;
};

const normDate = x => {
  if (!x) return x;
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(x)) {
    const [d,m,y]=x.split('.');
    return `${y}.${m}.${d}`;
  }
  return x;
};

function parseTable(html){
  const tables = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi) || [];
  let best = [];
  for (const tbl of tables){
    if (!/Tabelle/i.test(html) && (!/Platz|Rang/i.test(tbl) || !/(Mannschaft|Team)/i.test(tbl))) continue;

    const rows = [...tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>m[1]);
    const out = [];
    for (const r of rows){
      const c = [...r.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>clean(m[1]));
      if (c.length < 5) continue;

      // try to map columns heuristisch
      const maybeGoals = c.find(x=>/^\d+\s*:\s*\d+$/.test(x)) || '';
      const [gf,ga] = maybeGoals ? maybeGoals.split(':').map(num) : [0,0];

      const maybeDiff = c.find(x=>/^[+\-]?\d+$/.test(x));
      const maybePts  = c.slice().reverse().find(x=>/^\d+\s*:\s*\d+$/.test(x) || /^\d+$/.test(x)) || '';

      const o = {
        Platz: num(c[0]) || num(c[1]),
        Team_Kurzname: c.find(x=>x && !/^\d|:|^\+|-/.test(x)) || c[1],
        Spiele: num(c.find(x=>/^\d+$/.test(x))),
        SpieleGewonnen: num(c[3]),
        SpieleUnentschieden: num(c[4]),
        SpieleVerloren: num(c[5]),
        PlusTore: gf, MinusTore: ga,
      };
      if (maybeDiff != null) o.DiffTore = num(maybeDiff);
      if (maybePts.includes(':')) {
        const [pp,mp] = maybePts.split(':').map(num);
        o.PlusPunkte = pp; o.MinusPunkte = mp;
      } else {
        o.points = num(maybePts);
      }
      if (o.Team_Kurzname && (o.Platz || o.points!=null)) out.push(o);
    }
    if (out.length > best.length) best = out;
  }
  return { rows: best };
}

function parsePlan(html){
  const tables = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi) || [];
  let best = [];
  for (const tbl of tables){
    if (!/(Spielplan|Begegnung|Heim|Gast)/i.test(tbl)) continue;
    const rows = [...tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>m[1]);
    const out = [];
    for (const r of rows){
      const c = [...r.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>clean(m[1]));
      if (c.length < 4) continue;

      const obj = {};
      const date = c.find(x=>/^\d{2}\.\d{2}\.\d{4}$|^\d{4}\.\d{2}\.\d{2}$/.test(x));
      const time = c.find(x=>/^\d{1,2}:\d{2}$/.test(x));
      const hall = c.find(x=>/(Halle|Sporthalle|Sportzentrum|Vogteihalle|Realschule|Königshof|Süchteln|Lank|Vorst|Kempen|Tönis|Viersen)/i);
      const nr   = c.find(x=>/^\d{2,}$/.test(x));
      // Heim – Gast
      const vs = c.find(x=>/–|-/.test(x) && x.split(/–|-/).length===2);
      let heim='', gast='';
      if (vs){ [heim,gast] = vs.split(/–|-/).map(s=>s.trim()); }
      const score = c.find(x=>/^\d+\s*:\s*\d+$/.test(x));

      if (date) obj.SpieldatumTag = normDate(date);
      if (time) obj.SpieldatumUhrzeit = time;
      if (hall) obj.Hallenname = hall;
      if (nr)   obj.Spielnummer = nr;
      if (heim) obj.HeimTeam_Name_kurz = heim;
      if (gast) obj.GastTeam_Name_kurz = gast;
      if (score){ const [h,a]=score.split(':').map(num); obj.Tore_Heim=h; obj.Tore_Gast=a; }

      if (Object.keys(obj).length) out.push(obj);
    }
    if (out.length > best.length) best = out;
  }
  return { rows: best };
}

const cfg = JSON.parse(await fs.readFile(CFG,'utf8'));
const url = cfg.groupUrl;
if (!url){ console.error('groupUrl fehlt in public/config.json'); process.exit(1); }

const res = await fetch(url, { headers:{ 'User-Agent': UA }});
if (!res.ok){ console.error('nuLiga upstream', res.status); process.exit(2); }
const html = await res.text();

const table = parseTable(html);
const plan  = parsePlan(html);

if (table.rows?.length) await fs.writeFile(OUT_T, JSON.stringify(table, null, 2));
if (plan.rows?.length)  await fs.writeFile(OUT_P, JSON.stringify(plan,  null, 2));

console.log(`✅ nuLiga snapshots: table=${table.rows?.length||0}, plan=${plan.rows?.length||0}`);
