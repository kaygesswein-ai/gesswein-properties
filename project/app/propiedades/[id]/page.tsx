/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bed, ShowerHead, Car, Ruler, Square,
  X, ChevronLeft, ChevronRight, Compass, TrendingUp,
} from 'lucide-react';

/* ======================================================== */
/*                           TIPOS                          */
/* ======================================================== */
type Property = {
  id: string;
  titulo?: string | null;
  comuna?: string | null;
  operacion?: 'venta' | 'arriendo' | null;
  tipo?: string | null;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  estacionamientos?: number | null;
  superficie_util_m2?: number | null;
  superficie_terreno_m2?: number | null;
  descripcion?: string | null;
  imagenes?: string[] | null;
};

/* ======================================================== */
/*                     UTILS & HELPERS                      */
/* ======================================================== */
const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

const cls = (...s:(string|false|null|undefined)[]) => s.filter(Boolean).join(' ');
const HERO_FALLBACK =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop';

const capFirst = (s?:string|null) => s ? s[0].toUpperCase()+s.slice(1).toLowerCase() : '';
const capWords = (s?:string|null) => (s ?? '').split(' ').map(capFirst).join(' ').trim();

function guessCategory(url:string):'exterior'|'interior'{
  const u=url.toLowerCase();
  const ext = /(exterior|fachada|jard|patio|piscina|quincho|terraza|vista|balc[oó]n)/;
  const int = /(living|estar|comedor|cocina|bañ|ban|dorm|interior|pasillo|hall)/;
  if(ext.test(u)) return 'exterior';
  if(int.test(u)) return 'interior';
  return 'exterior';
}

/* ------------- mini-hook: UF del día -------------- */
function useUf(){
  const [uf,setUf]=useState<number|null>(null);
  useEffect(()=>{
    let alive=true;
    (async()=>{
      try{
        const r = await fetch('https://mindicador.cl/api/uf',{cache:'no-store'});
        const j = await r.json().catch(()=>null);
        const v = Number(j?.serie?.[0]?.valor);
        if(alive && Number.isFinite(v)) setUf(v);
      }catch{}
    })();
    return()=>{alive=false;};
  },[]);
  return uf;
}

/* ------------- lightbox para galería -------------- */
function Lightbox({open,images,index,onClose,onPrev,onNext}:{open:boolean;images:string[];index:number;
  onClose:()=>void;onPrev:()=>void;onNext:()=>void;}){
  useEffect(()=>{
    if(!open) return;
    const h=(e:KeyboardEvent)=>{
      if(e.key==='Escape') onClose();
      if(e.key==='ArrowLeft') onPrev();
      if(e.key==='ArrowRight') onNext();
    };
    window.addEventListener('keydown',h);
    return()=>window.removeEventListener('keydown',h);
  },[open,onClose,onPrev,onNext]);

  if(!open) return null;
  return(
    <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded">
        <X className="text-white h-6 w-6"/>
      </button>
      <button onClick={onPrev} className="absolute left-3 md:left-6 p-2 bg-white/10 hover:bg-white/20 rounded">
        <ChevronLeft className="text-white h-8 w-8"/>
      </button>
      <img src={images[index]} alt="" className="max-h-[90vh] max-w-[92vw] object-contain select-none"/>
      <button onClick={onNext} className="absolute right-3 md:right-6 p-2 bg-white/10 hover:bg-white/20 rounded">
        <ChevronRight className="text-white h-8 w-8"/>
      </button>
    </div>
  );
}

/* small title component */
const SectionTitle = ({children}:{children:React.ReactNode})=>(
  <h2 className="mt-10 mb-4 text-[18px] md:text-[20px] tracking-[0.25em] uppercase text-slate-700"
      style={{letterSpacing:'0.25em'}}>{children}</h2>
);

/* ======================================================== */
/*                       MAIN PAGE                          */
/* ======================================================== */
export default function PropertyDetailPage({params}:{params:{id:string}}){
  const [prop,setProp]=useState<Property|null>(null);
  const ufHoy = useUf();

  /* ---------- fetch property ---------- */
  useEffect(()=>{
    let cancel=false;
    (async()=>{
      const r=await fetch(`/api/propiedades/${encodeURIComponent(params.id)}`).catch(()=>null as any);
      const j=r?.ok?await r.json().catch(()=>null):null;
      if(!cancel) setProp(j?.data ?? null);
    })();
    return()=>{cancel=true;};
  },[params.id]);

  /* ---------- derived values ---------- */
  const heroImgs = useMemo(()=>{
    const arr=(prop?.imagenes ?? []).filter(Boolean);
    if(arr.length>=3) return arr.slice(0,3);
    if(arr.length===2) return [...arr,arr[1]];
    if(arr.length===1) return [...arr,arr[0],arr[0]];
    return [HERO_FALLBACK,HERO_FALLBACK,HERO_FALLBACK];
  },[prop]);

  const linea=[
    capWords(prop?.comuna?.replace(/^lo barnechea/i,'Lo Barnechea')),
    capFirst(prop?.tipo),
    capFirst(prop?.operacion),
  ].filter(Boolean).join(' · ');

  const precioUF =
    typeof prop?.precio_uf==='number'&&prop.precio_uf>0
      ? Math.round(prop.precio_uf)
      : prop?.precio_clp && ufHoy
        ? Math.round(prop.precio_clp/ufHoy)
        : 0;

  const precioCLP =
    typeof prop?.precio_clp==='number'&&prop.precio_clp>0
      ? Math.round(prop.precio_clp)
      : prop?.precio_uf && ufHoy
        ? Math.round(prop.precio_uf*ufHoy)
        : 0;

  /* ---------- refs para botón ---------- */
  const priceBoxRef=useRef<HTMLDivElement|null>(null);
  const actionRef=useRef<HTMLAnchorElement|null>(null);
  useEffect(()=>{
    const sync=()=>{
      const h=priceBoxRef.current?.offsetHeight;
      if(actionRef.current && h){
        actionRef.current.style.height=`${h}px`;
        actionRef.current.style.display='inline-flex';
        actionRef.current.style.alignItems='center';
        actionRef.current.style.justifyContent='center';
        actionRef.current.style.padding='0 16px';
      }
    };
    sync();
    let ro:ResizeObserver|null=null;
    if('ResizeObserver'in window){
      ro=new ResizeObserver(sync);
      if(priceBoxRef.current) ro.observe(priceBoxRef.current);
    }
    return()=>{try{ro?.disconnect();}catch{}};
  },[prop]);

  const dash='—';
  const fmtInt=(n:number|null|undefined)=>
    typeof n==='number'?nfINT.format(n):dash;

  /* ======================================================== */
  /*                         RENDER                           */
  /* ======================================================== */
  return(
    <main className="bg-white">

      {/* ================= HERO ================= */}
      <section className="relative w-full isolate overflow-hidden">
        {/* ------ collage de 3 fotos ------ */}
        <div className="absolute inset-0 -z-10 grid grid-cols-3 grid-rows-2 gap-[2px]">
          <img src={heroImgs[0]} alt="" className="col-span-2 row-span-2 object-cover w-full h-full"/>
          <img src={heroImgs[1]} alt="" className="object-cover w-full h-full"/>
          <img src={heroImgs[2]} alt="" className="object-cover w-full h-full"/>
        </div>
        {/* sombra para legibilidad */}
        <div className="absolute inset-0 -z-10 bg-black/35"/>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16
                        min-h-[100svh] flex items-end pb-16 md:pb-20">

          <div className="w-full">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl p-4 md:p-5 w-full md:max-w-[480px]">
              <h1 className="text-[1.4rem] md:text-2xl text-gray-900">{prop?.titulo ?? 'Propiedad'}</h1>
              <p className="mt-1 text-sm text-gray-600">{linea || '—'}</p>

              {/* ---------- stats ---------- */}
              <div className="mt-4">
                <div className="grid grid-cols-5 border border-slate-200 bg-white/70 text-center">
                  {[
                    {icon:<Bed className="h-5 w-5 text-[#6C819B]"/>, v:prop?.dormitorios},
                    {icon:<ShowerHead className="h-5 w-5 text-[#6C819B]"/>, v:prop?.banos},
                    {icon:<Car className="h-5 w-5 text-[#6C819B]"/>, v:prop?.estacionamientos},
                    {icon:<Ruler className="h-5 w-5 text-[#6C819B]"/>, v:fmtInt(prop?.superficie_util_m2)},
                    {icon:<Square className="h-5 w-5 text-[#6C819B]"/>, v:fmtInt(prop?.superficie_terreno_m2)},
                  ].map((t,idx)=>(
                    <div key={idx}
                         className={cls('flex flex-col items-center justify-center gap-1 py-3 md:py-4',
                                        idx<4 && 'border-r border-slate-200')}>
                      {t.icon}
                      <span className="text-sm text-slate-800 leading-none">{t.v ?? dash}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ---------- botón & precio ---------- */}
              <div className="mt-4 flex items-end gap-3">
                <Link ref={actionRef} href="/contacto"
                      className="inline-flex text-sm tracking-wide rounded-none
                                 border border-[#0A2E57] text-[#0A2E57] bg-white"
                      style={{boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.95)'}}>
                  Solicitar información
                </Link>

                <div ref={priceBoxRef} className="ml-auto text-right">
                  <div className="text-[1.15rem] md:text-[1.25rem] font-semibold text-[#0A2E57] leading-none">
                    {precioUF ? `UF ${nfUF.format(precioUF)}` : 'Consultar'}
                  </div>
                  {precioCLP>0 && (
                    <div className="text-sm md:text-base text-slate-600 mt-[2px]">
                      $ {nfCLP.format(precioCLP)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENIDO INFERIOR ================= */}
      <GalleryAndDetails prop={prop}/>
    </main>
  );
}

/* ======================================================== */
/*          GALERÍA + DESCRIPCIÓN + FEATURES + MAPA         */
/* ======================================================== */
function GalleryAndDetails({prop}:{prop:Property|null}){
  const [tab,setTab]=useState<'todas'|'exterior'|'interior'>('todas');
  const [lbOpen,setLbOpen]=useState(false);
  const [lbIndex,setLbIndex]=useState(0);

  const images = useMemo(()=>{
    const arr=(prop?.imagenes ?? []).filter(Boolean);
    return arr.length?arr:[HERO_FALLBACK];
  },[prop]);

  const imagesByCat = useMemo(()=>{
    const all=images.map(u=>({url:u,cat:guessCategory(u)}));
    return{
      todas:all,
      exterior:all.filter(i=>i.cat==='exterior'),
      interior:all.filter(i=>i.cat==='interior'),
    };
  },[images]);

  const list=imagesByCat[tab];
  const openLb=(i:number)=>{setLbIndex(i);setLbOpen(true);};
  const closeLb=()=>setLbOpen(false);
  const prevLb=()=>setLbIndex(i=>(i-1+list.length)%list.length);
  const nextLb=()=>setLbIndex(i=>(i+1)%list.length);

  return(
    <>
      {/* ---------- GALERÍA ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Galería</SectionTitle>

        <div className="flex items-center gap-2 mb-4">
          {(['todas','exterior','interior'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
                    className={cls('px-4 py-2 border rounded-md text-sm',
                                   tab===t
                                     ?'bg-[var(--brand-50,#E9EFF6)] border-[var(--brand-200,#BFD0E6)] text-slate-900'
                                     :'bg-white border-slate-200 text-slate-700')}>
              {t==='todas'?'Todas':t[0].toUpperCase()+t.slice(1)}
            </button>
          ))}
          <span className="ml-auto text-sm text-slate-500">
            {list.length} {list.length===1?'foto':'fotos'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((it,i)=>(
            <button key={i} onClick={()=>openLb(i)}
                    className="relative aspect-[4/3] overflow-hidden group border border-slate-200">
              <img src={it.url} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition"/>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"/>
            </button>
          ))}
        </div>
      </section>

      {/* separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10"/>
      </div>

      {/* ---------- DESCRIPCIÓN ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Descripción</SectionTitle>
        <p className="text-slate-700 leading-relaxed">
          {prop?.descripcion || 'Descripción no disponible por el momento.'}
        </p>
      </section>

      {/* separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10"/>
      </div>

      {/* ---------- FEATURES DEMO ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Características destacadas</SectionTitle>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-slate-800">
          <li className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-slate-300">
              <Compass className="h-4 w-4 text-slate-600"/>
            </span>
            <span>Orientación norte</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-slate-300">
              <TrendingUp className="h-4 w-4 text-slate-600"/>
            </span>
            <span>Potencial de plusvalía</span>
          </li>
        </ul>
      </section>

      {/* separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10"/>
      </div>

      {/* ---------- MAPA (marcador estático) ---------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <SectionTitle>Explora el sector</SectionTitle>
        <div className="relative w-full h-[420px] border border-slate-200 overflow-hidden">
          <div className="pointer-events-none absolute z-10 left-1/2 top-1/2
                          -translate-x-1/2 -translate-y-1/2 w-[55%] aspect-square
                          rounded-full border border-white/60
                          shadow-[0_0_0_2000px_rgba(255,255,255,0.25)]"/>
          <iframe
            title="mapa"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d33338.286!2d-70.527!3d-33.406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2scl!4v1713000000000"
          />
        </div>
      </section>

      {/* ---------- LIGHTBOX ---------- */}
      <Lightbox
        open={lbOpen}
        images={list.map(x=>x.url)}
        index={lbIndex}
        onClose={closeLb}
        onPrev={prevLb}
        onNext={nextLb}
      />
    </>
  );
}
