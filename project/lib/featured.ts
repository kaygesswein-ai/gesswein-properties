// project/lib/featured.ts
export type FeaturedProp = {
  id: string;
  titulo: string;
  comuna: string;
  operacion: 'venta' | 'arriendo';
  tipo: 'Casa' | 'Departamento' | 'Oficina';
  precio_uf: number;
  precio_clp?: number | null;
  dormitorios: number | null;
  banos: number | null;
  superficie_util_m2: number | null;
  estacionamientos?: number | null;
  coverImage: string;
  destacada: true;
};

export const featuredApiPath = '/api/featured';

/** Las 3 destacadas — mismas fotos/“look & feel” de tus capturas */
export const featuredItems: FeaturedProp[] = [
  {
    id: 'feat-depto-vitacura',
    titulo: 'Depto luminoso en Vitacura',
    comuna: 'Vitacura',
    operacion: 'venta',
    tipo: 'Departamento',
    precio_uf: 10500,
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
    operacion: 'venta',
    tipo: 'Casa',
    precio_uf: 23000,
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
    operacion: 'arriendo',
    tipo: 'Oficina',
    // precio ficticio a pedido: 4.000 UF
    precio_uf: 4000,
    dormitorios: 0,
    banos: 1,
    superficie_util_m2: 55,
    estacionamientos: 2,
    coverImage:
      'https://images.unsplash.com/photo-1517502166878-35c93a0072bb?q=80&w=1600&auto=format&fit=crop',
    destacada: true,
  },
];
