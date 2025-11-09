#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const ROOT = process.cwd();
const PUB = path.join(ROOT, 'public');

// Simple helpers
const text = (el) => (el?.textContent || '').trim();

function parseTable(doc){
  // Sucht die Tabelle mit Rang/Mannschaft/Punkte (nuLiga variiert je Verband, Struktur ist aber ähnlich)
  const table = doc.querySelector('table') || doc.querySelector('table.result-set') || doc.querySelector('table.table');
  if(!table) return [];
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  return rows.map((tr, i)=>{
    const tds = tr.querySelectorAll('td');
    const get = (idx) => text(tds[idx] || null);
    // Versuche generisches Mapping (Rang, Team, Spiele, S/U/N, Tore, +/- , Punkte)
    const rank = get(0) || String(i+1);
    const team = get(1);
    const games = Number((get(2) || '0').replace(/\D+/g,''));
    // häufig getrennt: Siege / Unentschieden / Niederlagen
    const w = Number((get(3)||'0').replace(/\D+/g,'')) || 0;
    const d = Number((get(4)||'0').replace(/\D+/g,'')) || 0;
    const l = Number((get(5)||'0').replace(/\D+/g,'')) || 0;
    const goals = get(6) || '';
    const m = goals.match(/(\d+):(\d+)/);
    const gf = m? Number(m[1]):0, ga = m? Number(m[2]):0;
    const diff = gf - ga;
    const pts = get(7) || get(8) || '';
    return { rank, team, games, w, d, l, goalsFor: gf, goalsAgainst: ga, diff, points: pts };
  }).filter(r=>r.team);
}

function parsePlan(doc){
  // Sucht Spielplanzeilen (Datum, Zeit, Halle, Nr, Heim, Gast, Ergebnis)
  const table = Array.from(doc.querySelectorAll('table')).find(t=>{
    return /Datum|Zeit/i.test(t.textContent||'') && /Heim|Gast/i.test(t.textContent||'');
  });
  if(!table) return [];
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  return rows.map((tr, i)=>{
    const tds = tr.querySelectorAll('td');
    const get = (idx) => text(tds[idx] || null);
    const dateStr = get(0)?.split(/\s+/).slice(0,3).join(' ') || get(0);
    const time = get(1);
    const hallCode = get(2);
    const matchNo = get(3);
    const home = get(4);
    const away = get(5);
    const result = get(6);
    // naive ISO (heute ohne TZ Annahmen – nuLiga hat keine TZ; wir setzen lokale Zeit → UTC)
    const dt = new Date(`${dateStr} ${time}`);
    const startISO = new Date(dt.getTime()-dt.getTimezoneOffset()*60000).toISOString();
    const endISO = new Date(dt.getTime()+90*60000 - dt.getTimezoneOffset()*60000).toISOString();
    const hallName = hallCode;
    const id = `${dateStr}-${matchNo}-${home}-${away}`.replace(/\s+/g,'_');
    return { id, dateStr, time, hallCode, hallName, matchNo, home, away, result: result||'', startISO, endISO, deepLink: '' };
  }).filter(r=>r.home && r.away);
}

async function main(){
  const cfgPath = path.join(PUB, 'config.json');
  const cfg = JSON.parse(await fs.readFile(cfgPath, 'utf8'));
  const res = await fetch(cfg.groupUrl, { headers: { 'user-agent': 'asv-scraper/1.0' }});
  if(!res.ok) throw new Error('nuLiga fetch failed: '+res.status);
  const html = await res.text();
  // Save RAW for debugging
  await fs.writeFile(path.join(PUB, 'snapshot.raw.html'), html, 'utf8');

  // Parse
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const table = parseTable(doc);
  const plan  = parsePlan(doc);

  await fs.writeFile(path.join(PUB,'snapshot.table.json'), JSON.stringify(table, null, 2));
  await fs.writeFile(path.join(PUB,'snapshot.plan.json'), JSON.stringify(plan,  null, 2));

  console.log('✅ snapshots written', { table: table.length, plan: plan.length });
}

main().catch(e=>{ console.error(e); process.exit(1); });