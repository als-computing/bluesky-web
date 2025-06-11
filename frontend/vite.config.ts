import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        '/api/qserver': {
            target: 'http://localhost:60610', 
            changeOrigin: true, 
            rewrite: (path) => path.replace(/^\/api\/qserver/, ''), // Remove "/api/qserver" from the path
        },
        '/api/qserver/console': {
        target: 'ws://localhost:8000/queue_server',
        ws: true, 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/qserver\/console/, ''), // Remove "/api/qserver/console" from the path
      },
      '/api/camera': {
        target: 'ws://localhost:8000/pvcamera',
        ws: true, 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/camera/, ''), // Remove "/api/camera" from the path
      },
    },
},
})
