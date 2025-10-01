'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bed, ShowerHead, Car, Ruler, Square, MapPin, X, ChevronLeft, ChevronRight, Compass, TrendingUp,
} from 'lucide-react';

const BRAND_BLUE = '#0A2E57';
const BRAND_DARK = '#0f172a';

/* ========= Tipos ========= */
type Property = {
  id: string;
  slug?: string | null;
  titulo?: string | null;
  comuna?: string | null;
  region?: string | null;
  barrio?: string | null;           // <-- agregado para el mapa dinámico
  operacion?: 'venta' | 'arriendo' | null;
  tipo?: string | null;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  superficie_util_m2?: number | null;
  superficie_terreno_m2?: number | null;
  estacionamientos?: number | null;
  created_at?: string | null;
  descripcion?: string | null;
  imagenes?: string[] | null;
};

const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

/* ========= Util ========= */
const cls = (...s: (string | false | null | undefined)[]) => s.filter(Boolean).join(' ');

/** adivina categoría por nombre de archivo */
function guessCategory(url: string): 'exterior' | 'interior' {
  const u = url.toLowerCase();
  const ext = /(exterior|fachada|jard|patio|piscina|quincho|terraza|vista|balc[oó]n)/;
  const int = /(living|estar|comedor|cocina|bañ|ban|dorm|pasillo|hall|escritorio|interior)/;
  if (ext.test(u)) return 'exterior';
  if (int.test(u)) return 'interior';
  return /(\d{1,2}\s*)?(a|b)?\.(jpg|png|jpeg)/.test(u) ? 'exterior' : 'interior';
}

/* ==== Helpers para el mapa (barrio -> comuna -> región) ==== */
function buildMapTarget(p?: { barrio?: string | null; comuna?: string | null; region?: string | null }) {
  const barrio = (p?.barrio || '').trim();
  const comuna = (p?.comuna || '').trim();
  const region = (p?.region || '').trim();

  if (barrio && comuna) return { q: `${barrio}, ${comuna}`, zoom: 14 };
  if (comuna)           return { q: `${comuna}`,           zoom: 12 };
  if (region)           return { q: `${region}`,           zoom: 9  };
  return { q: 'Santiago, Chile', zoom: 11 };
}
function mapEmbedSrc(p?: { barrio?: string | null; comuna?: string | null; region?: string | null }) {
  const { q, zoom } = buildMapTarget(p);
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed&hl=es`;
}

/* ========= Lightbox simple ========= */
function Lightbox({
  open, images, index, onClose, onPrev, onNext,
}: {
  open: boolean;
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;
  const src = images[index];

  return (
    <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded"
        aria-label="Cerrar"
      >
        <X className="text-white h-6 w-6" />
      </button>

      <button
        onClick={onPrev}
        aria-label="Anterior"
        className="absolute left-3 md:left-6 p-2 bg-white/10 hover:bg-white/20 rounded"
      >
        <ChevronLeft className="text-white h-8 w-8" />
      </button>

      <img
        src={src}
        alt="foto"
        className="max-h-[90vh] max-w-[92vw] object-contain select-none"
      />

      <button
        onClick={onNext}
        aria-label="Siguiente"
        className="absolute right-3 md:right-6 p-2 bg-white/10 hover:bg-white/20 rounded"
      >
        <ChevronRight className="text-white h-8 w-8" />
      </button>
    </div>
  );
}

/* ========= Encabezado de sección (mismo look que “BÚSQUEDA”) ========= */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mt-10 mb-4 text-[18px] md:text-[20px] tracking-[0.25em] uppercase text-slate-700"
      style={{ letterSpacing: '0.25em' }}
    >
      {children}
    </h2>
  );
}

/* ========= Chips con íconos (como las cards) ========= */
function FeatureChips({ p }: { p: Property }) {
  const Item = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <span
      className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-[14px] bg-white/70 backdrop-blur"
      style={{ borderColor: '#D6DEE8', color: BRAND_DARK }}
    >
      {icon}{label}
    </span>
  );

  return (
    <div className="flex flex-wrap gap-2">
      <Item icon={<Bed className="h-4 w-4" />}    label={`${p.dormitorios ?? '—'}`} />
      <Item icon={<ShowerHead className="h-4 w-4" />} label={`${p.banos ?? '—'}`} />
      <Item icon={<Car className="h-4 w-4" />}    label={`${p.estacionamientos ?? '—'}`} />
      <Item icon={<Ruler className="h-4 w-4" />}  label={`${p.superficie_util_m2 != null ? nfINT.format(p.superficie_util_m2) : '—'} m² const.`} />
      <Item icon={<Square className="h-4 w-4" />} label={`${p.superficie_terreno_m2 != null ? nfINT.format(p.superficie_terreno_m2) : '—'} m² terreno`} />
    </div>
  );
}

/* ========= Página ========= */
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [prop, setProp] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<'todas' | 'exterior' | 'interior'>('todas');
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  // fetch desde tu API (ya estaba funcionando)
  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/propiedades/${encodeURIComponent(params.id)}`).catch(() => null as any);
      let data: any = null;
      if (res?.ok) { const j = await res.json().catch(() => null); data = j?.data ?? null; }
      if (!cancel) { setProp(data); setLoading(false); }
    })();
    return () => { cancel = true; };
  }, [params.id]);

  const images = useMemo(() => {
    const arr = (prop?.imagenes ?? []).filter(Boolean);
    if (!arr.length) {
      return ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop'];
    }
    return arr;
  }, [prop]);

  // clasificación por categoría (All / Exterior / Interior)
  const imagesByCat = useMemo(() => {
    const all = images.map((url) => ({ url, cat: guessCategory(url) }));
    return {
      todas: all,
      exterior: all.filter((i) => i.cat === 'exterior'),
      interior: all.filter((i) => i.cat === 'interior'),
    };
  }, [images]);
  const list = imagesByCat[tab];
  const priceUF = prop?.precio_uf ? `UF ${nfUF.format(prop!.precio_uf!)}` : 'Consultar';
  const priceCLP = prop?.precio_clp && prop.precio_clp > 0 ? `$ ${nfCLP.format(prop.precio_clp)}` : '';

  // Mapa dinámico
  const mapSrc = useMemo(() => mapEmbedSrc(prop ?? undefined), [prop]);

  /* ====== Lightbox handlers ====== */
  const openLb = (idx: number) => { setLbIndex(idx); setLbOpen(true); };
  const closeLb = () => setLbOpen(false);
  const prevLb = () => setLbIndex((i) => (i - 1 + list.length) % list.length);
  const nextLb = () => setLbIndex((i) => (i + 1) % list.length);

  return (
    <main className="bg-white">
      {/* HERO full-bleed */}
      <section className="relative w-full h-[86vh] md:h-[88vh]">
        <img
          src={images[0]}
          alt={prop?.titulo ?? 'Propiedad'}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* overlay para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />

        {/* Tarjeta superior tipo “destacada” */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[95%] md:w-[92%]">
          <div className="bg-white/80 backdrop-blur-md shadow-sm border border-slate-200 px-4 sm:px-6 py-4 md:py-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-[22px] md:text-[28px] font-normal text-slate-900">
                  {prop?.titulo ?? 'Propiedad'}
                </h1>
                <div className="mt-1 flex items-center gap-2 text-slate-600 text-[14px]">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">
                    {[prop?.comuna, prop?.region].filter(Boolean).join(', ')}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="font-medium" style={{ color: BRAND_BLUE }}>{priceUF}</span>
                  {priceCLP ? <span className="text-slate-500 ml-2">{priceCLP}</span> : null}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/contacto"
                  className="px-5 py-3 text-white rounded-none"
                  style={{ background: BRAND_BLUE }}
                >
                  Solicitar información
                </Link>
              </div>
            </div>

            {/* chips (como cards) */}
            <div className="mt-4">
              <FeatureChips p={prop ?? { id: '' }} />
            </div>
          </div>
        </div>

        {/* (se elimina el botón “Volver a propiedades” como pediste) */}
      </section>

      {/* GALERÍA con tabs + lightbox */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Galería</SectionTitle>

        <div className="flex items-center gap-2 mb-4">
          {(['todas','exterior','interior'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cls(
                'px-4 py-2 border rounded-md text-sm',
                tab === t ? 'bg-[var(--brand-50,#E9EFF6)] border-[var(--brand-200,#BFD0E6)] text-slate-900' : 'bg-white border-slate-200 text-slate-700'
              )}
            >
              {t === 'todas' ? 'Todas' : t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
          <span className="ml-auto text-sm text-slate-500">{list.length} {list.length === 1 ? 'foto' : 'fotos'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((it, i) => (
            <button
              key={i}
              onClick={() => openLb(i)}
              className="relative aspect-[4/3] overflow-hidden group border border-slate-200"
            >
              <img src={it.url} alt={`img ${i+1}`} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </button>
          ))}
        </div>
      </section>

      {/* separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* DESCRIPCIÓN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Descripción</SectionTitle>
        <p className="text-slate-700 leading-relaxed">
          {prop?.descripcion || 'Descripción no disponible por el momento.'}
        </p>
      </section>

      {/* CARACTERÍSTICAS DESTACADAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Características destacadas</SectionTitle>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-slate-800">
          <li className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-slate-300">
              <Compass className="h-4 w-4 text-slate-600" />
            </span>
            <span>Orientación norte</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-slate-300">
              <TrendingUp className="h-4 w-4 text-slate-600" />
            </span>
            <span>Potencial de plusvalía</span>
          </li>
        </ul>
      </section>

      {/* separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* EXPLORA EL SECTOR (mapa dinámico + “círculo” referencial) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <SectionTitle>Explora el sector</SectionTitle>
        <div className="relative w-full h-[420px] border border-slate-200 overflow-hidden">
          {/* círculo referencial */}
          <div className="pointer-events-none absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] aspect-square rounded-full border border-white/60 shadow-[0_0_0_2000px_rgba(255,255,255,0.25)]" />
          <iframe
            title="mapa"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
          />
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        open={lbOpen}
        images={list.map((x) => x.url)}
        index={lbIndex}
        onClose={closeLb}
        onPrev={prevLb}
        onNext={nextLb}
      />
    </main>
  );
}
