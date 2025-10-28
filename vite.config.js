import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    open: true,
  },
  preview: {
    // For production preview: serve SPA fallback
    // Vercel uses vercel.json rewrites; this helps local preview
    host: '127.0.0.1',
    port: 4173,
  }
})
