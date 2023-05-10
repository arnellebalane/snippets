import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            components: path.resolve(__dirname, 'src/components'),
            store: path.resolve(__dirname, 'src/store'),
            views: path.resolve(__dirname, 'src/views'),
        },
    },
});
