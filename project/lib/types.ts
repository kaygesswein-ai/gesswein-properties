// project/lib/types.ts

export type Operation = 'venta' | 'arriendo'

export interface Property {
  id: string
  slug?: string

  // títulos / textos
  titulo?: string
  title?: string
  descripcion?: string
  description?: string

  // ubicación / negocio
  comuna?: string
  barrio?: string
  direccion?: string
  operacion?: Operation

  // flags
  destacada?: boolean // <-- necesario para PropertyCard

  // precios
  precioUf?: number
  precioClp?: number

  // características
  dormitorios?: number
  banos?: number
  estacionamientos?: number
  m2?: number
  m2Util?: number
  m2Totales?: number

  // medios
  portadaUrl?: string
  coverImage?: string
  images?: string[]

  createdAt?: string
  updatedAt?: string
}

// Respuestas API típicas
export interface ApiListResponse<T> { data: T[] }
export interface ApiItemResponse<T> { data: T }
