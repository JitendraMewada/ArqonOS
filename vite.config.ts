import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [tailwindcss(), react()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
      },
      dedupe: [
        'react',
        'react-dom',
        'react-router-dom',
        'firebase',
        'firebase/app',
        'firebase/auth',
        'firebase/firestore',
        'firebase/storage'
      ],
    },
    optimizeDeps: {
      include: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        'react-dom/client',
        'react-router-dom',
        'firebase/app',
        'firebase/auth',
        'firebase/firestore',
        'firebase/storage',
        'framer-motion',
        'lucide-react',
        'clsx',
        'tailwind-merge',
        'use-image'
      ],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: false,
    },
  };
});
