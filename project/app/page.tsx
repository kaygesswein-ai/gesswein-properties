/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bed,
  ShowerHead,
  Ruler,
  Gift,
  Users2,
  Car,
  Square,
} from 'lucide-react';
import useUf from '../hooks/useUf';
import SmartSelect from '../components/SmartSelect';

/* ------------------------------------------------------------------ */
/*                               TIPOS                                */
/* ------------------------------------------------------------------ */
type Property = {
  id: string;
  titulo?: string;
  comuna?: string;
  operacion?: 'venta' | 'arriendo';
  tipo?: string;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  estacionamientos?: number | null;
  superficie_util_m2?: number | null;
  superficie_terreno_m2?: number | null;
  imagenes?: string[];
  images?: string[];
  coverImage?: string;
  destacada?: boolean;
  // (No es obligatorio, pero si vienen, las usamos)
  // portada_url?: string | null;
  // portada_fija_url?: string | null;
};

/* ------------------------------------------------------------------ */
/*                             UTILIDADES                             */
/* ------------------------------------------------------------------ */
const fmtUF  = (n:number) => `UF ${new Intl.NumberFormat('es-CL',{maximumFractionDigits:0}).format(n)}`;
const fmtCLP = (n:number) => `$ ${new Intl.NumberFormat('es-CL',{maximumFractionDigits:0}).format(n)}`;

const fmtPrecioFallback = (pUf?:number|null,pClp?:number|null) =>
  typeof pUf === 'number' && pUf>0 ? fmtUF(pUf)
  : typeof pClp === 'number' && pClp>0 ? fmtCLP(pClp)
  : 'Consultar';

const capFirst = (s?:string|null) =>{
  if(!s) return '';
  const lower=s.toLowerCase();
  return lower.charAt(0).toUpperCase()+lower.slice(1);
};

/* capitaliza cada palabra (“las condes” → “Las Condes”) */
const capWords = (s?:string|null) =>
  (s ?? '')
    .split(' ')
    .map(w=>w ? w[0].toUpperCase()+w.slice(1).toLowerCase() : '')
    .join(' ')
    .trim();

const HERO_FALLBACK =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';

function getHeroImage(p?:Property){
  if(!p) return HERO_FALLBACK;
  const anyP:any = p;
  // PRIORIDAD: portada_url / portada_fija_url (Supabase) -> cover/imagenes habituales -> fallback
  const cand:(string|undefined|null)[]=[
    anyP.portada_url,
    anyP.portada_fija_url,
    p.coverImage,
    anyP.imagen, anyP.image, anyP.foto,
    p.images?.[0], p.imagenes?.[0],
  ];
  const src=cand.find(s=>typeof s==='string' && s.trim().length>4);
  return (src as string) || HERO_FALLBACK;
}

/* ------------------------------------------------------------------ */
/*                      DATOS CHILE – SELECTS                         */
/* ------------------------------------------------------------------ */
const REGIONES:readonly string[]=[
  'Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo','Valparaíso',
  "O'Higgins",'Maule','Ñuble','Biobío','La Araucanía','Los Ríos','Los Lagos',
  'Aysén','Magallanes','Metropolitana de Santiago',
];
type Region = (typeof REGIONES)[number];

const displayRegion=(r:Region)=>{
  const roman=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI'][REGIONES.indexOf(r)]||'';
  return roman ? `${roman} - ${r}` : r;
};

const SERVICIOS = ['Comprar','Vender','Arrendar','Gestionar un arriendo','Consultoría específica'];
const TIPO_PROPIEDAD = ['Casa','Departamento','Bodega','Oficina','Local comercial','Terreno'];

/* ------------------------------------------------------------------ */
/*                              HOME PAGE                             */
/* ------------------------------------------------------------------ */
export default function HomePage(){
  const [destacadas,setDestacadas]=useState<Property[]>([]);
  const [i,setI]=useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const priceBoxRef = useRef<HTMLDivElement|null>(null);
  const verMasRef   = useRef<HTMLAnchorElement|null>(null);

  /* ---------- fetch propiedades destacadas ---------- */
  useEffect(()=>{
    let mounted=true;
    (async()=>{
      try{
        const res = await fetch('/api/propiedades?destacada=true&limit=6',{cache:'no-store'});
        const j   = await res.json().catch(()=>null);
        if(!mounted) return;
        const data:Array<Property>=Array.isArray(j?.data)?j.data:[];
        const fixed=data.map(p=>(p.precio_uf??0)<=0&&(p.precio_clp??0)<=0
          ? {...p,precio_uf:2300}
          : p);
        setDestacadas(fixed);
      }catch{ if(mounted) setDestacadas([]); }
    })();
    return()=>{ mounted=false; };
  },[]);

  /* ---------- autoplay ---------- */
  useEffect(()=>{
    if(!destacadas.length) return;
    if(timerRef.current) clearInterval(timerRef.current);
    timerRef.current=setInterval(()=>setI(p=>(p+1)%destacadas.length),4000);
    return()=>{ if(timerRef.current) clearInterval(timerRef.current); };
  },[destacadas.length]);

  const go=(dir:-1|1)=>{
    if(!destacadas.length) return;
    setI(p=>{
      const n=destacadas.length;
      return ((p+dir)%n+n)%n;
    });
  };

  /* ---------- touch swipe ---------- */
  const touchStartX=useRef<number|null>(null);
  const touchDeltaX=useRef(0);
  const onTouchStart=(e:React.TouchEvent)=>{
    touchStartX.current=e.touches[0].clientX;
    touchDeltaX.current=0;
    if(timerRef.current) clearInterval(timerRef.current);
  };
  const onTouchMove=(e:React.TouchEvent)=>{
    if(touchStartX.current!==null){
      touchDeltaX.current=e.touches[0].clientX-touchStartX.current;
    }
  };
  const onTouchEnd=()=>{
    const dx=touchDeltaX.current;
    if(Math.abs(dx)>50){ dx<0?go(1):go(-1); }
    touchStartX.current=null; touchDeltaX.current=0;
    if(destacadas.length){
      timerRef.current=setInterval(()=>setI(p=>(p+1)%destacadas.length),4000);
    }
  };

  /* ---------- hero data ---------- */
  const active=destacadas[i];
  const bg=useMemo(()=>getHeroImage(active),[active]);

  const lineaSecundaria=[
    capWords(active?.comuna?.replace(/^lo barnechea/i,'Lo Barnechea')),
    capFirst(active?.tipo),
    capFirst(active?.operacion),
  ].filter(Boolean).join(' · ');

  const ufHoy=useUf();
  const precioUfHero =
    typeof active?.precio_uf==='number' && active.precio_uf>0
      ? Math.round(active.precio_uf)
      : active?.precio_clp && ufHoy
        ? Math.round(active.precio_clp/ufHoy)
        : 0;

  const precioClpHero =
    typeof active?.precio_clp==='number' && active.precio_clp>0
      ? Math.round(active.precio_clp)
      : active?.precio_uf && ufHoy
        ? Math.round(active.precio_uf*ufHoy)
        : 0;

  /* ---------- sincronizar alto del botón ---------- */
  useEffect(()=>{
    const sync=()=>{
      const h=priceBoxRef.current?.offsetHeight;
      if(verMasRef.current && h){
        verMasRef.current.style.height=`${h}px`;
        verMasRef.current.style.display='inline-flex';
        verMasRef.current.style.alignItems='center';
        verMasRef.current.style.justifyContent='center';
        verMasRef.current.style.padding='0 16px';
      }
    };
    sync();
    let ro:ResizeObserver|null=null;
    if('ResizeObserver'in window){
      ro=new ResizeObserver(sync);
      if(priceBoxRef.current) ro.observe(priceBoxRef.current);
    }
    return()=>{ try{ro?.disconnect();}catch{} };
  },[active]);

  const dash='—';
  const fmtInt=(n:number|null|undefined)=>
    typeof n==='number' ? new Intl.NumberFormat('es-CL',{maximumFractionDigits:0}).format(n) : dash;

  /* ------------------------------------------------------------------ */
  return(
    <main className="bg-white">
      {/* ================= HERO ================= */}
      <section
        className="relative w-full overflow-hidden isolate"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0 -z-10 bg-center bg-cover"
             style={{backgroundImage:`url(${bg})`}} />
        <div className="absolute inset-0 -z-10 bg-black/35" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16
                        min-h-[100svh] flex items-end pb-16 md:pb-20">
          <div className="w-full">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl p-4 md:p-5
                            w-full md:max-w-[480px]">
              <h1 className="text-[1.4rem] md:text-2xl text-gray-900">
                {active?.titulo ?? 'Propiedad destacada'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{lineaSecundaria || '—'}</p>

              {/* ---------- Tiles ---------- */}
              <div className="mt-4">
                <div className="grid grid-cols-5 border border-slate-200 bg-white/70">
                  {[
                    {icon:<Bed        className="h-5 w-5 text-[#6C819B]"/>, v:active?.dormitorios},
                    {icon:<ShowerHead className="h-5 w-5 text-[#6C819B]"/>, v:active?.banos},
                    {icon:<Car        className="h-5 w-5 text-[#6C819B]"/>, v:active?.estacionamientos},
                    {icon:<Ruler      className="h-5 w-5 text-[#6C819B]"/>, v:fmtInt(active?.superficie_util_m2)},
                    {icon:<Square     className="h-5 w-5 text-[#6C819B]"/>, v:fmtInt(active?.superficie_terreno_m2)},
                  ].map((t,idx)=>(
                    <div key={idx}
                         className={`${idx<4?'border-r border-slate-200':''}
                                      flex flex-col items-center justify-center gap-1
                                      py-2 md:py-[10px]`}>
                      {t.icon}
                      <span className="text-sm text-slate-800 leading-none">{t.v ?? dash}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ---------- Botón + precio ---------- */}
              <div className="mt-4 flex items-end gap-3">
                {active?.id && (
                  <Link ref={verMasRef}
                        href={`/propiedades/${active.id}`}
                        className="inline-flex text-sm tracking-wide rounded-none
                                   border border-[#0A2E57] text-[#0A2E57] bg-white"
                        style={{ boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.95)' }}>
                    Ver más
                  </Link>
                )}

                <div ref={priceBoxRef} className="ml-auto text-right">
                  <div className="text-[1.15rem] md:text-[1.25rem] font-semibold
                                  text-[#0A2E57] leading-none">
                    {precioUfHero
                      ? fmtUF(precioUfHero)
                      : fmtPrecioFallback(active?.precio_uf,active?.precio_clp)}
                  </div>
                  {precioClpHero>0 && (
                    <div className="text-sm md:text-base text-slate-600 mt-[2px]">
                      {fmtCLP(precioClpHero)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {destacadas.length>1 && (
            <>
              <button aria-label="Anterior" onClick={()=>go(-1)}
                      className="group absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-2">
                <ChevronLeft className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
              <button aria-label="Siguiente" onClick={()=>go(1)}
                      className="group absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-2">
                <ChevronRight className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
            </>
          )}

          {destacadas.length>1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {destacadas.map((_,idx)=>(
                <span key={idx}
                      className={`h-1.5 w-6 rounded-full ${i===idx?'bg-white':'bg-white/50'}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= EQUIPO ================= */}
      <section id="equipo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center gap-3">
          <Users2 className="h-6 w-6 text-[#0A2E57]" />
          <h2 className="text-2xl md:text-3xl uppercase tracking-[0.25em]">EQUIPO</h2>
        </div>

        <p className="mt-3 max-w-4xl text-slate-700">
          En Gesswein Properties nos diferenciamos por un servicio cercano y de alto estándar:
          cada día combinamos criterio arquitectónico, respaldo legal y mirada financiera
          para que cada decisión inmobiliaria sea segura y rentable.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { nombre:'Carolina San Martín', cargo:'SOCIA FUNDADORA', profesion:'Arquitecta', foto:'/team/carolina-san-martin.png' },
            { nombre:'Alberto Gesswein',     cargo:'SOCIO',           profesion:'Periodista y gestor de proyectos', foto:'/team/alberto-gesswein.png' },
            { nombre:'Jan Gesswein',         cargo:'SOCIO',           profesion:'Abogado', foto:'/team/jan-gesswein.png' },
            { nombre:'Kay Gesswein',         cargo:'SOCIO',           profesion:'Ingeniero comercial · Magíster en finanzas', foto:'/team/kay-gesswein.png' },
          ].map(m=>(
            <article key={m.nombre}
                     className="group relative rounded-2xl overflow-hidden border border-slate-200
                                bg-white shadow-sm hover:shadow-lg transition"
                     tabIndex={0}>
              <div className="aspect-[3/4] w-full bg-slate-100">
                <img src={m.foto} alt={m.nombre}
                     className="h-full w-full object-cover"
                     onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none';}}/>
              </div>

              <div className="pointer-events-none absolute inset-0 bg-[#0A2E57]/0
                              group-hover:bg-[#0A2E57]/90 group-active:bg-[#0A2E57]/90
                              focus-within:bg-[#0A2E57]/90 transition duration-300" />

              <div className="absolute inset-0 flex items-end opacity-0
                              group-hover:opacity-100 group-active:opacity-100
                              focus-within:opacity-100 transition duration-300">
                <div className="w-full p-4 text-white">
                  <h3 className="text-lg leading-snug">{m.nombre}</h3>
                  <p className="text-sm mt-1">{m.cargo}</p>
                  <p className="mt-1 text-xs text-white/90">{m.profesion}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ================= REFERIDOS ================= */}
      <section id="referidos" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* encabezado */}
          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Gift className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl">
              Programa de Referidos con exclusividad
            </h2>
            <p className="mt-2 text-slate-600">
              ¿Conoces a alguien que busca propiedad? Refiérelo y obtén beneficios exclusivos.
            </p>
          </div>

          {/* formulario */}
          <div className="px-6 pb-8">
            {/* ---------- referente ---------- */}
            <h3 className="text-lg">Tus datos (referente)</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2
                                  text-slate-700 placeholder-slate-400"
                       placeholder="Tu nombre completo" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2
                                  text-slate-700 placeholder-slate-400"
                       placeholder="tu@email.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2
                                  text-slate-700 placeholder-slate-400"
                       placeholder="+56 9 1234 5678" />
              </div>
            </div>

            {/* ---------- referido ---------- */}
            <h3 className="mt-8 text-lg">Datos del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2
                                  text-slate-700 placeholder-slate-400"
                       placeholder="Nombre del referido" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2
                                  text-slate-700 placeholder-slate-400"
                       placeholder="correo@referido.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2
                                  text-slate-700 placeholder-slate-400"
                       placeholder="+56 9 1234 5678" />
              </div>
            </div>

            {/* ---------- preferencias ---------- */}
            <h3 className="mt-8 text-lg">Preferencias del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {/* servicio */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">¿Qué servicio necesita?</label>
                <SmartSelect
                  options={SERVICIOS}
                  value={''}
                  onChange={()=>{}}
                  placeholder="Seleccionar o escribir…"
                  className="w-full"
                />
              </div>
              {/* tipo propiedad */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Tipo de propiedad</label>
                <SmartSelect
                  options={TIPO_PROPIEDAD}
                  value={''}
                  onChange={()=>{}}
                  placeholder="Seleccionar o escribir…"
                  className="w-full"
                />
              </div>
              {/* región */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Región</label>
                <SmartSelect
                  options={REGIONES.map(r=>displayRegion(r as Region))}
                  value={''}
                  onChange={()=>{}}
                  placeholder="Seleccionar o escribir…"
                  className="w-full"
                />
              </div>
              {/* comuna */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Comuna</label>
                <SmartSelect
                  options={[]}
                  value={''}
                  onChange={()=>{}}
                  placeholder="Selecciona una región primero"
                  disabled
                  className="w-full"
                />
              </div>
              {/* presupuesto */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto mínimo (UF)</label>
                <input inputMode="numeric"
                       className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2
                                  text-slate-700 placeholder-slate-400"
                       placeholder="0" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto máximo (UF)</label>
                <input inputMode="numeric"
                       className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2
                                  text-slate-700 placeholder-slate-400"
                       placeholder="0" />
              </div>
              {/* comentarios */}
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Comentarios adicionales</label>
                <textarea rows={4}
                          className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2
                                     text-slate-700 placeholder-slate-400"
                          placeholder="Cualquier información adicional que pueda ser útil…" />
              </div>
            </div>

            {/* botón enviar */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm tracking-wide
                           text-white bg-[#0A2E57] rounded-none"
                style={{boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.35)'}}>
                <Gift className="h-4 w-4" /> Enviar referido
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-slate-500">
              Al enviar este formulario, aceptas nuestros términos del programa de referidos
              y política de privacidad.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
