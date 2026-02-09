import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // OJO: no lanzar error aquí (para no romper build). Devolver null y responder 500 en runtime.
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function POST(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Server not configured (missing SUPABASE env vars).' },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);

  const name = String(body?.name ?? '').trim();
  const email = String(body?.email ?? '').trim();
  const phone = String(body?.phone ?? '').trim();
  const message = String(body?.message ?? '').trim();
  const source = String(body?.source ?? 'website').trim();

  if (name.length < 2 || email.length < 5 || message.length < 10) {
    return NextResponse.json(
      { error: 'Datos inválidos. Revisa nombre, email y mensaje.' },
      { status: 400 }
    );
  }

  const { error } = await supabase.from('contact_messages').insert([
    {
      name,
      email,
      phone: phone || null,
      message,
      source,
      user_agent: req.headers.get('user-agent') || null,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: 'No se pudo guardar el mensaje.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
