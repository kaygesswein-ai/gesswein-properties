/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft, ChevronRight,
  Bed, ShowerHead, Ruler, Gift, Users2,
} from 'lucide-react';
import useUf from '../hooks/useUf';
import SmartSelect from '../components/SmartSelect';

/* -------------------- Tipos -------------------- */
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
  superficie_util_m2?: number | null;
  imagenes?: string[];
  images?: string[];
  coverImage?: string;
  destacada?: boolean;
};

/* -------------------- Utilidades -------------------- */
const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

const fmtUF  = (n: number) => `UF ${nfUF.format(n)}`;
const fmtCLP = (n: number) => `$ ${nfCLP.format(n)}`;
const fmtPrecioFallback = (uf?: number | null, clp?: number | null) =>
  (uf && uf > 0) ? fmtUF(uf) : (clp && clp > 0 ? fmtCLP(clp) : 'Consultar');

const capFirst = (s?: string | null) => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '');
const capWords = (s?: string | null) => (s ?? '').split(' ').map(capFirst).join(' ').trim();

const HERO_FALLBACK =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';

const getHeroImage = (p?: Property) => {
  if (!p) return HERO_FALLBACK;
  const anyP: any = p as any;
  const cand: (string | undefined)[] = [
    p.coverImage, anyP.imagen, anyP.image, anyP.foto,
    p.images?.[0], p.imagenes?.[0],
  ];
  const src = cand.find((s) => typeof s === 'string' && s.trim().length > 4);
  return src ?? HERO_FALLBACK;
};

const cls = (...s: (string | false | null | undefined)[]) => s.filter(Boolean).join(' ');

/* -------------------- Datos Chile (para formulario) -------------------- */
/* ------------- (REGIONES, COMUNAS_POR_REGION, SERVICIOS, TIPO_PROPIEDAD, ROMANOS) ------------- */
/* ---------- *** SE MANTIENEN SIN CAMBIOS; CÓDIGO OMITIDO SOLO POR BREVEDAD *** ----------- */

/* -------------------- Componente -------------------- */
export default function HomePage() {
  /* ------------ estado destacados ------------ */
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [i, setI] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* refs para igualar ancho del botón */
  const statDormRef = useRef<HTMLDivElement | null>(null);
  const priceBoxRef = useRef<HTMLDivElement | null>(null);
  const verMasRef   = useRef<HTMLAnchorElement | null>(null);

  /* -------- fetch destacadas -------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch('/api/propiedades?destacada=true&limit=6', { cache: 'no-store' });
        const j = await r.json();
        if (mounted) setDestacadas(Array.isArray(j?.data) ? j.data : []);
      } catch {
        if (mounted) setDestacadas([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  /* -------- autoplay -------- */
  useEffect(() => {
    if (!destacadas.length) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setI((p) => (p + 1) % destacadas.length), 4000);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [destacadas.length]);

  const go = (dir: -1 | 1) => {
    if (!destacadas.length) return;
    setI((p) => ((p + dir) % destacadas.length + destacadas.length) % destacadas.length);
  };

  /* -------- héroe activo -------- */
  const active = destacadas[i];
  const bg     = useMemo(() => getHeroImage(active), [active]);
  const ufHoy  = useUf();

  const lineaSecundaria = [
    capFirst(active?.comuna?.replace(/^lo barnechea/i, 'Lo Barnechea')),
    capFirst(active?.tipo),
    capFirst(active?.operacion),
  ].filter(Boolean).join(' · ');

  const precioUfHero = useMemo(() => {
    if (!active) return 0;
    if (active.precio_uf && active.precio_uf > 0) return Math.round(active.precio_uf);
    if (active.precio_clp && active.precio_clp > 0 && ufHoy) return Math.round(active.precio_clp / ufHoy);
    return 0;
  }, [active, ufHoy]);

  const precioClpHero = useMemo(() => {
    if (!active) return 0;
    if (active.precio_clp && active.precio_clp > 0) return Math.round(active.precio_clp);
    if (active.precio_uf && active.precio_uf > 0 && ufHoy) return Math.round(active.precio_uf * ufHoy);
    return 0;
  }, [active, ufHoy]);

  /* igualar ancho botón */
  useEffect(() => {
    const apply = () => {
      const w = statDormRef.current?.offsetWidth;
      const h = priceBoxRef.current?.offsetHeight;
      const a = verMasRef.current;
      if (a && w) a.style.width = `${w}px`;
      if (a && h) a.style.height = `${h}px`;
      if (a) { a.style.display = 'inline-flex'; a.style.alignItems = 'center'; a.style.justifyContent = 'center'; }
    };
    apply();
    let ro: ResizeObserver | null = null;
    try {
      if ('ResizeObserver' in window) {
        ro = new ResizeObserver(apply);
        statDormRef.current && ro.observe(statDormRef.current);
        priceBoxRef.current && ro.observe(priceBoxRef.current);
      }
    } catch {}
    return () => { ro?.disconnect(); };
  }, [active]);

  /* ---------------- JSX ---------------- */
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  return (
    <main className="bg-white">
      {/* ---------------- HERO ---------------- */}
      <section
        className="relative w-full isolate overflow-hidden"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchMove={(e) => { touchDeltaX.current = e.touches[0].clientX - (touchStartX.current ?? 0); }}
        onTouchEnd={() => {
          if (Math.abs(touchDeltaX.current) > 50) go(touchDeltaX.current < 0 ? 1 : -1);
          touchStartX.current = null; touchDeltaX.current = 0;
        }}
      >
        <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }} />
        <div className="absolute inset-0 -z-10 bg-black/35" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 min-h-[100svh] flex items-end pb-16">
          <div className="w-full">
            {/* ====== CARD: ahora mismo look que ficha detalle ====== */}
            <div className="bg-white/70 backdrop-blur-sm shadow-xl p-4 md:p-5 w-full md:max-w-[310px]">
              {/* título */}
              <h1 className="text-[18px] md:text-[20px] text-slate-800">
                {active?.titulo ?? 'Propiedad destacada'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{lineaSecundaria || '—'}</p>

              {/* 3 tiles (icono + valor) con mismo estilo que detalle */}
              <div className="mt-4 grid grid-cols-3 border border-slate-200 bg-white/70">
                {[
                  { icon: <Bed className="h-5 w-5" />,       v: active?.dormitorios },
                  { icon: <ShowerHead className="h-5 w-5" />, v: active?.banos },
                  { icon: <Ruler className="h-5 w-5" />,      v: active?.superficie_util_m2 ? nfINT.format(active.superficie_util_m2) : '—' },
                ].map((t, idx) => (
                  <div
                    key={idx}
                    ref={idx === 0 ? statDormRef : undefined}
                    className={cls(
                      'flex flex-col items-center justify-center gap-1 py-2 md:py-3',
                      idx < 2 && 'border-r border-slate-200'
                    )}
                  >
                    <div className="text-[#6C819B]">{t.icon}</div>
                    <div className="text-sm text-slate-800 leading-none">{t.v ?? '—'}</div>
                  </div>
                ))}
              </div>

              {/* botón + precio */}
              <div className="mt-4 flex items-end gap-3">
                {active?.id && (
                  <Link
                    ref={verMasRef}
                    href={`/propiedades/${active.id}`}
                    className="inline-flex items-center justify-center h-[46px] md:h-[50px] px-4 text-sm rounded-none border border-[#0A2E57] text-[#0A2E57] bg-white"
                  >
                    Ver más
                  </Link>
                )}

                <div ref={priceBoxRef} className="ml-auto text-right">
                  <div className="text-[1.15rem] md:text-[1.25rem] font-semibold text-[#0A2E57] leading-none">
                    {precioUfHero > 0 ? fmtUF(precioUfHero) : fmtPrecioFallback(active?.precio_uf, active?.precio_clp)}
                  </div>
                  {precioClpHero > 0 && (
                    <div className="text-sm text-slate-600 mt-[2px]">{fmtCLP(precioClpHero)}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* flechas navegación */}
          {destacadas.length > 1 && (
            <>
              <button aria-label="Anterior" onClick={() => go(-1)}
                className="group absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-2">
                <ChevronLeft className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
              <button aria-label="Siguiente" onClick={() => go(1)}
                className="group absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-2">
                <ChevronRight className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
            </>
          )}

          {/* dots */}
          {destacadas.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {destacadas.map((_, idx) => (
                <span key={idx} className={`h-1.5 w-6 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======== RESTO DEL ARCHIVO SIN CAMBIOS  ======== */}
      {/* (Equipo, Referidos, etc. permanecen exactamente igual a tu versión aprobada) */}
      {/* -------------------------------------------------------------------------- */}

      {/* ========= EQUIPO ========= */}
      {/* (Todo el bloque EQUIPO original aquí; contenido NO MODIFICADO) */}

      {/* ========= REFERIDOS ========= */}
      {/* (Todo el bloque REFERIDOS original aquí; contenido NO MODIFICADO) */}
    </main>
  );
}
