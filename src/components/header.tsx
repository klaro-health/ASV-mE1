import React from 'react';

export default function Header({ onReload }: { onReload?: () => void }) {
  return (
    <header className="container" style={{paddingTop:16}}>
      <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
        <div className="row" style={{alignItems:'center'}}>
          <img src="/ASV-mE1/logo.svg" alt="ASV Logo" width="36" height="36" style={{borderRadius:8, boxShadow:'0 6px 16px rgba(0,0,0,.35)'}}/>
          <div style={{marginLeft:10}}>
            <div className="badge" aria-label="Live Status">
              <span style={{width:8,height:8,background:'#22c55e',borderRadius:999}}></span>
              ASV Süchteln · mE1 · Live
            </div>
            <h1 className="h1">„Vollgas. Fair. <span style={{color:'var(--brandB)'}}>ASV</span>.“</h1>
            <div className="kicker">
              Self-Check: nuTab <strong>down</strong> — Cache/Fallback · Nächstes Spiel wird automatisch im 15-Min-Takt aktualisiert.
            </div>
          </div>
        </div>
        <div className="row">
          <a className="btn" href="https://hnr-handball.liga.nu/cgi-bin/WebObjects/nuLigaHBDE.woa/wa/groupPage?championship=KG+25%2F26&group=424318" target="_blank" rel="noreferrer">nuLiga</a>
          <button className="btn" onClick={onReload}>Neu laden</button>
        </div>
      </div>
    </header>
  );
}
