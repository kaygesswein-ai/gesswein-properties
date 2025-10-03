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
  Camera,
  Trees,
  Sofa,
  LayoutPanelTop,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
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

  _hero?: string | null; // calculada
};

type FotoRow = {
  url: string;
  categoria?: 'exterior' | 'interior' | 'planos' | null;
  tag?: 'exterior' | 'interior' | 'planos' | null; // compat
  orden?: number | null;
};

type FotoItem = {
  url: string;
  cat: 'exterior' | 'interior' | 'planos';
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

const getHeroImage = (p?: Property | null) => {
  if (!p) return HERO_FALLBACK;
  if (p._hero?.trim()) return p._hero!;
  if (p.imagenes?.[0]?.trim()) return p.imagenes![0];
  return HERO_FALLBACK;
};

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

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef  = useRef<HTMLImageElement | null>(null);

  const [isFs, setIsFs] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<{x:number;y:number}>({x:0,y:0});
  const [drag, setDrag] = useState<{active:boolean; sx:number; sy:number; ox:number; oy:number}>({
    active:false, sx:0, sy:0, ox:0, oy:0
  });

  // keyboard
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      { if (document.fullscreenElement) document.exitFullscreen().catch(()=>{}); onClose(); }
      if (e.key === 'ArrowLeft')   onPrev();
      if (e.key === 'ArrowRight')  onNext();
      if (e.key === '+')           setScale(s => Math.min(3, +(s+0.25).toFixed(2)));
      if (e.key === '-')           setScale(s => Math.max(1, +(s-0.25).toFixed(2)));
      if (e.key === '0')           { setScale(1); setOffset({x:0,y:0}); }
      if (e.key.toLowerCase() === 'f') toggleFullscreen();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose, onPrev, onNext]);

  useEffect(() => { // reset zoom cuando cambia la foto o se abre
    if (open) { setScale(1); setOffset({x:0,y:0}); }
  }, [index, open]);

  const toggleFullscreen = async () => {
    if (!wrapRef.current) return;
    if (!document.fullscreenElement) {
      try { await wrapRef.current.requestFullscreen(); setIsFs(true); } catch {}
    } else {
      try { await document.exitFullscreen(); setIsFs(false); } catch {}
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return;
    setDrag({active:true, sx:e.clientX, sy:e.clientY, ox:offset.x, oy:offset.y});
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.active) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    setOffset({x:drag.ox + dx, y:drag.oy + dy});
  };
  const onMouseUp = () => setDrag(d => ({...d, active:false}));

  const onWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) e.preventDefault();
    const dir = e.deltaY > 0 ? -1 : 1;
    setScale(s => {
      const next = Math.max(1, Math.min(3, +(s + dir*0.25).toFixed(2)));
      if (next === 1) setOffset({x:0,y:0});
      return next;
    });
  };

  const onDblClick = () => {
    setScale(s => {
      const next = s === 1 ? 2 : 1;
      if (next === 1) setOffset({x:0,y:0});
      return next;
    });
  };

  if (!open) return null;
  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[999] bg-black/95 text-white select-none"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      {/* Top bar: contador + acciones */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 text-sm">
        <div className="opacity-80">
          {/* vacío para balancear */}
        </div>
        <div className="rounded bg-white/10 px-3 py-1.5 backdrop-blur-sm">
          <span className="font-medium">{index + 1}</span>
          <span className="opacity-70"> / {images.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(s => Math.max(1, +(s-0.25).toFixed(2)))}
            aria-label="Alejar"
            className="p-2 bg-white/10 hover:bg-white/20 rounded"
          >
            <Minus className="h-5 w-5" />
          </button>
          <button
            onClick={() => setScale(s => Math.min(3, +(s+0.25).toFixed(2)))}
            aria-label="Acercar"
            className="p-2 bg-white/10 hover:bg-white/20 rounded"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            onClick={() => { setScale(1); setOffset({x:0,y:0}); }}
            aria-label="Restablecer zoom"
            className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded"
          >
            100%
          </button>
          <button
            onClick={toggleFullscreen}
            aria-label="Pantalla completa"
            className="p-2 bg-white/10 hover:bg-white/20 rounded"
          >
            {isFs ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          <button
            onClick={() => { if (document.fullscreenElement) document.exitFullscreen().catch(()=>{}); onClose(); }}
            aria-label="Cerrar"
            className="p-2 bg-white/10 hover:bg-white/20 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Flechas */}
      <button
        onClick={onPrev}
        aria-label="Anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        onClick={onNext}
        aria-label="Siguiente"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Imagen */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          ref={imgRef}
          src={images[index]}
          alt=""
          onDoubleClick={onDblClick}
          onMouseDown={onMouseDown}
          draggable={false}
          className={cls(
            'max-h-[88vh] max-w-[92vw] object-contain transition-transform duration-75',
            scale > 1 ? (drag.active ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
          )}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
        />
      </div>
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
  const [photos, setPhotos] = useState<FotoItem[]>([]);
  const uf = useUf();

  const guessCategory = (url: string): 'exterior' | 'interior' | 'planos' => {
    const u = url.toLowerCase();
    const ext = /(exterior|fachada|jard|patio|piscina|quincho|terraza|vista|balc[oó]n)/;
    const int = /(living|estar|comedor|cocina|bañ|ban|dorm|pasillo|hall|escritorio|interior)/;
    if (ext.test(u)) return 'exterior';
    if (int.test(u)) return 'interior';
    return 'exterior';
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // 1) Propiedad
        const r = await fetch(`/api/propiedades/${encodeURIComponent(params.id)}`).catch(() => null as any);
        const j = r?.ok ? await r.json().catch(() => null) : null;
        const baseProp: Property | null = j?.data ?? null;

        // 2) Fotos
        const rf = await fetch(`/api/propiedades/${encodeURIComponent(params.id)}/fotos`).catch(() => null as any);
        const jf = rf?.ok ? await rf.json().catch(() => null) : null;
        const rows: FotoRow[] = Array.isArray(jf?.data) ? jf.data : [];

        const mapped: FotoItem[] = rows.map(row => {
          const cat = (row.categoria ?? row.tag ?? guessCategory(row.url)) as FotoItem['cat'];
          return { url: row.url, cat };
        });

        const heroFromFotos =
          mapped.find(f => f.cat === 'exterior')?.url
          ?? mapped[0]?.url
          ?? baseProp?.imagenes?.[0]
          ?? null;

        const merged: Property | null = baseProp
          ? { ...baseProp, imagenes: mapped.length ? mapped.map(f => f.url) : (baseProp.imagenes ?? []), _hero: heroFromFotos }
          : null;

        if (!alive) return;
        setProp(merged);
        setPhotos(mapped);
      } catch {
        if (alive) {
          setProp(null);
          setPhotos([]);
        }
      }
    })();
    return () => { alive = false; };
  }, [params.id]);

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

              {/* ---------- Tiles de features ---------- */}
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

      {/* ---------------- TARJETAS DE GALERÍA (abre lightbox) ---------------- */}
      <GalleryTiles photos={photos} />

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
                          shadow-[0_0_0_2000px_rgba(255,255,255,0.25)]" />
          <iframe
            title="mapa"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d33338.286!2d-70.527!3d-33.406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1es!2scl!4v1713000000000"
          />
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*              TARJETAS (abre lightbox) SIN GRID DE FOTOS            */
/* ------------------------------------------------------------------ */
function GalleryTiles({ photos }: { photos: FotoItem[] }) {
  const [tab, setTab] = useState<'todas' | 'exterior' | 'interior' | 'planos'>('todas');
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  const effectivePhotos: FotoItem[] = photos.length
    ? photos
    : [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop', cat: 'exterior' }];

  const imagesByCat = useMemo(() => {
    const all = effectivePhotos;
    return {
      todas: all,
      exterior: all.filter(i => i.cat === 'exterior'),
      interior: all.filter(i => i.cat === 'interior'),
      planos: all.filter(i => i.cat === 'planos'),
    };
  }, [effectivePhotos]);

  const currentList = imagesByCat[tab];

  const openLb  = (i: number) => { setLbIndex(i); setLbOpen(true); };
  const closeLb = () => setLbOpen(false);
  const prevLb  = () => setLbIndex(i => (i - 1 + currentList.length) % currentList.length);
  const nextLb  = () => setLbIndex(i => (i + 1) % currentList.length);

  const cover = {
    todas   : imagesByCat.todas[0]?.url,
    exterior: imagesByCat.exterior[0]?.url,
    interior: imagesByCat.interior[0]?.url,
    planos  : imagesByCat.planos[0]?.url ?? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="%2318273a"/><g fill="%23ffffff" opacity="0.25"><rect x="80" y="120" width="640" height="360" stroke="%23ffffff" stroke-width="2" fill="none"/><line x1="80" y1="300" x2="720" y2="300" stroke="%23ffffff" stroke-width="2"/><line x1="400" y1="120" x2="400" y2="480" stroke="%23ffffff" stroke-width="2"/></g></svg>',
  };

  type TileKey = 'todas' | 'exterior' | 'interior' | 'planos';
  type Tile = { key: TileKey; label: string; icon: React.ReactNode; bg?: string; count: number };

  const tiles: Tile[] = [
    { key: 'todas',    label: 'Photos',     icon: <Camera className="h-7 w-7" />,         bg: cover.todas,    count: imagesByCat.todas.length },
    { key: 'exterior', label: 'Exterior',   icon: <Trees className="h-7 w-7" />,          bg: cover.exterior, count: imagesByCat.exterior.length },
    { key: 'interior', label: 'Interior',   icon: <Sofa className="h-7 w-7" />,           bg: cover.interior, count: imagesByCat.interior.length },
    { key: 'planos',   label: 'Floor Plan', icon: <LayoutPanelTop className="h-7 w-7" />, bg: cover.planos,   count: imagesByCat.planos.length },
  ];

  const handleTileClick = (key: TileKey, count: number) => {
    setTab(key);
    if (count > 0) {
      setLbIndex(0);
      setLbOpen(true);
    }
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Galería</SectionTitle>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {tiles.map(t => {
            const disabled = t.count === 0;
            return (
              <button
                key={t.key}
                onClick={() => handleTileClick(t.key, t.count)}
                className={cls(
                  'group relative aspect-[4/3] w-full overflow-hidden rounded-[10px]',
                  'border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
                  disabled && 'opacity-60 cursor-not-allowed'
                )}
                aria-label={t.label}
                disabled={disabled}
              >
                <div
                  className="absolute inset-0 bg-center bg-cover"
                  style={{ backgroundImage: `url(${t.bg ?? ''})` }}
                />
                <div
                  className={cls(
                    'absolute inset-0 transition',
                    'bg-[#0A2E57]/60 group-hover:bg-[#0A2E57]/40'
                  )}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="opacity-90">{t.icon}</div>
                  <div className="mt-2 text-[13px] font-medium tracking-wide">{t.label}</div>
                  <div className="mt-0.5 text-[11px] opacity-80">{t.count} {t.count === 1 ? 'foto' : 'fotos'}</div>
                </div>
                {(!disabled && tab === t.key && (
                  <div className="absolute inset-0 ring-2 ring-[#0A2E57] rounded-[10px] pointer-events-none" />
                )) || null}
              </button>
            );
          })}
        </div>
      </section>

      <Lightbox
        open={lbOpen}
        images={imagesByCat[tab].map(x => x.url)}
        index={lbIndex}
        onClose={() => setLbOpen(false)}
        onPrev={() => {
          const list = imagesByCat[tab];
          setLbIndex(i => (i - 1 + list.length) % list.length);
        }}
        onNext={() => {
          const list = imagesByCat[tab];
          setLbIndex(i => (i + 1) % list.length);
        }}
      />
    </>
  );
}
