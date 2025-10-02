// project/app/api/propiedades/[id]/fotos/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// --- 1) CLIENTE SUPABASE (solo lectura: usa la ANON KEY) ----
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!   // <— NO uses la service-role en el front
);

// --- 2) HANDLER ---------------------------------------------
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // propiedades_fotos: id (uuid PK), propiedad_id (uuid FK), url (text), tag (text), orden (int)
  const { data, error } = await supabase
    .from('propiedades_fotos')
    .select('url, tag')
    .eq('propiedad_id', id)
    .order('orden', { ascending: true });

  if (error) {
    console.error('[GET /api/propiedades/:id/fotos]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
