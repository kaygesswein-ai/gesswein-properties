import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error:
            'Falta configuración del servidor para guardar referidos en Supabase.',
        },
        { status: 500 }
      );
    }

    const referidosTo =
      process.env.REFERIDOS_TO || 'contacto@gessweinproperties.com';

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

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/referidos_programa`, {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    const insertData = await insertRes.json().catch(() => null);

    if (!insertRes.ok) {
      return NextResponse.json(
        {
          error:
            insertData?.message ||
            insertData?.error ||
            'No fue posible guardar el referido.',
        },
        { status: 500 }
      );
    }

    const precioMin =
      body.precio_min_uf !== null &&
      body.precio_min_uf !== undefined &&
      body.precio_min_uf !== ''
        ? `${body.precio_min_uf} UF`
        : 'No informado';

    const precioMax =
      body.precio_max_uf !== null &&
      body.precio_max_uf !== undefined &&
      body.precio_max_uf !== ''
        ? `${body.precio_max_uf} UF`
        : 'No informado';

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="color: #0A2E57;">Nuevo referido recibido desde la web</h2>

        <h3 style="margin-top: 24px; color: #0A2E57;">Referente</h3>
        <p><strong>Nombre:</strong> ${escapeHtml(body.referente_nombre)}</p>
        <p><strong>Email:</strong> ${escapeHtml(body.referente_email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(body.referente_telefono)}</p>

        <h3 style="margin-top: 24px; color: #0A2E57;">Referido</h3>
        <p><strong>Nombre:</strong> ${escapeHtml(body.referido_nombre)}</p>
        <p><strong>Email:</strong> ${escapeHtml(body.referido_email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(body.referido_telefono)}</p>

        <h3 style="margin-top: 24px; color: #0A2E57;">Preferencias</h3>
        <p><strong>Servicio:</strong> ${escapeHtml(body.servicio_necesita)}</p>
        <p><strong>Tipo de propiedad:</strong> ${escapeHtml(body.tipo_propiedad)}</p>
        <p><strong>Región:</strong> ${escapeHtml(body.region)}</p>
        <p><strong>Comuna:</strong> ${escapeHtml(body.comuna)}</p>
        <p><strong>Precio mínimo:</strong> ${escapeHtml(precioMin)}</p>
        <p><strong>Precio máximo:</strong> ${escapeHtml(precioMax)}</p>

        <h3 style="margin-top: 24px; color: #0A2E57;">Comentarios</h3>
        <p>${escapeHtml(body.comentarios || 'Sin comentarios')}</p>
      </div>
    `;

    const text = `
Nuevo referido recibido desde la web

REFERENTE
Nombre: ${body.referente_nombre}
Email: ${body.referente_email}
Teléfono: ${body.referente_telefono}

REFERIDO
Nombre: ${body.referido_nombre}
Email: ${body.referido_email}
Teléfono: ${body.referido_telefono}

PREFERENCIAS
Servicio: ${body.servicio_necesita}
Tipo de propiedad: ${body.tipo_propiedad}
Región: ${body.region}
Comuna: ${body.comuna}
Precio mínimo: ${precioMin}
Precio máximo: ${precioMax}

COMENTARIOS
${body.comentarios || 'Sin comentarios'}
    `.trim();

    const emailResult = await resend.emails.send({
      from: 'Gesswein Properties <referidos@mail.gessweinproperties.com>',
      to: [referidosTo],
      subject: `Nuevo referido web - ${body.referido_nombre}`,
      replyTo: body.referente_email,
      text,
      html,
    });

    if (emailResult.error) {
      return NextResponse.json(
        {
          error: 'El referido se guardó, pero falló el envío del correo.',
          emailError: emailResult.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Referido guardado y correo enviado correctamente.',
      data: insertData,
      email: emailResult.data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado al procesar el referido.' },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
