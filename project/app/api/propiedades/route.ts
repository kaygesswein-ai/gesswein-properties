// project/app/api/propiedades/route.ts
import { NextResponse } from 'next/server';
import { featuredItems } from '../../../lib/featured';

/** ---------- Tipos ---------- */
type Op = 'venta' | 'arriendo';
type Tipo =
  | 'Casa'
  | 'Departamento'
  | 'Oficina'
  | 'Bodega'
  | 'Local comercial'
  | 'Terreno';

type Prop = {
  id: string;
  titulo: string;
  comuna: string;
  region: string;
  operacion: Op;
  tipo: Tipo;
  precio_uf: number | null;
  precio_clp: number | null;
  dormitorios: number | null;
  banos: number | null;
  superficie_util_m2: number | null;
  superficie_terreno_m2: number | null;
  coverImage: string;
  destacada?: boolean;
};

/** ---------- Datos de ejemplo para NO destacadas (30) ---------- */
function makeId(prefix: string, n: number) {
  return `${prefix}-${String(n).padStart(2, '0')}`;
}

const COMUNAS = [
  'Vitacura',
  'Providencia',
  'Lo Barnechea',
  'Las Condes',
  'Ñuñoa',
  'Santiago',
  'La Reina',
  'Huechuraba',
  'Maipú',
  'Colina',
] as const;

const TIPOS: Tipo[] = [
  'Casa',
  'Departamento',
  'Oficina',
  'Bodega',
  'Local comercial',
  'Terreno',
];

const FOTO_CASA =
  'https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8b?q=80&w=1600&auto=format&fit=crop';
const FOTO_DEPTO =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop';
const FOTO_OFICINA =
  'https://images.unsplash.com/photo-1517502166878-35c93a0072bb?q=80&w=1600&auto=format&fit=crop';
const FOTO_LOCAL =
  'https://images.unsplash.com/photo-1507138833268-3b9080fc026a?q=80&w=1600&auto=format&fit=crop';
const FOTO_BODEGA =
  'https://images.unsplash.com/photo-1582582621959-48d3a00a3f2c?q=80&w=1600&auto=format&fit=crop';
const FOTO_TERRENO =
  'https://images.unsplash.com/photo-1535909339361-9b84d31b1cdf?q=80&w=1600&auto=format&fit=crop';

function fotoPorTipo(t: Tipo): string {
  switch (t) {
    case 'Casa':
      return FOTO_CASA;
    case 'Departamento':
      return FOTO_DEPTO;
    case 'Oficina':
      return FOTO_OFICINA;
    case 'Local comercial':
      return FOTO_LOCAL;
    case 'Bodega':
      return FOTO_BODEGA;
    case 'Terreno':
      return FOTO_TERRENO;
  }
}

function genPublicaciones(): Prop[] {
  const arr: Prop[] = [];
  for (let i = 1; i <= 30; i++) {
    const tipo = TIPOS[i % TIPOS.length];
    const comuna = COMUNAS[i % COMUNAS.length];
    const operacion: Op = i % 5 === 0 ? 'arriendo' : 'venta';

    const m2 = tipo === 'Terreno' ? 300 + ((i * 37) % 1200) : 45 + ((i * 11) % 180);

    const dormitorios: number | null =
      tipo === 'Terreno' || tipo === 'Bodega' || tipo === 'Local comercial'
        ? 0
        : 1 + (i % 4);

    const banos: number | null = tipo === 'Terreno' ? 0 : 1 + (i % 2);

    const precioUF =
      tipo === 'Terreno'
        ? 3500 + ((i * 70) % 6000)
        : tipo === 'Oficina'
        ? 2500 + ((i * 40) % 3500)
        : 4500 + ((i * 120) % 22000);

    arr.push({
      id: makeId('pub', i),
      titulo:
        tipo === 'Casa'
          ? `Casa en ${comuna}`
          : tipo === 'Departamento'
          ? `Departamento en ${comuna}`
          : tipo === 'Terreno'
          ? `Terreno en ${comuna}`
          : `${tipo} en ${comuna}`,
      comuna,
      region: 'Metropolitana de Santiago',
      operacion,
      tipo,
      precio_uf: precioUF,
      precio_clp: null,
      dormitorios,
      banos,
      superficie_util_m2: tipo === 'Terreno' ? null : m2,
      superficie_terreno_m2: tipo === 'Terreno' ? m2 : null,
      coverImage: fotoPorTipo(tipo),
    });
  }
  return arr;
}

/** ---------- Utilidades ---------- */
const toNumber = (s: string | null): number | null => {
  if (!s) return null;
  const v = Number(String(s).replace(/\./g, ''));
  return Number.isFinite(v) ? v : null;
};

/** ---------- Handler ---------- */
export async function GET(req: Request) {
  // 1) Base de datos en memoria
  const arr: Prop[] = genPublicaciones();

  // 2) Inyecta las 3 destacadas (arriba y sin duplicados)
  {
    const seen = new Set(arr.map((p) => p.id));
    featuredItems.forEach((f) => {
      if (!seen.has(f.id)) {
        arr.unshift({
          id: f.id,
          titulo: f.titulo,
          comuna: f.comuna,
          region: 'Metropolitana de Santiago',
          operacion: f.operacion, // 'venta' | 'arriendo'
          tipo: f.tipo, // 'Casa' | 'Departamento' | 'Oficina'
          precio_uf: f.precio_uf ?? null,
          precio_clp: f.precio_clp ?? null,
          dormitorios: f.dormitorios ?? 0,
          banos: f.banos ?? 0,
          superficie_util_m2: f.superficie_util_m2 ?? null,
          superficie_terreno_m2: null,
          coverImage: f.coverImage,
          destacada: true,
        });
      }
    });
  }

  // 3) Filtros simples según los query params existentes en tu UI
  const { searchParams } = new URL(req.url);

  const q = searchParams.get('q')?.toLowerCase() ?? '';
  const operacion = (searchParams.get('operacion') || '').toLowerCase() as Op | '';
  const tipo = (searchParams.get('tipo') || '') as Tipo | '';
  const region = searchParams.get('region') || '';
  const comuna = searchParams.get('comuna') || '';
  const barrio = searchParams.get('barrio') || ''; // placeholder (no se usa en estos datos)

  const minUF = toNumber(searchParams.get('minUF'));
  const maxUF = toNumber(searchParams.get('maxUF'));
  const minCLP = toNumber(searchParams.get('minCLP'));
  const maxCLP = toNumber(searchParams.get('maxCLP'));

  let items = arr;

  if (q) {
    items = items.filter(
      (p) =>
        p.titulo.toLowerCase().includes(q) ||
        p.comuna.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q),
    );
  }
  if (operacion) items = items.filter((p) => p.operacion === operacion);
  if (tipo) items = items.filter((p) => p.tipo === tipo);
  if (region) items = items.filter((p) => p.region === region);
  if (comuna) items = items.filter((p) => p.comuna === comuna);
  if (barrio) {
    // no hay barrios en estos datos; se deja el hook para cuando existan
  }

  // Rango por UF / CLP (si llega cualquiera, se respeta)
  if (minUF != null) items = items.filter((p) => (p.precio_uf ?? Infinity) >= minUF);
  if (maxUF != null) items = items.filter((p) => (p.precio_uf ?? -Infinity) <= maxUF);
  if (minCLP != null) items = items.filter((p) => (p.precio_clp ?? Infinity) >= minCLP);
  if (maxCLP != null) items = items.filter((p) => (p.precio_clp ?? -Infinity) <= maxCLP);

  return NextResponse.json({ items });
}
