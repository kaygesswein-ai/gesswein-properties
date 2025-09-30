// app/api/propiedades/[id]/route.ts
import { NextResponse } from 'next/server';
import { supaRest } from '@/lib/supabase-rest';

type Row = Record<string, any> | null;

async function fetchOne(column: 'id' | 'slug', value: string): Promise<Row> {
  const qs = new URLSearchParams();
  // Importante: usa la vista pública para mantener el mismo shape que las cards
  qs.set('select', '*');
  qs.set(column, `eq.${value}`);
  qs.set('limit', '1');

  // Primero intento en la vista (trae coverImage); si no está, caigo a la tabla
  let res = await supaRest(`propiedades_api?${qs.toString()}`);
  if (!res.ok) {
    // Reintento directo a la tabla por si la vista aún no existe en algún entorno
    res = await supaRest(`propiedades?${qs.toString()}`);
  }
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || `PostgREST error (${res.status})`);
  }
  const data = await res.json().catch(() => null);
  return Array.isArray(data) && data.length > 0 ? (data[0] as Row) : null;
}

function normalize(row: any) {
  if (!row) return null;
  // Asegura que siempre exista un array de imágenes
  const imagenes: string[] = Array.isArray(row.imagenes) ? row.imagenes : [];
  return {
    ...row,
    // alias en inglés para el front
    images: imagenes,
    // si la vista no vino con coverImage, lo calculamos
    coverImage: row.coverImage ?? imagenes[0] ?? null,
  };
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const raw = decodeURIComponent(params.id || '');
    // Permite buscar por id o por slug
    let row = await fetchOne('id', raw).catch(() => null);
    if (!row) row = await fetchOne('slug', raw).catch(() => null);

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: normalize(row) }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal error', details: String(err?.message || err) },
      { status: 500 },
    );
  }
}
// export const runtime = 'edge'; // opcional
