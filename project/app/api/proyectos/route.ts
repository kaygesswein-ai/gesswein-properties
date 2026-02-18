// app/api/proyectos/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // ideal: service role en server. Si no está, cae a anon.
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function toBool(v: string | null): boolean | null {
  if (v == null) return null;
  const s = v.trim().toLowerCase();
  if (s === 'true' || s === '1' || s === 't' || s === 'yes') return true;
  if (s === 'false' || s === '0' || s === 'f' || s === 'no') return false;
  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const operacion = searchParams.get('operacion') || '';
  const tipo = searchParams.get('tipo') || '';
  const comuna = searchParams.get('comuna') || '';
  const publicadoParam = toBool(searchParams.get('publicado')); // ✅ boolean real

  let q = supabase
    .from('proyectos')
    .select(
      [
        'id',
        'created_at',
        'slug',
        'titulo',
        'operacion',
        'tipo',
        'region',
        'comuna',
        'barrio',
        'precio_uf',
        'sello_tipo',
        'tasa_novacion',
        'portada_url',
        'portada_fija_url',
        'imagenes',
        'publicado',
      ].join(',')
    )
    .order('created_at', { ascending: false });

  if (operacion) q = q.eq('operacion', operacion);
  if (tipo) q = q.ilike('tipo', `${tipo}%`);
  if (comuna) q = q.eq('comuna', comuna);

  // ✅ aquí está el fix
  if (publicadoParam !== null) q = q.eq('publicado', publicadoParam);

  const { data, error } = await q;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, max-age=0' } }
    );
  }

  return NextResponse.json(
    { data: data ?? [] },
    { headers: { 'Cache-Control': 'no-store, no-cache, max-age=0' } }
  );
}
