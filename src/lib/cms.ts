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
export async function getProyectos() {
  return (await reader.collections.proyectos.all())
    .filter((p) => p.entry.publicado)
    .sort(byOrden);
}
