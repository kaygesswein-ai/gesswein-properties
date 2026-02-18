// app/api/proyectos/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const operacion = searchParams.get('operacion') || '';
  const tipo = searchParams.get('tipo') || '';
  const comuna = searchParams.get('comuna') || '';
  const publicado = searchParams.get('publicado'); // 'true' | 'false' | null

  try {
    let q = supabase
      .from('proyectos')
      .select(
        `
        id, created_at, slug, titulo,
        operacion, tipo,
        region, comuna, barrio,
        precio_uf,
        sello_tipo, tasa_novacion,
        portada_url, portada_fija_url,
        publicado
        `
      )
      .order('created_at', { ascending: false });

    if (publicado) q = q.eq('publicado', publicado === 'true');
    if (operacion) q = q.eq('operacion', operacion);
    if (tipo) q = q.ilike('tipo', `${tipo}%`);
    if (comuna) q = q.eq('comuna', comuna);

    const { data, error } = await q;

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, max-age=0' } }
      );
    }

    return NextResponse.json(
      { ok: true, count: data?.length ?? 0, data: data ?? [] },
      { headers: { 'Cache-Control': 'no-store, no-cache, max-age=0' } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, max-age=0' } }
    );
  }
}


