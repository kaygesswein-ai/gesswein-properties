// app/api/propiedades/[id]/route.ts  (REAL: usa Supabase/PostgREST)
import { NextResponse } from 'next/server';
import { supaRest } from '@/lib/supabase-rest';

// Helper chiquito para llamar a la vista
async function fetchOneBy(column: 'id' | 'slug', value: string) {
  const qs = new URLSearchParams();
  qs.set('select', '*');
  qs.set(column, `eq.${value}`);
  qs.set('limit', '1');

  // IMPORTANTE: usamos la vista propiedades_api
  const res = await supaRest(`propiedades_api?${qs.toString()}`);
  if (!res.ok) {
    const err = await res.text().catch(() => '');
    throw new Error(err || `PostgREST error (${res.status})`);
  }
  const data = await res.json().catch(() => null);
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const raw = decodeURIComponent(params.id || '');

    // 1) busca por id (uuid) y 2) si no, por slug
    let row = await fetchOneBy('id', raw).catch(() => null);
    if (!row) row = await fetchOneBy('slug', raw).catch(() => null);

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: row }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal error', details: String(err?.message || err) },
      { status: 500 },
    );
  }
}

// export const runtime = 'edge'; // opcional

