import { NextResponse } from 'next/server';
import { PROPERTIES, Property } from './_data/properties';

/* ================= utilidades ================= */
const stripDiacritics = (s: string) =>
  (s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const normTxt = (s?: string | null) => stripDiacritics((s ?? '').trim().toLowerCase());

function toInt(s?: string) {
  if (!s) return NaN;
  const n = parseInt(String(s).replace(/\D+/g, ''), 10);
  return Number.isFinite(n) ? n : NaN;
}

// normaliza nombre de región y acepta alias
const normalizeRegion = (s?: string) =>
  normTxt(s)
    .replace(/regi[oó]n/g, '')
    .replace(/\bmetropolitana(?:\s+de\s+santiago)?/g, 'metropolitana')
    .replace(/\brm\b/g, 'metropolitana')
    .replace(/^\s*(?:[ivxlcdm]+)\s*-\s*/i, '') // quita romanos "X - "
    .replace(/\bde\b|\bdel\b|\bla\b|\bel\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const sameRegion = (a?: string, b?: string) => {
  const na = normalizeRegion(a), nb = normalizeRegion(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
};

/* Comunas mínimas para inferir región cuando falta */
const COMUNAS_TO_REGION: Record<string, string> = {};
[
  ['Metropolitana de Santiago', [
    'Las Condes','Vitacura','Lo Barnechea','Providencia','Santiago','Ñuñoa','La Reina',
    'Huechuraba','La Florida','Maipú','Puente Alto','Colina','Lampa','Talagante','Peñalolén','Macul',
  ]],
  ['Valparaíso', [
    'Viña del Mar','Valparaíso','Concón','Quilpué','Villa Alemana','Limache','Olmué','Tunquén',
  ]],
].forEach(([region, comunas]) => {
  (comunas as string[]).forEach(c => { COMUNAS_TO_REGION[normTxt(c)] = region as string; });
});

function inferRegionByComuna(p: Property): string | undefined {
  const c = normTxt(p.comuna);
  return COMUNAS_TO_REGION[c];
}

/* ================= handler ================= */
type Q = {
  q?: string;
  operacion?: string;
  tipo?: string;
  region?: string;
  comuna?: string;
  barrio?: string;
  minUF?: string;
  maxUF?: string;
  minCLP?: string;
  maxCLP?: string;
  minDorm?: string;
  minBanos?: string;
  minM2Const?: string;
  minM2Terreno?: string;
  estac?: string;
  destacada?: string;
  limit?: string;
  offset?: string;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = Object.fromEntries(url.searchParams.entries()) as Q;

  // Pre-normaliza datos: "sitio" -> "Terreno" y completa región si falta
  let items: Property[] = PROPERTIES.map((p) => {
    const tipoNorm = normTxt(p.tipo).includes('sitio') ? 'Terreno' : p.tipo;
    const regionFinal = p.region || inferRegionByComuna(p);
    return { ...p, tipo: tipoNorm, region: regionFinal };
  });

  // ---- Texto libre (título / comuna / tipo)
  if (q.q) {
    const needle = normTxt(q.q);
    items = items.filter(
      (p) =>
        normTxt(p.titulo).includes(needle) ||
        normTxt(p.comuna).includes(needle) ||
        normTxt(p.tipo).includes(needle),
    );
  }

  // ---- Filtros exactos (case/diacríticos insensitive)
  if (q.operacion) items = items.filter((p) => normTxt(p.operacion) === normTxt(q.operacion));
  if (q.tipo)       items = items.filter((p) => normTxt(p.tipo) === normTxt(q.tipo));

  if (q.region) {
    const wanted = q.region; // puede venir "RM - Metropolitana..." o "Metropolitana de Santiago"
    items = items.filter((p) => sameRegion(p.region || inferRegionByComuna(p), wanted));
  }

  if (q.comuna) {
    const c = normTxt(q.comuna);
    items = items.filter((p) => normTxt(p.comuna) === c);
  }

  if (q.barrio) {
    const b = normTxt(q.barrio);
    // si manejas "barrio" en datos, úsalo; si no, se filtra por título
    items = items.filter(
      (p) => normTxt((p as any).barrio).includes(b) || normTxt(p.titulo).includes(b),
    );
  }

  // ---- Numéricos
  const minUF = toInt(q.minUF);
  const maxUF = toInt(q.maxUF);
  if (!Number.isNaN(minUF)) items = items.filter((p) => (p.precio_uf ?? Infinity) >= minUF);
  if (!Number.isNaN(maxUF)) items = items.filter((p) => (p.precio_uf ?? -Infinity) <= maxUF);

  const minCLP = toInt(q.minCLP);
  const maxCLP = toInt(q.maxCLP);
  if (!Number.isNaN(minCLP)) items = items.filter((p) => (p.precio_clp ?? Infinity) >= minCLP);
  if (!Number.isNaN(maxCLP)) items = items.filter((p) => (p.precio_clp ?? -Infinity) <= maxCLP);

  const minDorm = toInt(q.minDorm);
  if (!Number.isNaN(minDorm)) items = items.filter((p) => (p.dormitorios ?? 0) >= minDorm);

  const minBanos = toInt(q.minBanos);
  if (!Number.isNaN(minBanos)) items = items.filter((p) => (p.banos ?? 0) >= minBanos);

  const minM2Const = toInt(q.minM2Const);
  if (!Number.isNaN(minM2Const)) items = items.filter((p) => (p.superficie_util_m2 ?? 0) >= minM2Const);

  const minM2Terreno = toInt(q.minM2Terreno);
  if (!Number.isNaN(minM2Terreno)) items = items.filter((p) => (p.superficie_terreno_m2 ?? 0) >= minM2Terreno);

  const estac = toInt(q.estac);
  if (!Number.isNaN(estac)) items = items.filter((p) => ((p as any).estacionamientos ?? 0) >= estac);

  if (normTxt(q.destacada) === 'true') items = items.filter((p) => !!p.destacada);

  // ---- Orden y paginación
  items.sort((a, b) => {
    if (!!b.destacada !== !!a.destacada) return Number(!!b.destacada) - Number(!!a.destacada);
    return (b.precio_uf ?? 0) - (a.precio_uf ?? 0);
  });

  const offset = Math.max(0, toInt(q.offset) || 0);
  const limit = Math.max(0, toInt(q.limit) || items.length);
  const page = items.slice(offset, offset + limit);

  return NextResponse.json({ data: page });
}
