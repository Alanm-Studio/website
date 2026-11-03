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
