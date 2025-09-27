// Fuente única de propiedades para toda la app
// Reemplaza COMPLETO este archivo.

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
  superficie_util_m2?: number | null;      // construidos/útiles
  superficie_terreno_m2?: number | null;   // terrenos
  estacionamientos?: number | null;
  coverImage?: string;
  images?: string[];
  destacada?: boolean;
};

// Helper para placeholder de imagen bonita si no hay foto aún
const PH = (w = 1600, h = 1066) =>
  `https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}`;

export const PROPERTIES: Property[] = [
  /* === DESTACADAS (primeras 3) === */
  {
    id: 'los-dominicos-remodelada-gds',
    titulo: 'Maravillosa casa remodelada, jardín naturalista, Los Dominicos Antiguo (GDS)',
    comuna: 'Las Condes',
    region: 'Metropolitana de Santiago',
    tipo: 'Casa',
    operacion: 'venta',
    precio_uf: 26000,
    dormitorios: 6, banos: 5, estacionamientos: 2,
    superficie_util_m2: 200,
    superficie_terreno_m2: 805,
    coverImage: PH(),
    destacada: true,
  },
  {
    id: 'los-dominicos-arboles-ia',
    titulo: 'Casa en Venta con árboles grandes, Los Dominicos Antiguo (IA)',
    comuna: 'Las Condes',
    region: 'Metropolitana de Santiago',
    tipo: 'Casa',
    operacion: 'venta',
    precio_uf: 27350,
    dormitorios: 5, banos: 4, estacionamientos: 6,
    superficie_util_m2: 270,
    superficie_terreno_m2: 1563,
    coverImage: PH(),
    destacada: true,
  },
  {
    id: 'los-dominicos-remodelar-ia-m',
    titulo: 'Casa para remodelar, Los Dominicos Antiguo (IA M)',
    comuna: 'Las Condes',
    region: 'Metropolitana de Santiago',
    tipo: 'Casa',
    operacion: 'venta',
    precio_uf: 26500,
    dormitorios: 5, banos: 3, estacionamientos: 6,
    superficie_util_m2: 200,
    superficie_terreno_m2: 1515,
    coverImage: PH(),
    destacada: true,
  },

  /* === Restantes del portafolio que nos pasaste === */
  {
    id: 'los-dominicos-terreno-ia-m',
    titulo: 'Terreno en Venta, árboles grandes, Los Dominicos Antiguo (IA M)',
    comuna: 'Las Condes',
    region: 'Metropolitana de Santiago',
    tipo: 'Terreno',
    operacion: 'venta',
    precio_uf: 53850,
    dormitorios: null, banos: null, estacionamientos: null,
    superficie_terreno_m2: 3070,
    coverImage: PH(),
  },
  {
    id: 'los-dominicos-agua-cd',
    titulo: 'Terreno en Venta, derechos de agua, Los Dominicos Antiguo (CD)',
    comuna: 'Las Condes',
    region: 'Metropolitana de Santiago',
    tipo: 'Terreno',
    operacion: 'venta',
    precio_uf: 49950,
    superficie_terreno_m2: 2780,
    coverImage: PH(),
  },
  {
    id: 'lo-barnechea-vista-fenomenal',
    titulo: 'Excelente Casa en Venta con vista fenomenal, Lo Barnechea',
    comuna: 'Lo Barnechea',
    region: 'Metropolitana de Santiago',
    tipo: 'Casa',
    operacion: 'venta',
    precio_uf: 45000,
    dormitorios: 6, banos: 4, estacionamientos: 5,
    superficie_util_m2: 527,
    superficie_terreno_m2: 1090,
    coverImage: PH(),
  },
  {
    id: 'la-reina-alta-condominio-seguro',
    titulo: 'Casa bien mantenida, condominio seguro, La Reina Alta',
    comuna: 'La Reina',
    region: 'Metropolitana de Santiago',
    tipo: 'Casa',
    operacion: 'venta',
    precio_uf: 13950,
    dormitorios: 6, banos: 4, estacionamientos: 2,
    superficie_util_m2: 162,
    superficie_terreno_m2: 330,
    coverImage: PH(),
  },
  {
    id: 'la-reina-alta-mediterranea-rr',
    titulo: 'Casa mediterránea, calle segura, La Reina Alta (RR)',
    comuna: 'La Reina',
    region: 'Metropolitana de Santiago',
    tipo: 'Casa',
    operacion: 'venta',
    precio_uf: 29000,
    dormitorios: 4, banos: 4, estacionamientos: 4,
    superficie_util_m2: 324,
    superficie_terreno_m2: 1105,
    coverImage: PH(),
  },
  {
    id: 'vitacura-sector-sport-frances',
    titulo: 'Casa en Venta cerca Sector Sport Francés y colegios',
    comuna: 'Vitacura',
    region: 'Metropolitana de Santiago',
    tipo: 'Casa',
    operacion: 'venta',
    precio_uf: 12600,
    dormitorios: 4, banos: 2, estacionamientos: 2,
    superficie_util_m2: 100,
    superficie_terreno_m2: 286,
    coverImage: PH(),
  },
  {
    id: 'las-condes-townhouses-nuevo',
    titulo: 'Casa nueva en Venta · Proyecto Townhouses',
    comuna: 'Las Condes',
    region: 'Metropolitana de Santiago',
    tipo: 'Casa',
    operacion: 'venta',
    precio_uf: 14900,
    dormitorios: 3, banos: 3, estacionamientos: 2,
    superficie_util_m2: 139,
    superficie_terreno_m2: 150,
    coverImage: PH(),
  },
  {
    id: 'las-condes-departamento-manquehue-sur',
    titulo: 'Departamento en Venta, vista despejada, Manquehue Sur',
    comuna: 'Las Condes',
    region: 'Metropolitana de Santiago',
    tipo: 'Departamento',
    operacion: 'venta',
    precio_uf: 10500,
    dormitorios: 4, banos: 3, estacionamientos: 2,
    superficie_util_m2: 150,
    coverImage: PH(),
  },
  {
    id: 'tunquen-casa-borde-mar',
    titulo: 'Casa borde mar en Venta · El Rosario de Tunquén',
    comuna: 'Tunquén',
    region: 'Valparaíso',
    tipo: 'Casa',
    operacion: 'venta',
    precio_uf: 21000,
    dormitorios: 5, banos: 3, estacionamientos: 10,
    superficie_util_m2: 312,
    superficie_terreno_m2: 5000,
    coverImage: PH(),
  },
  {
    id: 'tunquen-sitio-bajada-playa',
    titulo: 'Sitio bajada playa en Venta · El Rosario de Tunquén',
    comuna: 'Tunquén',
    region: 'Valparaíso',
    tipo: 'Sitio',
    operacion: 'venta',
    precio_uf: 11000,
    dormitorios: null, banos: null, estacionamientos: null,
    superficie_terreno_m2: 6080,
    coverImage: PH(),
  },
];
