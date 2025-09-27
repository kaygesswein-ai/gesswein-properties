// lib/properties.ts

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
  createdAt?: string;
  destacada?: boolean;
};

// █ ÚNICA LISTA (solo tus propiedades actuales)
const PROPERTIES: Property[] = [
  { id: 'static-001', titulo: 'Maravillosa casa remodelada, jardín naturalista, Los Dominicos Antiguo (GDS)', comuna: 'Las Condes', region: 'Metropolitana de Santiago', operacion: 'venta', tipo: 'Casa', superficie_terreno_m2: 805, superficie_util_m2: 200, dormitorios: 6, banos: 5, estacionamientos: 2, precio_uf: 26000, destacada: true },
  { id: 'static-002', titulo: 'Casa en Venta con árboles grandes, Los Dominicos Antiguo (IA)', comuna: 'Las Condes', region: 'Metropolitana de Santiago', operacion: 'venta', tipo: 'Casa', superficie_terreno_m2: 1563, superficie_util_m2: 270, dormitorios: 5, banos: 4, estacionamientos: 6, precio_uf: 27350, destacada: true },
  { id: 'static-003', titulo: 'Casa para remodelar, Los Dominicos Antiguo (IA M)', comuna: 'Las Condes', region: 'Metropolitana de Santiago', operacion: 'venta', tipo: 'Casa', superficie_terreno_m2: 1515, superficie_util_m2: 200, dormitorios: 5, banos: 3, estacionamientos: 6, precio_uf: 26500, destacada: true },
  { id: 'static-004', titulo: 'Terreno en Venta, árboles grandes, Los Dominicos Antiguo (IA M)', comuna: 'Las Condes', region: 'Metropolitana de Santiago', operacion: 'venta', tipo: 'Terreno', superficie_terreno_m2: 3070, precio_uf: 53850 },
  { id: 'static-005', titulo: 'Terreno en Venta, derechos de agua, Los Dominicos Antiguo (CD)', comuna: 'Las Condes', region: 'Metropolitana de Santiago', operacion: 'venta', tipo: 'Terreno', superficie_terreno_m2: 2780, precio_uf: 49950 },
  { id: 'static-006', titulo: 'Excelente Casa con vista fenomenal, Lo Barnechea', comuna: 'Lo Barnechea', region: 'Metropolitana de Santiago', operacion: 'venta', tipo: 'Casa', superficie_terreno_m2: 1090, superficie_util_m2: 527, dormitorios: 6, banos: 4, estacionamientos: 5, precio_uf: 45000 },
  { id: 'static-007', titulo: 'Casa bien mantenida, condominio seguro, La Reina Alta', comuna: 'La Reina', region: 'Metropolitana de Santiago', operacion: 'venta', tipo: 'Casa', superficie_terreno_m2: 330, superficie_util_m2: 162, dormitorios: 6, banos: 4, estacionamientos: 2, precio_uf: 13950 },
  { id: 'static-008', titulo: 'Casa mediterránea, calle segura, La Reina Alta (RR)', comuna: 'La Reina', region: 'Metropolitana de Santiago', operacion: 'venta', tipo: 'Casa', superficie_terreno_m2: 1105, superficie_util_m2: 324, dormitorios: 5, banos: 4, estacionamientos: 4, precio_uf: 29000 },
  { id: 'static-009', titulo: 'Casa cerca Sector Sport Francés y colegios', comuna: 'Vitacura', region: 'Metropolitana de Santiago', operacion: 'venta', tipo: 'Casa', superficie_terreno_m2: 286, superficie_util_m2: 100, dormitorios: 4, banos: 2, estacionamientos: 2, precio_uf: 12600 },
  { id: 'static-010', titulo: 'Casa nueva – Proyecto Townhouses (en construcción)', comuna: 'Las Condes', region: 'Metropolitana de Santiago', operacion: 'venta', tipo: 'Casa', superficie_terreno_m2: 150, superficie_util_m2: 139, dormitorios: 3, banos: 3, estacionamientos: 2, precio_uf: 14900 },
  { id: 'static-011', titulo: 'Departamento con vista despejada, Manquehue Sur', comuna: 'Las Condes', region: 'Metropolitana de Santiago', operacion: 'venta', tipo: 'Departamento', superficie_util_m2: 150, dormitorios: 4, banos: 3, estacionamientos: 2, precio_uf: 10500 },
  { id: 'static-012', titulo: 'Casa borde mar, El Rosario de Tunquén', comuna: 'Tunquén', region: 'Valparaíso', operacion: 'venta', tipo: 'Casa', superficie_terreno_m2: 5000, superficie_util_m2: 312, dormitorios: 5, banos: 3, estacionamientos: 10, precio_uf: 21000 },
  { id: 'static-013', titulo: 'Sitio bajada playa, El Rosario de Tunquén', comuna: 'Tunquén', region: 'Valparaíso', operacion: 'venta', tipo: 'Terreno', superficie_terreno_m2: 6080, precio_uf: 11000 },
];

// APIs mínimas para consumir desde cualquier página:
export function getAllProperties(): Property[] {
  return PROPERTIES;
}

export function getFeaturedProperties(limit = 3): Property[] {
  // destacadas explícitas; si falta alguna, rellena con las primeras
  const star = PROPERTIES.filter(p => p.destacada);
  const rest = PROPERTIES.filter(p => !p.destacada);
  return [...star, ...rest].slice(0, limit);
}
