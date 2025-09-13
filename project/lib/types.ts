// project/lib/types.ts

export type Operation = 'venta' | 'arriendo'

export interface Property {
  id: string
  slug?: string

  // títulos / textos
  titulo?: string          // ES
  title?: string           // EN
  descripcion?: string     // ES
  description?: string     // EN

  // ubicación / negocio
  comuna?: string
  barrio?: string
  direccion?: string
  operacion?: Operation

  // flags
  destacada?: boolean

  // precios (alias en ambos formatos)
  precioUf?: number        // camelCase
  precioUF?: number        // alias
  precioClp?: number       // camelCase
  precioCLP?: number
