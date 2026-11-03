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

export default config({
  storage,
  cloud: { project: 'aleagui/alanm-studio' },
  ui: {
    brand: { name: 'Alan Marino Studio' },
    navigation: {
      Contenido: ['proyectos', 'servicios', 'equipo', 'marcas'],
      Sitio: ['inicio', 'ajustes'],
    },
  },

  collections: {
    proyectos: collection({
      label: 'Proyectos',
      slugField: 'titulo',
      path: 'src/content/proyectos/*',
      format: { contentField: 'contenido' },
      entryLayout: 'content',
      columns: ['titulo', 'cliente', 'anio'],
      schema: {
        titulo: fields.slug({ name: { label: 'Título' } }),
        publicado: fields.checkbox({ label: 'Publicado', description: 'Si está apagado, el proyecto no aparece en el sitio.', defaultValue: false }),
        destacado: fields.checkbox({ label: 'Destacado en Inicio', defaultValue: false }),
        orden: fields.integer({ label: 'Orden', description: 'Menor número = aparece primero.', defaultValue: 100 }),
        cliente: fields.text({ label: 'Cliente' }),
        anio: fields.integer({ label: 'Año' }),
        servicios: fields.multiselect({ label: 'Servicios', options: SERVICIOS }),
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
              ],
              defaultValue: 'vertical',
            }),
          }),
          { label: 'Galería', itemLabel: (p) => p.fields.alt.value || 'Imagen' }
        ),
        video: fields.url({ label: 'Video (YouTube o Vimeo, opcional)' }),
        presentacion: fields.url({ label: 'Presentación completa (PDF, opcional)' }),
        contenido: fields.markdoc({ label: 'Descripción del proyecto' }),
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
        items: fields.array(fields.text({ label: 'Ítem' }), { label: 'Qué incluye', itemLabel: (p) => p.value }),
        descripcion: fields.text({ label: 'Descripción', multiline: true }),
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
        muyPronto: fields.checkbox({ label: 'Mostrar página "Muy pronto"', description: 'Mientras esté prendido, la portada muestra la página temporal.', defaultValue: true }),
      },
    }),
  },
});
