// project/app/api/propiedades/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Revalida en el edge (opcional)
export const runtime = 'edge';
export const revalidate = 60 * 60 * 2;

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // 1) Trae la propiedad (usa tu vista pública para no exponer precio_clp)
  const { data: prop, error: e1 } = await supabase
    .from('propiedades_api')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (e1) {
    console.error('[api/propiedades/:id] fetch propiedad', e1);
    return NextResponse.json({ success: false, error: e1.message }, { status: 500 });
  }
  if (!prop) {
    return NextResponse.json({ success: false, error: 'No existe la propiedad' }, { status: 404 });
  }

  // 2) Trae sus fotos categorizadas
  const { data: fotos, error: e2 } = await supabase
    .from('propiedades_fotos')
    .select('url, tag, orden')
    .eq('propiedad_id', id)
    .order('orden', { ascending: true });

  if (e2) {
    console.error('[api/propiedades/:id] fetch fotos', e2);
    // No abortamos; devolvemos la propiedad igual
  }

  // 3) Si hay fotos en propiedades_fotos, sobre-escribimos "imagenes"
  const imagenesDesdeTabla =
    (fotos?.map((f) => f.url).filter(Boolean) as string[] | undefined) ?? [];

  const merged = {
    ...prop,
    imagenes: imagenesDesdeTabla.length > 0 ? imagenesDesdeTabla : (prop.imagenes ?? []),
    // Opcional: también devolvemos agrupado por tag para un futuro
    _byTag: {
      exterior: (fotos ?? []).filter(f => f.tag === 'exterior').map(f => f.url),
      interior: (fotos ?? []).filter(f => f.tag === 'interior').map(f => f.url),
      planos:   (fotos ?? []).filter(f => f.tag === 'planos').map(f => f.url),
    }
  };

  return NextResponse.json({ success: true, data: merged });
}
