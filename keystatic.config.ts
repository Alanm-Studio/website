import { config, collection, singleton, fields } from '@keystatic/core';

// En tu compu (npm run dev) el contenido se edita en archivos locales.
// En producción se edita desde Keystatic Cloud y cada cambio queda como commit en GitHub.
const storage = import.meta.env.DEV
  ? ({ kind: 'local' } as const)
  : ({ kind: 'cloud' } as const);

const SERVICIOS = [
  { label: 'Marketing', value: 'marketing' },
  { label: 'Marca', value: 'marca' },
  { label: 'Sistema visual', value: 'sistema-visual' },
  { label: 'Editorial', value: 'editorial' },
  { label: 'Web', value: 'web' },
];

const imagen = (label: string, carpeta: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: `public/images/${carpeta}`,
    publicPath: `/images/${carpeta}/`,
  });


// Campos de SEO reutilizables (título y descripción para Google y redes, imagen para compartir).
const seo = (carpeta: string) =>
  fields.object(
    {
      titulo: fields.text({ label: 'Título para Google', description: 'Ideal: hasta 60 caracteres. Si queda vacío, se usa el título de la página.', validation: { length: { max: 70 } } }),
      descripcion: fields.text({ label: 'Descripción para Google', description: 'Ideal: entre 120 y 160 caracteres.', multiline: true, validation: { length: { max: 180 } } }),
      imagen: fields.image({ label: 'Imagen para compartir (1200 × 630)', description: 'La que aparece al compartir el link en WhatsApp, LinkedIn, etc.', directory: `public/images/${carpeta}`, publicPath: `/images/${carpeta}/` }),
      noindex: fields.checkbox({ label: 'Ocultar de Google', defaultValue: false }),
    },
    { label: 'SEO' }
  );

// Mismo formulario para los proyectos de cada servicio.
const proyectoSchema = () => ({
        titulo: fields.slug({ name: { label: 'Título' } }),
        publicado: fields.checkbox({ label: 'Publicado', description: 'Si está apagado, el proyecto no aparece en el sitio.', defaultValue: false }),
        destacado: fields.checkbox({ label: 'Destacado en Inicio', defaultValue: false }),
        orden: fields.integer({ label: 'Orden', description: 'Menor número = aparece primero.', defaultValue: 100 }),
        cliente: fields.text({ label: 'Cliente' }),
        anio: fields.integer({ label: 'Año' }),
        otrosServicios: fields.multiselect({ label: 'También aparece en', description: 'Otros servicios que se trabajaron en este proyecto (además de esta sección).', options: SERVICIOS }),
        descripcionCorta: fields.text({ label: 'Descripción corta', description: 'Una línea para las tarjetas (ej.: Sistema visual y piezas gráficas). Máx. 80 caracteres.', validation: { length: { max: 80 } } }),
        bajada: fields.text({ label: 'Bajada', description: 'El desafío en una frase.', multiline: true }),
        equipo: fields.text({ label: 'Equipo que participó' }),
        portada: imagen('Portada (horizontal)', 'proyectos'),
        miniatura: imagen('Miniatura (vertical, para tarjetas)', 'proyectos'),
        logo: imagen('Logo del cliente (opcional)', 'proyectos'),
        galeria: fields.array(
          fields.object({
            imagen: imagen('Imagen', 'proyectos'),
            alt: fields.text({ label: 'Texto alternativo', description: 'Qué se ve en la imagen, para lectores de pantalla.' }),
            formato: fields.select({
              label: 'Formato',
              options: [
                { label: 'Vertical', value: 'vertical' },
                { label: 'Horizontal', value: 'horizontal' },
                { label: 'Cuadrado', value: 'cuadrado' },
                { label: 'Completa (ancho total, sin recorte)', value: 'completo' },
              ],
              defaultValue: 'vertical',
            }),
          }),
          { label: 'Galería', itemLabel: (p) => p.fields.alt.value || 'Imagen' }
        ),
        video: fields.url({ label: 'Video (YouTube, Vimeo o reel de Instagram, opcional)' }),
        reels: fields.array(
          fields.object({
            titulo: fields.text({ label: 'Título del reel' }),
            portada: imagen('Portada (vertical 4:5)', 'proyectos'),
            link: fields.url({ label: 'Link al reel (Instagram)' }),
          }),
          { label: 'Reels (slider, mismo formato que el de Inicio)', itemLabel: (p) => p.fields.titulo.value || 'Reel' }
        ),
        presentacion: fields.url({ label: 'Presentación completa (PDF, opcional)' }),
        seo: seo('proyectos'),
        contenido: fields.markdoc({ label: 'Descripción del proyecto' }),
});

const proyectosDe = (servicio: string, label: string) =>
  collection({
    label,
    slugField: 'titulo',
    path: `src/content/proyectos/${servicio}/*`,
    format: { contentField: 'contenido' },
    entryLayout: 'content',
    columns: ['titulo', 'cliente', 'anio'],
    schema: proyectoSchema(),
  });

export default config({
  storage,
  cloud: { project: 'aleagui/alanm-studio' },
  ui: {
    brand: { name: 'Alan Marino Studio' },
    navigation: {
      Proyectos: ['proyectosMarketing', 'proyectosMarca', 'proyectosSistemaVisual', 'proyectosEditorial', 'proyectosWeb'],
      Contenido: ['servicios', 'equipo', 'marcas', 'historias'],
      Sitio: ['inicio', 'ajustes'],
    },
  },

  collections: {
    // Proyectos divididos por servicio, en el mismo orden que la home.
    proyectosMarketing: proyectosDe('marketing', '01 · Marketing'),
    proyectosMarca: proyectosDe('marca', '02 · Marca'),
    proyectosSistemaVisual: proyectosDe('sistema-visual', '03 · Sistema visual'),
    proyectosEditorial: proyectosDe('editorial', '04 · Editorial'),
    proyectosWeb: proyectosDe('web', '05 · Web'),

    historias: collection({
      label: 'Historias de Instagram',
      slugField: 'titulo',
      path: 'src/content/historias/*',
      format: 'yaml',
      columns: ['titulo', 'fecha'],
      schema: {
        titulo: fields.slug({ name: { label: 'Título interno', description: 'Solo para encontrarla en el panel.' } }),
        publicado: fields.checkbox({ label: 'Publicada', defaultValue: true }),
        fecha: fields.date({ label: 'Fecha' }),
        tipo: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Reel', value: 'reel' },
            { label: 'Post', value: 'post' },
            { label: 'Historia destacada', value: 'historia' },
          ],
          defaultValue: 'reel',
        }),
        portada: imagen('Portada vertical (9:16)', 'historias'),
        alt: fields.text({ label: 'Texto alternativo de la portada' }),
        texto: fields.text({ label: 'Texto (se muestran las primeras líneas)', multiline: true }),
        link: fields.url({ label: 'Link a Instagram', validation: { isRequired: true } }),
      },
    }),

    servicios: collection({
      label: 'Servicios',
      slugField: 'titulo',
      path: 'src/content/servicios/*',
      format: 'yaml',
      columns: ['titulo', 'orden'],
      schema: {
        titulo: fields.slug({ name: { label: 'Título' } }),
        orden: fields.integer({ label: 'Orden', defaultValue: 1 }),
        bajada: fields.text({ label: 'Bajada', description: 'Va entre corchetes, ej.: Donde todo comienza.' }),
        lema: fields.text({ label: 'Lema en Proyectos', description: 'Título de la sección del servicio en Proyectos, ej.: Marca en acción.' }),
        items: fields.array(fields.text({ label: 'Ítem' }), { label: 'Qué incluye', itemLabel: (p) => p.value }),
        descripcion: fields.text({ label: 'Descripción', multiline: true }),
        seo: seo('servicios'),
      },
    }),

    equipo: collection({
      label: 'Equipo',
      slugField: 'nombre',
      path: 'src/content/equipo/*',
      format: 'yaml',
      columns: ['nombre', 'rol'],
      schema: {
        nombre: fields.slug({ name: { label: 'Nombre' } }),
        orden: fields.integer({ label: 'Orden', defaultValue: 1 }),
        rol: fields.text({ label: 'Rol y formación' }),
        frase: fields.text({ label: 'Frase' }),
        bio: fields.text({ label: 'Bio', multiline: true }),
        foto: imagen('Retrato (vertical)', 'equipo'),
      },
    }),

    marcas: collection({
      label: 'Marcas (marquee)',
      slugField: 'nombre',
      path: 'src/content/marcas/*',
      format: 'yaml',
      schema: {
        nombre: fields.slug({ name: { label: 'Nombre' } }),
        orden: fields.integer({ label: 'Orden', defaultValue: 1 }),
        logo: imagen('Logo en blanco (PNG o SVG con fondo transparente)', 'marcas'),
      },
    }),
  },

  singletons: {
    inicio: singleton({
      label: 'Inicio',
      path: 'src/content/inicio',
      format: 'yaml',
      schema: {
        etiqueta: fields.text({ label: 'Etiqueta sobre el título', defaultValue: 'Branding · Diseño web · Comunicación' }),
        titulo: fields.text({ label: 'Título principal', defaultValue: 'Un pequeño estudio, con grandes ideas.' }),
        intro: fields.text({ label: 'Texto de introducción', multiline: true }),
        serviciosTitulo: fields.text({ label: 'Título de la sección Servicios' }),
        serviciosIntro: fields.text({ label: 'Texto de la sección Servicios', multiline: true }),
        seo: seo('seo'),
      },
    }),
    ajustes: singleton({
      label: 'Ajustes generales',
      path: 'src/content/ajustes',
      format: 'yaml',
      schema: {
        email: fields.text({ label: 'Email del estudio' }),
        whatsapp: fields.text({ label: 'WhatsApp', description: 'Con código de país, ej.: 5492392000000' }),
        ubicacion: fields.text({ label: 'Ubicación', defaultValue: 'Trenque Lauquen, Buenos Aires' }),
        instagram: fields.url({ label: 'Instagram' }),
        behance: fields.url({ label: 'Behance' }),
        linkedin: fields.url({ label: 'LinkedIn' }),
        seoSitio: fields.object(
          {
            nombre: fields.text({ label: 'Nombre del sitio', defaultValue: 'Alan Marino Studio' }),
            descripcion: fields.text({ label: 'Descripción por defecto', multiline: true, defaultValue: 'Estudio de branding, diseño web y comunicación para marcas en crecimiento. Trenque Lauquen, Buenos Aires.' }),
            imagen: fields.image({ label: 'Imagen para compartir por defecto (1200 × 630)', directory: 'public/images/seo', publicPath: '/images/seo/' }),
            googleVerificacion: fields.text({ label: 'Código de verificación de Google Search Console', description: 'Solo el valor de content="…" de la etiqueta meta.' }),
          },
          { label: 'SEO del sitio' }
        ),
        muyPronto: fields.checkbox({ label: 'Mostrar página "Muy pronto"', description: 'Mientras esté prendido, la portada muestra la página temporal.', defaultValue: true }),
      },
    }),
  },
});
