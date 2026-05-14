import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Normal app build (dev server + standalone preview).
// Embed widget bundle: `npm run build:widget` (uses vite.widget.config.ts).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
