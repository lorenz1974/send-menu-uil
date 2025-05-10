import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // [DesignPattern: Configuration] Load environment variables based on mode
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    base: env.VITE_APP_BASENAME || '/',
  }
})
