import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ 
      presets: [reactCompilerPreset()],
      exclude: [/node_modules\/@fullcalendar/]
    })
  ],
  optimizeDeps: {
    include: [
      '@fullcalendar/react', 
      '@fullcalendar/core', 
      '@fullcalendar/daygrid', 
      '@fullcalendar/timegrid', 
      '@fullcalendar/interaction'
    ]
  }
})

