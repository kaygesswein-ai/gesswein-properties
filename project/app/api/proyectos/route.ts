// project/app/api/proyectos/route.ts
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
  const { data: rows, error: e1 } = await supabase
    .from('proyectos_api')
    .select('*')
    .order('created_at', { ascending: false });

  if (e1) {
    console.error('[api/proyectos] proyectos_api', e1);
    return NextResponse.json({ success: false, error: e1.message }, { status: 500 });
  }

  if (!rows || rows.length === 0) {
    return NextResponse.json({ success: true, data: [] });
  }

  // 2) Detecta cuáles no traen coverImage
  const sinCover = rows.filter((p: any) => !p.coverImage).map((p: any) => p.id as string);
  let covers: Record<string, string> = {};

  if (sinCover.length > 0) {
    const { data: fotos, error: e2 } = await supabase
      .from('proyectos_fotos')
      .select('proyecto_id, url, orden')
      .in('proyecto_id', sinCover)
      .order('orden', { ascending: true });

    if (e2) {
      console.error('[api/proyectos] fotos para covers', e2);
    } else {
      for (const f of fotos ?? []) {
        const pid = f.proyecto_id as string;
        if (!covers[pid]) covers[pid] = f.url; // primera
      }
    }
  }

  // 3) Merge
  const merged = rows.map((p: any) => ({
    ...p,
    coverImage: p.coverImage || covers[p.id as string] || null,
  }));

  return NextResponse.json({ success: true, data: merged });
}
