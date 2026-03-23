import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const requiredFields = [
      'referente_nombre',
      'referente_email',
      'referente_telefono',
      'referido_nombre',
      'referido_email',
      'referido_telefono',
      'servicio_necesita',
      'tipo_propiedad',
      'region',
      'comuna',
    ];

    for (const field of requiredFields) {
      if (!body?.[field] || String(body[field]).trim() === '') {
        return NextResponse.json(
          { error: `Falta el campo requerido: ${field}` },
          { status: 400 }
        );
      }
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Falta configuración del servidor para guardar referidos.' },
        { status: 500 }
      );
    }

    const payload = {
      referente_nombre: body.referente_nombre,
      referente_email: body.referente_email,
      referente_telefono: body.referente_telefono,
      referido_nombre: body.referido_nombre,
      referido_email: body.referido_email,
      referido_telefono: body.referido_telefono,
      servicio_necesita: body.servicio_necesita,
      tipo_propiedad: body.tipo_propiedad,
      region: body.region,
      comuna: body.comuna,
      precio_min_uf: body.precio_min_uf ?? null,
      precio_max_uf: body.precio_max_uf ?? null,
      comentarios: body.comentarios ?? null,
      estado: 'nuevo',
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/referidos_programa`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data?.message || data?.error || 'No fue posible guardar el referido.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Referido guardado correctamente.',
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado al procesar el referido.' },
      { status: 500 }
    );
  }
}
