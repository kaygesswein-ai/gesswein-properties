// app/propiedades/[id]/page.tsx
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Bed, ShowerHead, Ruler, Car, Square } from 'lucide-react';

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
};

// Evita caching en esta página (HTML + fetch)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getBaseUrl() {
  // Preferimos variable si la tienes definida (opcional):
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/,'');
  if (envUrl) return envUrl;

  // Si no, construimos desde los headers del request (Vercel friendly)
  const h = headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  const proto = h.get('x-forwarded-proto') || 'https';
  if (!host) {
    // Si no tenemos host en el server (raro), mandamos al home
    return '';
  }
  return `${proto}://${host}`;
}

async function getPropertyById(id: string): Promise<Property | null> {
  const base = getBaseUrl();
  if (!base) return null; // fallback muy defensivo

  // Llamamos a tu API interna con URL ABSOLUTA
  const url = `${base}/api/propiedades/${encodeURIComponent(id)}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: 'no-store' });
  } catch {
    return null;
  }
  if (!res.ok) return null;

  // Tu API devuelve { data: {...} }
  const payload = await res.json().catch(() => null) as { data?: Property } | null;
  const prop = payload?.data || null;
  return prop;
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const prop = await getPropertyById(params.id);
  if (!prop) notFound();

  const showUF = !!(prop.precio_uf && prop.precio_uf > 0);

  return (
    <main className="bg-white">
      {/* HERO / imagen */}
      <section className="relative">
        <div className="aspect-[16/9] w-full bg-slate-100">
          <img
            src={
              prop.coverImage ||
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop'
            }
            alt={prop.titulo || 'Propiedad'}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-[260px]">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              {prop.titulo || 'Propiedad'}
            </h1>
            <p className="text-slate-600 mt-1">
              {[prop.comuna || '', prop.region || '', prop.tipo || '']
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>

          <div className="text-right min-w-[220px]">
            <div className="text-xl font-semibold" style={{ color: BRAND_BLUE }}>
              {showUF ? `UF ${nfUF.format(prop.precio_uf as number)}` : 'Consultar'}
            </div>
            {prop.precio_clp ? (
              <div className="text-sm text-slate-500">$ {nfCLP.format(prop.precio_clp)}</div>
            ) : null}
          </div>
        </div>

        {/* Métricas */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="border border-slate-200 p-3 text-center">
            <div className="flex items-center justify-center"><Bed className="h-5 w-5 text-slate-500" /></div>
            <div className="text-sm mt-1">{prop.dormitorios ?? '—'} dormitorios</div>
          </div>
          <div className="border border-slate-200 p-3 text-center">
            <div className="flex items-center justify-center"><ShowerHead className="h-5 w-5 text-slate-500" /></div>
            <div className="text-sm mt-1">{prop.banos ?? '—'} baños</div>
          </div>
          <div className="border border-slate-200 p-3 text-center">
            <div className="flex items-center justify-center"><Car className="h-5 w-5 text-slate-500" /></div>
            <div className="text-sm mt-1">{prop.estacionamientos ?? '—'} estac.</div>
          </div>
          <div className="border border-slate-200 p-3 text-center">
            <div className="flex items-center justify-center"><Ruler className="h-5 w-5 text-slate-500" /></div>
            <div className="text-sm mt-1">
              {prop.superficie_util_m2 != null ? `${nfINT.format(prop.superficie_util_m2)} m² const.` : '—'}
            </div>
          </div>
          <div className="border border-slate-200 p-3 text-center">
            <div className="flex items-center justify-center"><Square className="h-5 w-5 text-slate-500" /></div>
            <div className="text-sm mt-1">
              {prop.superficie_terreno_m2 != null ? `${nfINT.format(prop.superficie_terreno_m2)} m² terreno` : '—'}
            </div>
          </div>
        </div>

        {/* Descripción / placeholder */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">Descripción</h2>
            <p className="text-slate-700 mt-2 leading-relaxed">
              Ficha de propiedad en {prop.comuna || '—'}. Completa aquí el detalle real:
              características, terminaciones, entorno, conectividad y cualquier información comercial
              relevante (gastos comunes, contribuciones, etc.).
            </p>
          </div>

          <aside className="border border-slate-200 p-4">
            <h3 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
              Información rápida
            </h3>
            <ul className="mt-3 space-y-2 text-slate-700 text-sm">
              <li><strong>Operación:</strong> {prop.operacion ? prop.operacion.toUpperCase() : '—'}</li>
              <li><strong>Tipo:</strong> {prop.tipo || '—'}</li>
              <li><strong>Comuna:</strong> {prop.comuna || '—'}</li>
              <li><strong>Región:</strong> {prop.region || '—'}</li>
              <li><strong>ID:</strong> {prop.id}</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
