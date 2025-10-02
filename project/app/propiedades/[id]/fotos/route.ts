/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// --- cliente admin (solo lado servidor) ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/propiedades/:id/fotos
 * Devuelve [{ url, categoria, orden }]
 */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const { data, error } = await supabase
    .from('propiedades_fotos')
    .select('url, categoria, orden')
    .eq('propiedad_id', id)
    .order('orden', { ascending: true });

  if (error) {
    console.error('propiedades_fotos:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
