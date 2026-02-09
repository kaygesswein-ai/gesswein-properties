import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''

  // ✅ preferimos Service Role para insertar (server-only)
  // fallback: anon key (solo si no tienes service role aún)
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''

  if (!url || !key) {
    return { client: null as any, missing: true }
  }

  const client = createClient(url, key, {
    auth: { persistSession: false },
  })

  return { client, missing: false }
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export async function POST(req: Request) {
  const { client, missing } = getSupabase()

  // ✅ no rompas build: responde 500 y listo
  if (missing) {
    return NextResponse.json(
      { error: 'Faltan variables de entorno de Supabase (URL/KEY).' },
      { status: 500 }
    )
  }

  try {
    const body = await req.json().catch(() => null)

    const nombre = String(body?.nombre ?? '').trim()
    const email = String(body?.email ?? '').trim()
    const telefono = String(body?.telefono ?? '').trim()
    const mensaje = String(body?.mensaje ?? '').trim()

    if (nombre.length < 2) {
      return NextResponse.json({ error: 'Nombre inválido.' }, { status: 400 })
    }
    if (!isEmail(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }
    if (mensaje.length < 10) {
      return NextResponse.json({ error: 'Mensaje demasiado corto.' }, { status: 400 })
    }

    // ✅ TABLA DESTINO:
    // Crea una tabla en Supabase: public.contact_messages
    // columnas sugeridas:
    // id uuid default gen_random_uuid() pk
    // created_at timestamptz default now()
    // nombre text, email text, telefono text, mensaje text, source text
    const { error } = await client
      .from('contact_messages')
      .insert([
        {
          nombre,
          email,
          telefono: telefono || null,
          mensaje,
          source: 'web',
        },
      ])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Error inesperado.' },
      { status: 500 }
    )
  }
}
