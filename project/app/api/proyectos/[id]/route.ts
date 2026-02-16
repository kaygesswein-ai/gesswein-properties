import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    const supabase = getSupabaseServer();
    const id = ctx.params.id;

    const { data, error } = await supabase
      .from('proyectos')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
    if (!data) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 200 });

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Unknown error' }, { status: 200 });
  }
}
