import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:3001',
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
