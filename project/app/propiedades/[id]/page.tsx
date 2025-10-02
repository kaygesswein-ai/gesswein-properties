/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bed, ShowerHead, Car, Ruler, Square,
  X, ChevronLeft, ChevronRight, Compass, TrendingUp,
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
  imagenes?: string[] | null;  // backup legacy
  barrio?: string | null;
};

type Foto = { url: string; tag: string | null };   // viene de /api/propiedades/:id/fotos

/* ------------------------------------------------------------------ */
/*                         FORMATTERS & HELPERS                       */
/* ------------------------------------------------------------------ */
const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

const cls = (...s:(string|false|null|undefined)[]) => s.filter(Boolean).join(' ');
const HERO_FALLBACK =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';

/** Capitaliza TODAS las palabras de la cadena */
const wordsCap = (s?:string|null) =>
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
      } catch {/* ignore */}
    })();
    return () => { alive = false; };
  }, []);
  return uf;
}

/* ------------------------------------------------------------------ */
/*                              LIGHTBOX                              */
/* ------------------------------------------------------------------ */
function Lightbox(props:{
  open:boolean; images:string[]; index:number;
  onClose:()=>void; onPrev:()=>void; onNext:()=>void;
}) {
  const { open, images, index, onClose, onPrev, onNext } = props;

  useEffect(() => {
    if (!open) return;
    const h = (e:KeyboardEvent) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  onPrev();
      if (e.key === 'ArrowRight') onNext();
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
      <img src={images[index]} alt=""
           className="max-h-[90vh] max-w-[92vw] object-contain select-none" />
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
const SectionTitle = ({children}:{children:React.ReactNode}) => (
  <h2 className="mt-10 mb-4 text-[18px] md:text-[20px] uppercase tracking-[0.25em] text-slate-700">
    {children}
  </h2>
);

/* ------------------------------------------------------------------ */
/*                             COMPONENTE                             */
/* ------------------------------------------------------------------ */
export default function PropertyDetailPage({ params }:{ params:{ id:string } }) {
  const [prop,  setProp]  = useState<Property|null>(null);
  const [fotos, setFotos] = useState<Foto[]>([]);    // ← nuevas fotos centralizadas
  const uf = useUf();

  /* --- fetch propiedad + fotos --- */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [pRes, fRes] = await Promise.all([
          fetch(`/api/propiedades/${encodeURIComponent(params.id)}`),
          fetch(`/api/propiedades/${encodeURIComponent(params.id)}/fotos`),
        ]);

        if (alive) {
          const pJson = pRes.ok ? await pRes.json().catch(()=>null) : null;
          setProp(pJson?.data ?? null);

          const fJson = fRes.ok ? await fRes.json().catch(()=>null) : null;
          setFotos(Array.isArray(fJson?.data) ? fJson.data : []);
        }
      } catch {/* ignore */}
    })();
    return () => { alive = false; };
  }, [params.id]);

  /* --- imágenes para hero / galería --- */
  const heroSrc = useMemo(() => {
    const manual = fotos[0]?.url;
    if (manual) return manual;
    return prop?.imagenes?.[0]?.trim()?.length ? prop.imagenes![0] : HERO_FALLBACK;
  }, [fotos, prop]);

  /* --- INFO GENERAL --- */
  const linea = [
    wordsCap(prop?.comuna?.replace(/^lo barnechea/i,'Lo Barnechea')),
    wordsCap(prop?.tipo),
    wordsCap(prop?.operacion),
  ].filter(Boolean).join(' · ');

  const precioUfHero =
    typeof prop?.precio_uf === 'number' && prop.precio_uf>0
      ? prop.precio_uf
      : prop?.precio_clp && uf
        ? Math.round(prop.precio_clp/uf)
        : null;

  const precioClpHero =
    typeof prop?.precio_clp === 'number' && prop.precio_clp>0
      ? prop.precio_clp
      : prop?.precio_uf && uf
        ? Math.round(prop.precio_uf*uf)
        : null;

  const priceBoxRef = useRef<HTMLDivElement|null>(null);
  const btnRef      = useRef<HTMLAnchorElement|null>(null);

  /* --- sincronizar alto botón --- */
  useEffect(() => {
    const sync = () => {
      const h = priceBoxRef.current?.offsetHeight;
      if (btnRef.current && h) {
        Object.assign(btnRef.current.style, {
          height: `${h}px`,
          display:'inline-flex',
          alignItems:'center',
          justifyContent:'center',
          padding:'0 16px',
        });
      }
    };
    sync();
    let ro:ResizeObserver|null = null;
    if ('ResizeObserver'in window){
      ro=new ResizeObserver(sync);
      priceBoxRef.current && ro.observe(priceBoxRef.current);
    }
    return () => { ro?.disconnect(); };
  }, [prop]);

  const dash = '—';
  const fmtInt = (n:number|null|undefined)=>
    typeof n==='number'?nfINT.format(n):dash;

  /* ------------------------------------------------------------------ */
  return (
    <main className="bg-white">
      {/* ---------------- HERO ---------------- */}
      <section className="relative w-full overflow-hidden isolate">
        <div className="absolute inset-0 -z-10 bg-center bg-cover"
             style={{backgroundImage:`url(${heroSrc})`}} />
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
                    {icon:<Bed        className="h-5 w-5 text-[#6C819B]" />, v:prop?.dormitorios},
                    {icon:<ShowerHead className="h-5 w-5 text-[#6C819B]" />, v:prop?.banos},
                    {icon:<Car        className="h-5 w-5 text-[#6C819B]" />, v:prop?.estacionamientos},
                    {icon:<Ruler      className="h-5 w-5 text-[#6C819B]" />, v:fmtInt(prop?.superficie_util_m2)},
                    {icon:<Square     className="h-5 w-5 text-[#6C819B]" />, v:fmtInt(prop?.superficie_terreno_m2)},
                  ].map((t,idx)=>(
                    <div key={idx}
                         className={cls(
                           'flex flex-col items-center justify-center gap-1 py-2 md:py-[10px]',
                           idx<4 && 'border-r border-slate-200'
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
                      style={{boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.95)'}}>
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

      {/* ---------------- GALERÍA + RESTO ---------------- */}
      <GalleryAndDetails fotos={fotos} fallbackImgs={prop?.imagenes ?? []} />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*                        GALERÍA + CONTENIDO                         */
/* ------------------------------------------------------------------ */
function GalleryAndDetails({
  fotos,
  fallbackImgs,
}:{ fotos:Foto[]; fallbackImgs:string[] }) {

  /* ---- normalizamos a {url,cat} ---- */
  const allImgs = useMemo(() => {
    if (fotos.length) {
      return fotos.map(f => ({
        url: f.url,
        cat: (f.tag ?? '').toLowerCase() as 'exterior'|'interior'|'planos'|'todas',
      }));
    }
    // legacy: adivina por URL
    const guess = (url:string):'exterior'|'interior' => {
      const u=url.toLowerCase();
      const ext=/(exterior|fachada|jard|patio|piscina|quincho|terraza|vista|balc[oó]n)/;
      const int=/(living|estar|comedor|cocina|bañ|ban|dorm|pasillo|hall|escritorio|interior)/;
      if (ext.test(u)) return 'exterior';
      if (int.test(u)) return 'interior';
      return 'exterior';
    };
    return fallbackImgs.map(url=>({url,cat:guess(url)}));
  },[fotos,fallbackImgs]);

  const cats = ['todas','exterior','interior','planos'] as const;
  const [tab,setTab]=useState<typeof cats[number]>('todas');
  const filtered = allImgs.filter(i => tab==='todas'?true:i.cat===tab);

  /* ---- lightbox ---- */
  const [lbOpen,setLbOpen]=useState(false);
  const [lbIndex,setLbIndex]=useState(0);
  const openLb  = (i:number)=>{setLbIndex(i);setLbOpen(true);};
  const closeLb = ()=>setLbOpen(false);
  const prevLb  = ()=>setLbIndex(i=>(i-1+filtered.length)%filtered.length);
  const nextLb  = ()=>setLbIndex(i=>(i+1)%filtered.length);

  return (
    <>
      {/* ---------- GALERÍA ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Galería</SectionTitle>

        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
          {cats.map(c=>(
            <button key={c} onClick={()=>setTab(c)}
                    className={cls(
                      'px-4 py-2 border rounded-md text-sm whitespace-nowrap',
                      tab===c
                        ?'bg-[var(--brand-50,#E9EFF6)] border-[var(--brand-200,#BFD0E6)] text-slate-900'
                        :'bg-white border-slate-200 text-slate-700'
                    )}>
              {c==='todas' ? 'Todas' : wordsCap(c)}
            </button>
          ))}
          <span className="ml-auto text-sm text-slate-500 whitespace-nowrap">
            {filtered.length} {filtered.length===1?'foto':'fotos'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((it,i)=>(
            <button key={i} onClick={()=>openLb(i)}
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

      {/* ---------- CONTENIDO RESTANTE (placeholder) ---------- */}
      {/* …(Descripción, características, mapa, etc.)…
          Mantén tu contenido existente aquí
      */}

      {/* ---------- LIGHTBOX ---------- */}
      <Lightbox
        open={lbOpen}
        images={filtered.map(x=>x.url)}
        index={lbIndex}
        onClose={closeLb}
        onPrev={prevLb}
        onNext={nextLb}
      />
    </>
  );
}
