// /lib/cover.ts
export const HERO_FALLBACK =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';

export type FotoRow = {
  url: string;
  categoria?: string | null; // "exterior" | "interior" | "planos" | ...
  orden?: number | null;
};

export type PropertyForCover = {
  portada_url?: string | null;
  imagenes?: string[] | null; // si tu API devuelve un arreglo plano con urls
};

/**
 * Dada una propiedad (con portada_url/imagenes) y opcionalmente las fotos categorizadas
 * (por ejemplo en la ficha/id), devuelve SIEMPRE la mejor imagen de portada.
 */
export function getCoverUrl(
  prop?: PropertyForCover | null,
  fotos?: FotoRow[] | null
): string {
  // 1) Siempre respeta lo que fijas en Supabase:
  if (prop?.portada_url && String(prop.portada_url).trim().length > 0) {
    return prop.portada_url!;
  }

  // 2) Si nos pasaron fotos categorizadas, priorizamos "exterior" > "interior" > cualquiera
  if (Array.isArray(fotos) && fotos.length) {
    const lower = (s?: string | null) => (s ?? '').toLowerCase();
    const byOrden = (a: FotoRow, b: FotoRow) =>
      (a.orden ?? 9_999) - (b.orden ?? 9_999);

    const exts = fotos.filter(f => lower(f.categoria).includes('exterior')).sort(byOrden);
    const ints = fotos.filter(f => lower(f.categoria).includes('interior')).sort(byOrden);
    if (exts[0]?.url) return exts[0].url;
    if (ints[0]?.url) return ints[0].url;
    if (fotos[0]?.url)  return fotos.slice().sort(byOrden)[0].url;
  }

  // 3) Si tu API trae un arreglo plano de imágenes, usa la primera
  if (prop?.imagenes?.length) {
    return prop.imagenes[0]!;
  }

  // 4) Fallback
  return HERO_FALLBACK;
}
