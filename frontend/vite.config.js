import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api/v1/users': 'http://localhost:8000',
      '/api/v1/upload': 'http://localhost:8000',
      '/api/v1/likes': 'http://localhost:8000',
      '/api/v1/allComments': 'http://localhost:8000'
      
      // '/api/v1/users': {
      //   target: 'http://localhost:8000',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api\/v1\/users/, ''),
      // },
      // '/api1/v1/upload': {
      //   target: 'http://localhost:8000',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api1\/v1\/upload/, ''),
      // }
    },
  },
  plugins: [react()],
})
