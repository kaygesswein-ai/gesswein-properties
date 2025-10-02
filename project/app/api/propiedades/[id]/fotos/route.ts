// app/api/propiedades/[id]/fotos/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 1) Re-usa tus env vars
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // ó ANON KEY si solo lectura
);

export const runtime = 'edge';           // opcional-pero-recomendado
export const revalidate = 60 * 60 * 2;   // 2 h de cache del lado servidor

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // ↓ propiedades_fotos tiene: id (uuid), propiedad_id (uuid FK), url (text), tag (text)
  const { data, error } = await supabase
    .from('propiedades_fotos')
    .select('url, tag')
    .eq('propiedad_id', id)
    .order('orden', { ascending: true });     // si tienes columna “orden”

  if (error) {
    console.error('[GET /api/propiedades/:id/fotos]', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}
