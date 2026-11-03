import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

// Lee el contenido que se edita en Keystatic (archivos del repo) al momento del build.
export const reader = createReader(process.cwd(), keystaticConfig);

const byOrden = <T extends { entry: { orden: number | null } }>(a: T, b: T) =>
  (a.entry.orden ?? 999) - (b.entry.orden ?? 999);

export async function getServicios() {
  return (await reader.collections.servicios.all()).sort(byOrden);
}
export async function getEquipo() {
  return (await reader.collections.equipo.all()).sort(byOrden);
}
export async function getMarcas() {
  return (await reader.collections.marcas.all()).sort(byOrden);
}
// Proyectos: una colección por servicio (mismo orden que la home).
export const SERVICIOS_PROYECTOS = [
  { key: 'proyectosMarketing', servicio: 'marketing', titulo: 'Marketing' },
  { key: 'proyectosMarca', servicio: 'marca', titulo: 'Marca' },
  { key: 'proyectosSistemaVisual', servicio: 'sistema-visual', titulo: 'Sistema visual' },
  { key: 'proyectosEditorial', servicio: 'editorial', titulo: 'Editorial' },
  { key: 'proyectosWeb', servicio: 'web', titulo: 'Web' },
] as const;

/** Todos los proyectos publicados, cada uno con su servicio principal. */
export async function getProyectos() {
  const grupos = await Promise.all(
    SERVICIOS_PROYECTOS.map(async ({ key, servicio, titulo }) =>
      (await reader.collections[key].all()).map((p) => ({ ...p, servicio, servicioTitulo: titulo }))
    )
  );
  return grupos.flat().filter((p) => p.entry.publicado).sort(byOrden);
}

/** Proyectos publicados de un servicio (incluye los que lo marcan en "También aparece en"). */
export async function getProyectosDe(servicio: string) {
  return (await getProyectos()).filter(
    (p) => p.servicio === servicio || p.entry.otrosServicios.includes(servicio as never)
  );
}

export async function getHistorias() {
  return (await reader.collections.historias.all())
    .filter((h) => h.entry.publicado)
    .sort((a, b) => (b.entry.fecha ?? '').localeCompare(a.entry.fecha ?? ''));
}
