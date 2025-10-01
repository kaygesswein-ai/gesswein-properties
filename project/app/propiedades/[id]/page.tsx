'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bed, ShowerHead, Car, Ruler, Square, MapPin
} from 'lucide-react';

/* ================= Config / helpers ================= */
const BRAND_BLUE = '#0A2E57';
const BRAND_DARK = '#0f172a';

type PropRow = {
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
  barrio?: string | null;
  created_at?: string | null;
};

const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

/* ===== Map helpers (dinámico por barrio/comuna) ===== */
function buildMapTarget(p?: { barrio?: string | null; comuna?: string | null; region?: string | null }) {
  const barrio = (p?.barrio || '').trim();
  const comuna = (p?.comuna || '').trim();
  const region = (p?.region || '').trim();

  if (barrio && comuna) return { q: `${barrio}, ${comuna}`, zoom: 14 }; // barrio + comuna (cercano)
  if (comuna)           return { q: `${comuna}`,           zoom: 12 }; // solo comuna
  if (region)           return { q: `${region}`,           zoom: 9  }; // región
  return { q: 'Santiago, Chile', zoom: 11 };                             // fallback
}

function mapSrcFrom(p?: { barrio?: string | null; comuna?: string | null; region?: string | null }) {
  const { q, zoom } = buildMapTarget(p);
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed&hl=es`;
}

/* ---------- fetch (usa tu API interna ya creada) ---------- */
async function fetchPropertyByIdOrSlug(idOrSlug: string): Promise<PropRow | null> {
  try {
    const res = await fetch(`/api/propiedades/${encodeURIComponent(idOrSlug)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    return (json && json.data) ? (json.data as PropRow) : null;
  } catch {
    return null;
  }
}

/* ---------- UI helpers ---------- */
function classNames(...s: (string|false|undefined|null)[]) { return s.filter(Boolean).join(' '); }

/* ================= Page ================= */
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [prop, setProp] = useState<PropRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const decoded = decodeURIComponent(params.id);
      const data = await fetchPropertyByIdOrSlug(decoded);
      if (!cancel) {
        setProp(data);
        setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [params.id]);

  const cover = useMemo(() => {
    if (prop?.imagenes?.length) return prop.imagenes[0]!;
    // fallback
    return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop';
  }, [prop]);

  const gallery = useMemo(() => (prop?.imagenes ?? []).slice(0, 32), [prop]);

  const showUF  = !!(prop?.precio_uf && prop.precio_uf > 0);
  const showCLP = !!(prop?.precio_clp && prop.precio_clp > 0);

  return (
    <main className="bg-white text-slate-800">
      {/* HERO: imagen full-bleed */}
      <section className="relative w-full min-h-[62vh] md:min-h-[70vh] lg:min-h-[76vh]">
        <img
          src={cover}
          alt={prop?.titulo ?? 'Propiedad'}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* overlay degradé sutil para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/20" />

        {/* Caja estilo “destacado” (similar a home) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="w-full md:max-w-[92%] lg:max-w-[86%] mt-[44vh] md:mt-[48vh] lg:mt-[52vh]
                       bg-white/85 backdrop-blur border border-slate-200 shadow-sm"
          >
            <div className="px-5 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6">
              {/* Título + CTA */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-[clamp(22px,3vw,34px)] font-medium text-slate-900">
                    {loading ? 'Cargando…' : (prop?.titulo ?? 'Propiedad')}
                  </h1>
                  <p className="mt-1.5 flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    {loading ? '—' : [prop?.comuna, prop?.region].filter(Boolean).join(', ')}
                    {prop?.operacion ? (
                      <span className="mx-2">· {prop.tipo ?? '—'} · {prop.operacion[0].toUpperCase()+prop.operacion.slice(1)}</span>
                    ) : null}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-[clamp(20px,2.5vw,28px)] font-semibold" style={{ color: BRAND_BLUE }}>
                    {loading ? '—' : (showUF ? `UF ${nfUF.format(prop!.precio_uf as number)}` : 'Consultar')}
                  </div>
                  {showCLP ? (
                    <div className="text-sm text-slate-600">
                      $ {nfCLP.format(prop!.precio_clp as number)}
                    </div>
                  ) : null}
                  <Link
                    href="/contacto"
                    className="mt-1 inline-flex items-center justify-center px-4 py-2 text-white rounded-none"
                    style={{ background: BRAND_BLUE }}
                  >
                    Solicitar información
                  </Link>
                </div>
              </div>

              {/* KPIs (idéntico lenguaje visual que listados) */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                <Kpi icon={<Bed className="h-4 w-4" />}    label="Dormitorios" value={prop?.dormitorios} />
                <Kpi icon={<ShowerHead className="h-4 w-4" />} label="Baños" value={prop?.banos} />
                <Kpi icon={<Car className="h-4 w-4" />}    label="Estac." value={prop?.estacionamientos} />
                <Kpi icon={<Ruler className="h-4 w-4" />}  label="m² const." value={prop?.superficie_util_m2} />
                <Kpi icon={<Square className="h-4 w-4" />} label="m² terreno" value={prop?.superficie_terreno_m2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* G A L E R Í A */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-[clamp(20px,2.2vw,28px)] tracking-[0.2em] font-semibold text-slate-800">GALERÍA</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(gallery.length ? gallery : [cover]).map((src, i) => (
            <a key={i} href={src} target="_blank" rel="noreferrer"
               className="block relative w-full aspect-[4/3] overflow-hidden bg-slate-200">
              <img src={src} alt={`Foto ${i+1}`} className="absolute inset-0 w-full h-full object-cover hover:scale-[1.015] transition-transform" />
            </a>
          ))}
        </div>
      </section>

      {/* separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* D E S C R I P C I Ó N */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[clamp(20px,2.2vw,28px)] tracking-[0.2em] font-semibold text-slate-800 mb-2">
          DESCRIPCIÓN
        </h2>
        <p className="text-slate-700 leading-relaxed">
          {loading
            ? 'Cargando…'
            : (prop?.descripcion
                ?? 'Propiedad con gran potencial en un sector consolidado. Entorno residencial, conectividad y servicios a minutos. Ideal para quienes buscan tranquilidad, áreas verdes y una proyección de plusvalía en el tiempo. Solicita más información para coordinar visita.')}
        </p>
      </section>

      {/* separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* C A R A C T E R Í S T I C A S  D E S T A C A D A S */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[clamp(20px,2.2vw,28px)] tracking-[0.2em] font-semibold text-slate-800 mb-4">
          CARACTERÍSTICAS DESTACADAS
        </h2>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-slate-700">
          <li>• Orientación norte</li>
          <li>• Potencial de plusvalía</li>
        </ul>
      </section>

      {/* separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* M A P A  dinámico: barrio -> comuna -> región */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-[clamp(20px,2.2vw,28px)] tracking-[0.2em] font-semibold text-slate-800 mb-4">
          EXPLORA EL SECTOR
        </h2>

        <div className="relative w-full aspect-[16/9] overflow-hidden border border-slate-200">
          <iframe
            title="Ubicación referencial"
            src={mapSrcFrom(prop ?? undefined)}
            className="absolute inset-0 w-full h-full"
            referrerPolicy="no-referrer-when-downgrade"
            loading="lazy"
          />
          {/* Overlay tipo radio + pin (no bloquea interacción) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="rounded-full"
              style={{
                width: '48%',
                aspectRatio: '1 / 1',
                background: 'radial-gradient(closest-side, rgba(10,46,87,0.12), rgba(10,46,87,0.04) 60%, rgba(10,46,87,0) 70%)',
              }}
            />
            <div className="absolute flex items-center justify-center"
                style={{ width: 56, height: 56, borderRadius: 9999, background: BRAND_BLUE }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 2.25c-3.6 0-6.5 2.9-6.5 6.5 0 4.5 6.5 13 6.5 13s6.5-8.5 6.5-13c0-3.6-2.9-6.5-6.5-6.5Zm0 9.25a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5Z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============ Subcomponentes ============ */
function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value?: number | null }) {
  return (
    <div className="border border-slate-200 px-3 py-2 bg-white/90 flex items-center gap-2">
      <span className="text-slate-600">{icon}</span>
      <div className="flex-1">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-slate-800">{value != null ? nfINT.format(value) : '—'}</div>
      </div>
    </div>
  );
}
