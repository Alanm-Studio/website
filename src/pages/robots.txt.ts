import type { APIRoute } from 'astro';

// robots.txt generado con el dominio del sitio; deja afuera el CMS y sus rutas internas.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('/sitemap-index.xml', site).href;
  const body = ['User-agent: *', 'Allow: /', 'Disallow: /keystatic', 'Disallow: /api/', '', `Sitemap: ${sitemap}`, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
