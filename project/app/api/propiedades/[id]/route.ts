// app/api/propiedades/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('propiedades')
    .select(`
      id, slug, titulo, comuna, region, operacion, tipo,
      precio_uf, precio_clp, dormitorios, banos,
      superficie_util_m2, superficie_terreno_m2, estacionamientos,
      created_at, descripcion, imagenes, barrio,
      portada_url, map_lat, map_lng, map_zoom,
      tags
    `)
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: { 'Cache-Control':'no-store' } });
  }
  return NextResponse.json({ data }, { headers: { 'Cache-Control':'no-store, no-cache, max-age=0' } });
}
