// Chilean currency formatting utilities

export function formatCLP(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatUF(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' UF'
}

export function formatPrice(precio_uf?: number, precio_clp?: number): string {
  if (precio_uf) {
    return formatUF(precio_uf)
  }
  if (precio_clp) {
    return formatCLP(precio_clp)
  }
  return 'Consultar precio'
}

export function formatArea(area?: number): string {
  if (!area) return ''
  return `${area} m²`
}

export const COMUNAS_SANTIAGO = [
  'Las Condes',
  'Providencia',
  'Vitacura',
  'Ñuñoa',
  'Santiago Centro',
  'La Reina',
  'Peñalolén',
  'Macul',
  'San Miguel',
  'Maipú',
  'Pudahuel',
  'Cerrillos',
  'Lo Barnechea',
  'Huechuraba',
  'Quilicura',
  'Renca',
  'Independencia',
  'Recoleta',
  'Conchalí',
  'Quinta Normal',
  'Estación Central',
  'Pedro Aguirre Cerda',
  'San Joaquín',
  'La Granja',
  'San Ramón',
  'La Cisterna',
  'El Bosque',
  'La Pintana',
  'San Bernardo',
  'Puente Alto',
]