import { NextResponse } from 'next/server';
import { supaRest } from '@/lib/supabase-rest';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const comuna = searchParams.get('comuna');
  const operacion = searchParams.get('operacion');
  const tipo = searchParams.get('tipo');

  const qs = new URLSearchParams();
  qs.set('select', '*');
  qs.set('order', 'created_at.desc');
  if (comuna) qs.set('comuna', `eq.${comuna}`);
  if (operacion) qs.set('operacion', `eq.${operacion}`);
  if (tipo) qs.set('tipo', `eq.${tipo}`);

  const res = await supaRest(`propiedades?${qs.toString()}`);
  const data = await res.json();
  return NextResponse.json({ data });
}

