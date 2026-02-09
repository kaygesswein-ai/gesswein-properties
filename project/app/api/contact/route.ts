import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type Payload = {
  nombre: string
  email: string
  telefono?: string
  mensaje: string
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // ✅ Usa SERVICE ROLE en el server (NO exponer en client)
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Payload>

    const nombre = (body.nombre || '').trim()
    const email = (body.email || '').trim()
    const telefono = (body.telefono || '').trim()
    const mensaje = (body.mensaje || '').trim()

    if (nombre.length < 2) {
      return NextResponse.json({ error: 'Nombre inválido.' }, { status: 400 })
    }
    if (email.length < 5 || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }
    if (mensaje.length < 10) {
      return NextResponse.json({ error: 'Mensaje demasiado corto.' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('contact_messages').insert([
      {
        nombre,
        email,
        telefono: telefono || null,
        mensaje,
        source: 'web',
        user_agent: req.headers.get('user-agent') || null,
      },
    ])

    if (error) {
      return NextResponse.json({ error: 'No se pudo guardar el mensaje.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Request inválida.' }, { status: 400 })
  }
}
