// project/lib/types.ts

// Tipo base para una propiedad. Incluye variantes de nombres que tu código usa
// (es/en, camelCase/snake) para evitar errores en build.
export type Property = {
  id: string | number;

  // Identificación / contenido
  titulo?: string;
  title?: string;
  descripcion?: string;
  description?: string;
  slug?: string;

  // Ubicación
  comuna?: string;
  barrio?: string;
  direccion?: string;
  ciudad?: string;
  region?: string;

  // Operación y precio
  operacion?: 'venta' | 'arriendo' | string;
  precio?: number;
  precioClp?: number; // camelCase
  precioCLP?: number; // variante usada en algunos componentes
  precioUf?: number;
  precioUSD?: number;

  // Superficies / métricas
  m2?: number;
  superficie?: number;
  superficieConstruida?: number;
  superficieTotal?: number;

  // Programa
  dormitorios?: number;
  banos?: number;              // ojo: “baños” sin tilde para el código
  estacionamientos?: number;
  bodegas?: number;

  // Medios / imágenes
  images?: string[];           // variante en inglés
  imagenes?: string[];         // variante en español
  coverImage?: string;
  portadaUrl?: string;

  // Flags antiguos que podrían aparecer
  destacado?: boolean;
  destacada?: boolean;

  // Tiempos
  createdAt?: string | Date;
  updatedAt?: string | Date;

  // Campos flexibles que puedan venir del backend
  [key: string]: any;
};

// Respuestas genéricas de API (por si las ocupas)
export type ApiListResponse<T> = {
  data: T[];
  error?: string | null;
};

export type ApiItemResponse<T> = {
  data: T | null;
  error?: string | null;
};
