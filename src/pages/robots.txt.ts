import type { APIRoute } from 'astro';

// robots.txt generado con el dominio del sitio; deja afuera el CMS y las vistas internas.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('/sitemap-index.xml', site).href;
  return new Response(
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
};
