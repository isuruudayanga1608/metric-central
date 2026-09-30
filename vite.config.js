import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/metric-central/',
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4321,
  },
})
