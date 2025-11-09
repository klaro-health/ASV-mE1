// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// WICHTIG: base = Unterordner deiner GitHub-Pages-URL.
// Repo heißt "ASV-mE1" -> URL ist https://klaro-health.github.io/ASV-mE1/
// => base MUSS '/ASV-mE1/' sein (mit führendem und abschließendem Slash).
export default defineConfig({
  base: '/ASV-mE1/',

  plugins: [react()],

  // Optional, aber hilfreich:
  build: {
    outDir: 'dist',          // Output-Ordner (wird vom Pages-Workflow deployed)
    assetsDir: 'assets',     // JS/CSS/Images landen hier
    sourcemap: false,        // true nur zum Debuggen
    target: 'es2019'         // kompatible JS-Zielversion
  },

  // Optional: sauberere Pfade im Dev-Server (lokal)
  server: {
    port: 5173,
    open: false
  }
})


