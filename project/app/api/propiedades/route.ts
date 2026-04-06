// project/app/api/propiedades/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const runtime = 'edge';
export const revalidate = 60 * 20; // 20 minutos

function parseBoolean(value: string | null): boolean | null {
  if (value === null) return null;
  const v = value.trim().toLowerCase();
  if (v === 'true') return true;
  if (v === 'false') return false;
  return null;
}

function parseNumber(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const operacion = searchParams.get('operacion')?.trim() || '';
  const tipo = searchParams.get('tipo')?.trim() || '';
  const comuna = searchParams.get('comuna')?.trim() || '';
  const destacada = parseBoolean(searchParams.get('destacada'));

  const minUF = parseNumber(searchParams.get('minUF'));
  const maxUF = parseNumber(searchParams.get('maxUF'));
  const minCLP = parseNumber(searchParams.get('minCLP'));
  const maxCLP = parseNumber(searchParams.get('maxCLP'));

  const minDorm = parseNumber(searchParams.get('minDorm'));
  const minBanos = parseNumber(searchParams.get('minBanos'));
  const minM2Const = parseNumber(searchParams.get('minM2Const'));
  const minM2Terreno = parseNumber(searchParams.get('minM2Terreno'));
  const minEstac = parseNumber(searchParams.get('minEstac'));

  const limit = parseNumber(searchParams.get('limit'));

  let query = supabase
    .from('propiedades_api')
    .select('*')
    .order('created_at', { ascending: false });

  if (operacion) query = query.ilike('operacion', operacion);
  if (tipo) query = query.ilike('tipo', `${tipo}%`);
  if (comuna) query = query.ilike('comuna', comuna);

  if (destacada !== null) {
    query = query.eq('destacada', destacada);
  }

  if (minUF !== null) query = query.gte('precio_uf', minUF);
  if (maxUF !== null) query = query.lte('precio_uf', maxUF);

  if (minDorm !== null) query = query.gte('dormitorios', minDorm);
  if (minBanos !== null) query = query.gte('banos', minBanos);
  if (minM2Const !== null) query = query.gte('superficie_util_m2', minM2Const);
  if (minM2Terreno !== null) query = query.gte('superficie_terreno_m2', minM2Terreno);
  if (minEstac !== null) query = query.gte('estacionamientos', minEstac);

  if (limit !== null && limit > 0) {
    query = query.limit(limit);
  }

  const { data: props, error: e1 } = await query;

  if (e1) {
    console.error('[api/propiedades] propiedades_api', e1);
    return NextResponse.json({ success: false, error: e1.message }, { status: 500 });
  }

  if (!props || props.length === 0) {
    return NextResponse.json({ success: true, data: [] });
  }

  const propsWithCLPFilter = props.filter((p: any) => {
    if (minCLP !== null) {
      if (typeof p.precio_clp !== 'number' || p.precio_clp < minCLP) return false;
    }
    if (maxCLP !== null) {
      if (typeof p.precio_clp !== 'number' || p.precio_clp > maxCLP) return false;
    }
    return true;
  });

  const sinCover = propsWithCLPFilter
    .filter((p) => !p.coverImage)
    .map((p) => p.id as string);

  let covers: Record<string, string> = {};

  if (sinCover.length > 0) {
    const { data: fotos, error: e2 } = await supabase
      .from('propiedades_fotos')
      .select('propiedad_id, url, orden')
      .in('propiedad_id', sinCover)
      .order('orden', { ascending: true });

    if (e2) {
      console.error('[api/propiedades] fotos para covers', e2);
    } else {
      for (const f of fotos ?? []) {
        const pid = f.propiedad_id as string;
        if (!covers[pid]) covers[pid] = f.url;
      }
    }
  }

  const merged = propsWithCLPFilter.map((p: any) => ({
    ...p,
    coverImage: p.coverImage || covers[p.id as string] || null,
    es_proyecto_exclusivo: Boolean(p.es_proyecto_exclusivo),
    destacada: Boolean(p.destacada),
  }));

  return NextResponse.json({ success: true, data: merged });
}
