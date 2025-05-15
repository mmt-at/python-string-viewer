import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  preview: {
    // 允许从特定域名访问
    allowedHosts: ['python-string-viewer.mlsys.dev', 'localhost'],
  },
});
