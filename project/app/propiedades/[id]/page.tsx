// project/app/propiedades/[id]/page.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Bed, ShowerHead, Car, Ruler, Square, MapPin, Plus, Minus, X, ChevronLeft, ChevronRight
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
  imagenes?: string[] | null;
  descripcion?: string | null;
};

const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

function classNames(...s: (string|false|undefined|null)[]) { return s.filter(Boolean).join(' '); }

async function fetchProp(idOrSlug: string): Promise<Property | null> {
  const res = await fetch(`/api/propiedades/${encodeURIComponent(idOrSlug)}`, { cache: 'no-store' }).catch(() => null as any);
  if (!res || !res.ok) return null;
  const j = await res.json().catch(() => null as any);
  return j?.data ?? null;
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [prop, setProp] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const raw = decodeURIComponent(params.id || '');
      const p = await fetchProp(raw);
      if (!cancel) {
        setProp(p);
        setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [params.id]);

  const images = useMemo(() => (prop?.imagenes ?? []).filter(Boolean), [prop]);

  /* --------------- LIGHTBOX --------------- */
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightIndex, setLightIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const imgWrap = useRef<HTMLDivElement>(null);

  const openAt = (i: number) => { setLightIndex(i); setZoom(1); setLightboxOpen(true); };
  const prev = () => setLightIndex(i => (i - 1 + images.length) % images.length);
  const next = () => setLightIndex(i => (i + 1) % images.length);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, images.length]);

  /* --------------- RENDER --------------- */
  const showUF = !!(prop?.precio_uf && prop.precio_uf > 0);
  const showCLP = !!(prop?.precio_clp && prop.precio_clp > 0);

  const hero = images[0] ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop';

  return (
    <main className="bg-white">
      {/* NAV superior: link atrás */}
      <div className="border-b border-slate-200 bg-white/70 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <Link href="/propiedades" className="inline-flex items-center gap-2 text-sm" style={{ color: BRAND_BLUE }}>
            <ArrowLeft className="h-4 w-4" />
            Volver a propiedades
          </Link>
        </div>
      </div>

      {/* HERO full-bleed (80vh) con tarjeta superpuesta */}
      <section className="relative w-full" style={{ height: '80vh' }}>
        <img src={hero} alt={prop?.titulo ?? 'Propiedad'} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[min(1200px,92vw)]">
          <div className="backdrop-blur bg-white/80 shadow-sm px-5 py-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              {loading ? 'Cargando…' : (prop?.titulo ?? 'Propiedad')}
            </h1>
            <p className="mt-1 text-slate-700 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {loading ? '—' : [prop?.comuna, prop?.region].filter(Boolean).join(', ')}
            </p>
            {/* chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip label={prop?.operacion ? cap(prop.operacion) : '—'} />
              <Chip label={prop?.tipo ?? '—'} />
              {prop?.superficie_terreno_m2 != null && <Chip label={`${nfINT.format(prop.superficie_terreno_m2)} m² terreno`} />}
              {prop?.superficie_util_m2 != null && <Chip label={`${nfINT.format(prop.superficie_util_m2)} m² const.`} />}
            </div>
          </div>
        </div>
      </section>

      {/* MOSAICO inicial: 1 grande + 2 pequeñas (si hay) */}
      {images.length > 1 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => openAt(0)} className="col-span-2 aspect-[16/9] overflow-hidden">
              <img src={images[0]} alt="" className="w-full h-full object-cover" />
            </button>
            <div className="grid grid-rows-2 gap-3">
              <button onClick={() => openAt(1)} className="aspect-[16/9] overflow-hidden">
                <img src={images[1] ?? images[0]} alt="" className="w-full h-full object-cover" />
              </button>
              <button onClick={() => openAt(2)} className="aspect-[16/9] overflow-hidden">
                <img src={images[2] ?? images[0]} alt="" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CONTENIDO principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Galería en miniaturas */}
          <div className="lg:col-span-2">
            <h2 className="gp-section">GALERÍA</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {images.map((url, i) => (
                <button key={i} onClick={() => openAt(i)} className="aspect-[4/3] overflow-hidden">
                  <img src={url} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Descripción */}
            <h2 className="gp-section mt-10">DESCRIPCIÓN</h2>
            <p className="mt-3 text-slate-700 leading-relaxed">
              {loading ? 'Cargando…' : (prop?.descripcion || 'Descripción no disponible por el momento.')}
            </p>

            {/* Destacados */}
            <h2 className="gp-section mt-10">CARACTERÍSTICAS DESTACADAS</h2>
            <ul className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-slate-700">
              <li>• Orientación predominante: Norte</li>
              <li>• Terminaciones de alto estándar</li>
              <li>• Conectividad y servicios cercanos</li>
              <li>• Excelente potencial de renta/plusvalía</li>
            </ul>

            {/* Mapa */}
            <h2 className="gp-section mt-10">EXPLORA EL SECTOR</h2>
            <div className="mt-3 w-full h-80 bg-slate-200 overflow-hidden">
              {(!loading && (prop?.comuna || prop?.region)) ? (
                <>
                  <iframe
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent([prop?.comuna, prop?.region].filter(Boolean).join(', '))}&output=embed`}
                  />
                  <div className="mt-2 text-sm">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([prop?.comuna, prop?.region].filter(Boolean).join(', '))}`}
                      target="_blank" rel="noopener noreferrer"
                      className="underline"
                      style={{ color: BRAND_BLUE }}
                    >
                      Ver en Google Maps
                    </a>
                    <span className="text-slate-500 ml-2">(ubicación referencial)</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">Mapa próximamente</div>
              )}
            </div>
          </div>

          {/* Aside: precio + CTA (limpio, sin ID) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-[88px] border border-slate-200 p-4">
              <div className="text-sm text-slate-500">Precio</div>
              <div className="text-3xl font-semibold" style={{ color: BRAND_BLUE }}>
                {loading ? '—' : (showUF ? `UF ${nfUF.format(prop!.precio_uf as number)}` : 'Consultar')}
              </div>
              {(!loading && showCLP) && (
                <div className="text-sm text-slate-500 mt-1">{nfCLP.format(prop!.precio_clp as number)}</div>
              )}
              <div className="h-px bg-slate-200 my-4" />
              <Link
                href="/contacto"
                className="block text-center px-4 py-3 text-white"
                style={{ background: BRAND_BLUE }}
              >
                Solicitar información
              </Link>

              <dl className="mt-6 space-y-2 text-sm">
                <Row label="Tipo" value={prop?.tipo ?? '—'} />
                <Row label="Operación" value={prop?.operacion ? cap(prop.operacion) : '—'} />
                <Row label="Comuna" value={prop?.comuna ?? '—'} />
                <Row label="Región" value={prop?.region ?? '—'} />
                <Row label="Construidos" value={prop?.superficie_util_m2 != null ? `${nfINT.format(prop.superficie_util_m2)} m²` : '—'} />
                <Row label="Terreno" value={prop?.superficie_terreno_m2 != null ? `${nfINT.format(prop.superficie_terreno_m2)} m²` : '—'} />
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 text-white">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="absolute inset-0 flex items-center justify-center">
            <button onClick={prev} className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20"><ChevronLeft className="h-6 w-6" /></button>
            <button onClick={next} className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20"><ChevronRight className="h-6 w-6" /></button>

            <div ref={imgWrap} className="max-w-[95vw] max-h-[85vh] overflow-hidden">
              <img
                key={lightIndex}
                src={images[lightIndex]}
                alt=""
                className="select-none"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 120ms ease' }}
                draggable={false}
              />
            </div>

            <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-2">
              <button onClick={() => setZoom(z => Math.max(1, +(z - 0.1).toFixed(2)))} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded"><Minus /></button>
              <button onClick={() => setZoom(1)} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded">100%</button>
              <button onClick={() => setZoom(z => +(z + 0.1).toFixed(2))} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded"><Plus /></button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- UI helpers ---------- */
function cap(s: string) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

function Chip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1.5 border rounded-none text-sm"
      style={{ borderColor: BRAND_BLUE, color: BRAND_DARK }}
    >
      {label}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}

/* Título de sección “igual” al estilo del sitio (versión Tailwind) */
declare module 'react' { interface HTMLAttributes<T> { } }
