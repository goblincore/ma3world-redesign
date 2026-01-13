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
    assetsPrefix: 'https://ma3worldbunny.b-cdn.net',
    inlineStylesheets: 'auto' // Inline critical CSS automatically
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom', '@react-three/fiber', '@react-three/drei']
    },
    build: {
      cssCodeSplit: true, // Split CSS for better caching
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // More granular splitting for better progressive loading
            if (id.includes('three') && !id.includes('@react-three')) {
              return 'three-vendor';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@react-three')) {
              return 'react-three-vendor';
            }
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      }
    }
  }
});