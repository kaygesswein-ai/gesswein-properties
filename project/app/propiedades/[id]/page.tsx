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
  // el backend puede llamar a la categoría "tag" o "categoria", aceptamos ambos
  tag?: 'exterior' | 'interior' | 'planos' | 'portada' | string | null;
  categoria?: 'exterior' | 'interior' | 'planos' | 'portada' | string | null;
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

  // Mapa
  map_lat?: number | null;
  map_lng?: number | null;
  map_zoom?: number | null;

  // NUEVO: si tu API lo trae, lo usamos; si no, lo deducimos de las fotos
  portada_url?: string | null;

  // Tags opcionales
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
  const boxRef = useRef<HTMLDivElement | null>(null);

  type P = { x: number; y: number };
  const pt = (t: Touch | React.Touch): P => ({ x: t.clientX, y: t.clientY });
  const dist2 = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);

  const touch = useRef({
    x0: 0, y0: 0,
    swiping: false,
    pinchStartDist: 0,
    startScale: 1,
  });

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose, onPrev, onNext]);

  useEffect(() => setScale(1), [index, open]);

  const zoomIn  = () => setScale(v => Math.min(3, Math.round((v + 0.25) * 100) / 100));
  const zoomOut = () => setScale(v => Math.max(0.5, Math.round((v - 0.25) * 100) / 100));

  const full = async () => {
    try {
      const el = boxRef.current || document.documentElement;
      if (document.fullscreenElement) await document.exitFullscreen();
      else await el.requestFullscreen();
    } catch {}
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!open) return;
    e.preventDefault();
    Math.sign(e.deltaY) > 0 ? zoomOut() : zoomIn();
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touch.current.x0 = e.touches[0].clientX;
      touch.current.y0 = e.touches[0].clientY;
      touch.current.swiping = true;
    } else if (e.touches.length === 2) {
      const d = dist2(pt(e.touches[0]), pt(e.touches[1]));
      touch.current.pinchStartDist = d;
      touch.current.startScale = scale;
      touch.current.swiping = false;
    }
  };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      const d = dist2(pt(e.touches[0]), pt(e.touches[1]));
      const ratio = d / Math.max(1, touch.current.pinchStartDist);
      setScale(v => Math.max(0.5, Math.min(3, touch.current.startScale * ratio)));
      e.preventDefault();
    }
  };
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touch.current.swiping) return;
    const ch = e.changedTouches?.[0];
    if (!ch) return;
    const dx = ch.clientX - touch.current.x0;
    const dy = ch.clientY - touch.current.y0;
    if (Math.abs(dx) > 40 && Math.abs(dy) < 60) dx < 0 ? onNext() : onPrev();
    touch.current.swiping = false;
  };

  if (!open) return null;

  return (
    <div
      ref={boxRef}
      className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center"
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* contador */}
      <div className="absolute top-3 left-3 md:left-1/2 md:-translate-x-1/2 px-3 py-1 rounded text-white/90 text-sm bg-white/10 z-40">
        {index + 1} / {images.length}
      </div>

      {/* controles */}
      <div className="absolute top-3 right-4 flex items-center gap-2 text-white z-40">
        <button onClick={zoomOut} aria-label="Zoom out" className="p-2 bg-white/10 hover:bg-white/20 rounded">
          <Minus className="h-5 w-5" />
        </button>
        <span className="px-2 text-sm">{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn} aria-label="Zoom in" className="p-2 bg-white/10 hover:bg-white/20 rounded">
          <Plus className="h-5 w-5" />
        </button>
        <button onClick={full} aria-label="Pantalla completa" className="hidden sm:inline-flex p-2 bg-white/10 hover:bg-white/20 rounded">
          <Maximize2 className="h-5 w-5" />
        </button>
        <button onClick={onClose} aria-label="Cerrar" className="p-2 bg-white/10 hover:bg-white/20 rounded">
          <X className="h-5 w-5" />
        </button>
      </div>

      <button onClick={onPrev} aria-label="Anterior" className="absolute left-3 md:left-6 p-2 bg-white/10 hover:bg-white/20 rounded z-30">
        <ChevronLeft className="h-8 w-8 text-white" />
      </button>

      <img
        ref={imgRef}
        src={images[index]}
        alt=""
        className="max-h-[90vh] max-w-[92vw] object-contain transition-transform z-20"
        style={{ transform: `scale(${scale})` }}
      />

      <button onClick={onNext} aria-label="Siguiente" className="absolute right-3 md:right-6 p-2 bg-white/10 hover:bg-white/20 rounded z-30">
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

  // propiedad
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

  // fotos
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

  // normaliza categoría
  function normalizeTag(tag?: string | null): 'portada' | 'exterior' | 'interior' | 'planos' | 'todas' {
    const t = (tag ?? '').toLowerCase();
    if (t.includes('portada')) return 'portada';
    if (t.includes('plan')) return 'planos';
    if (t.includes('exterior') || /(fachada|jard|patio|piscina|quincho|terraza|vista|balc[oó]n)/.test(t)) return 'exterior';
    if (t.includes('interior') || /(living|estar|comedor|cocina|bañ|ban|dorm|pasillo|hall|escritorio)/.test(t)) return 'interior';
    return 'todas';
  }

  // agrupa fotos
  const groups = useMemo(() => {
    const rows = (fotos ?? []).filter(f => f?.url);
    const g = {
      todas: [] as string[],
      portada: [] as string[],
      exterior: [] as string[],
      interior: [] as string[],
      planos: [] as string[],
    };
    rows.forEach(r => {
      const raw = (r.categoria ?? r.tag ?? '') as string | null;
      const k = normalizeTag(raw);
      g.todas.push(r.url);
      if (k !== 'todas') (g as any)[k].push(r.url);
    });
    return g;
  }, [fotos]);

  // HERO: orden de prioridad para elegir la imagen
  const bg = useMemo(() => {
    const fromPropPortada = prop?.portada_url?.trim();
    if (fromPropPortada) return fromPropPortada;

    const fromFotosPortada = groups.portada[0];
    if (fromFotosPortada) return fromFotosPortada;

    const fromProp = (prop?.imagenes?.[0] ?? '').trim();
    if (fromProp) return fromProp;

    const firstFoto = groups.todas[0];
    return firstFoto || HERO_FALLBACK;
  }, [prop?.portada_url, prop?.imagenes, groups.portada, groups.todas]);

  const linea = [
    wordsCap(prop?.comuna?.replace(/^lo barnechea/i, 'Lo Barnechea')),
    wordsCap(prop?.tipo),
    wordsCap(prop?.operacion),
  ].filter(Boolean).join(' · ');

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

              {/* Tiles */}
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

              {/* Botón + precio */}
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

      {/* ---------------- GALERÍA + DESCRIPCIÓN + MAPA ---------------- */}
      <GalleryAndDetails prop={prop} fotos={fotos} groups={groups} />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*                        GALERÍA + CONTENIDO                         */
/* ------------------------------------------------------------------ */
function GalleryAndDetails({
  prop,
  fotos,
  groups,
}: {
  prop: Property | null;
  fotos: FotoRow[];
  groups: {
    todas: string[];
    portada: string[];
    exterior: string[];
    interior: string[];
    planos: string[];
  };
}) {
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  // Tarjetas resumen (NO mostramos "Portada" como tarjeta)
  const tiles = useMemo(() => {
    return [
      { key: 'todas'    as const, label: 'Photos',     icon: <Images   className="h-6 w-6" />, count: (groups.todas    ?? []).length, preview: groups.todas[0]    },
      { key: 'exterior' as const, label: 'Exterior',   icon: <Home     className="h-6 w-6" />, count: (groups.exterior ?? []).length, preview: groups.exterior[0] },
      { key: 'interior' as const, label: 'Interior',   icon: <DoorOpen className="h-6 w-6" />, count: (groups.interior ?? []).length, preview: groups.interior[0] },
      { key: 'planos'   as const, label: 'Floor Plan', icon: <MapIcon  className="h-6 w-6" />, count: (groups.planos   ?? []).length, preview: groups.planos[0]   },
    ];
  }, [groups]);

  // lista que consume Lightbox
  const [dynamicList, setDynamicList] = useState<string[]>([]);
  const openLbFor = (arr: string[], start = 0) => {
    if (!arr.length) return;
    setLbIndex(start);
    setDynamicList(arr);
    setLbOpen(true);
  };
  useEffect(() => {
    if ((groups.todas ?? []).length && dynamicList.length === 0) {
      setDynamicList(groups.todas);
    }
  }, [groups.todas, dynamicList.length]);

  // descripción con espaciado consistente
  const normalizedParagraphs = useMemo(() => {
    const raw = (prop?.descripcion ?? '')
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    return raw.length ? raw.split('\n\n') : [];
  }, [prop?.descripcion]);

  return (
    <>
      {/* TARJETAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Galería</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiles.map(t => {
            const list =
              t.key === 'todas'   ? groups.todas :
              t.key === 'exterior' ? groups.exterior :
              t.key === 'interior' ? groups.interior : groups.planos;

            const showImage = !!t.preview && t.key !== 'todas';
            return (
              <button
                key={t.key}
                onClick={() => openLbFor(list, 0)}
                className="group relative aspect-[4/3] overflow-hidden border border-slate-200 text-left"
              >
                {showImage ? (
                  <img src={t.preview!} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-[rgba(15,40,80,0.55)]" />
                )}

                <div className={cls(
                  'absolute inset-0 flex flex-col items-center justify-center gap-1',
                  'transition',
                  'bg-[rgba(15,40,80,0.55)] group-hover:bg-[rgba(15,40,80,0.40)] text-white'
                )}>
                  <div className="flex items-center gap-2">
                    {t.icon}
                    <span className="font-semibold">{t.label}</span>
                  </div>
                  <span className="text-xs opacity-90">{t.count} {t.count === 1 ? 'foto' : 'fotos'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* DESCRIPCIÓN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Descripción</SectionTitle>

        {normalizedParagraphs.length ? (
          <div>
            {normalizedParagraphs.map((p, i) => (
              <p key={i} className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-3 last:mb-0">
                {p}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-slate-700 leading-relaxed">
            Descripción no disponible por el momento.
          </p>
        )}
      </section>

      {/* SEPARADOR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* MAPA DINÁMICO */}
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

      {/* LIGHTBOX */}
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
