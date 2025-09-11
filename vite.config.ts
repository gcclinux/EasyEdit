import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get the port from the environment variable or default to 3000
const port = process.env.PORT ? parseInt(process.env.PORT) : 3024;

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 3024,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    assetsDir: '.',
    emptyOutDir: true
  }
});
