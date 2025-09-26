// project/lib/featured.ts

export type FeaturedProperty = {
  id: string;
  titulo: string;
  comuna: string;
  operacion: 'venta' | 'arriendo';
  tipo: string;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  superficie_util_m2?: number | null;
  coverImage?: string;
  destacada: boolean;
};

// Utilidad opcional para construir URLs absolutas si tienes NEXT_PUBLIC_SITE_URL.
// Si no está definida, simplemente retorna el path recibido sin modificar.
export const featuredApiPath = (path = ''): string => {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || '';
  if (!base) return path || '';
  const p = path?.startsWith('/') ? path : `/${path || ''}`;
  return `${base}${p}`;
};

// === 3 destacadas (fuente única de verdad) ===
// Mantén aquí las imágenes/títulos que te gustaban.
// SOLO actualicé la imagen de la oficina a una foto interior pertinente.
export const featured: FeaturedProperty[] = [
  {
    id: 'oficina-providencia',
    titulo: 'Oficina en Providencia',
    comuna: 'Providencia',
    operacion: 'Arriendo',
    tipo: 'Oficina',
    precio_uf: 4000,           // precio solicitado
    dormitorios: 0,
    banos: 1,
    superficie_util_m2: 55,
    // Foto interior de oficina (Unsplash, libre de uso)
    coverImage:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop',
    destacada: true,
  },
  {
    id: 'casa-lo-barnechea',
    titulo: 'Casa familiar en Lo Barnechea',
    comuna: 'Lo Barnechea',
    operacion: 'Venta',
    tipo: 'Casa',
    precio_uf: 23000,
    dormitorios: 4,
    banos: 3,
    superficie_util_m2: 180,
    // misma estética que te gustaba
    coverImage:
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=2000&auto=format&fit=crop',
    destacada: true,
  },
  {
    id: 'depto-vitacura',
    titulo: 'Depto luminoso en Vitacura',
    comuna: 'Vitacura',
    operacion: 'Venta',
    tipo: 'Departamento',
    precio_uf: 10500,
    dormitorios: 2,
    banos: 2,
    superficie_util_m2: 78,
    // misma estética que te gustaba
    coverImage:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2000&auto=format&fit=crop',
    destacada: true,
  },
];

// Helper por si algún lugar quiere leer la lista
export const getFeatured = () => featured;
export default featured;
