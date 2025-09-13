import { NextResponse } from 'next/server';
import { supaRest } from '@/lib/supabase-rest';

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.nombre) {
    return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 });
  }
  await supaRest('leads', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify([{
      nombre: body.nombre,
      email: body.email ?? null,
      telefono: body.telefono ?? null,
      mensaje: body.mensaje ?? null,
      propiedad_id: body.propiedad_id ?? null,
      origen: 'web',
    }]),
    useServiceRole: true,
  });
  return NextResponse.json({ ok: true });
}


