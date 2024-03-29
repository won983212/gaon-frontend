import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const path = require('path');

// https://vitejs.dev/config
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    publicDir: 'public',
    server:
        mode === 'development'
            ? {
                  proxy: {
                      '/api': {
                          target: 'http://localhost:4000',
                          changeOrigin: true,
                          rewrite: (path) => path.replace(/^\/api/, '')
                      },
                      '/ws': {
                          target: 'ws://localhost:6000',
                          changeOrigin: true,
                          ws: true,
                          rewrite: (path) => path.replace(/^\/ws/, '')
                      },
                      '/voice-ws': {
                          target: 'ws://localhost:8081',
                          changeOrigin: true,
                          ws: true,
                          rewrite: (path) => path.replace(/^\/voice-ws/, '')
                      },
                      '/file': {
                          target: 'http://localhost:6000',
                          changeOrigin: true,
                          rewrite: (path) => path.replace(/^\/file/, '')
                      },
                      '/voice': {
                          target: 'http://localhost:8080/',
                          changeOrigin: true,
                          rewrite: (path) => path.replace(/^\/voice/, '')
                      }
                  }
              }
            : undefined,
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    define: {
        'process.env': process.env
    }
}));
