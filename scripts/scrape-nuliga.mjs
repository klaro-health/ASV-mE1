// scripts/scrape-nuliga.mjs
// Holt die nuLiga-Gruppenseite aus public/config.json und schreibt Snapshots ins public/-Verzeichnis.

import fs from 'fs/promises';

const CONFIG_PATH = 'public/config.json';
const OUT_TABLE = 'public/snapshot.table.json';
const OUT_PLAN  = 'public/snapshot.plan.json';
const UA = 'Mozilla/5.0 (compatible; ASV-mE1-scraper/1.0)';

// --- Utils ---
const clean = s => String(s)
  .replace(/<br\s*\/?>/gi,' ')
  .replace(/<[^>]+>/g,' ')
  .replace(/\s+/g,' ')
  .replace(/&nbsp;/g,' ')
  .trim();
const num = x => { const n = parseInt(String(x).replace(/[^\d\-]/g,''),10); return isNaN(n) ? 0 : n; };
const normalizeDate = x => {
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(x)) { const [d,m,y]=x.split('.'); return `${y}.${m}.${d}`; }
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(x)) return x;
  return x;
};

// --- Parser: Tabelle ---
function parseTable(html){
  const tables = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi) || [];
  let best = [];
  for (const tbl of tables){
    if (!/Platz/i.test(tbl) || !/(Mannschaft|Team)/i.test(tbl)) continue;
    const rows = [...tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>m[1]);
    const out = [];
    for (const r of rows){
      const cols = [...r.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>clean(m[1]));
      if (cols.length < 5) continue;
      const o = {
        Platz: num(cols[0]),
        Team_Kurzname: cols[1],
        Spiele: num(cols[2]),
        SpieleGewonnen: num(cols[3]),
        SpieleUnentschieden: num(cols[4]),
        SpieleVerloren: num(cols[5]),
      };
      const tore = cols.find(x=>/\d+\s*:\s*\d+/.test(x)) || '';
      const [gf,ga] = tore.split(':').map(num);
      o.PlusTore = gf || 0; o.MinusTore = ga || 0;
      const diffC = cols.find(x=>/^[+\-]?\d+$/.test(x)); if (diffC!=null) o.DiffTore = num(diffC);
      const ptsC  = cols.slice().reverse().find(x=>/^\d+\s*:\s*\d+$/.test(x) || /^\d+$/.test(x)) || '';
      if (ptsC.includes(':')) { const [pp,mp]=ptsC.split(':').map(num); o.PlusPunkte=pp; o.MinusPunkte=mp; }
      else { o.points = num(ptsC); }
      if (o.Platz && o.Team_Kurzname) out.push(o);
    }
    if (out.length > best.length) best = out;
  }
  return { rows: best };
}

// --- Parser: Spielplan ---
function parsePlan(html){
  const tables = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi) || [];
  let best = [];
  for (const tbl of tables){
    if (!/(Datum|Begegnung|Heim|Gast)/i.test(tbl)) continue;
    const rows = [...tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>m[1]);
    const out = [];
    for (const r of rows){
      const cols = [...r.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m=>clean(m[1]));
      if (cols.length < 4) continue;
      const obj = {};
      const date = cols.find(x=>/^\d{2}\.\d{2}\.\d{4}$|^\d{4}\.\d{2}\.\d{2}$/.test(x));
      const time = cols.find(x=>/^\d{1,2}:\d{2}$/.test(x));
      const hall = cols.find(x=>/(Halle|Süchteln|Lank|Lobberich|Kaarst|Möncheng)/i.test(x)) || '';
      const nr   = cols.find(x=>/^\d{4,}$/.test(x)) || '';
      const vs   = cols.find(x=>/–|-/.test(x) && x.split(/–|-/).length===2) || '';
      let home='', away='';
      if (vs){ [home,away] = vs.split(/–|-/).map(s=>s.trim()); }
      const score = cols.find(x=>/^\d+\s*:\s*\d+$/.test(x)) || '';

      if (date) obj.SpieldatumTag = normalizeDate(date);
      if (time) obj.SpieldatumUhrzeit = time;
      if (hall) obj.Halle_Kuerzel = hall;
      if (nr)   obj.Spielnummer = nr;
      if (home) obj.HeimTeam_Name_kurz = home;
      if (away) obj.GastTeam_Name_kurz = away;
      if (score){ const [h,a]=score.split(':').map(num); obj.Tore_Heim=h; obj.Tore_Gast=a; }
      if (Object.keys(obj).length) out.push(obj);
    }
    if (out.length > best.length) best = out;
  }
  return { rows: best };
}

// --- Main ---
const cfg = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf8'));
const groupUrl = cfg.groupUrl;
if (!groupUrl) { console.error('groupUrl fehlt in public/config.json'); process.exit(1); }

const res = await fetch(groupUrl, { headers: { 'User-Agent': UA }});
if (!res.ok){ console.error('nuLiga upstream', res.status); process.exit(2); }
const html = await res.text();

const table = parseTable(html);
const plan  = parsePlan(html);

if (table.rows?.length) await fs.writeFile(OUT_TABLE, JSON.stringify(table, null, 2));
if (plan.rows?.length)  await fs.writeFile(OUT_PLAN,  JSON.stringify(plan,  null, 2));

console.log(`✅ snapshots aktualisiert: ${table.rows?.length||0} tabellenzeilen, ${plan.rows?.length||0} spiele`);
