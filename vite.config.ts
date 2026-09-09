import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react';
import path from "node:path";
import process from "node:process";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        conditions: ['module', 'browser', 'production|development', 'import', 'type'],
        alias: {
            "@/api": path.resolve(process.cwd(), 'src/api'),
            '@/app': path.resolve(process.cwd(), 'src/app'),
            '@/components': path.resolve(process.cwd(), 'src/components'),
            "@/ducks": path.resolve(process.cwd(), 'src/ducks'),
            "@/hooks": path.resolve(process.cwd(), 'src/hooks'),
            '@/slices': path.resolve(process.cwd(), 'src/slices'),
            "@/types": path.resolve(process.cwd(), 'src/types'),
            "@/utils": path.resolve(process.cwd(), 'src/utils'),
        }
    },
    base: "/apps/b2b-products/",
    build: {
        manifest: true,
        sourcemap: true,
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {name: 'react', test: /node_modules\/(react|react-dom)\//, priority: 20},
                        {name: 'vendor', test: /node_modules/},
                    ]
                }
            }
        },
    },
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
            // generateScopedName: '[name]__[local]-[hash:base64:5]'
        }
    },

    server: {
        port: 8080,
        host: 'localhost',
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
            },
            '/api/user/v2/cookie-consent.png': {
                target: 'https://intranet.chums.com/api/user/v2/cookie-consent.png',
                changeOrigin: true,
            },
            '/images': {
                target: 'https://intranet.chums.com/',
                changeOrigin: true,
            }
        }
    }
})
