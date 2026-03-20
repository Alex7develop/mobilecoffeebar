import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          redux: ['react-redux', '@reduxjs/toolkit'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
    // Предупреждение при chunk > 500kb
    chunkSizeWarningLimit: 500,
  },
})
