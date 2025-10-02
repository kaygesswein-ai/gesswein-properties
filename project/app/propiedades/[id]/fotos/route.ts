import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from('propiedades_fotos_api')             // ← la view
    .select('url,categoria,orden')
    .eq('propiedad_id', params.id)
    .order('categoria')
    .order('orden')

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ data })
}
