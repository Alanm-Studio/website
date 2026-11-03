// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// Sitio estático; solo el panel de Keystatic (/keystatic) y su API corren en el servidor.
export default defineConfig({
  site: 'https://www.alanmarino.com',
  integrations: [react(), markdoc(), keystatic()],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
