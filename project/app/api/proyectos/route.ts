import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function GET(req: Request) {
  try {
    const supabase = getSupabaseServer();
    const { searchParams } = new URL(req.url);

    const operacion = searchParams.get('operacion');
    const tipo = searchParams.get('tipo');
    const region = searchParams.get('region');
    const comuna = searchParams.get('comuna');
    const barrio = searchParams.get('barrio');

    const minUF = searchParams.get('minUF');
    const maxUF = searchParams.get('maxUF');
    const minCLP = searchParams.get('minCLP');
    const maxCLP = searchParams.get('maxCLP');

    const minDorm = searchParams.get('minDorm');
    const minBanos = searchParams.get('minBanos');
    const minM2Const = searchParams.get('minM2Const');
    const minM2Terreno = searchParams.get('minM2Terreno');
    const minEstac = searchParams.get('minEstac');

    // Base query
    let q = supabase
      .from('proyectos')
      .select(
        `
        id,
        titulo,
        operacion,
        tipo,
        region,
        comuna,
        barrio,
        precio_uf,
        precio_clp,
        dormitorios,
        banos,
        superficie_util_m2,
        superficie_terreno_m2,
        estacionamientos,
        portada_url,
        portada_fija_url,
        sello_tipo,
        tasa_novacion,
        publicado
        `,
      )
      .eq('publicado', true);

    // Text filters
    if (operacion) q = q.ilike('operacion', operacion);
    if (tipo) q = q.ilike('tipo', `${tipo}%`);
    if (region) q = q.ilike('region', region);
    if (comuna) q = q.ilike('comuna', comuna);
    if (barrio) q = q.ilike('barrio', barrio);

    // Price filters
    if (minUF) q = q.gte('precio_uf', Number(minUF));
    if (maxUF) q = q.lte('precio_uf', Number(maxUF));
    if (minCLP) q = q.gte('precio_clp', Number(minCLP));
    if (maxCLP) q = q.lte('precio_clp', Number(maxCLP));

    // Advanced numeric filters
    if (minDorm) q = q.gte('dormitorios', Number(minDorm));
    if (minBanos) q = q.gte('banos', Number(minBanos));
    if (minM2Const) q = q.gte('superficie_util_m2', Number(minM2Const));
    if (minM2Terreno) q = q.gte('superficie_terreno_m2', Number(minM2Terreno));
    if (minEstac) q = q.gte('estacionamientos', Number(minEstac));

    // Order: latest first (si tienes created_at, mejor)
    q = q.order('titulo', { ascending: true });

    const { data, error } = await q;

    if (error) {
      return NextResponse.json({ ok: false, error: error.message, data: [] }, { status: 200 });
    }

    return NextResponse.json({ ok: true, data: data ?? [] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Unknown error', data: [] },
      { status: 200 },
    );
  }
}
