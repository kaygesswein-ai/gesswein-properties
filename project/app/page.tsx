'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
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

  // Carga de destacadas (carrusel + grilla)
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

  // Auto-avance 4s
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
    if (!active) return 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';
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

        {/* Contenedor maestro del hero */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[72vh] md:min-h-[78vh] flex items-end pb-10 md:pb-14">
          {/* Wrapper para alinear botón arriba-izquierda de la tarjeta */}
          <div className="w-full relative">
            {/* BOTÓN: arriba y alineado a la izquierda del cuadro */}
            <div className="absolute left-0 -top-14 md:-top-16">
              <Link
                href="/propiedades"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold tracking-wide text-white bg-[#0A2E57] rounded-none"
                style={{
                  // doble línea interna (dos bordes hacia adentro)
                  boxShadow:
                    'inset 0 0 0 2px rgba(255,255,255,0.95), inset 0 0 0 5px rgba(255,255,255,0.35)',
                }}
              >
                Ver Propiedades
              </Link>
            </div>

            {/* TARJETA RESUMEN: corrida a la derecha, sin bordes redondeados y*
