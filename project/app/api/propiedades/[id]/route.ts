// app/api/propiedades/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usa SIEMPRE la ANON KEY en producción -tiene los mismos permisos RLS-
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const runtime   = 'edge';
export const revalidate = 60 * 10; // 10 min

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // 👇 Aseguramos traer TODOS los campos que usa la UI, incluyendo
  // descripcion, tags, map_lat, map_lng y map_zoom
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
      tags
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('[api/propiedades/:id] ', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}
