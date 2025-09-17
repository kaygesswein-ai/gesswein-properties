'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Bed, ShowerHead, Ruler } from 'lucide-react';

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

function fmtPrecio(pUf?: number | null, pClp?: number | null) {
  if (typeof pUf === 'number' && pUf > 0) return `UF ${new Intl.NumberFormat('es-CL').format(pUf)}`;
  if (typeof pClp === 'number' && pClp > 0) return `$ ${new Intl.NumberFormat('es-CL').format(pClp)}`;
  return 'Consultar';
}

export default function HomePage() {
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [i, setI] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Carga destacadas (carrusel + grilla)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/propiedades?destacada=true&limit=6', { cache: 'no-store' });
        const json = await res.json();
        if (!mounted) return;
        const data: Property[] = Array.isArray(json?.data) ? json.data : [];
        setDestacadas(data);
      } catch {
        if (mounted) setDestacadas([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Auto-slide cada 4s
  useEffect(() => {
    if (!destacadas.length) return;
    timerRef.current && clearInterval(timerRef.current);
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

  const active = destacadas[i];
  const bg = useMemo(() => {
    if (!active)
      return 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';
    const imgs = active.coverImage || active.imagenes?.[0] || active.images?.[0];
    return imgs || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';
  }, [active]);

  return (
    <main className="bg-white">
      {/* HERO / CARRUSEL */}
      <section className="relative w-full overflow-hidden isolate">
        {/* Fondo */}
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-black/35" aria-hidden />

        {/* Contenido principal del hero */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[72vh] md:min-h-[78vh] flex items-end pb-10 md:pb-14">
          {/* CONTENEDOR: botón arriba y tarjeta debajo, alineados al mismo borde izquierdo */}
          <div className="w-full relative">
            {/* BOTÓN ARRIBA */}
            <div className="ml-6 md:ml-10 mb-3">
              <Link
                href="/propiedades"
                className="inline-flex items-center px-4 py-2 text-sm font-normal tracking-wide text-white bg-[#0A2E57] rounded-none"
                style={{
                  // doble línea interna: externo 1px (mitad), interno 3px
                  boxShadow:
                    'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.35)',
                }}
              >
                Ver Propiedades
              </Link>
            </div>

            {/* TARJETA RESUMEN (misma que tenías) */}
            <div className="ml-6 md:ml-10 bg-white/65 backdrop-blur-sm shadow-xl p-4 md:p-5 rounded-none max-w-md">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                {active?.titulo ?? 'Propiedad destacada'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {active?.comuna ? `${active.comuna} · ` : ''}
                {active?.tipo ?? '—'} · {active?.operacion ?? '—'}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50/70 p-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <Bed className="h-4 w-4" />
                    Dormitorios
                  </div>
                  <div className="text-base font-semibold">{active?.dormitorios ?? '—'}</div>
                </div>
                <div className="bg-gray-50/70 p-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <ShowerHead className="h-4 w-4" />
                    Baños
                  </div>
                  <div className="text-base font-semibold">{active?.banos ?? '—'}</div>
                </div>
                <div className="bg-gray-50/70 p-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <Ruler className="h-4 w-4" />
                    Área útil (m²)
                  </div>
                  <div className="text-base font-semibold">{active?.superficie_util_m2 ?? '—'}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xl font-extrabold text-[#C1272D]">
                  {fmtPrecio(active?.precio_uf, active?.precio_clp)}
                </div>
                {active?.id ? (
                  <Link
                    href={`/propiedades/${active.id}`}
                    className="inline-flex items-center border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-none"
                  >
                    Ver detalle
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          {/* Flechas finas */}
          {destacadas.length > 1 && (
            <>
              <button
                aria-label="Anterior"
                onClick={() => go(-1)}
                className="group absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2"
              >
                <ChevronLeft className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
              <button
                aria-label="Siguiente"
                onClick={() => go(1)}
                className="group absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2"
              >
                <ChevronRight className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
            </>
          )}

          {/* Indicadores */}
          {destacadas.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {destacadas.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 w-6 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Espaciador pequeño para no tapar la siguiente sección */}
        <div className="h-2 md:h-4" />
      </section>

      {/* PROPIEDADES DESTACADAS (grilla conserva tu implementación) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold">Propiedades destacadas</h2>
          <Link href="/propiedades" className="text-sm text-slate-600 hover:text-slate-900">
            Ver todas →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(destacadas.length ? destacadas : Array.from({ length: 6 })).map((p: any, idx: number) => {
            if (!destacadas.length) {
              return (
                <div key={idx} className="animate-pulse border border-slate-200">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-4">
                    <div className="h-4 w-2/3 bg-slate-200" />
                    <div className="mt-2 h-4 w-1/2 bg-slate-200" />
                    <div className="mt-6 h-8 w-24 bg-slate-200" />
                  </div>
                </div>
              );
            }

            const imgs: string[] =
              Array.isArray(p?.imagenes) ? p.imagenes : Array.isArray(p?.images) ? p.images : [];
            const img =
              p?.coverImage ??
              imgs?.[0] ??
              'https://images.pexels.com/photos/259597/pexels-photo-259597.jpeg?auto=compress&cs=tinysrgb&w=1600';
            const precio = fmtPrecio(p?.precio_uf, p?.precio_clp);

            return (
              <Link
                key={p.id}
                href={`/propiedades/${p.id}`}
                className="group border border-slate-200 hover:shadow-lg transition"
              >
                <div className="aspect-[4/3] bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={p?.titulo ?? 'Propiedad'} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-1">{p?.titulo ?? 'Propiedad'}</h3>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-1">{p?.comuna ?? 'Santiago Oriente'}</p>
                  <p className="mt-2 font-semibold">{precio}</p>
                  <span className="mt-4 inline-flex items-center text-sm text-[#0A2E57] group-hover:underline">
                    Ver detalle →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

