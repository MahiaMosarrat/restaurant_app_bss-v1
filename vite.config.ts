import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/restaurant_app_bss-v1",
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
       
      },
    }),
  ],
})
