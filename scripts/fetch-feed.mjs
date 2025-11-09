// Holt 3 Headlines aus handball-world RSS (ohne externe Pakete)
import fs from 'fs/promises';
const OUT = 'public/news.json';
const FEED = 'https://www.handball-world.news/feed.xml';
const UA = 'Mozilla/5.0 (compatible; ASV-mE1-feed/1.0)';

const xml = await (await fetch(FEED, { headers: { 'User-Agent': UA }})).text();

// Sehr einfacher Parser: <item><title>..</title><link>..</link>
const items = [];
const itemRe = /<item\b[\s\S]*?<\/item>/gi;
const titleRe = /<title>([\s\S]*?)<\/title>/i;
const linkRe  = /<link>([\s\S]*?)<\/link>/i;

for (const m of xml.matchAll(itemRe)) {
  const chunk = m[0];
  const title = (chunk.match(titleRe)?.[1] || '').trim();
  const link  = (chunk.match(linkRe)?.[1]  || '').trim();
  if (title && link) items.push({ title, link });
  if (items.length >= 3) break;
}

await fs.writeFile(OUT, JSON.stringify({ items }, null, 2));
console.log(`✅ News fetched: ${items.length} items`);
