import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

type Body = {
  name?: string
  email?: string
  phone?: string
  message?: string
  source?: string
}

export async function POST(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Server not configured (missing SUPABASE env vars).' },
      { status: 500 }
    )
  }

  let body: Body = {}
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const name = (body.name ?? '').trim()
  const email = (body.email ?? '').trim()
  const phone = (body.phone ?? '').trim()
  const message = (body.message ?? '').trim()
  const source = (body.source ?? 'contact_page').trim()

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Missing required fields: name, email, message.' },
      { status: 400 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  })

  const { error } = await supabase.from('contact_messages').insert([
    {
      name,
      email,
      phone: phone || null,
      message,
      source,
      created_at: new Date().toISOString(),
    },
  ])

  if (error) {
    return NextResponse.json(
      { error: `Supabase insert failed: ${error.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
