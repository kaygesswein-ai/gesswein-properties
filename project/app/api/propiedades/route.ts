import { NextResponse } from 'next/server';
import { PROPERTIES, Property } from '../../../project/lib/properties'; // 👈 ruta relativa estable

type Q = {
  q?: string;
  operacion?: string;
  tipo?: string;
  region?: string;
  comuna?: string;
  barrio?: string;

  // precios
  minUF?: string;
  maxUF?: string;
  minCLP?: string;
  maxCLP?: string;

  // avanzados
  minDorm?: string;
  minBanos?: string;
  minM2Const?: string;
  minM2Terreno?: string;
  estac?: string;

  // featured / paginación
  destacada?: string;
  limit?: string;
  offset?: string;
};

function norm(s?: string | null) {
  return (s ?? '').trim().toLowerCase();
}
function toInt(s?: string) {
  if (!s) return NaN;
  const n = parseInt(String(s).replace(/\D+/g, ''), 10);
  return Number.isFinite(n) ? n : NaN;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = Object.fromEntries(url.searchParams.entries()) as Q;

  let items: Property[] = PROPERTIES.slice();

  // texto libre
  if (q.q) {
    const needle = norm(q.q);
    items = items.filter(
      (p) =>
        norm(p.titulo).includes(needle) ||
        norm(p.comuna).includes(needle) ||
        norm(p.tipo).includes(needle),
    );
  }

  // básicos
  if (q.operacion) items = items.filter((p) => norm(p.operacion) === norm(q.operacion));
  if (q.tipo) items = items.filter((p) => norm(p.tipo) === norm(q.tipo));
  if (q.region) items = items.filter((p) => norm((p as any).region) === norm(q.region));
  if (q.comuna) items = items.filter((p) => norm(p.comuna) === norm(q.comuna));
  if (q.barrio) items = items.filter((p) => norm((p as any).barrio).includes(norm(q.barrio)));

  // precios UF
  const minUF = toInt(q.minUF);
  const maxUF = toInt(q.maxUF);
  if (!Number.isNaN(minUF)) items = items.filter((p) => (p.precio_uf ?? Infinity) >= minUF);
  if (!Number.isNaN(maxUF)) items = items.filter((p) => (p.precio_uf ?? -Infinity) <= maxUF);

  // precios CLP
  const minCLP = toInt(q.minCLP);
  const maxCLP = toInt(q.maxCLP);
  if (!Number.isNaN(minCLP)) items = items.filter((p) => (p.precio_clp ?? Infinity) >= minCLP);
  if (!Number.isNaN(maxCLP)) items = items.filter((p) => (p.precio_clp ?? -Infinity) <= maxCLP);

  // avanzados
  const minDorm = toInt(q.minDorm);
  if (!Number.isNaN(minDorm)) items = items.filter((p) => (p.dormitorios ?? 0) >= minDorm);

  const minBanos = toInt(q.minBanos);
  if (!Number.isNaN(minBanos)) items = items.filter((p) => (p.banos ?? 0) >= minBanos);

  const minM2Const = toInt(q.minM2Const);
  if (!Number.isNaN(minM2Const)) {
    items = items.filter((p) => (p.superficie_util_m2 ?? 0) >= minM2Const);
  }

  const minM2Terreno = toInt(q.minM2Terreno);
  if (!Number.isNaN(minM2Terreno)) {
    items = items.filter((p) => (p.superficie_terreno_m2 ?? 0) >= minM2Terreno);
  }

  const estac = toInt(q.estac);
  if (!Number.isNaN(estac)) {
    items = items.filter((p) => ((p as any).estacionamientos ?? 0) >= estac);
  }

  // solo destacadas
  if (norm(q.destacada) === 'true') items = items.filter((p) => !!p.destacada);

  // orden
  items.sort((a, b) => {
    if (!!b.destacada !== !!a.destacada) return Number(!!b.destacada) - Number(!!a.destacada);
    return (b.precio_uf ?? 0) - (a.precio_uf ?? 0);
  });

  // paginación
  const offset = Math.max(0, toInt(q.offset) || 0);
  const limit = Math.max(0, toInt(q.limit) || items.length);
  const page = items.slice(offset, offset + limit);

  return NextResponse.json({ data: page });
}
