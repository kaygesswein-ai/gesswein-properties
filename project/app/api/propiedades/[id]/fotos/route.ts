// project/app/api/propiedades/[id]/fotos/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Usa la ANON KEY en producción (RLS aplica igual en modo lectura)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const runtime = 'edge';
export const revalidate = 60 * 60 * 2; // 2 horas

type Row = {
  url: string;
  categoria: 'exterior' | 'interior' | 'planos' | null;
  orden: number | null;
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data, error } = await supabase
    .from('propiedades_fotos')
    .select('url,categoria,orden')
    .eq('propiedad_id', id)
    .order('orden', { ascending: true });

  if (error) {
    console.error('[api/propiedades/:id/fotos]', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  const photos = (data as Row[] | null)?.map((r) => ({
    url: r.url,
    categoria: r.categoria,
    // Alias "tag" por compatibilidad con código antiguo
    tag: r.categoria,
    orden: r.orden ?? 0,
  })) ?? [];

  return NextResponse.json({ success: true, data: photos });
}
