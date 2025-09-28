// app/api/propiedades/[id]/route.ts
import { NextResponse } from 'next/server';
import { supaRest } from '@/lib/supabase-rest';

type Row = Record<string, any> | null;

async function fetchBy(column: 'id' | 'slug', value: string): Promise<Row> {
  const qs = new URLSearchParams();
  qs.set('select', '*');
  qs.set(column, `eq.${value}`);
  qs.set('limit', '1');

  const res = await supaRest(`propiedades?${qs.toString()}`);
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || `PostgREST error (${res.status})`);
  }
  const data = await res.json().catch(() => null);
  return Array.isArray(data) && data.length > 0 ? (data[0] as Row) : null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const raw = decodeURIComponent(params.id || '');
    let row = await fetchBy('id', raw).catch(() => null);
    if (!row) row = await fetchBy('slug', raw).catch(() => null);

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
