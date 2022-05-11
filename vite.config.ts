import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const config = require('./apiconfig.json');
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    publicDir: 'public',
    server: {
        proxy: {
            '/api': config.url
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
});
