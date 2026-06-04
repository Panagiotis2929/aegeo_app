import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // ΑΥΤΟ ΕΙΝΑΙ ΤΟ ΚΛΕΙΔΙ!
  plugins: [react()],
})