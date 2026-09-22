import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The TypeSafe API sends no CORS headers, so the browser cannot call it
    // directly. Proxy /v1 through the dev server and the SDK uses a relative
    // baseURL. ponytail: dev-only, a real deployment needs its own proxy.
    proxy: {
      '/v1': {
        target: 'https://api.typesafe.ai',
        changeOrigin: true,
      },
    },
  },
})
