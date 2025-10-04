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
  Home,
  Camera,
  ScrollText,
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
  map_lat?: number | null;
  map_lng?: number | null;
  imagenes?: string[] | null;
  barrio?: string | null;
};

type Foto = { url: string; tag: 'exterior' | 'interior' | 'planos' | null; orden?: number | null };

const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

/* ------------------------------------------------------------------ */
/*                             UTILIDADES                             */
/* ------------------------------------------------------------------ */
const cls = (...s:(string | false | null | undefined)[]) => s.filter(Boolean).join(' ');
const HERO_FALLBACK =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';

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

/* ================================================================== */
/*                          PÁGINA DETALLE                            */
/* ================================================================== */
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [prop, setProp] = useState<Property | null>(null);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const uf = useUf();

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

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/propiedades/${encodeURIComponent(params.id)}/fotos`, { cache: 'no-store' })
          .catch(() => null as any);
        const j = r?.ok ? await r.json().catch(() => null) : null;
        if (alive) setFotos(Array.isArray(j?.data) ? j.data : []);
      } catch { if (alive) setFotos([]); }
    })();
    return () => { alive = false; };
  }, [params.id]);

  const imgs = useMemo(() => {
    const all = fotos.map((f) => ({ url: f.url, tag: (f.tag ?? 'exterior') as 'exterior'|'interior'|'planos' }));
    return {
      todas: all,
      exterior: all.filter(x => x.tag === 'exterior'),
      interior: all.filter(x => x.tag === 'interior'),
      planos:   all.filter(x => x.tag === 'planos'),
    };
  }, [fotos]);

  // HERO: prioriza exterior > interior > cualquier > fallback
  const hero = useMemo(() => {
    const cands = [
      imgs.exterior[0]?.url,
      imgs.interior[0]?.url,
      imgs.todas[0]?.url,
      prop?.imagenes?.[0],
    ].filter(Boolean) as string[];
    return cands[0] ?? HERO_FALLBACK;
  }, [imgs, prop]);

  const linea = [
    (prop?.comuna ?? '').replace(/^lo barnechea/i, 'Lo Barnechea'),
    prop?.tipo ?? undefined,
    prop?.operacion ?? undefined,
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
  const fmtInt = (n: number | null | undefined) => typeof n === 'number' ? nfINT.format(n) : dash;

  return (
    <main className="bg-white">
      {/* ---------------- HERO ---------------- */}
      <section className="relative w-full overflow-hidden isolate">
        <div className="absolute inset-0 -z-10 bg-center bg-cover"
             style={{ backgroundImage: `url(${hero})` }} />
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

      {/* ---------------- GALERÍA (tarjetas) ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Galería</SectionTitle>
        <GalleryTiles imgs={imgs} />
      </section>

      {/* ---------------- DESCRIPCIÓN ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Descripción</SectionTitle>
        <p className="whitespace-pre-line text-slate-700 leading-relaxed">
          {prop?.descripcion || 'Descripción no disponible por el momento.'}
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* --------- CARACTERÍSTICAS (placeholder) --------- */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* ---------------- MAPA ---------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <SectionTitle>Explora el sector</SectionTitle>
        <div className="relative w-full h-[420px] border border-slate-200 overflow-hidden">
          <iframe
            title="mapa"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={
              prop?.map_lat && prop?.map_lng
                ? `https://www.google.com/maps?q=${prop.map_lat},${prop.map_lng}&z=15&output=embed`
                : 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d33338.286!2d-70.527!3d-33.406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1es!2scl!4v1713000000000'
            }
          />
        </div>
      </section>
    </main>
  );
}

/* ================================================================== */
/*                           GALERÍA – TILES                           */
/* ================================================================== */

function GalleryTiles({
  imgs,
}: {
  imgs: {
    todas: { url: string; tag: 'exterior'|'interior'|'planos' }[];
    exterior: { url: string; tag: 'exterior'|'interior'|'planos' }[];
    interior: { url: string; tag: 'exterior'|'interior'|'planos' }[];
    planos:   { url: string; tag: 'exterior'|'interior'|'planos' }[];
  };
}) {
  const counts = {
    todas: imgs.todas.length,
    exterior: imgs.exterior.length,
    interior: imgs.interior.length,
    planos: imgs.planos.length,
  };

  const sample = {
    todas: imgs.todas[0]?.url,
    exterior: imgs.exterior[0]?.url,
    interior: imgs.interior[0]?.url,
    planos: imgs.planos[0]?.url,
  };

  const tiles: Array<{
    key: 'todas'|'exterior'|'interior'|'planos';
    label: string;
    icon: React.ReactNode;
    bg?: string;
    count: number;
  }> = [
    { key: 'todas',    label: 'Photos',     icon: <Camera className="h-6 w-6" />,     bg: sample.todas,    count: counts.todas },
    { key: 'exterior', label: 'Exterior',   icon: <Home className="h-6 w-6" />,       bg: sample.exterior, count: counts.exterior },
    { key: 'interior', label: 'Interior',   icon: <Home className="h-6 w-6" />,       bg: sample.interior, count: counts.interior },
    { key: 'planos',   label: 'Floor Plan', icon: <ScrollText className="h-6 w-6" />, bg: counts.planos > 0 ? sample.planos : undefined, count: counts.planos },
  ];

  const [open, setOpen]   = useState(false);
  const [index, setIndex] = useState(0);
  const [list, setList]   = useState<string[]>([]);

  const openLb = (key: 'todas'|'exterior'|'interior'|'planos') => {
    const arr = (imgs as any)[key] as Array<{url: string}>;
    if (!arr?.length) return;
    setList(arr.map(x => x.url));
    setIndex(0);
    setOpen(true);
  };

  return (
    <>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {tiles.map(t => {
          const hasImages = t.count > 0;
          return (
            <button
              key={t.key}
              onClick={() => hasImages && openLb(t.key)}
              className="group relative h-[220px] w-full overflow-hidden rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A2E57]"
            >
              {/* MISMO LOOK PARA TODAS: si no hay fotos, fondo neutro + MISMO overlay azul */}
              {hasImages ? (
                <>
                  <img src={t.bg!} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#14324E]/70 group-hover:bg-[#14324E]/60 transition" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-slate-200" />
                  <div className="absolute inset-0 bg-[#14324E]/70 group-hover:bg-[#14324E]/60 transition" />
                </>
              )}

              <div className="relative z-10 h-full w-full flex flex-col items-start justify-center px-8">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/20 text-white">
                  {t.icon}
                </div>
                <div className="mt-3">
                  <div className="text-white font-semibold text-xl drop-shadow">
                    {t.label}
                  </div>
                  <div className="text-white/90 text-sm drop-shadow">
                    {t.count} {t.count === 1 ? 'foto' : 'fotos'}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Lightbox
        open={open}
        images={list}
        index={index}
        onClose={() => setOpen(false)}
        onPrev={() => setIndex(i => (i - 1 + list.length) % list.length)}
        onNext={() => setIndex(i => (i + 1) % list.length)}
      />
    </>
  );
}
