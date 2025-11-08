import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(<App />)

// PWA SW registrieren (optional)
if ('serviceWorker' in navigator) {
  const url = new URL('/ASV-mE1/sw.js', location.origin)
  navigator.serviceWorker.register(url).catch(()=>{})
}
