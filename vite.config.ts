import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'buffer';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3024;

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      path: 'path-browserify',
    },
  },
  ssr: {
    noExternal: ['isomorphic-git', 'fs', 'path'],
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    port: port,
    strictPort: true,
    host: '0.0.0.0',
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
    emptyOutDir: true,
    rollupOptions: {
      external: [],
    },
  }
});
