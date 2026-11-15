import { reader } from './cms';

export type SeoInput = {
  titulo?: string | null;
  descripcion?: string | null;
  imagen?: string | null;
  noindex?: boolean | null;
};

export async function getAjustes() {
  return (await reader.singletons.ajustes.read()) ?? null;
}

/** Datos estructurados del estudio (schema.org), para Google. */
export async function organizationJsonLd(site: URL) {
  const a = await getAjustes();
  const servicios = (await reader.collections.servicios.all()).map((s) => s.entry.titulo);
  const sameAs = [a?.instagram, a?.behance, a?.linkedin].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': new URL('/#estudio', site).href,
    name: a?.seoSitio?.nombre || 'Alan Marino Studio',
    url: site.href,
    logo: new URL('/logo.png', site).href,
    image: new URL(a?.seoSitio?.imagen || '/og-default.png', site).href,
    description: a?.seoSitio?.descripcion || undefined,
    email: a?.email || undefined,
    telephone: a?.whatsapp ? `+${a.whatsapp.replace(/\D/g, '')}` : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Trenque Lauquen',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    // Zona que atiende el estudio: base en Trenque Lauquen, clientes del oeste bonaerense y de todo el país.
    areaServed: [
      ...['Trenque Lauquen', 'Pehuajó', '9 de Julio', 'Bolívar', 'Chivilcoy', 'Carlos Casares'].map((name) => ({ '@type': 'City', name })),
      { '@type': 'State', name: 'Provincia de Buenos Aires' },
      { '@type': 'Country', name: 'Argentina' },
    ],
    geo: { '@type': 'GeoCoordinates', latitude: -35.9705, longitude: -62.7339 },
    priceRange: '$$',
    founder: { '@type': 'Person', name: 'Alan Marino', jobTitle: 'Diseñador gráfico' },
    knowsAbout: servicios,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function websiteJsonLd(site: URL, nombre: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': new URL('/#sitio', site).href,
    url: site.href,
    name: nombre,
    inLanguage: 'es-AR',
    publisher: { '@id': new URL('/#estudio', site).href },
  };
}

export function breadcrumbJsonLd(site: URL, items: { nombre: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.nombre,
      item: new URL(it.path, site).href,
    })),
  };
}
