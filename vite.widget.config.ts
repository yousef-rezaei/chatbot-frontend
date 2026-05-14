import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds a single self-contained IIFE you can drop into any host page:
//   <script src="https://your.cdn/norman-chatbot.iife.js" defer></script>
// The script auto-mounts into <body> and detects the API host from its own src.
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'dist-widget',
    lib: {
      entry: 'src/widget.tsx',
      name: 'NormanChatbot',
      fileName: () => 'norman-chatbot.iife.js',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'norman-chatbot.[ext]',
        inlineDynamicImports: true,
      },
    },
  },
});
