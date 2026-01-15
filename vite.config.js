import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                catalog: resolve(__dirname, 'catalog.html'),
                about: resolve(__dirname, 'about.html'),
                product: resolve(__dirname, 'product.html'),
                success: resolve(__dirname, 'success.html'),
            },
        },
    },
});
