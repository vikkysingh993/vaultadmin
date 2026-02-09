import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// remove /admin/
export default defineConfig({
  base: '/',
  plugins: [react()],
})
