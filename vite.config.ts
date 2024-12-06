import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Get the port from the environment variable or default to 3000
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

export default defineConfig({
  plugins: [react()],
  server: {
    port
  },
  build: {
    outDir: 'dist'
  }
});
