// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Custom domain
  site: 'https://ma3world.com',
  build: {
    assets: 'assets',
    assetsPrefix: 'https://ma3worldbunny.b-cdn.net'
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom', '@react-three/fiber', '@react-three/drei']
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei']
          }
        }
      }
    }
  }
});