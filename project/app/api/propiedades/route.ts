// project/app/api/propiedades/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const runtime = 'edge';
export const revalidate = 60 * 20; // 20 minutos

export async function GET() {
  // 1) Trae todas las publicadas desde tu vista
  const { data: props, error: e1 } = await supabase
    .from('propiedades_api')
    .select('*')
    .order('created_at', { ascending: false });

  if (e1) {
    console.error('[api/propiedades] propiedades_api', e1);
    return NextResponse.json({ success: false, error: e1.message }, { status: 500 });
  }

  if (!props || props.length === 0) {
    return NextResponse.json({ success: true, data: [] });
  }

  // 2) Detecta cuáles no traen coverImage
  const sinCover = props.filter(p => !p.coverImage).map(p => p.id as string);
  let covers: Record<string, string> = {};

  if (sinCover.length > 0) {
    // Traemos la primera foto por propiedad (orden ascendente)
    const { data: fotos, error: e2 } = await supabase
      .from('propiedades_fotos')
      .select('propiedad_id, url, orden')
      .in('propiedad_id', sinCover)
      .order('orden', { ascending: true });

    if (e2) {
      console.error('[api/propiedades] fotos para covers', e2);
    } else {
      // Nos quedamos con el primer url por propiedad_id
      for (const f of fotos ?? []) {
        const pid = f.propiedad_id as string;
        if (!covers[pid]) covers[pid] = f.url; // solo la primera
      }
    }
  }

  // 3) Merge: si no hay coverImage, usar el de "covers"
  const merged = props.map(p => ({
    ...p,
    coverImage: p.coverImage || covers[p.id as string] || null
  }));

  return NextResponse.json({ success: true, data: merged });
}
