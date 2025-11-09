import React, { useEffect, useState } from 'react';

export default function LiveTickerBadge({ dateISO, time, meetingId }: {
  dateISO?: string; time?: string; meetingId?: string | number;
}) {
  const [label,setLabel] = useState<string>('—');

  useEffect(() => {
    if (!dateISO || !time) { setLabel('—'); return; }
    const t = setInterval(() => {
      const target = new Date(`${dateISO.replace(/\./g,'-')}T${time}:00`);
      const diff = +target - Date.now();
      if (diff <= 0) {
        setLabel('Live bald'); return;
      }
      const h = Math.floor(diff/3_600_000);
      const m = Math.floor((diff%3_600_000)/60_000);
      const s = Math.floor((diff%60_000)/1000);
      setLabel(`Anwurf in ${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(t);
  }, [dateISO, time]);

  const link = meetingId
    ? `https://hbde-live.liga.nu/nuScoreLive/#/groups/` // Gruppen-Widget, kein direkter Meeting-Deep-Link verfügbar
    : 'https://hbde-live.liga.nu/nuScoreLive';

  return (
    <a className="badge" href={link} target="_blank" rel="noreferrer" aria-label="Live-Ticker">
      <span style={{width:8,height:8,background:'#22c55e',borderRadius:999}} aria-hidden />
      {label}
    </a>
  );
}
