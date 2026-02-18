import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const operacion = searchParams.get('operacion') || '';
  const tipo = searchParams.get('tipo') || '';
  const comuna = searchParams.get('comuna') || '';
  const publicadoParam = searchParams.get('publicado'); // "true" | "false" | null
  const publicado =
    publicadoParam == null ? null : publicadoParam === 'true';

  let q = supabase
    .from('proyectos')
    .select(
      `
        id,
        slug,
        titulo,
        operacion,
        tipo,
        region,
        comuna,
        barrio,
        precio_uf,
        sello_tipo,
        tasa_novacion,
        portada_url,
        portada_fija_url,
        imagenes,
        publicado,
        created_at
      `
    )
    .order('created_at', { ascending: false });

  if (publicado !== null) q = q.eq('publicado', publicado);
  if (operacion) q = q.eq('operacion', operacion.toLowerCase());
  if (tipo) q = q.ilike('tipo', `${tipo}%`);
  if (comuna) q = q.eq('comuna', comuna);

  const { data, error } = await q;

  if (error) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  }

  return NextResponse.json(
    { data: data ?? [] },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
}
