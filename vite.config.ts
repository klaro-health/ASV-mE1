import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ASV-mE1/',   // wichtig für Pages
  plugins: [react()]
})

