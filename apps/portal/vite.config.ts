import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Portal Vite config — merge proxy `/api` into existing apps/portal/vite.config.ts.
 * Full file mirrors ae-it-platform portal config + owner API proxy.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../create'), '')
  const supabaseTarget = (env.VITE_SUPABASE_URL || 'http://supabase.pixelwaverf.ru').replace(/\/$/, '')

  return {
    plugins: [react()],
    envDir: path.resolve(__dirname, '../create'),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@ae-it/logo': path.resolve(__dirname, '../../shared/logo'),
        '@ae-it/design': path.resolve(__dirname, '../../shared/design'),
        '@ae-it/legal': path.resolve(__dirname, '../../shared/legal'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
      },
    },
    server: {
      port: 5174,
      strictPort: true,
      host: 'localhost',
      proxy: {
        '/supabase-api': {
          target: supabaseTarget,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/supabase-api/, ''),
        },
        '/api': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
        },
      },
    },
  }
})
