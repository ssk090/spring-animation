import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The TypeSafe API sends no CORS headers, so the browser cannot call it
    // directly. In production api/v1/[...path].ts proxies it; here Vite does.
    proxy: {
      '/api/v1': {
        target: 'https://api.typesafe.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
