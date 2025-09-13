import { NextResponse } from 'next/server';
import { supaRest } from '@/lib/supabase-rest';

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.nombre || !body?.acepta_terminos) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }
  await supaRest('referidos', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify([{
      nombre: body.nombre,
      email: body.email ?? null,
      telefono: body.telefono ?? null,
      relacion: body.relacion ?? null,
      comuna: body.comuna ?? null,
      tipo: body.tipo ?? null,
      estimacion_precio: body.estimacion_precio ?? null,
      direccion_referida: body.direccion_referida ?? null,
      acepta_terminos: !!body.acepta_terminos,
      estado: 'nuevo',
    }]),
    useServiceRole: true,
  });
  return NextResponse.json({ ok: true });
}



