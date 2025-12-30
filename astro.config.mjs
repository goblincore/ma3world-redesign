// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // SITE: Replace with your actual domain or GitHub Pages URL
  site: 'https://goblincore.github.io',
  // BASE: The name of your repository /ma3world-redesign/
  base: '/ma3world-redesign/',
  build: {
    assets: 'assets',
    assetsPrefix: 'https://ma3worldbunny.b-cdn.net'
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});