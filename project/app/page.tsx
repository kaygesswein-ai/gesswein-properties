'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Bed, ShowerHead, Ruler, Gift, Users2 } from 'lucide-react';
import useUf from '../hooks/useUf';
import { featuredApiPath } from '../lib/featured';

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
  coverImage?: string;
  destacada?: boolean;
};

function fmtUF(n: number) { return `UF ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`; }
function fmtCLP(n: number) { return `$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`; }
function fmtPrecioFallback(pUf?: number | null, pClp?: number | null) {
  if (typeof pUf === 'number' && pUf > 0) return fmtUF(pUf);
  if (typeof pClp === 'number' && pClp > 0) return fmtCLP(pClp);
  return 'Consultar';
}
function capFirst(s?: string | null) {
  if (!s) return '';
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export default function HomePage() {
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [i, setI] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const statDormRef = useRef<HTMLDivElement | null>(null);
  const priceBoxRef = useRef<HTMLDivElement | null>(null);
  const verMasRef = useRef<HTMLAnchorElement | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  // CARGA DESTACADAS desde API dedicada
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(featuredApiPath, { cache: 'no-store' });
        const json = await res.json();
        const data: Property[] = Array.isArray(json?.data) ? json.data : [];
        if (mounted) setDestacadas(data);
      } catch {
        if (mounted) setDestacadas([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!destacadas.length) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setI((p) => (p + 1) % destacadas.length), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [destacadas.length]);

  const go = (dir: -1 | 1) => {
    if (!destacadas.length) return;
    setI((p) => {
      const n = destacadas.length;
      return ((p + dir) % n + n) % n;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }
  };
  const handleTouchEnd = () => {
    const dx = touchDeltaX.current;
    const TH = 50;
    if (Math.abs(dx) > TH) (dx < 0 ? go(1) : go(-1));
    touchStartX.current = null;
    touchDeltaX.current = 0;
    if (destacadas.length) {
      timerRef.current = setInterval(() => setI((p) => (p + 1) % destacadas.length), 4000);
    }
  };

  const active = destacadas[i];
  const bg = useMemo(() => {
    if (!active)
      return 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';
    return active.coverImage || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';
  }, [active]);

  const lineaSecundaria = [
    capFirst(active?.comuna?.replace(/^lo barnechea/i, 'Lo Barnechea')),
    capFirst(active?.tipo),
    capFirst(active?.operacion),
  ].filter(Boolean).join(' · ');

  const ufHoy = useUf();

  const precioUfHero = useMemo(() => {
    if (!active) return 0;
    if (typeof active.precio_uf === 'number' && active.precio_uf > 0) return Math.round(active.precio_uf);
    if (typeof active.precio_clp === 'number' && active.precio_clp > 0 && ufHoy) {
      return Math.round(active.precio_clp / ufHoy);
    }
    return 0;
  }, [active, ufHoy]);

  const precioClpHero = useMemo(() => {
    if (!active) return 0;
    if (typeof active.precio_clp === 'number' && active.precio_clp > 0) return Math.round(active.precio_clp);
    if (typeof active.precio_uf === 'number' && active.precio_uf > 0 && ufHoy) {
      return Math.round(active.precio_uf * ufHoy);
    }
    return 0;
  }, [active, ufHoy]);

  const applyButtonSize = () => {
    const w = statDormRef.current?.offsetWidth;
    const h = priceBoxRef.current?.offsetHeight;
    const a = verMasRef.current;
    if (a && w) a.style.width = `${w}px`;
    if (a && h) a.style.height = `${h}px`;
    if (a) { a.style.display = 'inline-flex'; a.style.alignItems = 'center'; a.style.justifyContent = 'center'; }
  };
  useEffect(() => {
    applyButtonSize();
    const ro = new ResizeObserver(applyButtonSize);
    if (statDormRef.current) ro.observe(statDormRef.current);
    if (priceBoxRef.current) ro.observe(priceBoxRef.current);
    return () => ro.disconnect();
  }, [active]);

  return (
    <main className="bg-white">
      {/* HERO */}
      <section
        className="relative w-full overflow-hidden isolate"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 -z-10 bg-center bg-cover" style={{ backgroundImage: `url(${bg})` }} />
        <div className="absolute inset-0 -z-10 bg-black/35" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 min-h-[100svh] md:min-h-[96vh] lg:min-h-[100vh] flex items-end pb-16 md:pb-20">
          <div className="w-full relative">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-none p-4 md:p-5 w-full max-w-[620px]">
              <h1 className="text-[1.4rem] md:text-2xl text-gray-900">
                {active?.titulo ?? 'Propiedad destacada'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{lineaSecundaria || '—'}</p>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div ref={statDormRef} className="bg-gray-50 p-2.5 md:p-3">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] md:text-xs text-gray-500">
                    <Bed className="h-4 w-4" /> Dormitorios
                  </div>
                  <div className="text-base">{active?.dormitorios ?? '—'}</div>
                </div>
                <div className="bg-gray-50 p-2.5 md:p-3">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] md:text-xs text-gray-500">
                    <ShowerHead className="h-4 w-4" /> Baños
                  </div>
                  <div className="text-base">{active?.banos ?? '—'}</div>
                </div>
                <div className="bg-gray-50 p-2.5 md:p-3">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] md:text-xs text-gray-500">
                    <Ruler className="h-4 w-4" /> Área (m²)
                  </div>
                  <div className="text-base">{active?.superficie_util_m2 ?? '—'}</div>
                </div>
              </div>

              <div className="mt-4 flex items-end gap-3">
                <div>
                  {active?.id ? (
                    <Link
                      ref={verMasRef}
                      href={`/propiedades/${active.id}`}
                      className="inline-flex text-sm tracking-wide rounded-none border border-[#0A2E57] text-[#0A2E57] bg-white"
                      style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.95)' }}
                    >
                      Ver más
                    </Link>
                  ) : null}
                </div>

                <div ref={priceBoxRef} className="ml-auto text-right">
                  <div className="text-[1.25rem] md:text-[1.35rem] font-semibold text-[#0A2E57] leading-none">
                    {precioUfHero > 0 ? fmtUF(precioUfHero) : fmtPrecioFallback(active?.precio_uf, active?.precio_clp)}
                  </div>
                  <div className="text-sm md:text-base text-slate-600 mt-1">
                    {precioClpHero > 0 ? fmtCLP(precioClpHero) : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {destacadas.length > 1 && (
            <>
              <button aria-label="Anterior" onClick={() => go(-1)} className="group absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-2">
                <ChevronLeft className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
              <button aria-label="Siguiente" onClick={() => go(1)} className="group absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-2">
                <ChevronRight className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
            </>
          )}

          {destacadas.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {destacadas.map((_, idx) => (
                <span key={idx} className={`h-1.5 w-6 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* el resto de tu página (equipo/referidos) queda igual */}
    </main>
  );
}
