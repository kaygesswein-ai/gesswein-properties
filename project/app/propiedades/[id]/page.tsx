/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bed, ShowerHead, Car, Ruler, Square, X, ChevronLeft, ChevronRight,
  Compass, TrendingUp, Images, DoorOpen, Home, Map as MapIcon,
  Maximize2, Minus, Plus,
} from 'lucide-react';

/* ---------------- Tipos ---------------- */
type FotoRow = {
  url: string;
  categoria?: string | null;
  tag?: string | null;
  orden?: number | null;
};

type Property = {
  id: string;
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

  portada_url?: string | null;
  map_lat?: number | null;
  map_lng?: number | null;
  map_zoom?: number | null;

  tags?: string[] | null;
};

const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

const cls = (...s:(string | false | null | undefined)[]) => s.filter(Boolean).join(' ');
const HERO_FALLBACK =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';

const wordsCap = (s?: string | null) =>
  (s ?? '').toLowerCase().split(' ').map(w => (w ? w[0].toUpperCase() + w.slice(1) : '')).join(' ').trim();

function useUf() {
  const [uf, setUf] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r  = await fetch('https://mindicador.cl/api/uf', { cache: 'no-store' });
        const j  = await r.json().catch(() => null);
        const vv = Number(j?.serie?.[0]?.valor);
        if (alive && Number.isFinite(vv)) setUf(vv);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);
  return uf;
}

/* ---------------- Lightbox (igual que antes) ---------------- */
function Lightbox(props: {
  open: boolean; images: string[]; index: number;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const { open, images, index, onClose, onPrev, onNext } = props;
  const [scale, setScale] = useState(1);
  const boxRef = useRef<HTMLDivElement | null>(null);
  type P = { x:number; y:number };
  const pt = (t: Touch | React.Touch): P => ({ x:t.clientX, y:t.clientY });
  const dist2 = (a:P, b:P) => Math.hypot(a.x-b.x, a.y-b.y);

  const touch = useRef({ x0:0, y0:0, swiping:false, pinchStartDist:0, startScale:1 });

  useEffect(() => {
    if (!open) return;
    const h = (e:KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose, onPrev, onNext]);

  useEffect(() => setScale(1), [index, open]);
  const zoomIn  = () => setScale(v => Math.min(3, Math.round((v+0.25)*100)/100));
  const zoomOut = () => setScale(v => Math.max(0.5, Math.round((v-0.25)*100)/100));

  const onWheel = (e:React.WheelEvent) => { if (!open) return; e.preventDefault(); Math.sign(e.deltaY)>0?zoomOut():zoomIn(); };
  const onTouchStart = (e:React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length===1) {
      touch.current.x0=e.touches[0].clientX; touch.current.y0=e.touches[0].clientY; touch.current.swiping=true;
    } else if (e.touches.length===2) {
      touch.current.pinchStartDist = dist2(pt(e.touches[0]), pt(e.touches[1]));
      touch.current.startScale = scale; touch.current.swiping=false;
    }
  };
  const onTouchMove = (e:React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length===2) {
      const d = dist2(pt(e.touches[0]), pt(e.touches[1]));
      const ratio = d/Math.max(1, touch.current.pinchStartDist);
      setScale(Math.max(0.5, Math.min(3, touch.current.startScale*ratio)));
      e.preventDefault();
    }
  };
  const onTouchEnd = (e:React.TouchEvent<HTMLDivElement>) => {
    if (!touch.current.swiping) return;
    const ch = e.changedTouches?.[0]; if (!ch) return;
    const dx = ch.clientX - touch.current.x0, dy = ch.clientY - touch.current.y0;
    if (Math.abs(dx)>40 && Math.abs(dy)<60) dx<0?onNext():onPrev();
    touch.current.swiping=false;
  };

  if (!open) return null;
  return (
    <div ref={boxRef} className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center"
         onWheel={onWheel} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div className="absolute top-3 left-3 md:left-1/2 md:-translate-x-1/2 px-3 py-1 rounded text-white/90 text-sm bg-white/10 z-40">
        {index+1} / {images.length}
      </div>
      <div className="absolute top-3 right-4 flex items-center gap-2 text-white z-40">
        <button onClick={zoomOut} className="p-2 bg-white/10 hover:bg-white/20 rounded"><Minus className="h-5 w-5"/></button>
        <span className="px-2 text-sm">{Math.round(scale*100)}%</span>
        <button onClick={zoomIn}  className="p-2 bg-white/10 hover:bg-white/20 rounded"><Plus className="h-5 w-5"/></button>
        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded"><X className="h-5 w-5"/></button>
      </div>
      <button onClick={onPrev} className="absolute left-3 md:left-6 p-2 bg-white/10 hover:bg-white/20 rounded z-30">
        <ChevronLeft className="h-8 w-8 text-white" />
      </button>
      <img src={images[index]} alt="" className="max-h-[90vh] max-w-[92vw] object-contain transition-transform z-20"
           style={{ transform:`scale(${scale})` }} />
      <button onClick={onNext} className="absolute right-3 md:right-6 p-2 bg-white/10 hover:bg-white/20 rounded z-30">
        <ChevronRight className="h-8 w-8 text-white" />
      </button>
    </div>
  );
}

/* ---------------- Página ---------------- */
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [prop, setProp] = useState<Property | null>(null);
  const [fotos, setFotos] = useState<FotoRow[]>([]);
  const uf = useUf();

  // NO CACHE + cache-buster
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/propiedades/${encodeURIComponent(params.id)}?ts=${Date.now()}`, { cache:'no-store' });
        const j = r.ok ? await r.json().catch(() => null) : null;
        if (alive) setProp(j?.data ?? null);
      } catch { if (alive) setProp(null); }
    })();
    return () => { alive = false; };
  }, [params.id]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/propiedades/${encodeURIComponent(params.id)}/fotos?ts=${Date.now()}`, { cache:'no-store' });
        const j = r.ok ? await r.json().catch(() => null) : null;
        if (alive) setFotos(j?.data ?? []);
      } catch { if (alive) setFotos([]); }
    })();
    return () => { alive = false; };
  }, [params.id]);

  const heroUrl = useMemo(() => {
    if (prop?.portada_url && String(prop.portada_url).trim().length) return prop.portada_url!;
    const portada = fotos.find(f => (f.categoria ?? f.tag ?? '').toLowerCase()==='portada')?.url;
    if (portada) return portada;
    const fromProp = (prop?.imagenes ?? []).find(u => (u ?? '').trim().length);
    if (fromProp) return fromProp!;
    const first = fotos.find(f => f.url)?.url;
    return first || HERO_FALLBACK;
  }, [prop?.portada_url, prop?.imagenes, fotos]);

  const linea = [
    wordsCap(prop?.comuna?.replace(/^lo barnechea/i, 'Lo Barnechea')),
    wordsCap(prop?.tipo),
    wordsCap(prop?.operacion),
  ].filter(Boolean).join(' · ');

  const precioUfHero =
    typeof prop?.precio_uf === 'number' && prop.precio_uf > 0 ? prop.precio_uf :
    prop?.precio_clp && uf ? Math.round(prop.precio_clp/uf) : null;

  const precioClpHero =
    typeof prop?.precio_clp === 'number' && prop.precio_clp > 0 ? prop.precio_clp :
    prop?.precio_uf && uf ? Math.round(prop.precio_uf*uf) : null;

  const priceBoxRef = useRef<HTMLDivElement | null>(null);
  const btnRef      = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    const sync = () => {
      const h = priceBoxRef.current?.offsetHeight;
      if (!h || !btnRef.current) return;
      Object.assign(btnRef.current.style, {
        height: `${h}px`, display:'inline-flex', alignItems:'center', justifyContent:'center', padding:'0 16px'
      } as CSSStyleDeclaration);
    };
    sync();
    let ro:ResizeObserver|null=null;
    if ('ResizeObserver' in window) { ro=new ResizeObserver(sync); if (priceBoxRef.current) ro.observe(priceBoxRef.current); }
    return () => { try { ro?.disconnect(); } catch {} };
  }, [prop]);

  const dash = '—';
  const fmtInt = (n: number | null | undefined) => typeof n==='number' ? nfINT.format(n) : dash;

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative w-full overflow-hidden isolate">
        <div className="absolute inset-0 -z-10 bg-center bg-cover" style={{ backgroundImage:`url(${heroUrl})` }} />
        <div className="absolute inset-0 -z-10 bg-black/35" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 min-h-[100svh] flex items-end pb-16 md:pb-20">
          <div className="w-full">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl p-4 md:p-5 w-full md:max-w-[480px]">
              <h1 className="text-[1.4rem] md:text-2xl text-gray-900">{prop?.titulo ?? 'Propiedad'}</h1>
              <p className="mt-1 text-sm text-gray-600">{linea || '—'}</p>
              <div className="mt-4">
                <div className="grid grid-cols-5 border border-slate-200 bg-white/70">
                  {[
                    { icon:<Bed className="h-5 w-5 text-[#6C819B]" />,        v: prop?.dormitorios },
                    { icon:<ShowerHead className="h-5 w-5 text-[#6C819B]" />,  v: prop?.banos },
                    { icon:<Car className="h-5 w-5 text-[#6C819B]" />,         v: prop?.estacionamientos },
                    { icon:<Ruler className="h-5 w-5 text-[#6C819B]" />,       v: fmtInt(prop?.superficie_util_m2) },
                    { icon:<Square className="h-5 w-5 text-[#6C819B]" />,      v: fmtInt(prop?.superficie_terreno_m2) },
                  ].map((t, idx) => (
                    <div key={idx} className={cls('flex flex-col items-center justify-center gap-1 py-2 md:py-[10px]', idx<4 && 'border-r border-slate-200')}>
                      {t.icon}<span className="text-sm text-slate-800 leading-none">{t.v ?? dash}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-end gap-3">
                <Link ref={btnRef} href="/contacto"
                      className="inline-flex text-sm tracking-wide rounded-none border border-[#0A2E57] text-[#0A2E57] bg-white"
                      style={{ boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.95)' }}>
                  Solicitar información
                </Link>
                <div ref={priceBoxRef} className="ml-auto text-right">
                  <div className="text-[1.15rem] md:text-[1.25rem] font-semibold text-[#0A2E57] leading-none">
                    {precioUfHero ? `UF ${nfUF.format(precioUfHero)}` : 'Consultar'}
                  </div>
                  {precioClpHero && <div className="text-sm md:text-base text-slate-600 mt-[2px]">$ {nfCLP.format(precioClpHero)}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GalleryAndDetails prop={prop} fotos={fotos} />
    </main>
  );
}

/* ---------------- Galería + contenido ---------------- */
function normalizeTag(row?: FotoRow): 'exterior'|'interior'|'planos'|'portada'|'todas' {
  const raw = (row?.categoria ?? row?.tag ?? '')?.toString().toLowerCase();
  if (!raw) return 'todas';
  if (raw.includes('portada')) return 'portada';
  if (raw.includes('plan')) return 'planos';
  if (raw.includes('exterior') || /(fachada|jard|patio|piscina|quincho|terraza|vista|balc[oó]n)/.test(raw)) return 'exterior';
  if (raw.includes('interior') || /(living|estar|comedor|cocina|bañ|ban|dorm|pasillo|hall|escritorio)/.test(raw)) return 'interior';
  return 'todas';
}

function GalleryAndDetails({ prop, fotos }: { prop: Property | null; fotos: FotoRow[] }) {
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  const groups = useMemo(() => {
    const map = { todas: [] as string[], exterior: [] as string[], interior: [] as string[], planos: [] as string[] };
    (fotos ?? []).filter(f => f?.url).forEach(r => {
      const k = normalizeTag(r);
      map.todas.push(r.url);
      if (k==='exterior') map.exterior.push(r.url);
      if (k==='interior') map.interior.push(r.url);
      if (k==='planos')   map.planos.push(r.url);
    });
    return map;
  }, [fotos]);

  const tiles = useMemo(() => ([
    { key:'todas' as const,    label:'Photos',     icon:<Images className="h-6 w-6"/>,   count:groups.todas.length,    preview:undefined },
    { key:'exterior' as const, label:'Exterior',   icon:<Home className="h-6 w-6"/>,     count:groups.exterior.length,  preview:groups.exterior[0] },
    { key:'interior' as const, label:'Interior',   icon:<DoorOpen className="h-6 w-6"/>, count:groups.interior.length,  preview:groups.interior[0] },
    { key:'planos' as const,   label:'Floor Plan', icon:<MapIcon className="h-6 w-6"/>,  count:groups.planos.length,    preview:groups.planos[0] },
  ]), [groups]);

  const [dynamicList, setDynamicList] = useState<string[]>([]);
  const openLbFor = (arr: string[], start=0) => { if (!arr.length) return; setLbIndex(start); setDynamicList(arr); setLbOpen(true); };
  useEffect(() => { if (groups.todas.length && !dynamicList.length) setDynamicList(groups.todas); }, [groups.todas, dynamicList.length]);

  const normalizedParagraphs = useMemo(() => {
    const raw = (prop?.descripcion ?? '').replace(/\r\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
    return raw ? raw.split('\n\n') : [];
  }, [prop?.descripcion]);

  const featureTags = (prop?.tags ?? []).filter(t => (t ?? '').trim().length);
  const hasTags = featureTags.length>0;

  return (
    <>
      {/* Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mt-10 mb-4 text-[18px] md:text-[20px] uppercase tracking-[0.25em] text-slate-700">Galería</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiles.map(t => {
            const list = t.key==='todas'?groups.todas : t.key==='exterior'?groups.exterior : t.key==='interior'?groups.interior : groups.planos;
            const withImg = !!t.preview;
            return (
              <button key={t.key} onClick={() => openLbFor(list,0)} className="group relative aspect-[4/3] overflow-hidden border border-slate-200 text-left">
                {withImg ? <img src={t.preview!} alt="" className="absolute inset-0 w-full h-full object-cover" /> :
                  <div className="absolute inset-0 bg-[rgba(15,40,80,0.55)]" />}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[rgba(15,40,80,0.55)] group-hover:bg-[rgba(15,40,80,0.40)] text-white">
                  <div className="flex items-center gap-2">{t.icon}<span className="font-semibold">{t.label}</span></div>
                  <span className="text-xs opacity-90">{t.count} {t.count===1?'foto':'fotos'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Descripción */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mt-10 mb-4 text-[18px] md:text-[20px] uppercase tracking-[0.25em] text-slate-700">Descripción</h2>
        {normalizedParagraphs.length ? normalizedParagraphs.map((p,i)=>(
          <p key={i} className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-3 last:mb-0">{p}</p>
        )) : <p className="text-slate-700 leading-relaxed">Descripción no disponible por el momento.</p>}
      </section>

      {/* Separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="h-px bg-slate-200 my-10" /></div>

      {/* Características destacadas (SIEMPRE visible; usa tu array tags) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mt-10 mb-4 text-[18px] md:text-[20px] uppercase tracking-[0.25em] text-slate-700">Características destacadas</h2>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-slate-800">
          {hasTags ? featureTags.map((t,i)=>(
            <li key={`${t}-${i}`} className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-slate-300">
                <Compass className="h-4 w-4 text-slate-600" />
              </span>
              <span>{t}</span>
            </li>
          )) : (
            <>
              <li className="flex items-center gap-2"><span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300"><Compass className="h-4 w-4 text-slate-600"/></span><span>Orientación norte</span></li>
              <li className="flex items-center gap-2"><span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300"><TrendingUp className="h-4 w-4 text-slate-600"/></span><span>Potencial de plusvalía</span></li>
            </>
          )}
        </ul>
      </section>

      {/* Separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="h-px bg-slate-200 my-10" /></div>

      {/* Mapa */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="mt-10 mb-4 text-[18px] md:text-[20px] uppercase tracking-[0.25em] text-slate-700">Explora el sector</h2>
        <div className="relative w-full h-[420px] border border-slate-200 overflow-hidden rounded">
          {(() => {
            const lat  = typeof prop?.map_lat  === 'number' ? prop!.map_lat  : -33.437;
            const lng  = typeof prop?.map_lng  === 'number' ? prop!.map_lng  : -70.65;
            const zoom = typeof prop?.map_zoom === 'number' ? (prop!.map_zoom as number) : 15;
            const src  = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=es&output=embed`;
            return <iframe title="mapa" className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={src} />;
          })()}
        </div>
      </section>

      <Lightbox open={lbOpen} images={dynamicList} index={lbIndex}
                onClose={()=>setLbOpen(false)}
                onPrev={()=>setLbIndex(i=>(i-1+dynamicList.length)%dynamicList.length)}
                onNext={()=>setLbIndex(i=>(i+1)%dynamicList.length)} />
    </>
  );
}
