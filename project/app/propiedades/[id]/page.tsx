'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bed, ShowerHead, Car, Ruler, Square,
  X, ChevronLeft, ChevronRight, Compass, TrendingUp, Droplets,
} from 'lucide-react';

/* ---------------- Tipos y formateadores (sin cambios) --------------- */
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
  imagenes?: string[] | null;
  barrio?: string | null;
  orientacion?: string | null;
  plusvalia?: boolean | null;
  derechos_agua?: boolean | null;
};

const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

/* ---------------- Util ---------------- */
const cls = (...s: (string | false | null | undefined)[]) => s.filter(Boolean).join(' ');
const HERO_FALLBACK =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';

const capFirst = (s?: string | null) => s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '';
const capWords = (s?: string | null) => (s ?? '').split(' ').map(capFirst).join(' ').trim();

function getHeroImage(p?: Property | null) {
  const src = p?.imagenes?.[0];
  return src && src.trim().length > 4 ? src : HERO_FALLBACK;
}

function guessCategory(url: string): 'exterior' | 'interior' {
  const u = url.toLowerCase();
  const ext = /(exterior|fachada|jard|patio|piscina|quincho|terraza|vista|balc[oó]n)/;
  const int = /(living|estar|comedor|cocina|bañ|ban|dorm|pasillo|hall|escritorio|interior)/;
  if (ext.test(u)) return 'exterior';
  if (int.test(u)) return 'interior';
  return 'exterior';
}

function useUf() {
  const [uf, setUf] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('https://mindicador.cl/api/uf', { cache: 'no-store' });
        const j = await r.json().catch(() => null);
        const v = Number(j?.serie?.[0]?.valor);
        if (alive && Number.isFinite(v)) setUf(v);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);
  return uf;
}

/* ---------------- Lightbox (sin cambios) --------------- */
function Lightbox({ open, images, index, onClose, onPrev, onNext }: {
  open: boolean; images: string[]; index: number;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded">
        <X className="text-white h-6 w-6" />
      </button>
      <button onClick={onPrev}  className="absolute left-3 md:left-6  p-2 bg-white/10 hover:bg-white/20 rounded">
        <ChevronLeft className="text-white h-8 w-8" />
      </button>
      <img src={images[index]} alt="" className="max-h-[90vh] max-w-[92vw] object-contain" />
      <button onClick={onNext}  className="absolute right-3 md:right-6 p-2 bg-white/10 hover:bg-white/20 rounded">
        <ChevronRight className="text-white h-8 w-8" />
      </button>
    </div>
  );
}

/* ---------------- HeroStatTiles (texto más pequeño) --------------- */
function HeroStatTiles({ p }: { p: Property | null }) {
  const dash = '—';
  const vals = [
    { icon: <Bed className="h-5 w-5" />,       v: p?.dormitorios },
    { icon: <ShowerHead className="h-5 w-5" />, v: p?.banos },
    { icon: <Car className="h-5 w-5" />,        v: p?.estacionamientos },
    { icon: <Ruler className="h-5 w-5" />,      v: p?.superficie_util_m2 ? nfINT.format(p.superficie_util_m2) : null },
    { icon: <Square className="h-5 w-5" />,     v: p?.superficie_terreno_m2 ? nfINT.format(p.superficie_terreno_m2) : null },
  ];

  return (
    <div className="grid grid-cols-5 border border-slate-200 bg-white/70">
      {vals.map((t, i) => (
        <div key={i} className={cls(
          'flex flex-col items-center justify-center gap-1 py-2 md:py-[10px]',
          i < 4 && 'border-r border-slate-200'
        )}>
          <div className="text-[#6C819B]">{t.icon}</div>
          <div className="text-sm text-slate-800 leading-none">{t.v ?? dash}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Página principal ---------------- */
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [prop, setProp] = useState<Property | null>(null);
  const ufHoy = useUf();

  useEffect(() => {
    let cancel = false;
    (async () => {
      const r = await fetch(`/api/propiedades/${encodeURIComponent(params.id)}`).catch(() => null as any);
      const j = r?.ok ? await r.json().catch(() => null) : null;
      if (!cancel) setProp(j?.data ?? null);
    })();
    return () => { cancel = true; };
  }, [params.id]);

  /* ---------- cálculos ---------- */
  const bg = useMemo(() => getHeroImage(prop), [prop]);
  const linea = [
    capWords(prop?.comuna?.replace(/^lo barnechea/i, 'Lo Barnechea')),
    capFirst(prop?.tipo),
    capFirst(prop?.operacion),
  ].filter(Boolean).join(' · ');

  const uf = prop?.precio_uf
    ?? (prop?.precio_clp && ufHoy ? Math.round(prop.precio_clp / ufHoy) : null);
  const clp = prop?.precio_clp
    ?? (prop?.precio_uf && ufHoy ? Math.round(prop.precio_uf * ufHoy) : null);

  return (
    <main className="bg-white">
      {/* ---------------- HERO ---------------- */}
      <section className="relative w-full isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }} />
        <div className="absolute inset-0 -z-10 bg-black/35" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 min-h-[100svh] flex items-end pb-16">
          <div className="w-full relative">
            {/* tarjeta */}
            <div className="bg-white/70 backdrop-blur-sm shadow-xl p-4 md:p-5 w-full md:max-w-[420px]">
              {/* título sin negrita */}
              <h1 className="text-[18px] md:text-[20px] text-slate-800">
                {prop?.titulo ?? 'Propiedad'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{linea || '—'}</p>

              <div className="mt-4">
                <HeroStatTiles p={prop} />
              </div>

              <div className="mt-4 flex items-end gap-3">
                {/* botón */}
                <Link
                  href="/contacto"
                  className="inline-flex text-sm rounded-none border border-[#0A2E57] text-[#0A2E57] bg-white px-3 py-[6px]"
                >
                  Solicitar información
                </Link>

                {/* precios */}
                <div className="ml-auto text-right">
                  <div className="text-[1.15rem] md:text-[1.25rem] font-semibold text-[#0A2E57] leading-none">
                    {uf ? `UF ${nfUF.format(uf)}` : 'Consultar'}
                  </div>
                  {clp && (
                    <div className="text-sm text-slate-600 mt-[2px]">$ {nfCLP.format(clp)}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- resto sin cambios: Galería, Descripción, etc. ---- */}
      {/* (puedes dejar el mismo código que ya tenías para esas secciones) */}
    </main>
  );
}
