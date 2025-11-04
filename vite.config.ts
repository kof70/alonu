import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    // Minifier et obfusquer le code en production
    minify: 'esbuild',
    sourcemap: false, // Pas de sourcemap en production pour masquer le code source
    rollupOptions: {
      output: {
        // Masquer les noms de fichiers pour éviter l'exposition de la structure
        manualChunks: undefined,
      },
    },
  },
})
