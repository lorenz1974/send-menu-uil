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
    // [DesignPattern: Configuration] Define path aliases for cleaner imports
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@components': resolve(__dirname, './src/components'),
        '@assets': resolve(__dirname, './src/assets'),
        '@hooks': resolve(__dirname, './src/hooks')
      }
    }
  }
})
