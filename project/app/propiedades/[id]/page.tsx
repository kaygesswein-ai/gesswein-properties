// app/propiedades/[id]/page.tsx
import Link from 'next/link';
import { Bed, Car, Ruler, ShowerHead, Square, ArrowLeft } from 'lucide-react';

const BRAND_BLUE = '#0A2E57';
const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

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
  images?: string[] | null;
};

async function getProperty(id: string): Promise<Property | null> {
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/propiedades/${id}`, { cache: 'no-store' });
  if (!r.ok) return null;
  const j = await r.json().catch(() => null as any);
  return j?.data ?? null;
}

export default async function PropiedadPage({ params }: { params: { id: string } }) {
  const p = await getProperty(params.id);

  if (!p) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/propiedades" className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Volver a propiedades
        </Link>
        <h1 className="mt-6 text-2xl text-slate-900">Propiedad no encontrada</h1>
      </main>
    );
  }

  const hero =
    (p.images && p.images[0]) ||
    p.coverImage ||
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop';

  const showUF = !!(p.precio_uf && p.precio_uf > 0);
  const precioMain = showUF ? `UF ${nfUF.format(p.precio_uf as number)}` : 'Consultar';
  const precioSec  = p.precio_clp ? `$ ${nfCLP.format(p.precio_clp)}` : '';

  const terreno =
    (p.tipo || '').toLowerCase().includes('terreno') ||
    (p.tipo || '').toLowerCase().includes('sitio');

  return (
    <main className="bg-white">
      {/* HERO */}
      <section
        className="relative bg-cover min-h-[46vh]"
        style={{ backgroundImage: `url(${hero})`, backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div className="text-white">
                <h1 className="text-2xl md:text-3xl font-semibold">{p.titulo || 'Propiedad'}</h1>
                <p className="text-white/85 mt-1">
                  {[p.comuna, p.region, p.tipo].filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-white text-2xl font-semibold">{precioMain}</div>
                {precioSec ? <div className="text-white/85 text-sm">{precioSec}</div> : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/propiedades" className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Volver a propiedades
          </Link>
        </div>

        {/* Galería simple si hay más imágenes */}
        {p.images && p.images.length > 1 ? (
          <div className="mb-8">
            <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden rounded-lg">
              <img src={p.images[0] as string} alt={p.titulo || 'Propiedad'} className="w-full h-full object-cover" />
            </div>
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
              {p.images.slice(1, 7).map((src, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded border">
                  <img src={src as string} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Características */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="text-slate-900 font-semibold mb-3">Características</h3>
            <div className="grid grid-cols-5 text-center">
              <div className="border border-slate-200 p-2">
                <div className="flex items-center justify-center"><Bed className="h-5 w-5 text-slate-500" /></div>
                <div className="text-sm">{terreno ? '—' : (p.dormitorios ?? '—')}</div>
              </div>
              <div className="border border-slate-200 p-2">
                <div className="flex items-center justify-center"><ShowerHead className="h-5 w-5 text-slate-500" /></div>
                <div className="text-sm">{terreno ? '—' : (p.banos ?? '—')}</div>
              </div>
              <div className="border border-slate-200 p-2">
                <div className="flex items-center justify-center"><Car className="h-5 w-5 text-slate-500" /></div>
                <div className="text-sm">{terreno ? '—' : (p.estacionamientos ?? '—')}</div>
              </div>
              <div className="border border-slate-200 p-2">
                <div className="flex items-center justify-center"><Ruler className="h-5 w-5 text-slate-500" /></div>
                <div className="text-sm">{terreno ? '—' : (p.superficie_util_m2 != null ? nfINT.format(p.superficie_util_m2) : '—')}</div>
              </div>
              <div className="border border-slate-200 p-2">
                <div className="flex items-center justify-center"><Square className="h-5 w-5 text-slate-500" /></div>
                <div className="text-sm">{p.superficie_terreno_m2 != null ? nfINT.format(p.superficie_terreno_m2) : '—'}</div>
              </div>
            </div>
          </div>

          {/* Operación */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="text-slate-900 font-semibold mb-3">Operación</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Tipo</dt><dd className="text-slate-900">{p.tipo || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Operación</dt><dd className="text-slate-900">{p.operacion ? p.operacion.charAt(0).toUpperCase() + p.operacion.slice(1) : '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Precio</dt><dd className="text-slate-900">{precioMain}</dd></div>
              {precioSec ? <div className="flex justify-between"><dt className="text-slate-500">Referencia CLP</dt><dd className="text-slate-900">{precioSec}</dd></div> : null}
            </dl>
          </div>

          {/* Ubicación */}
          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="text-slate-900 font-semibold mb-3">Ubicación</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Comuna</dt><dd className="text-slate-900">{p.comuna || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Región</dt><dd className="text-slate-900">{p.region || '—'}</dd></div>
            </dl>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="mailto:contacto@gesswein.cl" className="px-5 py-2 text-white rounded-none" style={{ background: BRAND_BLUE }}>
            Quiero más información
          </a>
          <a href="https://wa.me/56900000000" className="px-5 py-2 border rounded-none" style={{ borderColor: BRAND_BLUE, color: '#0f172a', background: '#fff' }}>
            Escribir por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
