import base44 from "@base44/vite-plugin"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/gsmst-connect/', // Replace with your repository name
})

