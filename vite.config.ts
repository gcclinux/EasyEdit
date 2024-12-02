import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'fs';
import path from 'path';

// Determine if HTTPS should be used based on an environment variable
const useHttps = process.env.USE_HTTPS === 'true';

// Get the port from the environment variable or default to 3000
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

export default defineConfig({
  plugins: [react()],
  server: {
    port,
    host: true,
    ...(useHttps ? {
      https: {
        key: fs.readFileSync(path.resolve('/certbot/domain/privkey.pem')),
        cert: fs.readFileSync(path.resolve('/certbot/domain/cert.pem')),
        ca: fs.readFileSync(path.resolve('/certbot/domain/chain.pem')),
      }
    } : {})
  },
  build: {
    outDir: 'dist'
  }
});
