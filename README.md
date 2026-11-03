# Alan Marino Studio — sitio web

Sitio de alanmarino.com. Astro + Tailwind, con el contenido editable en Keystatic.

- **Deploy:** Vercel (cuenta de Alan). Cada push a `main` se publica en producción.
- **CMS:** Keystatic Cloud, proyecto `aleagui/alanm-studio`. Panel en `/keystatic`.

## Contenido editable

| En Keystatic | Archivos |
| --- | --- |
| Proyectos | `src/content/proyectos/*.mdoc` |
| Servicios | `src/content/servicios/*.yaml` |
| Equipo | `src/content/equipo/*.yaml` |
| Marcas (marquee) | `src/content/marcas/*.yaml` |
| Inicio | `src/content/inicio.yaml` |
| Ajustes generales | `src/content/ajustes.yaml` |

Las imágenes que se suben desde Keystatic quedan en `public/images/`.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:4321  ·  panel: http://localhost:4321/keystatic
```

En local, Keystatic guarda en los archivos de tu compu; en producción guarda con commits a GitHub a través de Keystatic Cloud.

## Páginas

- `/` — página temporal "Muy pronto".
- `/borrador` — vista interna (no indexada) que muestra el contenido cargado en Keystatic.

## Tokens de diseño

Los colores y tipografías de marca están en `src/styles/global.css` (`@theme`). Usar solo esos valores.

## SEO

- Cada página usa `src/layouts/Base.astro` → `src/components/Seo.astro`: título, descripción, canonical, Open Graph, Twitter card y datos estructurados (JSON-LD).
- Datos estructurados del estudio (`ProfessionalService` + `WebSite`) en `src/lib/seo.ts`; también hay helper de migas de pan (`BreadcrumbList`).
- `sitemap-index.xml` automático (`@astrojs/sitemap`), sin `/borrador` ni `/keystatic`.
- `robots.txt` generado en `src/pages/robots.txt.ts`.
- Desde Keystatic: **Ajustes generales › SEO del sitio** (nombre, descripción e imagen por defecto, verificación de Search Console) y un bloque **SEO** en cada proyecto y en Inicio.
- Imagen para compartir por defecto: `public/og-default.png` (1200 × 630). Íconos: `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192/512.png`.
