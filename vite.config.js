import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "https://super.phoneo.in",
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (_proxyReq, req) => {
            console.log('[PROXY] Incoming:', req.url)
            console.log('[PROXY] Target: https://super.phoneo.in')
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('[PROXY] Response:', proxyRes.statusCode, req.url)
          })
          proxy.on('error', (error, req) => {
            console.error('[PROXY] Error:', req.url)
            console.error('[PROXY] ERROR:', error)
          })
        },
      },
    },
  },
})
