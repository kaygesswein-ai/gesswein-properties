// app/api/propiedades/[id]/route.ts
import { NextResponse } from 'next/server';
import { supaRest } from '@/lib/supabase-rest';

async function fetchBy(column: string, value: string) {
  const qs = new URLSearchParams();
  qs.set('select', '*');
  qs.set(column, `eq.${value}`);
  qs.set('limit', '1');
  const res = await supaRest(`propiedades?${qs.toString()}`);
  if (!res.ok) {
    // si PostgREST devuelve error, lo propagamos
    const err = await res.text();
    throw new Error(err || `Error al consultar por ${column}`);
  }
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // 1) intenta por columna "id"
  let row = await fetchBy('id', id).catch(() => null);

  // 2) si no hay resultado, intenta por columna "slug"
  if (!row) {
    row = await fetchBy('slug', id).catch(() => null);
  }

  if (!row) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ data: row });
}
