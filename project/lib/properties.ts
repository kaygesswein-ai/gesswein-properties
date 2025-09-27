export type Property = {
  id: string;
  titulo?: string;
  comuna?: string;
  region?: string;
  operacion?: 'venta' | 'arriendo';
  tipo?: string;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  superficie_util_m2?: number | null;
  superficie_terreno_m2?: number | null;
  estacionamientos?: number | null;
  coverImage?: string;
  destacada?: boolean;
};

function slugify(s: string) {
  return s.toLowerCase()
    .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e').replace(/[íìï]/g, 'i')
    .replace(/[óòö]/g, 'o').replace(/[úùü]/g, 'u').replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
const idFrom = (t: string) => slugify(t) || Math.random().toString(36).slice(2);
const DEFAULT_IMG =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200';

export const PROPERTIES: Property[] = [
  {
    id: idFrom('Maravillosa casa remodelada, jardín naturalista, Los Dominicos Antiguo (GDS)'),
    titulo: 'Maravillosa casa remodelada, jardín naturalista, Los Dominicos Antiguo (GDS)',
    comuna: 'Las Condes',
    operacion: 'venta',
    tipo: 'Casa',
    precio_uf: 26000,
    dormitorios: 6,
    banos: 5,
    superficie_util_m2: 200,
    superficie_terreno_m2: 805,
    estacionamientos: 2,
    coverImage: DEFAULT_IMG,
    destacada: true,
  },
  {
    id: idFrom('Casa en Venta con árboles grandes, Los Dominicos Antiguo (IA)'),
    titulo: 'Casa en Venta con árboles grandes, Los Dominicos Antiguo (IA)',
    comuna: 'Las Condes',
    operacion: 'venta',
    tipo: 'Casa',
    precio_uf: 27350,
    dormitorios: 5,
    banos: 4,
    superficie_util_m2: 270,
    superficie_terreno_m2: 1563,
    estacionamientos: 6,
    coverImage: DEFAULT_IMG,
    destacada: true,
  },
  {
    id: idFrom('Casa remodelar Los Dominicos Antiguo (IA M)'),
    titulo: 'Casa para remodelar, Los Dominicos Antiguo (IA M)',
    comuna: 'Las Condes',
    operacion: 'venta',
    tipo: 'Casa',
    precio_uf: 26500,
    dormitorios: 5,
    banos: 3,
    superficie_util_m2: 200,
    superficie_terreno_m2: 1515,
    estacionamientos: 6,
    coverImage: DEFAULT_IMG,
    destacada: true,
  },

  {
    id: idFrom('Terreno en Venta, árboles grandes, Los Dominicos Antiguo (IA M)'),
    titulo: 'Terreno en Venta, árboles grandes, Los Dominicos Antiguo (IA M)',
    comuna: 'Las Condes',
    operacion: 'venta',
    tipo: 'Terreno',
    precio_uf: 53850,
    superficie_terreno_m2: 3070,
    coverImage: DEFAULT_IMG,
  },
  {
    id: idFrom('Terreno en Venta, derechos de agua, Los Dominicos Antiguo (CD)'),
    titulo: 'Terreno en Venta, derechos de agua, Los Dominicos Antiguo (CD)',
    comuna: 'Las Condes',
    operacion: 'venta',
    tipo: 'Terreno',
    precio_uf: 49950,
    superficie_terreno_m2: 2780,
    coverImage: DEFAULT_IMG,
  },
  {
    id: idFrom('Excelente Casa en Venta con vista fenomenal, Lo Barnechea'),
    titulo: 'Excelente Casa en Venta con vista fenomenal, Lo Barnechea',
    comuna: 'Lo Barnechea',
    operacion: 'venta',
    tipo: 'Casa',
    precio_uf: 45000,
    dormitorios: 6,
    banos: 4,
    superficie_util_m2: 527,
    superficie_terreno_m2: 1090,
    estacionamientos: 5,
    coverImage: DEFAULT_IMG,
  },
  {
    id: idFrom('Casa en Venta, bien mantenida, Condominio seguro Reina Alta'),
    titulo: 'Casa bien mantenida, condominio seguro, La Reina Alta',
    comuna: 'La Reina',
    operacion: 'venta',
    tipo: 'Casa',
    precio_uf: 13950,
    dormitorios: 6,
    banos: 4,
    superficie_util_m2: 162,
    superficie_terreno_m2: 330,
    estacionamientos: 2,
    coverImage: DEFAULT_IMG,
  },
  {
    id: idFrom('Casa mediterránea en Venta, calle segura, La Reina Alta (RR)'),
    titulo: 'Casa mediterránea, calle segura, La Reina Alta (RR)',
    comuna: 'La Reina',
    operacion: 'venta',
    tipo: 'Casa',
    precio_uf: 29000,
    dormitorios: 5,
    banos: 4,
    superficie_util_m2: 324,
    superficie_terreno_m2: 1105,
    estacionamientos: 4,
    coverImage: DEFAULT_IMG,
  },
  {
    id: idFrom('Casa en Venta cerca Sector Sport Francés y colegios'),
    titulo: 'Casa en Venta cerca Sector Sport Francés y colegios',
    comuna: 'Vitacura',
    operacion: 'venta',
    tipo: 'Casa',
    precio_uf: 12600,
    dormitorios: 4,
    banos: 2,
    superficie_util_m2: 100,
    superficie_terreno_m2: 286,
    estacionamientos: 2,
    coverImage: DEFAULT_IMG,
  },
  {
    id: idFrom('Casa nueva en Venta Proyecto Townhouses'),
    titulo: 'Casa nueva en Venta · Proyecto Townhouses',
    comuna: 'Las Condes',
    operacion: 'venta',
    tipo: 'Casa en construcción',
    precio_uf: 14900,
    dormitorios: 3,
    banos: 3,
    superficie_util_m2: 139,
    superficie_terreno_m2: 150,
    estacionamientos: 2,
    coverImage: DEFAULT_IMG,
  },
  {
    id: idFrom('Departamento en Venta, vista despejada, Manquehue Sur'),
    titulo: 'Departamento en Venta, vista despejada, Manquehue Sur',
    comuna: 'Las Condes',
    operacion: 'venta',
    tipo: 'Departamento',
    precio_uf: 10500,
    dormitorios: 4,
    banos: 3,
    superficie_util_m2: 150,
    estacionamientos: 2,
    coverImage: DEFAULT_IMG,
  },
  {
    id: idFrom('Casa borde mar en Venta El Rosario de Tunquén'),
    titulo: 'Casa borde mar en Venta · El Rosario de Tunquén',
    comuna: 'Tunquén',
    operacion: 'venta',
    tipo: 'Casa',
    precio_uf: 21000,
    dormitorios: 5,
    banos: 3,
    superficie_util_m2: 312,
    superficie_terreno_m2: 5000,
    estacionamientos: 10,
    coverImage: DEFAULT_IMG,
  },
  {
    id: idFrom('Sitio bajada playa en Venta El Rosario de Tunquén'),
    titulo: 'Sitio bajada playa en Venta · El Rosario de Tunquén',
    comuna: 'Tunquén',
    operacion: 'venta',
    tipo: 'Sitio',
    precio_uf: 11000,
    superficie_terreno_m2: 6080,
    coverImage: DEFAULT_IMG,
  },
];
