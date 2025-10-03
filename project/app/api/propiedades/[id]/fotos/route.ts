// project/app/api/propiedades/[id]/fotos/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usa SIEMPRE la ANON KEY en producción (respeta RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cambiamos a nodejs para evitar problemas de envs en Edge
export const runtime = 'nodejs';

// No cachear este endpoint
export const revalidate = 0;

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { data, error } = await supabase
      .from('propiedades_fotos')
      .select('url, tag, orden')
      .eq('propiedad_id', id)
      .order('orden', { ascending: true });

    if (error) {
      console.error('[api/propiedades/:id/fotos] supabase error', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    console.error('[api/propiedades/:id/fotos] exception', e);
    return NextResponse.json(
      { success: false, error: e?.message ?? 'unknown' },
      { status: 500 }
    );
  }
}
