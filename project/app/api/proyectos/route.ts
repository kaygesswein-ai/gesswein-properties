// project/app/api/proyectos/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noStoreHeaders = { 'Cache-Control': 'no-store, no-cache, max-age=0' };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const operacion = searchParams.get('operacion') || '';
  const tipo = searchParams.get('tipo') || '';
  const comuna = searchParams.get('comuna') || '';
  const publicado = searchParams.get('publicado'); // 'true' | 'false' | null

  try {
    // ✅ Importante: select('*') para no depender de nombres exactos de columnas.
    // Así el listado puede traer (si existen) dormitorios/baños/estacionamientos/superficies, etc.
    let q = supabase
      .from('proyectos')
      .select('*')
      .order('created_at', { ascending: false });

    if (publicado) q = q.eq('publicado', publicado === 'true');
    if (operacion) q = q.eq('operacion', operacion);
    if (tipo) q = q.ilike('tipo', `${tipo}%`);
    if (comuna) q = q.eq('comuna', comuna);

    const { data, error } = await q;

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500, headers: noStoreHeaders }
      );
    }

    // ✅ Normaliza: siempre devolvemos los campos que tus cards necesitan.
    // Si tu tabla los tiene con otros nombres, igual no rompemos: quedarán null,
    // pero como ahora el listado trae '*', en la práctica deberían venir si existen.
    const normalized = (data ?? []).map((p: any) => ({
      // --- básicos actuales ---
      id: p.id,
      created_at: p.created_at,
      slug: p.slug,
      titulo: p.titulo,
      operacion: p.operacion,
      tipo: p.tipo,
      region: p.region,
      comuna: p.comuna,
      barrio: p.barrio,
      precio_uf: p.precio_uf,
      sello_tipo: p.sello_tipo,
      tasa_novacion: p.tasa_novacion,
      portada_url: p.portada_url ?? null,
      portada_fija_url: p.portada_fija_url ?? null,
      publicado: p.publicado,

      // --- campos “tipo propiedad” (si existen en proyectos) ---
      dormitorios: p.dormitorios ?? null,
      banos: p.banos ?? null,
      estacionamientos: p.estacionamientos ?? null,
      superficie_util_m2: p.superficie_util_m2 ?? null,
      superficie_terreno_m2: p.superficie_terreno_m2 ?? null,

      // ✅ coverImage consistente (igual que propiedades)
      coverImage:
        p.portada_url ??
        p.portada_fija_url ??
        (Array.isArray(p.imagenes) ? p.imagenes.find((u: any) => typeof u === 'string' && u.trim()) : null) ??
        null,
    }));

    return NextResponse.json(
      { ok: true, count: normalized.length, data: normalized },
      { headers: noStoreHeaders }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500, headers: noStoreHeaders }
    );
  }
}
