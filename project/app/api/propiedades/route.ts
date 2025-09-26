// project/app/api/propiedades/route.ts
import { NextResponse } from 'next/server';

// Evita cualquier cache/optimización estática del handler
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/* ------- helpers ------- */
const toNum = (v: any) => {
  if (v == null) return null;
  const n = Number(String(v).replace(/\./g, ''));
  return Number.isFinite(n) ? n : null;
};
const capFirst = (s?: string | null) => {
  if (!s) return '';
  const lower = String(s).toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

/* ------- fallback local (3 destacadas + 30 normales) ------- */
function fallbackData() {
  const FEATURED = [
    {
      id: 'f1',
      titulo: 'Depto luminoso en Vitacura',
      comuna: 'Vitacura',
      region: 'Metropolitana de Santiago',
      operacion: 'venta',
      tipo: 'departamento',
      precio_uf: 10500,
      precio_clp: null,
      dormitorios: 2,
      banos: 2,
      superficie_util_m2: 78,
      coverImage:
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1400&auto=format&fit=crop',
      destacada: true,
    },
    {
      id: 'f2',
      titulo: 'Casa familiar en Lo Barnechea',
      comuna: 'Lo Barnechea',
      region: 'Metropolitana de Santiago',
      operacion: 'venta',
      tipo: 'casa',
      precio_uf: 23000,
      precio_clp: 908169950,
      dormitorios: 4,
      banos: 3,
      superficie_util_m2: 180,
      coverImage:
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1400&auto=format&fit=crop',
      destacada: true,
    },
    {
      id: 'f3',
      titulo: 'Oficina en Providencia',
      comuna: 'Providencia',
      region: 'Metropolitana de Santiago',
      operacion: 'arriendo',
      tipo: 'oficina',
      precio_uf: 4000, // precio ficticio pedido
      precio_clp: null,
      dormitorios: 0,
      banos: 1,
      superficie_util_m2: 55,
      coverImage:
        'https://images.unsplash.com/photo-1507209696998-3c532be9b2b1?q=80&w=1400&auto=format&fit=crop',
      destacada: true,
    },
  ];

  const OTHERS = Array.from({ length: 30 }).map((_, i) => ({
    id: `n${i + 1}`,
    titulo: `Propiedad ${i + 1}`,
    comuna: 'Santiago',
    region: 'Metropolitana de Santiago',
    operacion: i % 3 === 0 ? 'arriendo' : 'venta',
    tipo: i % 2 ? 'departamento' : 'casa',
    precio_uf: 3000 + i * 120,
    precio_clp: null,
    dormitorios: (i % 4) + 1,
    banos: (i % 2) + 1,
    superficie_util_m2: 60 + (i % 6) * 10,
    coverImage:
      'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1400&auto=format&fit=crop',
    destacada: false,
  }));

  return { ALL: [...FEATURED, ...OTHERS] };
}

/* ------- filtros ------- */
function applyFilters(list: any[], p: URLSearchParams) {
  const operacion = String(p.get('operacion') || '').trim().toLowerCase();
  const tipo = String(p.get('tipo') || '').trim().toLowerCase();
  const region = String(p.get('region') || '').trim().toLowerCase();
  const comuna = String(p.get('comuna') || '').trim().toLowerCase();
  const onlyFeatured = String(p.get('destacada') || '').toLowerCase() === 'true';

  const minUF = toNum(p.get('minUF'));
  const maxUF = toNum(p.get('maxUF'));
  const minCLP = toNum(p.get('minCLP'));
  const maxCLP = toNum(p.get('maxCLP'));

  let out = list.slice();

  if (operacion) out = out.filter((x) => String(x.operacion || '').toLowerCase() === operacion);
  if (tipo) out = out.filter((x) => String(x.tipo || '').toLowerCase() === tipo);
  if (region) out = out.filter((x) => String(x.region || '').toLowerCase() === region);
  if (comuna) out = out.filter((x) => String(x.comuna || '').toLowerCase() === comuna);
  if (onlyFeatured) out = out.filter((x) => !!x.destacada);

  if (minUF != null) out = out.filter((x) => toNum(x.precio_uf) != null && toNum(x.precio_uf)! >= minUF);
  if (maxUF != null) out = out.filter((x) => toNum(x.precio_uf) != null && toNum(x.precio_uf)! <= maxUF);
  if (minCLP != null) out = out.filter((x) => toNum(x.precio_clp) != null && toNum(x.precio_clp)! >= minCLP);
  if (maxCLP != null) out = out.filter((x) => toNum(x.precio_clp) != null && toNum(x.precio_clp)! <= maxCLP);

  // normalizar capitalización del tipo
  out = out.map((x) => ({ ...x, tipo: capFirst(x.tipo) }));

  return out;
}

/* ------- handler ------- */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const limit = Math.max(0, Math.min(100, Number(params.get('limit') || '0'))) || undefined;

  // 1) Intentar cargar el dataset real
  let ALL: any[] | null = null;
  try {
    // ruta correcta desde app/api/propiedades/route.ts a project/lib/featured.ts
    const mod = await import('../../../lib/featured');
    const candidate = ((mod as any).ALL || (mod as any).default || []) as any[];
    // si el módulo trae items, los usamos; si no, fallback
    if (Array.isArray(candidate) && candidate.length > 0) {
      ALL = candidate;
    }
  } catch {
    // ignoramos y pasamos a fallback
  }

  // 2) Fallback si no hay datos del módulo
  if (!ALL) {
    ALL = fallbackData().ALL;
  }

  // 3) Aplicar filtros
  let filtered = applyFilters(ALL, params);

  // 4) Límite
  if (limit) filtered = filtered.slice(0, limit);

  return NextResponse.json({ data: filtered });
}
