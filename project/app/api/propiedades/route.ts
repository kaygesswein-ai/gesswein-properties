import { NextResponse } from 'next/server';
import * as FeaturedMod from '../../../lib/featured'; // import flexible

// Obtiene el path/API base si existiera en lib/featured
const getFeaturedApiPath = (): string => {
  const m = FeaturedMod as any;
  return (
    m.featuredApiPath ||
    m.FEATURED_API_PATH ||
    m.apiPath ||
    '/api/propiedades'
  );
};

// Obtiene la lista de destacadas sin depender del nombre exacto del export
const getFeaturedList = (): any[] => {
  const m = FeaturedMod as any;
  return (
    m.featuredList ||
    m.featured ||
    m.FEATURED ||
    m.items ||
    m.default ||
    []
  );
};

// Fotos libres para las NO destacadas (todas distintas)
const stockPhotos = [
  'https://images.unsplash.com/photo-1600585154340-1e4ce9a7a8c8?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1459535653751-d571815e906b?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505692952047-1a78307da8f3?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1444419988131-046ed4e5ffd6?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1445510861639-5651173bc5d5?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505692794403-34d4982ae5e9?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c89a?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1486304873000-235643847519?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1475855581690-80accde3ae2b?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505691723518-36a5ac3b2a59?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop',
];

const pick = <T,>(arr: T[], i: number) => arr[i % arr.length];

type Prop = {
  id: string;
  titulo: string;
  comuna: string;
  region: string;
  operacion: 'venta' | 'arriendo';
  tipo: string;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  superficie_util_m2?: number | null;
  coverImage?: string;
  destacada?: boolean;
};

const capFirst = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

function makeNonFeatured(count = 30): Prop[] {
  const comunas = ['Vitacura','Providencia','Ñuñoa','Santiago','Las Condes','La Reina','Lo Barnechea','Huechuraba','La Florida','Maipú','Colina'];
  const tipos = ['Departamento','Casa','Oficina','Local comercial','Bodega','Terreno'];
  const ops: Array<'venta' | 'arriendo'> = ['venta','arriendo'];

  const arr: Prop[] = [];
  for (let i = 0; i < count; i++) {
    const tipo = pick(tipos, i);
    const operacion = pick(ops, i);
    const comuna = pick(comunas, i);
    const uf = operacion === 'venta' ? 3500 + i * 120 : 45 + (i % 8) * 5;
    const dorm = (tipo === 'Departamento' || tipo === 'Casa') ? 1 + (i % 4) : 0;
    const banos = (tipo === 'Departamento' || tipo === 'Casa') ? 1 + (i % 3) : 1;
    const m2 = tipo === 'Terreno' ? 400 + i * 30 : 60 + (i % 6) * 20;

    arr.push({
      id: `nf-${i + 1}`,
      titulo: `${tipo} en ${comuna} #${i + 1}`,
      comuna,
      region: 'Metropolitana de Santiago',
      operacion,
      tipo,
      precio_uf: uf,
      dormitorios: dorm,
      banos,
      superficie_util_m2: m2,
      coverImage: pick(stockPhotos, i),
      destacada: false,
    });
  }
  return arr;
}

export async function GET(req: Request) {
  // 1) Destacadas desde lib/featured (mantiene coverImage/títulos existentes)
  const baseFeatured = getFeaturedList();
  const featured: Prop[] = (Array.isArray(baseFeatured) ? baseFeatured : []).map((p: any, i: number) => ({
    id: p.id ?? `feat-${i + 1}`,
    titulo: p.titulo ?? 'Propiedad destacada',
    comuna: p.comuna ?? '',
    region: p.region ?? 'Metropolitana de Santiago',
    operacion: (p.operacion ?? 'venta'),
    tipo: capFirst(p.tipo ?? 'Propiedad'),
    precio_uf: p.precio_uf ?? null,
    precio_clp: p.precio_clp ?? null,
    dormitorios: p.dormitorios ?? null,
    banos: p.banos ?? null,
    superficie_util_m2: p.superficie_util_m2 ?? null,
    coverImage: p.coverImage ?? p.images?.[0] ?? p.imagenes?.[0] ?? undefined,
    destacada: true,
  }));

  // 2) No destacadas
  const nonFeatured = makeNonFeatured(30);

  // 3) UF del día para calcular CLP si falta
  let uf: number | null = null;
  try {
    const r = await fetch(new URL('/api/uf', req.url), { cache: 'no-store' });
    const j = await r.json().catch(() => ({} as any));
    uf = typeof j?.uf === 'number' ? j.uf : null;
  } catch {
    uf = null;
  }

  const all: Prop[] = [...featured, ...nonFeatured].map((p) => {
    if ((!p.precio_clp || p.precio_clp <= 0) && p.precio_uf && uf) {
      return { ...p, precio_clp: Math.round(p.precio_uf * uf) };
    }
    return p;
  });

  // Filtros
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const operacion = (searchParams.get('operacion') || '').toLowerCase();
  const tipo = (searchParams.get('tipo') || '').toLowerCase();
  const region = (searchParams.get('region') || '').toLowerCase();
  const comuna = (searchParams.get('comuna') || '').toLowerCase();
  const minUF = parseInt(searchParams.get('minUF') || '', 10);
  const maxUF = parseInt(searchParams.get('maxUF') || '', 10);
  const minCLP = parseInt(searchParams.get('minCLP') || '', 10);
  const maxCLP = parseInt(searchParams.get('maxCLP') || '', 10);

  const filtered = all.filter((p) => {
    if (q && !(`${p.titulo} ${p.comuna}`.toLowerCase().includes(q))) return false;
    if (operacion && p.operacion.toLowerCase() !== operacion) return false;
    if (tipo && p.tipo.toLowerCase() !== tipo) return false;
    if (region && p.region.toLowerCase() !== region) return false;
    if (comuna && p.comuna.toLowerCase() !== comuna) return false;

    if (!Number.isNaN(minUF) && p.precio_uf != null && p.precio_uf < minUF) return false;
    if (!Number.isNaN(maxUF) && p.precio_uf != null && p.precio_uf > maxUF) return false;
    if (!Number.isNaN(minCLP) && p.precio_clp != null && p.precio_clp < minCLP) return false;
    if (!Number.isNaN(maxCLP) && p.precio_clp != null && p.precio_clp > maxCLP) return false;

    return true;
  });

  return NextResponse.json({ data: filtered, total: filtered.length, featuredApiPath: getFeaturedApiPath() });
}
