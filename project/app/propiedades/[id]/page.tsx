// app/propiedades/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Bed, ShowerHead, Car, Ruler, Square, ArrowLeft } from 'lucide-react';
import { supaRest } from '@/lib/supabase-rest';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const BRAND_BLUE = '#0A2E57';

type Property = {
  id: string;
  titulo?: string;
  comuna?: string;
  region?: string;
  operacion?: 'venta' | 'arriendo';
  tipo?: string;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  superficie_util_m2?: number | null;
  superficie_terreno_m2?: number | null;
  estacionamientos?: number | null;
  coverImage?: string;
  createdAt?: string;
  destacada?: boolean;
  descripcion?: string | null;
};

const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

// ---- Consulta directa a Supabase/PostgREST (sin pasar por /api) ----
async function fetchPropertyDirect(idOrSlug: string): Promise<Property | null> {
  // helper para reusar
  async function by(col: 'id' | 'slug', val: string) {
    const qs = new URLSearchParams();
    qs.set('select', '*');
    qs.set(col, `eq.${val}`);
    qs.set('limit', '1');
    const res = await supaRest(`propiedades?${qs.toString()}`, { // usa tu wrapper
      // no-cache aquí no es crítico porque pegamos directo a PostgREST
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null as any);
    return Array.isArray(data) && data.length > 0 ? (data[0] as Property) : null;
  }

  // 1) prueba por id
  let row = await by('id', idOrSlug);
  // 2) si no, por slug
  if (!row) row = await by('slug', idOrSlug);
  return row ?? null;
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const prop = await fetchPropertyDirect(params.id);
  if (!prop) notFound();

  const showUF = !!(prop.precio_uf && prop.precio_uf > 0);
  const clp = prop.precio_clp && prop.precio_clp > 0 ? prop.precio_clp : null;

  const terreno =
    (prop.tipo || '').toLowerCase().includes('terreno') ||
    (prop.tipo || '').toLowerCase().includes('sitio');
  const bodega = (prop.tipo || '').toLowerCase().includes('bodega');

  return (
    <main className="bg-white">
      {/* HEADER / VOLVER */}
      <section className="relative bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/propiedades" className="inline-flex items-center gap-2 text-sm" style={{ color: BRAND_BLUE }}>
            <ArrowLeft className="h-4 w-4" />
            Volver a propiedades
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="aspect-[16/9] w-full bg-slate-200 overflow-hidden rounded-md">
            <img
              src={
                prop.coverImage ||
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop'
              }
              alt={prop.titulo || 'Propiedad'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl md:text-3xl text-slate-900">{prop.titulo || 'Propiedad'}</h1>
            <p className="text-slate-600 mt-1">
              {[prop.comuna, prop.tipo, prop.operacion ? (prop.operacion[0].toUpperCase() + prop.operacion.slice(1)) : '']
                .filter(Boolean)
                .join(' · ')}
            </p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 text-center">
              {!terreno && !bodega ? (
                <>
                  <div className="border border-slate-200 p-3"><div className="flex items-center justify-center"><Bed className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{prop.dormitorios ?? '—'}</div></div>
                  <div className="border border-slate-200 p-3"><div className="flex items-center justify-center"><ShowerHead className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{prop.banos ?? '—'}</div></div>
                  <div className="border border-slate-200 p-3"><div className="flex items-center justify-center"><Car className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{prop.estacionamientos ?? '—'}</div></div>
                  <div className="border border-slate-200 p-3"><div className="flex items-center justify-center"><Ruler className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{prop.superficie_util_m2 != null ? nfINT.format(prop.superficie_util_m2) : '—'}</div></div>
                  <div className="border border-slate-200 p-3"><div className="flex items-center justify-center"><Square className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{prop.superficie_terreno_m2 != null ? nfINT.format(prop.superficie_terreno_m2) : '—'}</div></div>
                </>
              ) : terreno ? (
                <div className="border border-slate-200 p-3"><div className="flex items-center justify-center"><Square className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{prop.superficie_terreno_m2 != null ? nfINT.format(prop.superficie_terreno_m2) : '—'}</div></div>
              ) : (
                <>
                  <div className="border border-slate-200 p-3"><div className="flex items-center justify-center"><Ruler className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{prop.superficie_util_m2 != null ? nfINT.format(prop.superficie_util_m2) : '—'}</div></div>
                  <div className="border border-slate-200 p-3"><div className="flex items-center justify-center"><Car className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{prop.estacionamientos ?? '—'}</div></div>
                </>
              )}
            </div>

            <div className="mt-8 prose max-w-none">
              <h2 className="text-xl text-slate-900 mb-2">Descripción</h2>
              <p className="text-slate-700">{prop.descripcion || 'Descripción no disponible por el momento.'}</p>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="border border-slate-200 rounded-md p-4">
              <div className="text-sm text-slate-500">Precio</div>
              <div className="text-2xl font-semibold" style={{ color: BRAND_BLUE }}>
                {showUF ? `UF ${nfUF.format(prop.precio_uf as number)}` : 'Consultar'}
              </div>
              {clp ? <div className="text-sm text-slate-500 mt-1">{`$ ${nfCLP.format(clp)}`}</div> : null}
              <div className="h-px bg-slate-200 my-4" />
              <Link href="/contacto" className="block text-center px-4 py-2 text-white rounded-none" style={{ background: BRAND_BLUE }}>
                Consultar por esta propiedad
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
