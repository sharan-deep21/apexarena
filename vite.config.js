import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('d3') || id.includes('ogl')) return 'vendor-viz';
            if (id.includes('@google')) return 'vendor-ai';
            return 'vendor-core';
          }
        }
      }
    }
  },
});
