// app/api/propiedades/[id]/fotos/route.ts
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

  // Trae url, categoria y orden, ordenadas por "orden" primero
  const { data, error } = await supabase
    .from('propiedades_fotos')
    .select('url, categoria, orden')
    .eq('propiedad_id', id)
    .order('orden', { ascending: true, nullsFirst: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Normalizo nombres para el front
  const rows = (data ?? []).map((r: any) => ({
    url: r.url,
    tag: r.categoria,     // <- el front trabaja con "tag"
    orden: r.orden ?? null
  }));

  return NextResponse.json({ data: rows });
}
