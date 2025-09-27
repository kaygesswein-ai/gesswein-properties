// Endpoint único. Soporta filtros incluidos 'destacada=true'.
// Reemplaza COMPLETO este archivo.

import { NextResponse } from 'next/server';
import { PROPERTIES, Property } from '../../../project/lib/properties';

function toInt(v: string | null) {
  if (!v) return NaN;
  const n = parseInt(v.replace(/\./g, ''), 10);
  return Number.isFinite(n) ? n : NaN;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const operacion = (searchParams.get('operacion') || '').toLowerCase();
  const tipo = (searchParams.get('tipo') || '').toLowerCase();
  const region = (searchParams.get('region') || '').toLowerCase();
  const comuna = (searchParams.get('comuna') || '').toLowerCase();
  const barrio = (searchParams.get('barrio') || '').toLowerCase(); // reservado

  const minUF = toInt(searchParams.get('minUF'));
  const maxUF = toInt(searchParams.get('maxUF'));
  const minCLP = toInt(searchParams.get('minCLP'));
  const maxCLP = toInt(searchParams.get('maxCLP'));

  const minDorm = toInt(searchParams.get('minDorm'));
  const minBanos = toInt(searchParams.get('minBanos'));
  const minM2Const = toInt(searchParams.get('minM2Const'));
  const minM2Terreno = toInt(searchParams.get('minM2Terreno'));
  const minEstac = toInt(searchParams.get('minEstac'));

  const destacadaParam = searchParams.get('destacada');
  const onlyFeatured = destacadaParam === 'true';

  const limit = toInt(searchParams.get('limit'));
  const nLimit = Number.isNaN(limit) ? undefined : Math.max(1, limit);

  let data = PROPERTIES.slice();

  // destacado primero
  if (onlyFeatured) data = data.filter(p => !!p.destacada);

  // texto libre
  if (q) {
    data = data.filter(p => {
      const hay =
        (p.titulo || '').toLowerCase().includes(q) ||
        (p.comuna || '').toLowerCase().includes(q) ||
        (p.tipo || '').toLowerCase().includes(q);
      return hay;
    });
  }

  // filtros simples
  if (operacion) data = data.filter(p => (p.operacion || '').toLowerCase() === operacion);
  if (tipo) data = data.filter(p => (p.tipo || '').toLowerCase() === tipo);
  if (region) data = data.filter(p => (p.region || '').toLowerCase() === region);
  if (comuna) data = data.filter(p => (p.comuna || '').toLowerCase() === comuna);
  if (barrio) data = data; // reservado futuro

  // rango de precio
  data = data.filter(p => {
    const uf = typeof p.precio_uf === 'number' ? p.precio_uf! : null;
    const clp = typeof p.precio_clp === 'number' ? p.precio_clp! : null;

    if (!Number.isNaN(minUF) && uf !== null && uf < minUF) return false;
    if (!Number.isNaN(maxUF) && uf !== null && uf > maxUF) return false;
    if (!Number.isNaN(minCLP) && clp !== null && clp < minCLP) return false;
    if (!Number.isNaN(maxCLP) && clp !== null && clp > maxCLP) return false;

    // si solo viene UF y la propiedad no tiene UF, la dejamos pasar (se maneja en UI con UF del día)
    return true;
  });

  // avanzados
  if (!Number.isNaN(minDorm)) data = data.filter(p => (p.dormitorios ?? 0) >= minDorm);
  if (!Number.isNaN(minBanos)) data = data.filter(p => (p.banos ?? 0) >= minBanos);
  if (!Number.isNaN(minM2Const)) data = data.filter(p => (p.superficie_util_m2 ?? 0) >= minM2Const);
  if (!Number.isNaN(minM2Terreno)) data = data.filter(p => (p.superficie_terreno_m2 ?? 0) >= minM2Terreno);
  if (!Number.isNaN(minEstac)) data = data.filter(p => (p.estacionamientos ?? 0) >= minEstac);

  // orden simple: destacadas primero, luego por precio UF desc
  data.sort((a: Property, b: Property) => {
    const d = Number(!!b.destacada) - Number(!!a.destacada);
    if (d !== 0) return d;
    const au = a.precio_uf ?? 0;
    const bu = b.precio_uf ?? 0;
    return bu - au;
  });

  if (nLimit) data = data.slice(0, nLimit);

  return NextResponse.json({ ok: true, data });
}
