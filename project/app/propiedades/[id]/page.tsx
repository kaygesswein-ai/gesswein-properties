
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
  Images,
  DoorOpen,
  Home,
  Map as MapIcon,
  Maximize2,
  Minus,
  Plus,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*                               TIPOS                                */
/* ------------------------------------------------------------------ */
type FotoRow = {
  url: string;
  tag?: 'exterior' | 'interior' | 'planos' | string | null;
  orden?: number | null;
};

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

  // NUEVOS CAMPOS DINÁMICOS PARA EL MAPA
  map_lat?: number | null;
  map_lng?: number | null;
  map_zoom?: number | null;

  // Características destacadas opcionales
  tags?: string[] | null;
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

  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Soporte swipe táctil
  const touchStartX = useRef<number | null>(null);
  const touchEndX   = useRef<number | null>(null);

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

  useEffect(() => { setScale(1); }, [index, open]);

  const zoomIn  = () => setScale(v => Math.min(3, Math.round((v + 0.25) * 100) / 100));
  const zoomOut = () => setScale(v => Math.max(0.5, Math.round((v - 0.25) * 100) / 100));

  const full = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    } catch {}
  };

  // Eventos táctiles (móvil)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 50) onNext();      // swipe izquierda -> siguiente
    if (delta < -50) onPrev();     // swipe derecha   -> anterior
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* HUD superior (contador) */}
      <div
        className="
          absolute top-3 left-5 sm:top-4 sm:left-1/2 sm:-translate-x-1/2
          z-30 text-white text-[14px] sm:text-sm font-medium
          px-3 py-[6px] rounded-full
          bg-[rgba(10,46,87,0.85)] backdrop-blur-sm shadow-md
          pointer-events-none select-none
        "
      >
        {index + 1} / {images.length}
      </div>

      {/* Controles */}
      <div className="absolute top-3 right-4 flex items-center gap-2 text-white z-30">
        <button onClick={zoomOut} aria-label="Zoom out"
                className="p-2 bg-white/10 hover:bg-white/20 rounded">
          <Minus className="h-5 w-5" />
        </button>
        <span className="px-2 text-sm">{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn} aria-label="Zoom in"
                className="p-2 bg-white/10 hover:bg-white/20 rounded">
          <Plus className="h-5 w-5" />
        </button>
        {/* Oculto en móvil */}
        <button onClick={full} aria-label="Pantalla completa"
                className="hidden sm:inline-flex p-2 bg-white/10 hover:bg-white/20 rounded">
          <Maximize2 className="h-5 w-5" />
        </button>
        <button onClick={onClose} aria-label="Cerrar"
                className="p-2 bg-white/10 hover:bg-white/20 rounded">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Flechas */}
      <button onClick={onPrev}   aria-label="Anterior"
              className="absolute left-3 md:left-6 p-2 bg-white/10 hover:bg-white/20 rounded z-30">
        <ChevronLeft className="h-8 w-8 text-white" />
      </button>

      <img
        ref={imgRef}
        src={images[index]}
        alt=""
        className="max-h-[90vh] max-w-[92vw] object-contain transition-transform"
        style={{ transform: `scale(${scale})` }}
      />

      <button onClick={onNext}   aria-label="Siguiente"
              className="absolute right-3 md:right-6 p-2 bg-white/10 hover:bg-white/20 rounded z-30">
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
  const [fotos, setFotos] = useState<FotoRow[]>([]);
  const uf = useUf();

  /* --- fetch propiedad --- */
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

  /* --- fetch fotos --- */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/propiedades/${encodeURIComponent(params.id)}/fotos`).catch(() => null as any);
        const j = r?.ok ? await r.json().catch(() => null) : null;
        const rows: FotoRow[] = j?.data ?? [];
        if (alive) setFotos(rows);
      } catch { if (alive) setFotos([]); }
    })();
    return () => { alive = false; };
  }, [params.id]);

  /* --- cálculos --- */

  // Si no hay imagen en la propiedad, usa la primera foto cargada
  const bg = useMemo(() => {
    const fromProp = getHeroImage(prop);
    if (fromProp !== HERO_FALLBACK) return fromProp;
    const firstFoto = fotos?.find(f => f?.url)?.url;
    return firstFoto || HERO_FALLBACK;
  }, [prop, fotos]);

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
      <GalleryAndDetails prop={prop} fotos={fotos} />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*                        GALERÍA + CONTENIDO                         */
/* ------------------------------------------------------------------ */
function normalizeTag(tag?: string | null): 'exterior' | 'interior' | 'planos' | 'todas' {
  const t = (tag ?? '').toLowerCase();
  if (t.includes('plan')) return 'planos';
  if (t.includes('exterior') || /(fachada|jard|patio|piscina|quincho|terraza|vista|balc[oó]n)/.test(t)) return 'exterior';
  if (t.includes('interior') || /(living|estar|comedor|cocina|bañ|ban|dorm|pasillo|hall|escritorio)/.test(t)) return 'interior';
  return 'todas';
}

function GalleryAndDetails({ prop, fotos }: { prop: Property | null; fotos: FotoRow[] }) {
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  // Agrupa fotos por categoría
  const { todas, exterior, interior, planos } = useMemo(() => {
    const rows = (fotos ?? []).filter(f => f?.url);
    const map = {
      todas: [] as string[],
      exterior: [] as string[],
      interior: [] as string[],
      planos: [] as string[],
    };
    rows.forEach(r => {
      const k = normalizeTag(r.tag);
      map.todas.push(r.url);
      if (k !== 'todas') map[k].push(r.url);
    });
    return map;
  }, [fotos]);

  // Tarjetas resumen (sin foto de fondo para "Photos" y "Floor Plan")
  const tiles = useMemo(() => {
    return [
      { key: 'todas'    as const, label: 'Photos',     icon: <Images   className="h-6 w-6" />, count: (todas    ?? []).length, list: todas,    showImg: false, preview: todas[0] },
      { key: 'exterior' as const, label: 'Exterior',   icon: <Home     className="h-6 w-6" />, count: (exterior ?? []).length, list: exterior, showImg: true,  preview: exterior[0] },
      { key: 'interior' as const, label: 'Interior',   icon: <DoorOpen className="h-6 w-6" />, count: (interior ?? []).length, list: interior, showImg: true,  preview: interior[0] },
      { key: 'planos'   as const, label: 'Floor Plan', icon: <MapIcon  className="h-6 w-6" />, count: (planos   ?? []).length, list: planos,   showImg: false, preview: planos[0] },
    ];
  }, [todas, exterior, interior, planos]);

  const openLbFor = (arr: string[], start = 0) => {
    if (!arr.length) return;
    setLbIndex(start);
    setDynamicList(arr);
    setLbOpen(true);
  };

  // lista dinámica que consume Lightbox
  const [dynamicList, setDynamicList] = useState<string[]>([]);

  useEffect(() => {
    if ((todas ?? []).length && dynamicList.length === 0) {
      setDynamicList(todas);
    }
  }, [todas, dynamicList.length]);

  return (
    <>
      {/* ---------- TARJETAS / TILES ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Galería</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiles.map(t => {
            const showImg = t.showImg && !!t.preview && t.list.length > 0;

            return (
              <button
                key={t.key}
                onClick={() => openLbFor(t.list, 0)}
                className="group relative aspect-[4/3] overflow-hidden border border-slate-200 text-left"
              >
                {/* Fondo: foto si corresponde, si no, color */}
                {showImg ? (
                  <img src={t.preview!} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-[rgba(15,40,80,0.25)]" />
                )}
                <div
                  className={cls(
                    'absolute inset-0 flex flex-col items-center justify-center gap-1',
                    'transition',
                    'bg-[rgba(15,40,80,0.55)] group-hover:bg-[rgba(15,40,80,0.40)] text-white'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {t.icon}
                    <span className="font-semibold">{t.label}</span>
                  </div>
                  <span className="text-xs opacity-90">
                    {t.count} {t.count === 1 ? 'foto' : 'fotos'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---------- DESCRIPCIÓN ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Descripción</SectionTitle>
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
          {prop?.descripcion || 'Descripción no disponible por el momento.'}
        </p>
      </section>

      {/* ---------- SEPARADOR ---------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* ---------- CARACTERÍSTICAS DESTACADAS ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Características destacadas</SectionTitle>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-slate-800">
          {(prop?.tags ?? []).length ? (
            (prop?.tags ?? []).map((t, i) => (
              <li key={`${t}-${i}`} className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-slate-300">
                  <Compass className="h-4 w-4 text-slate-600" />
                </span>
                <span>{t}</span>
              </li>
            ))
          ) : (
            <>
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
            </>
          )}
        </ul>
      </section>

      {/* ---------- SEPARADOR ---------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* ---------- MAPA (DINÁMICO) ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <SectionTitle>Explora el sector</SectionTitle>
        <div className="relative w-full h-[420px] border border-slate-200 overflow-hidden rounded">
          {(() => {
            const lat  = typeof prop?.map_lat  === 'number' ? prop!.map_lat  : -33.437;
            const lng  = typeof prop?.map_lng  === 'number' ? prop!.map_lng  : -70.65;
            const zoom = typeof prop?.map_zoom === 'number' ? (prop!.map_zoom as number) : 15;
            const src  = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=es&output=embed`;
            return (
              <iframe
                title="mapa"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={src}
              />
            );
          })()}
        </div>
      </section>

      {/* ---------- LIGHTBOX ---------- */}
      <Lightbox
        open={lbOpen}
        images={dynamicList}
        index={lbIndex}
        onClose={() => setLbOpen(false)}
        onPrev={() => setLbIndex(i => (i - 1 + dynamicList.length) % dynamicList.length)}
        onNext={() => setLbIndex(i => (i + 1) % dynamicList.length)}
      />
    </>
  );
}
