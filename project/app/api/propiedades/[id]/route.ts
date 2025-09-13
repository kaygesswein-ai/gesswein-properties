import { NextResponse } from 'next/server';
import { supaRest } from '@/lib/supabase-rest';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const qs = new URLSearchParams();
  qs.set('select', '*');
  qs.set('id', `eq.${id}`);
  qs.set('limit', '1');

  const res = await supaRest(`propiedades?${qs.toString()}`);
  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ data: data[0] });
}


