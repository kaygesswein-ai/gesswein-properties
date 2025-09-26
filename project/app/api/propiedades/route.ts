// project/app/api/propiedades/route.ts
import { NextResponse } from 'next/server';
import * as featured from '../../../lib/featured';

/* ---------- helpers ---------- */
function capFirst(s?: string | null) {
  if (!s) return '';
  const lower = String(s).toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
function toNum(v: any) {
  if (v == null) return null;
  const n = Number(String(v).replace(/\./g, ''));
  return Number.isFinite(n) ? n : null;
}

/* Aplica filtros enviados por el front */
function applyFilters(list: any[], p: URLSearchParams) {
  const operacion = String(p.get('operacion') || '').trim().toLowerCase();
  const tipo = String(p.get('tipo') || '').trim().toLowerCase();
  const region = String(p.get('region') || '').trim().toLowerCase();
  const comuna = String(p.get('comuna') || '').trim().toLowerCase();
  const destacada = String(p.get('destacada') || '').toLowerCase() === 'true';

  const minUF = toNum(p.get('minUF'));
  const maxUF = toNum(p.get('maxUF'));
  const minCLP = toNum(p.get('minCLP'));
  const maxCLP = toNum(p.get('maxCLP'));

  let out = list.slice();

  if (operacion) out = out.filter((x) => String(x.operacion || '').toLowerCase() === operacion);
  if (tipo) out = out.filter((x) => String(x.tipo || '').toLowerCase() === tipo);
  if (region) out = out.filter((x) => String(x.region || '').toLowerCase() === region);
  if (comuna) out = out.filter((x) => String(x.comuna || '').toLowerCase() === comuna);
  if (destacada) out = out.filter((x) => !!x.destacada);

  if (minUF != null) out = out.filter((x) => toNum(x.precio_uf) != null && toNum(x.precio_uf)! >= minUF);
  if (maxUF != null) out = out.filter((x) => toNum(x.precio_uf) != null && toNum(x.precio_uf)! <= maxUF);
  if (minCLP != null) out = out.filter((x) => toNum(x.precio_clp) != null && toNum(x.precio_clp)! >= minCLP);
  if (maxCLP != null) out = out.filter((x) => toNum(x.precio_clp) != null && toNum(x.precio_clp)! <= maxCLP);

  // Normaliza "tipo" a Capitalizado (Casa, Oficina, Departamento, etc.)
  out = out.map((x) => ({ ...x, tipo: capFirst(x.tipo) }));

  return out;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const limit = Math.max(0, Math.min(100, Number(params.get('limit') || '0'))) || undefined;

  // 1) Tomamos SIEMPRE los datos locales
  let base: any[] = [];
  try {
    if (typeof (featured as any).getAllProperties === 'function') {
      base = await (featured as any).getAllProperties();
    } else if (Array.isArray((featured as any).ALL)) {
      base = (featured as any).ALL;
    } else if (Array.isArray((featured as any).FEATURED)) {
      base = (featured as any).FEATURED;
    }
  } catch {
    base = [];
  }

  // 2) Aplicar filtros del front
  let filtered = applyFilters(base, params);

  // 3) limit opcional
  if (limit) filtered = filtered.slice(0, limit);

  return NextResponse.json({ data: filtered });
}
