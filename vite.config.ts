import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// GitHub Pages relative production asset paths.
export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    base: isBuild ? './' : '/',

    plugins: [
      react(),
      tailwindcss(),
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    build: {
      target: 'esnext',
      cssCodeSplit: true,

      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (
                id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('react-router-dom')
              ) {
                return 'vendor-react'
              }

              if (id.includes('lucide-react')) {
                return 'vendor-icons'
              }

              if (id.includes('@supabase')) {
                return 'vendor-supabase'
              }

              if (id.includes('framer-motion')) {
                return 'vendor-motion'
              }

              if (
                id.includes('react-hook-form') ||
                id.includes('@hookform/resolvers') ||
                id.includes('zod')
              ) {
                return 'vendor-forms'
              }
            }
          },
        },
      },

      chunkSizeWarningLimit: 600,
    },
  }
})
