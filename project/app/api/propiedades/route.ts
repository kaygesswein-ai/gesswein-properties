// project/app/api/propiedades/route.ts
import { NextResponse } from 'next/server';

/* ================= Tipos ================= */
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

/* ============= 3 destacadas (inline, sin imports) ============= */
const FEATURED: Prop[] = [
  {
    id: 'feat-depto-vitacura',
    titulo: 'Depto luminoso en Vitacura',
    comuna: 'Vitacura',
    region: 'Metropolitana de Santiago',
    operacion: 'venta',
    tipo: 'Departamento',
    precio_uf: 10500,
    precio_clp: null,
    dormitorios: 2,
    banos: 2,
    superficie_util_m2: 78,
    superficie_terreno_m2: null,
    coverImage:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
    destacada: true,
  },
  {
    id: 'feat-casa-lobarnechea',
    titulo: 'Casa familiar en Lo Barnechea',
    comuna: 'Lo Barnechea',
    region: 'Metropolitana de Santiago',
    operacion: 'venta',
    tipo: 'Casa',
    precio_uf: 23000,
    precio_clp: null,
    dormitorios: 4,
    banos: 3,
    superficie_util_m2: 180,
    superficie_terreno_m2: null,
    coverImage:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop',
    destacada: true,
  },
  {
    id: 'feat-oficina-providencia',
    titulo: 'Oficina en Providencia',
    comuna: 'Providencia',
    region: 'Metropolitana de Santiago',
    operacion: 'arriendo',
    tipo: 'Oficina',
    precio_uf: 4000, // precio ficticio solicitado
    precio_clp: null,
    dormitorios: 0,
    banos: 1,
    superficie_util_m2: 55,
    superficie_terreno_m2: null,
    coverImage:
      'https://images.unsplash.com/photo-1517502166878-35c93a0072bb?q=80&w=1600&auto=format&fit=crop',
    destacada: true,
  },
];

/* ============= Catálogo de fotos por tipo (para las NO destacadas) ============= */
const FOTO_CASA =
  'https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8b?q=80&w=1600&auto=format&fit=crop';
const FOTO_DEPTO =
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop';
const FOTO_OFICINA =
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop';
const FOTO_LOCAL =
  'https://images.unsplash.com/photo-1507138833268-3b9080fc026a?q=80&w=1600&auto=format&fit=crop';
const FOTO_BODEGA =
  'https://images.unsplash.com/photo-1582582621959-48d3a00a3f2c?q=80&w=1600&auto=format&fit=crop';
const FOTO_TERRENO =
  'https://images.unsplash.com/photo-1535909339361-9b84d31b1cdf?q=80&w=1600&auto=format&fit=crop';

function fotoPorTipo(t: Tipo) {
  switch (t) {
    case 'Casa': return FOTO_CASA;
    case 'Departamento': return FOTO_DEPTO;
    case 'Oficina': return FOTO_OFICINA;
    case 'Local comercial': return FOTO_LOCAL;
    case 'Bodega': return FOTO_BODEGA;
    case 'Terreno': return FOTO_TERRENO;
  }
}

/* ============= 30 publicaciones NO destacadas ============= */
const COMUNAS = [
  'Vitacura','Providencia','Lo Barnechea','Las Condes','Ñuñoa',
  'Santiago','La Reina','Huechuraba','Maipú','Colina',
] as const;

const TIPOS: Tipo[] = [
  'Casa','Departamento','Oficina','Bodega','Local comercial','Terreno',
];

function makeId(prefix: string, n: number) {
  return `${prefix}-${String(n).padStart(2, '0')}`;
}

function genPublicaciones(): Prop[] {
  const arr: Prop[] = [];
  for (let i = 1; i <= 30; i++) {
    const tipo = TIPOS[i % TIPOS.length];
    const comuna = COMUNAS[i % COMUNAS.length];
    const operacion: Op = i % 5 === 0 ? 'arriendo' : 'venta';

    const esTerreno = tipo === 'Terreno';
    const m2 = esTerreno ? 300 + ((i * 37) % 1200) : 45 + ((i * 11) % 180);

    const dormitorios: number | null =
      tipo === 'Terreno' || tipo === 'Bodega' || tipo === 'Local comercial'
        ? 0 : 1 + (i % 4);

    const banos: number | null = tipo === 'Terreno' ? 0 : 1 + (i % 2);

    const precioUF =
      esTerreno ? 3500 + ((i * 70) % 6000)
      : tipo === 'Oficina' ? 2500 + ((i * 40) % 3500)
      : 4500 + ((i * 120) % 22000);

    arr.push({
      id: makeId('pub', i),
      titulo:
        tipo === 'Casa' ? `Casa en ${comuna}`
        : tipo === 'Departamento' ? `Departamento en ${comuna}`
        : tipo === 'Terreno' ? `Terreno en ${comuna}`
        : `${tipo} en ${comuna}`,
      comuna,
      region: 'Metropolitana de Santiago',
      operacion,
      tipo,
      precio_uf: precioUF,
      precio_clp: null,
      dormitorios,
      banos,
      superficie_util_m2: esTerreno ? null : m2,
      superficie_terreno_m2: esTerreno ? m2 : null,
      coverImage: fotoPorTipo(tipo),
      destacada: false,
    });
  }
  return arr;
}

/* ============= Util ============= */
const toNumber = (s: string | null): number | null => {
  if (!s) return null;
  const v = Number(String(s).replace(/\./g, ''));
  return Number.isFinite(v) ? v : null;
};

/* ============= Handler ============= */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // si piden solo destacadas (home)
  const soloDestacadas = (searchParams.get('destacada') || '').toLowerCase() === 'true';
  const limit = toNumber(searchParams.get('limit')) ?? null;

  // base: 3 destacadas + 30 extra
  const base: Prop[] = [...FEATURED, ...genPublicaciones()];

  if (soloDestacadas) {
    const only = limit && limit > 0 ? FEATURED.slice(0, limit) : FEATURED;
    return NextResponse.json({ data: only });
  }

  // filtros (normalizo strings para que acepten 'Venta'/'venta' etc.)
  const q = (searchParams.get('q') || '').toLowerCase();
  const operacionParam = (searchParams.get('operacion') || '').toLowerCase() as Op | '';
  const tipoParam = searchParams.get('tipo') || '';
  const regionParam = searchParams.get('region') || '';
  const comunaParam = searchParams.get('comuna') || '';
  // barrio: reservado para futuro
  const minUF = toNumber(searchParams.get('minUF'));
  const maxUF = toNumber(searchParams.get('maxUF'));
  const minCLP = toNumber(searchParams.get('minCLP'));
  const maxCLP = toNumber(searchParams.get('maxCLP'));

  let items = base;

  if (q) {
    items = items.filter(
      (p) =>
        p.titulo.toLowerCase().includes(q) ||
        p.comuna.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q),
    );
  }
  if (operacionParam) items = items.filter((p) => p.operacion === operacionParam);
  if (tipoParam) items = items.filter((p) => p.tipo === tipoParam);
  if (regionParam) items = items.filter((p) => p.region === regionParam);
  if (comunaParam) items = items.filter((p) => p.comuna === comunaParam);

  if (minUF != null) items = items.filter((p) => (p.precio_uf ?? Infinity) >= minUF);
  if (maxUF != null) items = items.filter((p) => (p.precio_uf ?? -Infinity) <= maxUF);
  if (minCLP != null) items = items.filter((p) => (p.precio_clp ?? Infinity) >= minCLP);
  if (maxCLP != null) items = items.filter((p) => (p.precio_clp ?? -Infinity) <= maxCLP);

  const limited = limit && limit > 0 ? items.slice(0, limit) : items;

  return NextResponse.json({ data: limited });
}
