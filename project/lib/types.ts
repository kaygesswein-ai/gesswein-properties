// lib/types.ts
export type Property = {
  id: string;
  operacion: 'venta' | 'arriendo';
  tipo: 'casa' | 'departamento' | 'oficina' | 'terreno' | 'otros';
  comuna: string;
  direccion_privada?: string | null;
  precio_uf?: number | null;
  precio_clp?: number | null;
  superficie_util_m2?: number | null;
  superficie_terreno_m2?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  estacionamientos?: number | null;
  ano?: number | null;
  gastos_comunes?: number | null;
  estado: 'disponible' | 'reservada' | 'vendida';
  titulo: string;
  descripcion?: string | null;
  imagenes: string[];
  video_url?: string | null;
  tour_url?: string | null;
  created_at: string;
};