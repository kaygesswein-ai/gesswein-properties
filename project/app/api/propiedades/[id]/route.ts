// app/api/propiedades/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Selecciona los campos que usa la ficha, incluyendo portada y mapa
  const { data, error } = await supabase
    .from('propiedades')
    .select(`
      id,
      slug,
      titulo,
      comuna,
      region,
      operacion,
      tipo,
      precio_uf,
      precio_clp,
      dormitorios,
      banos,
      superficie_util_m2,
      superficie_terreno_m2,
      estacionamientos,
      created_at,
      descripcion,
      imagenes,
      barrio,
      map_lat,
      map_lng,
      map_zoom,
      portada_url
    `)
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
