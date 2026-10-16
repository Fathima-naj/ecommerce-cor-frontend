
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      '^/product(?:/|$)': 'http://localhost:3000',
      '^/user(?:/|$)': 'http://localhost:3000',
    },
  },
})
