import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // ✅ Define all replacements
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'import.meta': JSON.stringify({}),
    global: 'globalThis',
  },
  
  build: {
    lib: {
      entry: 'src/widget.tsx',
      name: 'NormanChatbot',
      fileName: 'norman-chatbot',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        assetFileNames: 'norman-chatbot.[ext]',
      }
    },
  }
})