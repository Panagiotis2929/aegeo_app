import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/aegeo_app/', // <--- Πρόσθεσε αυτή τη γραμμή ακριβώς
  server: {
    port: 3000
  }
});