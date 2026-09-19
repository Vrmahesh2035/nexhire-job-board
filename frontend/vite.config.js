import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    root: path.resolve(process.cwd(), 'frontend'),
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'frontend/src'),
      },
    },
    build: {
      outDir: path.resolve(process.cwd(), 'dist'),
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/api': 'http://localhost:3000'
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});