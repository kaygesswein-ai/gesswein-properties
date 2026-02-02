// app/api/propiedades/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ✅ fuerza a Next a NO cachear esta route en Edge/CDN
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// (puedes dejar edge si quieres, pero ahora será realmente dinámico)
export const runtime = 'edge';

const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type RawProp = {
  id: string;
  slug: string | null;
  titulo: string | null;
  comuna: string | null;
  region: string | null;
  operacion: 'venta' | 'arriendo' | null;
  tipo: string | null;
  precio_uf: number | null;
  precio_clp: number | null;
  dormitorios: number | null;
  banos: number | null;
  superficie_util_m2: number | null;
  superficie_terreno_m2: number | null;
  estacionamientos: number | null;
  created_at: string | null;
  descripcion: string | null;
  imagenes: string[] | null;
  barrio: string | null;

  portada_url: string | null;
  portada_fija_url: string | null;
  portada_preferencia: string | null;

  map_lat: number | null;
  map_lng: number | null;
  map_zoom: number | null;

  tags: string[] | null;
  features_highlight: string[] | null;
  features: any;
};

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const cols = `
      id, slug, titulo, comuna, region, operacion, tipo,
      precio_uf, precio_clp, dormitorios, banos,
      superficie_util_m2, superficie_terreno_m2, estacionamientos,
      created_at, descripcion, imagenes, barrio,
      map_lat, map_lng, map_zoom,
      tags, features_highlight, features,
      portada_url, portada_fija_url, portada_preferencia
    `;

    const { data, error } = await supabase
      .from('propiedades')
      .select(cols)
      .eq('id', id)
      .single<RawProp>();

    if (error) {
      console.error('[api/propiedades/:id] select error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: noStoreHeaders }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Propiedad no encontrada' },
        { status: 404, headers: noStoreHeaders }
      );
    }

    // ---------- Normaliza TAGS ----------
    let tags: string[] = [];

    if (Array.isArray(data.tags)) {
      tags = data.tags.filter((t) => typeof t === 'string' && t.trim().length);
    }

    if (!tags.length && Array.isArray(data.features_highlight)) {
      tags = data.features_highlight.filter((t) => typeof t === 'string' && t.trim().length);
    }

    if (!tags.length && Array.isArray(data.features)) {
      tags = (data.features as any[]).filter((t) => typeof t === 'string' && t.trim().length);
    }

    if (!tags.length && data.features && typeof data.features === 'object') {
      const f = data.features as Record<string, any>;
      const guess = f.highlights || f.destacados || f.tags || f.items || f.lista || null;
      if (Array.isArray(guess)) {
        tags = guess.filter((t: any) => typeof t === 'string' && t.trim().length);
      }
    }

    const payload = {
      id: data.id,
      slug: data.slug,
      titulo: data.titulo,
      comuna: data.comuna,
      region: data.region,
      operacion: data.operacion,
      tipo: data.tipo,
      precio_uf: data.precio_uf,
      precio_clp: data.precio_clp,
      dormitorios: data.dormitorios,
      banos: data.banos,
      superficie_util_m2: data.superficie_util_m2,
      superficie_terreno_m2: data.superficie_terreno_m2,
      estacionamientos: data.estacionamientos,
      created_at: data.created_at,
      descripcion: data.descripcion,
      imagenes: data.imagenes ?? null,
      barrio: data.barrio,

      portada_url: data.portada_url ?? null,
      portada_fija_url: data.portada_fija_url ?? null,

      coverImage:
        data.portada_url ??
        data.portada_fija_url ??
        data.imagenes?.find((url) => typeof url === 'string' && url.trim().length) ??
        null,

      map_lat: typeof data.map_lat === 'number' ? data.map_lat : null,
      map_lng: typeof data.map_lng === 'number' ? data.map_lng : null,
      map_zoom: typeof data.map_zoom === 'number' ? data.map_zoom : null,

      tags: tags.length ? tags : null,
    };

    return NextResponse.json(
      { success: true, data: payload },
      { status: 200, headers: noStoreHeaders }
    );
  } catch (e: any) {
    console.error('[api/propiedades/:id] unexpected error:', e);
    return NextResponse.json(
      { success: false, error: e?.message ?? 'Unexpected error' },
      { status: 500, headers: noStoreHeaders }
    );
  }
}

