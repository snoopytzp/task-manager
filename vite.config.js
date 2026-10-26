import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  const backend = new URL(env.VITE_API_BASE_URL || 'https://module3-taskflow-api-production-9bee.up.railway.app/api')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: backend.origin,
          changeOrigin: true,
        },
      },
    },
  }
})
