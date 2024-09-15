import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 얘가 app 역할
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
