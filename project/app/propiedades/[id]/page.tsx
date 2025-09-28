'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Bed, ShowerHead, Car, Ruler, Square,
  MapPin, CalendarDays, Camera, Heart
} from 'lucide-react';

const BRAND_BLUE = '#0A2E57';
const BRAND_DARK = '#0f172a';

type Property = {
  id: string;
  slug?: string | null;
  titulo?: string | null;
  comuna?: string | null;
  region?: string | null;
  operacion?: 'venta' | 'arriendo' | null;
  tipo?: string | null;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  superficie_util_m2?: number | null;
  superficie_terreno_m2?: number | null;
  estacionamientos?: number | null;
  coverImage?: string | null;
  galeria?: string[] | null;       // si tienes una columna con array de URLs (opcional)
  createdAt?: string | null;
  destacada?: boolean | null;
  descripcion?: string | null;
  direccion?: string | null;       // opcional
};

const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** ======== Fetch directo a PostgREST desde el navegador (anon key) ======== */
async function pgGetOneBy(column: 'id'|'slug', value: string): Promise<Property | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  const qs = new URLSearchParams();
  qs.set('select', '*');
  qs.set(column, `eq.${value}`);
  qs.set('limit', '1');

  const res = await fetch(`${SUPABASE_URL}/rest/v1/propiedades?${qs.toString()}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  }).catch(() => null as any);

  if (!res || !res.ok) return null;
  const data = await res.json().catch(() => null as any);
  return Array.isArray(data) && data.length ? (data[0] as Property) : null;
}

function classNames(...s: (string|false|undefined|null)[]) { return s.filter(Boolean).join(' '); }

/** ======== PAGE ======== */
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [prop, setProp] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);

  // intenta por id y por slug, en el cliente
  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const param = decodeURIComponent(params.id);
      let row = await pgGetOneBy('id', param);
      if (!row) row = await pgGetOneBy('slug', param);
      if (!cancel) {
        setProp(row);
        setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [params.id]);

  // Galería calculada: cover + galería (si hay)
  const gallery: string[] = useMemo(() => {
    const imgs: string[] = [];
    if (prop?.coverImage) imgs.push(prop.coverImage);
    if (Array.isArray(prop?.galeria)) {
      for (const url of prop!.galeria!) if (url) imgs.push(url);
    }
    if (!imgs.length) {
      imgs.push('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop');
    }
    return imgs.slice(0, 12);
  }, [prop]);

  const showUF = !!(prop?.precio_uf && prop.precio_uf > 0);
  const clp     = prop?.precio_clp && prop.precio_clp > 0 ? prop.precio_clp : null;

  return (
    <main className="bg-white">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link href="/propiedades" className="inline-flex items-center gap-2 text-sm" style={{ color: BRAND_BLUE }}>
            <ArrowLeft className="h-4 w-4" />
            Volver a propiedades
          </Link>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1 text-sm px-3 py-1.5 border rounded-none"
              style={{ borderColor: BRAND_BLUE, color: BRAND_DARK }}>
              <Camera className="h-4 w-4" /> {gallery.length}
            </button>
            <button className="inline-flex items-center gap-1 text-sm px-3 py-1.5 border rounded-none"
              style={{ borderColor: BRAND_BLUE, color: BRAND_DARK }}>
              <Heart className="h-4 w-4" /> Guardar
            </button>
          </div>
        </div>
      </div>

      {/* HERO / GALERÍA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <div className="aspect-[16/9] w-full bg-slate-200 overflow-hidden">
              {loading ? (
                <div className="w-full h-full animate-pulse bg-slate-200" />
              ) : (
                <img
                  key={gallery[imgIndex] ?? 'hero'}
                  src={gallery[imgIndex]}
                  alt={prop?.titulo ?? 'Propiedad'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {/* Thumbs */}
            <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {gallery.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={classNames(
                    'relative aspect-[4/3] overflow-hidden border',
                    i === imgIndex ? 'border-[2px]' : 'border-slate-200'
                  )}
                  style={i === imgIndex ? { borderColor: BRAND_BLUE } : {}}
                  aria-label={`Imagen ${i+1}`}
                >
                  <img src={url} alt={`Imagen ${i+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar de precio / CTA */}
          <aside className="lg:col-span-1">
            <div className="sticky top-[86px] border border-slate-200 p-4">
              <div className="text-sm text-slate-500">Precio</div>
              <div className="text-3xl font-semibold" style={{ color: BRAND_BLUE }}>
                {loading ? '—' : (showUF ? `UF ${nfUF.format(prop!.precio_uf as number)}` : 'Consultar')}
              </div>
              {(!loading && clp) ? (
                <div className="text-sm text-slate-500 mt-1">{`$ ${nfCLP.format(clp)}`}</div>
              ) : null}
              <div className="h-px bg-slate-200 my-4" />
              <Link
                href="/contacto"
                className="block text-center px-4 py-3 text-white rounded-none"
                style={{ background: BRAND_BLUE }}
              >
                Solicitar información
              </Link>
              <div className="mt-4 text-xs text-slate-500">
                Publicada: {loading ? '—' : (prop?.createdAt ? new Date(prop.createdAt).toLocaleDateString('es-CL') : '—')}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* CABECERA DE TEXTO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
          {loading ? 'Cargando propiedad…' : (prop?.titulo ?? 'Propiedad')}
        </h1>
        <p className="mt-2 text-slate-600 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {loading ? '—' : [prop?.direccion, prop?.comuna, prop?.region].filter(Boolean).join(', ')}
        </p>

        {/* Chips rápidos */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip icon={<CalendarDays className="h-4 w-4" />} label={loading ? '—' : (prop?.operacion ? (prop.operacion[0].toUpperCase()+prop.operacion.slice(1)) : '—')} />
          <Chip icon={<span className="font-bold">🏷️</span>} label={loading ? '—' : (prop?.tipo ?? '—')} />
          <Chip icon={<Bed className="h-4 w-4" />} label={loading ? '—' : `${prop?.dormitorios ?? '—'} Dorm.`} />
          <Chip icon={<ShowerHead className="h-4 w-4" />} label={loading ? '—' : `${prop?.banos ?? '—'} Baños`} />
          <Chip icon={<Car className="h-4 w-4" />} label={loading ? '—' : `${prop?.estacionamientos ?? '—'} Estac.`} />
          <Chip icon={<Ruler className="h-4 w-4" />} label={loading ? '—' : `${prop?.superficie_util_m2 != null ? nfINT.format(prop!.superficie_util_m2!) : '—'} m² const.`} />
          <Chip icon={<Square className="h-4 w-4" />} label={loading ? '—' : `${prop?.superficie_terreno_m2 != null ? nfINT.format(prop!.superficie_terreno_m2!) : '—'} m² terreno`} />
        </div>
      </section>

      {/* DESCRIPCIÓN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-900">Descripción</h2>
            <div className="mt-3 text-slate-700 leading-relaxed whitespace-pre-line">
              {loading
                ? 'Cargando…'
                : (prop?.descripcion || 'Descripción no disponible por el momento.')
              }
            </div>

            {/* Features / Highlights (ejemplo estático si no los tienes en BD) */}
            <h3 className="mt-8 text-lg font-semibold text-slate-900">Características destacadas</h3>
            <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-slate-700">
              <li>• Orientación predominante: Norte</li>
              <li>• Terminaciones de alto estándar</li>
              <li>• Conectividad y servicios cercanos</li>
              <li>• Excelente potencial de renta/plusvalía</li>
            </ul>
          </div>

          {/* “Ficha” derecha adicional */}
          <div className="lg:col-span-1">
            <div className="border border-slate-200 p-4">
              <h4 className="font-medium text-slate-900">Ficha rápida</h4>
              <dl className="mt-3 space-y-2 text-sm">
                <Row label="ID" value={loading ? '—' : (prop?.id ?? '—')} />
                <Row label="Tipo" value={loading ? '—' : (prop?.tipo ?? '—')} />
                <Row label="Operación" value={loading ? '—' : (prop?.operacion ? (prop.operacion[0].toUpperCase()+prop.operacion.slice(1)) : '—')} />
                <Row label="Comuna" value={loading ? '—' : (prop?.comuna ?? '—')} />
                <Row label="Región" value={loading ? '—' : (prop?.region ?? '—')} />
                <Row label="Construidos" value={loading ? '—' : (prop?.superficie_util_m2 != null ? `${nfINT.format(prop!.superficie_util_m2!)} m²` : '—')} />
                <Row label="Terreno" value={loading ? '—' : (prop?.superficie_terreno_m2 != null ? `${nfINT.format(prop!.superficie_terreno_m2!)} m²` : '—')} />
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* MAPA (placeholder) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-16">
        <h2 className="text-xl font-semibold text-slate-900">Ubicación referencial</h2>
        <div className="mt-3 h-80 w-full bg-slate-200 flex items-center justify-center text-slate-500">
          <span className="text-sm">Mapa próximamente</span>
        </div>
      </section>
    </main>
  );
}

/* ---------- UI helpers ---------- */
function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1.5 border rounded-none text-sm"
      style={{ borderColor: BRAND_BLUE, color: BRAND_DARK }}
    >
      {icon}{label}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}
