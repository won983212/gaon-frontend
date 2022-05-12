import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    publicDir: 'public',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
});
