// lib/featured.ts
// ÚNICA FUENTE DE VERDAD para las propiedades destacadas
// Ambas páginas (Inicio y Propiedades) importan esta constante
// y llaman a /api/propiedades usando estos mismos parámetros.

export const FEATURED_QUERY = 'destacada=true&limit=3&order=orden_destacada';

// Helper para construir URL final hacia tu API actual
export function featuredApiPath(base = '/api/propiedades') {
  return `${base}?${FEATURED_QUERY}`;
}
