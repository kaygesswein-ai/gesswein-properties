// project/app/api/propiedades/route.ts
import { NextResponse } from 'next/server';

/** Util: capitaliza primera letra, resto minúsculas */
function capFirst(s: string | null | undefined) {
  if (!s) return '';
  const lower = String(s).toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/** Convierte cualquier cosa numérica segura (UF/CLP) */
function toNum(v: any) {
  if (v == null) return null;
  const n = Number(String(v).replace(/\./g, ''));
  return Number.isFinite(n) ? n : null;
}

/** Aplica filtros del UI sobre un arreglo de propiedades */
function applyFilters(list: any[], p: URLSearchParams) {
  const operacion = String(p.get('operacion') || '').trim().toLowerCase();
  const tipo = String(p.get('tipo') || '').trim().toLowerCase();
  const region = String(p.get('region') || '').trim().toLowerCase();
  const comuna = String(p.get('comuna') || '').trim().toLowerCase();

  const minUF = toNum(p.get('minUF'));
  const maxUF = toNum(p.get('maxUF'));
  const minCLP = toNum(p.get('minCLP'));
  const maxCLP = toNum(p.get('maxCLP'));

  const destacada = String(p.get('destacada') || '').toLowerCase() === 'true';

  let out = list.slice();

  if (operacion) out = out.filter((x) => String(x.operacion || '').toLowerCase() === operacion);
  if (tipo) out = out.filter((x) => String(x.tipo || '').toLowerCase() === tipo);
  if (region) out = out.filter((x) => String(x.region || '').toLowerCase() === region);
  if (comuna) out = out.filter((x) => String(x.comuna || '').toLowerCase() === comuna);
  if (destacada) out = out.filter((x) => !!x.destacada);

  // Rango por UF o CLP (si llegan ambos, se aplican ambos)
  if (minUF != null) out = out.filter((x) => toNum(x.precio_uf) != null && toNum(x.precio_uf)! >= minUF);
  if (maxUF != null) out = out.filter((x) => toNum(x.precio_uf) != null && toNum(x.precio_uf)! <= maxUF);
  if (minCLP != null) out = out.filter((x) => toNum(x.precio_clp) != null && toNum(x.precio_clp)! >= minCLP);
  if (maxCLP != null) out = out.filter((x) => toNum(x.precio_clp) != null && toNum(x.precio_clp)! <= maxCLP);

  // Normaliza mayúscula en "tipo" por si la BD trae minúsculas
  out = out.map((x) => ({ ...x, tipo: capFirst(x.tipo) }));

  return out;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const limit = Math.max(0, Math.min(100, Number(params.get('limit') || '0'))) || undefined;

  let data: any[] = [];

  // 1) Igual que antes: intenta ir contra supabase-rest
  try {
    const qs = new URLSearchParams();
    // Sólo pasamos a supabase-rest lo que hoy usaba tu archivo original
    if (params.get('comuna')) qs.set('comuna', params.get('comuna')!);
    if (params.get('operacion')) qs.set('operacion', params.get('operacion')!);
    if (params.get('tipo')) qs.set('tipo', params.get('tipo')!);

    const r = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_REST_URL}/properties?${qs.toString()}`,
      { headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' } },
    );

    if (r.ok) {
      const j = await r.json().catch(() => []);
      if (Array.isArray(j)) data = j;
    }
  } catch {
    // silencioso: si falla, nos vamos al fallback
  }

  // 2) Fallback: usa el dataset en memoria si la BD no entregó nada
  if (!Array.isArray(data) || data.length === 0) {
    try {
      const mod: any = await import('@/lib/featured');
      if (typeof mod.getAllProperties === 'function') {
        data = await mod.getAllProperties();
      } else if (Array.isArray(mod.ALL)) {
        data = mod.ALL;
      } else if (Array.isArray(mod.FEATURED)) {
        // al menos devolvemos destacadas si no existe el total
        data = mod.FEATURED;
      }
    } catch {
      data = [];
    }
  }

  // 3) Aplica TODOS los filtros del UI sobre el arreglo resultante
  let filtered = applyFilters(data, params);

  // 4) limit opcional (lo usa la portada cuando pide destacadas)
  if (limit) filtered = filtered.slice(0, limit);

  return NextResponse.json({ data: filtered });
}
