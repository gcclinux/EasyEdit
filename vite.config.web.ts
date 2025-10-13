import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Web-only build configuration for GitHub Pages deployment
export default defineConfig({
  plugins: [react()],
  base: '/EasyEdit/webapp/',
  server: {
    port: 3025,
    strictPort: false,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist-web',
    assetsDir: 'assets',
    emptyOutDir: true,
    // Optimize for web deployment
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'markdown-vendor': ['react-markdown', 'remark-gfm', 'rehype-raw'],
          'diagram-vendor': ['mermaid', 'nomnoml'],
        }
      }
    }
  }
});
