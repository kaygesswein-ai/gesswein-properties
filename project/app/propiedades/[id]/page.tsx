
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bed,
  ShowerHead,
  Car,
  Ruler,
  Square,
  X,
  ChevronLeft,
  ChevronRight,
  Compass,
  TrendingUp,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*                               TIPOS                                */
/* ------------------------------------------------------------------ */
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
  created_at?: string | null;
  descripcion?: string | null;
  imagenes?: string[] | null;
  barrio?: string | null;
};

const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

/* ------------------------------------------------------------------ */
/*                             UTILIDADES                             */
/* ------------------------------------------------------------------ */
const cls = (...s:(string | false | null | undefined)[]) => s.filter(Boolean).join(' ');
const HERO_FALLBACK =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';

const getHeroImage = (p?: Property | null) =>
  p?.imagenes?.[0]?.trim()?.length ? p.imagenes![0] : HERO_FALLBACK;

/** Capitaliza TODAS las palabras de la cadena */
const wordsCap = (s?: string | null) =>
  (s ?? '')
    .toLowerCase()
    .split(' ')
    .map(w => (w ? w[0].toUpperCase() + w.slice(1) : ''))
    .join(' ')
    .trim();

function useUf() {
  const [uf, setUf] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res  = await fetch('https://mindicador.cl/api/uf', { cache: 'no-store' });
        const json = await res.json().catch(() => null);
        const v    = Number(json?.serie?.[0]?.valor);
        if (alive && Number.isFinite(v)) setUf(v);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);
  return uf;
}

/* ------------------------------------------------------------------ */
/*                              LIGHTBOX                              */
/* ------------------------------------------------------------------ */
function Lightbox(props:{
  open: boolean; images: string[]; index: number;
  onClose: ()=>void; onPrev: ()=>void; onNext: ()=>void;
}) {
  const { open, images, index, onClose, onPrev, onNext } = props;

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   onPrev();
      if (e.key === 'ArrowRight')  onNext();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center">
      <button onClick={onClose}  aria-label="Cerrar"
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded">
        <X className="h-6 w-6 text-white" />
      </button>
      <button onClick={onPrev}   aria-label="Anterior"
              className="absolute left-3 md:left-6 p-2 bg-white/10 hover:bg-white/20 rounded">
        <ChevronLeft className="h-8 w-8 text-white" />
      </button>
      <img src={images[index]} alt="" className="max-h-[90vh] max-w-[92vw] object-contain" />
      <button onClick={onNext}   aria-label="Siguiente"
              className="absolute right-3 md:right-6 p-2 bg-white/10 hover:bg-white/20 rounded">
        <ChevronRight className="h-8 w-8 text-white" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                        ENCABEZADO DE SECCIÓN                       */
/* ------------------------------------------------------------------ */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mt-10 mb-4 text-[18px] md:text-[20px] uppercase tracking-[0.25em] text-slate-700">
    {children}
  </h2>
);

/* ------------------------------------------------------------------ */
/*                             COMPONENTE                             */
/* ------------------------------------------------------------------ */
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [prop, setProp] = useState<Property | null>(null);
  const uf = useUf();

  /* --- fetch --- */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/propiedades/${encodeURIComponent(params.id)}`).catch(() => null as any);
        const j = r?.ok ? await r.json().catch(() => null) : null;
        if (alive) setProp(j?.data ?? null);
      } catch { if (alive) setProp(null); }
    })();
    return () => { alive = false; };
  }, [params.id]);

  /* --- cálculos --- */
  const bg = useMemo(() => getHeroImage(prop), [prop]);

  const linea = [
    wordsCap(prop?.comuna?.replace(/^lo barnechea/i, 'Lo Barnechea')),
    wordsCap(prop?.tipo),
    wordsCap(prop?.operacion),
  ]
    .filter(Boolean)
    .join(' · ');

  const precioUfHero =
    typeof prop?.precio_uf === 'number' && prop.precio_uf > 0
      ? prop.precio_uf
      : prop?.precio_clp && uf
        ? Math.round(prop.precio_clp / uf)
        : null;

  const precioClpHero =
    typeof prop?.precio_clp === 'number' && prop.precio_clp > 0
      ? prop.precio_clp
      : prop?.precio_uf && uf
        ? Math.round(prop.precio_uf * uf)
        : null;

  const priceBoxRef = useRef<HTMLDivElement | null>(null);
  const btnRef      = useRef<HTMLAnchorElement | null>(null);

  /* --- sincronizar alto del botón --- */
  useEffect(() => {
    const sync = () => {
      const h = priceBoxRef.current?.offsetHeight;
      if (btnRef.current && h) {
        btnRef.current.style.height = `${h}px`;
        btnRef.current.style.display = 'inline-flex';
        btnRef.current.style.alignItems = 'center';
        btnRef.current.style.justifyContent = 'center';
        btnRef.current.style.padding = '0 16px';
      }
    };
    sync();
    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(sync);
      if (priceBoxRef.current) ro.observe(priceBoxRef.current);
    }
    return () => { try { ro?.disconnect(); } catch {} };
  }, [prop]);

  const dash   = '—';
  const fmtInt = (n: number | null | undefined) =>
    typeof n === 'number' ? nfINT.format(n) : dash;

  /* ------------------------------------------------------------------ */
  return (
    <main className="bg-white">
      {/* ---------------- HERO ---------------- */}
      <section className="relative w-full overflow-hidden isolate">
        <div className="absolute inset-0 -z-10 bg-center bg-cover"
             style={{ backgroundImage: `url(${bg})` }} />
        <div className="absolute inset-0 -z-10 bg-black/35" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16
                        min-h-[100svh] flex items-end pb-16 md:pb-20">
          <div className="w-full">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl p-4 md:p-5
                            w-full md:max-w-[480px]">
              <h1 className="text-[1.4rem] md:text-2xl text-gray-900">
                {prop?.titulo ?? 'Propiedad'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{linea || '—'}</p>

              {/* ---------- Tiles ---------- */}
              <div className="mt-4">
                <div className="grid grid-cols-5 border border-slate-200 bg-white/70">
                  {[
                    { icon: <Bed        className="h-5 w-5 text-[#6C819B]" />, v: prop?.dormitorios },
                    { icon: <ShowerHead className="h-5 w-5 text-[#6C819B]" />, v: prop?.banos },
                    { icon: <Car        className="h-5 w-5 text-[#6C819B]" />, v: prop?.estacionamientos },
                    { icon: <Ruler      className="h-5 w-5 text-[#6C819B]" />, v: fmtInt(prop?.superficie_util_m2) },
                    { icon: <Square     className="h-5 w-5 text-[#6C819B]" />, v: fmtInt(prop?.superficie_terreno_m2) },
                  ].map((t, idx) => (
                    <div key={idx}
                         className={cls(
                           'flex flex-col items-center justify-center gap-1 py-2 md:py-[10px]',
                           idx < 4 && 'border-r border-slate-200'
                         )}>
                      {t.icon}
                      <span className="text-sm text-slate-800 leading-none">{t.v ?? dash}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ---------- Botón + precio ---------- */}
              <div className="mt-4 flex items-end gap-3">
                <Link ref={btnRef} href="/contacto"
                      className="inline-flex text-sm tracking-wide rounded-none
                                 border border-[#0A2E57] text-[#0A2E57] bg-white"
                      style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.95)' }}>
                  Solicitar información
                </Link>

                <div ref={priceBoxRef} className="ml-auto text-right">
                  <div className="text-[1.15rem] md:text-[1.25rem] font-semibold
                                  text-[#0A2E57] leading-none">
                    {precioUfHero ? `UF ${nfUF.format(precioUfHero)}` : 'Consultar'}
                  </div>
                  {precioClpHero && (
                    <div className="text-sm md:text-base text-slate-600 mt-[2px]">
                      $ {nfCLP.format(precioClpHero)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- GALERÍA + DESCRIPCIÓN + FEATURES + MAPA ---------------- */}
      <GalleryAndDetails prop={prop} />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*                        GALERÍA + CONTENIDO                         */
/* ------------------------------------------------------------------ */
function guessCategory(url: string): 'exterior' | 'interior' {
  const u = url.toLowerCase();
  const ext = /(exterior|fachada|jard|patio|piscina|quincho|terraza|vista|balc[oó]n)/;
  const int = /(living|estar|comedor|cocina|bañ|ban|dorm|pasillo|hall|escritorio|interior)/;
  if (ext.test(u)) return 'exterior';
  if (int.test(u)) return 'interior';
  return 'exterior';
}

function GalleryAndDetails({ prop }: { prop: Property | null }) {
  const [tab, setTab] = useState<'todas' | 'exterior' | 'interior'>('todas');
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  const images = useMemo(() => {
    const arr = (prop?.imagenes ?? []).filter(Boolean);
    return arr.length
      ? arr
      : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop'];
  }, [prop]);

  const imagesByCat = useMemo(() => {
    const all = images.map(url => ({ url, cat: guessCategory(url) }));
    return {
      todas: all,
      exterior: all.filter(i => i.cat === 'exterior'),
      interior: all.filter(i => i.cat === 'interior'),
    };
  }, [images]);

  const list = imagesByCat[tab];
  const openLb  = (i: number) => { setLbIndex(i); setLbOpen(true); };
  const closeLb = () => setLbOpen(false);
  const prevLb  = () => setLbIndex(i => (i - 1 + list.length) % list.length);
  const nextLb  = () => setLbIndex(i => (i + 1) % list.length);

  return (
    <>
      {/* ---------- GALERÍA ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Galería</SectionTitle>

        <div className="flex items-center gap-2 mb-4">
          {(['todas', 'exterior', 'interior'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
                    className={cls(
                      'px-4 py-2 border rounded-md text-sm',
                      tab === t
                        ? 'bg-[var(--brand-50,#E9EFF6)] border-[var(--brand-200,#BFD0E6)] text-slate-900'
                        : 'bg-white border-slate-200 text-slate-700'
                    )}>
              {t === 'todas' ? 'Todas' : t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
          <span className="ml-auto text-sm text-slate-500">
            {list.length} {list.length === 1 ? 'foto' : 'fotos'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((it, i) => (
            <button key={i} onClick={() => openLb(i)}
                    className="relative aspect-[4/3] overflow-hidden group border border-slate-200">
              <img src={it.url} alt=""
                   className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </button>
          ))}
        </div>
      </section>

      {/* ---------- SEPARADOR ---------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* ---------- DESCRIPCIÓN ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Descripción</SectionTitle>
        <p className="text-slate-700 leading-relaxed">
          {prop?.descripcion || 'Descripción no disponible por el momento.'}
        </p>
      </section>

      {/* ---------- SEPARADOR ---------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* ---------- CARACTERÍSTICAS ---------- */}
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

      {/* ---------- SEPARADOR ---------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* ---------- MAPA ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <SectionTitle>Explora el sector</SectionTitle>
        <div className="relative w-full h-[420px] border border-slate-200 overflow-hidden">
          <div className="pointer-events-none absolute z-10 left-1/2 top-1/2
                          -translate-x-1/2 -translate-y-1/2 w-[55%] aspect-square
                          rounded-full border border-white/60
                          shadow-[0 0 0 2000px rgba(255,255,255,0.25)]" />
          <iframe
            title="mapa"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d33338.286!2d-70.527!3d-33.406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1es!2scl!4v1713000000000"
          />
        </div>
      </section>

      {/* ---------- LIGHTBOX ---------- */}
      <Lightbox
        open={lbOpen}
        images={list.map(x => x.url)}
        index={lbIndex}
        onClose={closeLb}
        onPrev={prevLb}
        onNext={nextLb}
      />
    </>
  );
}
