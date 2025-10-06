// app/api/propiedades/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

// Ajusta el caché para ver cambios altiro (sin esperar revalidación)
const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, max-age=0',
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

  // Portadas y mapa
  portada_url: string | null;
  portada_fija_url: string | null;
  portada_preferencia: string | null;

  map_lat: number | null;
  map_lng: number | null;
  map_zoom: number | null;

  // Features/tags en varias formas
  tags: string[] | null;
  features_highlight: string[] | null;
  features: any; // jsonb (puede ser array u objeto)
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Selecciona TODO lo que usa la página (incluye tags y variantes)
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

    // 1) usa tags si existe
    if (Array.isArray(data.tags)) {
      tags = data.tags.filter((t) => typeof t === 'string' && t.trim().length);
    }

    // 2) si no, usa features_highlight
    if (!tags.length && Array.isArray(data.features_highlight)) {
      tags = data.features_highlight.filter(
        (t) => typeof t === 'string' && t.trim().length
      );
    }

    // 3) si features (jsonb) trae un array de strings, úsalo
    if (!tags.length && Array.isArray(data.features)) {
      tags = (data.features as any[]).filter(
        (t) => typeof t === 'string' && t.trim().length
      );
    }

    // 4) si features es objeto con alguna clave tipo highlights/keys/etc.
    if (!tags.length && data.features && typeof data.features === 'object') {
      const f = data.features as Record<string, any>;
      const guess =
        f.highlights ||
        f.destacados ||
        f.tags ||
        f.items ||
        f.lista ||
        null;
      if (Array.isArray(guess)) {
        tags = guess.filter((t: any) => typeof t === 'string' && t.trim().length);
      }
    }

    // ---------- Respuesta con shape esperado por el front ----------
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

      // portada (la página ya prioriza portada_url, luego fotos 'portada', etc.)
      portada_url: data.portada_url ?? data.portada_fija_url ?? null,

      // mapa
      map_lat: typeof data.map_lat === 'number' ? data.map_lat : null,
      map_lng: typeof data.map_lng === 'number' ? data.map_lng : null,
      map_zoom: typeof data.map_zoom === 'number' ? data.map_zoom : null,

      // tags normalizados
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

