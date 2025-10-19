import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get the port from the environment variable or default to 3000
const port = process.env.PORT ? parseInt(process.env.PORT) : 3024;

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: port,
    strictPort: true,
    host: '0.0.0.0',
    // Prevent watcher from following large or symlink-heavy build dirs (fixes ELOOP)
    watch: {
      ignored: [
        '**/build-prebuilt/**',
        '**/build-flathub/**',
        '**/build-*/**',
        '**/.flatpak-builder/**',
        '**/build/**'
      ]
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: '.',
    emptyOutDir: true
  }
});
