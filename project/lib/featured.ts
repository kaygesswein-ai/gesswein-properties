// project/lib/featured.ts

// Camino único para que Inicio y el API lean las destacadas
export function featuredApiPath(_?: string): string {
  return '/api/featured';
}

export type Prop = {
  id: string;
  titulo: string;
  comuna: string;
  region: string;
  operacion: 'venta' | 'arriendo';
  tipo: 'Casa' | 'Departamento' | 'Oficina' | 'Bodega' | 'Local comercial' | 'Terreno';
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  superficie_util_m2?: number | null;
  superficie_terreno_m2?: number | null;
  estacionamientos?: number | null;
  coverImage: string;
  destacada?: boolean;
};

// Las 3 destacadas (nota: operacion en minúscula para evitar TS)
export const featuredItems: Prop[] = [
  {
    id: 'feat-depto-vitacura',
    titulo: 'Depto luminoso en Vitacura',
    comuna: 'Vitacura',
    region: 'Metropolitana de Santiago',
    operacion: 'venta',
    tipo: 'Departamento',
    precio_uf: 10500,
    precio_clp: null,
    dormitorios: 2,
    banos: 2,
    superficie_util_m2: 78,
    estacionamientos: 1,
    coverImage:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
    destacada: true,
  },
  {
    id: 'feat-casa-lobarnechea',
    titulo: 'Casa familiar en Lo Barnechea',
    comuna: 'Lo Barnechea',
    region: 'Metropolitana de Santiago',
    operacion: 'venta',
    tipo: 'Casa',
    precio_uf: 23000,
    precio_clp: 908169950,
    dormitorios: 4,
    banos: 3,
    superficie_util_m2: 180,
    estacionamientos: 2,
    coverImage:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop',
    destacada: true,
  },
  {
    id: 'feat-oficina-providencia',
    titulo: 'Oficina en Providencia',
    comuna: 'Providencia',
    region: 'Metropolitana de Santiago',
    operacion: 'arriendo',
    tipo: 'Oficina',
    precio_uf: 4000,
    precio_clp: null,
    dormitorios: 0,
    banos: 1,
    superficie_util_m2: 55,
    estacionamientos: 2,
    // interior de oficina (para que no aparezca gris)
    coverImage:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop',
    destacada: true,
  },
];

// Export por defecto opcional (no lo usa nada, pero no molesta)
export default { featuredApiPath, featuredItems };
