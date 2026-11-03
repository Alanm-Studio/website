// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Dominio principal (www). Cambiarlo acá si el sitio pasa a otro dominio.
const SITE = 'https://www.alanmarino.com';

// Sitio estático; solo el panel de Keystatic (/keystatic) y su API corren en el servidor.
export default defineConfig({
  site: SITE,
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({
      // Fuera del sitemap: vistas internas y el panel del CMS.
      filter: (page) => !/\/(borrador|keystatic)(\/|$)/.test(page),
    }),
  ],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
