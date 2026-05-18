import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { wycenyPlugin } from './vite-plugin-wyceny.js';

export default defineConfig({
  plugins: [react(), wycenyPlugin()],
  server: {
    port: 5173,
    open: true,
  },
});
