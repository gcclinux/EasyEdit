import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'buffer';
import fs from 'fs';
import path from 'path';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3024;

// Check if HTTPS certificates exist
const keyPath = path.resolve(__dirname, 'key.pem');
const certPath = path.resolve(__dirname, 'cert.pem');
const hasHttps = fs.existsSync(keyPath) && fs.existsSync(certPath);

// Disable HTTPS for Electron app mode (when running npm run app)
const isElectronMode = process.env.npm_lifecycle_event === 'app';
const useHttps = hasHttps && !isElectronMode;

if (isElectronMode) {
  console.log('🖥️  Electron mode - using HTTP for compatibility');
} else if (useHttps) {
  console.log('🔐 HTTPS certificates found - server will use HTTPS');
} else {
  console.log('ℹ️  No HTTPS certificates found - server will use HTTP');
  console.log('   Run ./setup-https.sh to enable HTTPS');
}

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
    // Enable HTTPS if certificates exist and not in Electron mode
    ...(useHttps && {
      https: {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      }
    }),
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
