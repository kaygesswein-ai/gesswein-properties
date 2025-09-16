'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  imagenes?: string[];   // nuestro backend acepta text[] 'imagenes'
  images?: string[];     // tolerante (historial anterior)
  coverImage?: string;   // tolerante
};

function fmtPrecio(pUf?: number | null, pClp?: number | null) {
  if (pUf && pUf > 0) return `UF ${new Intl.NumberFormat('es-CL').format(pUf)}`;
  if (pClp && pClp > 0) return `$${new Intl.NumberFormat('es-CL').format(pClp)}`;
  return 'Consultar';
}

export default function HeroCarousel() {
  const [items, setItems] = useState<Property[]>([]);
  const [i, setI] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch: destacadas primero, máx 6
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/propiedades?destacada=true&limit=6', { cache: 'no-store' });
        const json = await res.json();
        if (!mounted) return;
        const data: Property[] = Array.isArray(json?.data) ? json.data : [];
        setItems(data);
      } catch {
        // Fallback silencioso
        setItems([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Auto-avance cada 4s
  useEffect(() => {
    if (!items.length) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setI((p) => (p + 1) % items.length), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [items.length]);

  const go = (dir: -1 | 1) => setI((p) => {
    const n = items.length;
    return ((p + dir) % n + n) % n;
  });

  const active = items[i];
  const bg = useMemo(() => {
    if (!active) return 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg';
    const imgs = active.coverImage || (active.imagenes?.[0]) || (active.images?.[0]);
    return imgs || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg';
  }, [active]);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bg})` }}
        aria-hidden
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35" />

      {/* Contenido */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Botón fijo “Ver Propiedades” */}
        <div className="pt-5 md:pt-6 flex justify-end">
          <Link
            href="/propiedades"
            className="inline-flex items-center rounded-md border border-white bg-white px-4 py-2 text-sm font-semibold tracking-wide text-[#0A2E57] shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Ver Propiedades
          </Link>
        </div>

        {/* Alto del hero: ajusta estos vh para “llegar hasta Propiedades” */}
        <div className="min-h-[68vh] md:min-h-[75vh] flex items-end pb-10 md:pb-14">
          <div className="w-full">
            {/* Tarjeta resumen tipo ficha */}
            <div className="max-w-xl bg-white/95 backdrop-blur rounded-2xl shadow-xl p-5 md:p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {active?.titulo ?? 'Propiedad destacada'}
              </h2>
              <div className="mt-1 text-sm text-gray-500">
                {active?.comuna ? `${active.comuna} · ` : ''}{active?.tipo ?? '—'} · {active?.operacion ?? '—'}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Dormitorios</div>
                  <div className="text-lg font-semibold">{active?.dormitorios ?? '—'}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Baños</div>
                  <div className="text-lg font-semibold">{active?.banos ?? '—'}</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="text-xs text-gray-500">Área útil (m²)</div>
                  <div className="text-lg font-semibold">{active?.superficie_util_m2 ?? '—'}</div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="text-2xl font-extrabold text-[#ff6a00]">
                  {fmtPrecio(active?.precio_uf, active?.precio_clp)}
                </div>
                {active?.id ? (
                  <Link
                    href={`/propiedades/${active.id}`}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Ver detalle
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Flechas (solo punta/transparentes) */}
        {items.length > 1 && (
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
        {items.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 w-6 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Espaciador para que el hero no tape el siguiente bloque */}
      <div className="h-2 md:h-4" />
    </section>
  );
}
