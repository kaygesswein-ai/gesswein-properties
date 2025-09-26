// project/lib/featured.ts

// Mantengo la firma como FUNCIÓN (lo esperan tus páginas)
export function featuredApiPath(_fallback?: string): string {
  return '/api/featured';
}

export type Property = {
  id: string;
  titulo: string;
  comuna: string;
  region: string;
  operacion: 'Venta' | 'Arriendo';
  tipo: 'Casa' | 'Departamento' | 'Oficina' | 'Bodega' | 'Local comercial' | 'Terreno';
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios: number;
  banos: number;
  superficie_util_m2: number;
  superficie_terreno_m2?: number | null;
  estacionamientos?: number | null;
  coverImage: string;
  destacada?: boolean;
};

/** ====== Destacadas (portada) ====== */
const FEATURED: Property[] = [
  {
    id: 'vitacura-depto-01',
    titulo: 'Depto luminoso en Vitacura',
    comuna: 'Vitacura',
    region: 'Metropolitana de Santiago',
    operacion: 'Venta',
    tipo: 'Departamento',
    precio_uf: 10500,
    precio_clp: null,
    dormitorios: 2,
    banos: 2,
    superficie_util_m2: 78,
    superficie_terreno_m2: null,
    estacionamientos: 1,
    // Foto que ya te gustaba (estética de “depto luminoso”)
    coverImage:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
    destacada: true,
  },
  {
    id: 'lo-barnechea-casa-01',
    titulo: 'Casa familiar en Lo Barnechea',
    comuna: 'Lo Barnechea',
    region: 'Metropolitana de Santiago',
    operacion: 'Venta',
    tipo: 'Casa',
    precio_uf: 23000,
    precio_clp: 908169950,
    dormitorios: 4,
    banos: 3,
    superficie_util_m2: 180,
    superficie_terreno_m2: null,
    estacionamientos: 2,
    // Foto que ya te gustaba para “casa familiar”
    coverImage:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop',
    destacada: true,
  },
  {
    id: 'providencia-oficina-01',
    titulo: 'Oficina en Providencia',
    comuna: 'Providencia',
    region: 'Metropolitana de Santiago',
    operacion: 'Arriendo',
    tipo: 'Oficina',
    // Precio ficticio solicitado
    precio_uf: 4000,
    precio_clp: null,
    dormitorios: 0,
    banos: 1,
    superficie_util_m2: 55,
    superficie_terreno_m2: null,
    estacionamientos: 2,
    // Foto de interior de oficina (Unsplash, libre de uso) — SIN fallback
    coverImage:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop',
    destacada: true,
  },
];

/** ====== 30 publicaciones adicionales (no destacadas) ====== */
function makeId(prefix: string, n: number) {
  return `${prefix}-${String(n).padStart(2, '0')}`;
}

const EXTRA: Property[] = (() => {
  const tipos: Property['tipo'][] = [
    'Casa',
    'Departamento',
    'Oficina',
    'Bodega',
    'Local comercial',
    'Terreno',
  ];
  const comunas = [
    'Las Condes',
    'Providencia',
    'Vitacura',
    'Lo Barnechea',
    'Ñuñoa',
    'Santiago',
    'La Reina',
    'Huechuraba',
    'Maipú',
    'Puente Alto',
    'Colina',
    'Lampa',
  ];

  // Banco de imágenes neutras (arquitectura/interior) para publicaciones NO destacadas
  const imgs = [
    'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8b?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8b?q=80&w=1600&auto=format&fit=crop',
  ];

  const arr: Property[] = [];
  for (let i = 1; i <= 30; i++) {
    const tipo = tipos[i % tipos.length];
    const comuna = comunas[i % comunas.length];
    const operacion: Property['operacion'] = i % 5 === 0 ? 'Arriendo' : 'Venta';

    // Lógica de atributos según tipo
    const dormitorios =
      tipo === 'Oficina' || tipo === 'Bodega' || tipo === 'Local comercial' || tipo === 'Terreno'
        ? 0
        : 1 + (i % 4);
    const banos =
      tipo === 'Terreno' ? 0 : 1 + (i % 3);
    const m2 = 45 + ((i * 7) % 160);

    const precioUF =
      tipo === 'Terreno'
        ? 3500 + ((i * 70) % 6000)
        : tipo === 'Oficina'
        ? 2500 + ((i * 40) % 3500)
        : 4500 + ((i * 120) % 22000);

    arr.push({
      id: makeId('pub', i),
      titulo:
        tipo === 'Casa'
          ? `Casa en ${comuna}`
          : tipo === 'Departamento'
          ? `Departamento en ${comuna}`
          : tipo === 'Terreno'
          ? `Terreno en ${comuna}`
          : `${tipo} en ${comuna}`,
      comuna,
      region: 'Metropolitana de Santiago',
      operacion,
      tipo,
      precio_uf: precioUF,
      precio_clp: null,
      dormitorios,
      banos,
      superficie_util_m2: m2,
      superficie_terreno_m2: tipo === 'Terreno' ? m2 * 5 : null,
      coverImage: imgs[i % imgs.length],
      destacada: false,
    });
  }
  return arr;
})();

/** ====== API simple en memoria ====== */
const ALL: Property[] = [...FEATURED, ...EXTRA];

export async function getFeaturedProperties(): Promise<Property[]> {
  return FEATURED;
}

export async function getAllProperties(): Promise<Property[]> {
  return ALL;
}
