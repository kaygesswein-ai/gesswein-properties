// project/app/api/propiedades/[id]/route.ts
import { NextResponse } from 'next/server';
import { supaRest } from '@/lib/supabase-rest';

async function fetchBy(column: string, value: string) {
  const qs = new URLSearchParams();
  qs.set('select', '*');
  qs.set(column, `eq.${value}`);
  qs.set('limit', '1');

  const res = await supaRest(`propiedades?${qs.toString()}`, { cache: 'no-store' });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Error al consultar por ${column}`);
  }
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const idOrSlug = decodeURIComponent(params.id);

  let row = await fetchBy('id', idOrSlug).catch(() => null);

  if (!row) {
    // si tienes columna slug en la tabla, habilita esto
    row = await fetchBy('slug', idOrSlug).catch(() => null);
  }

  if (!row) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ data: row });
}
