'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bed, ShowerHead, Car, Ruler, Square, MapPin, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import useUf from '../../hooks/useUf'; // ⬅️ igual que en Home, pero ruta relativa a /app/propiedades/[id]/

const BRAND_BLUE = '#0A2E57';
const BRAND_DARK = '#0f172a';

/* ========= Tipos ========= */
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
};

const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

/* ========= Util ========= */
const cls = (...s: (string | false | null | undefined)[]) => s.filter(Boolean).join(' ');
const HERO_FALLBACK =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';

function getHeroImage(p?: Property | null) {
  const src = p?.imagenes?.[0];
  return (src && src.trim().length > 4) ? src : HERO_FALLBACK;
}

/** adivina categoría por nombre de archivo (para tabs de galería) */
function guessCategory(url: string): 'exterior' | 'interior' {
  const u = url.toLowerCase();
  const ext = /(exterior|fachada|jard|patio|piscina|quincho|terraza|vista|balc[oó]n)/;
  const int = /(living|estar|comedor|cocina|bañ|ban|dorm|pasillo|hall|escritorio|interior)/;
  if (ext.test(u)) return 'exterior';
  if (int.test(u)) return 'interior';
  return /(\d{1,2}\s*)?(a|b)?\.(jpg|png|jpeg)/.test(u) ? 'exterior' : 'interior';
}

/* ========= Lightbox simple ========= */
function Lightbox({
  open, images, index, onClose, onPrev, onNext,
}: {
  open: boolean;
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;
  const src = images[index];

  return (
    <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded"
        aria-label="Cerrar"
      >
        <X className="text-white h-6 w-6" />
      </button>

      <button
        onClick={onPrev}
        aria-label="Anterior"
        className="absolute left-3 md:left-6 p-2 bg-white/10 hover:bg-white/20 rounded"
      >
        <ChevronLeft className="text-white h-8 w-8" />
      </button>

      <img
        src={src}
        alt="foto"
        className="max-h-[90vh] max-w-[92vw] object-contain select-none"
      />

      <button
        onClick={onNext}
        aria-label="Siguiente"
        className="absolute right-3 md:right-6 p-2 bg-white/10 hover:bg-white/20 rounded"
      >
        <ChevronRight className="text-white h-8 w-8" />
      </button>
    </div>
  );
}

/* ========= Encabezado de sección (mismo look que “BÚSQUEDA”) ========= */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mt-10 mb-4 text-[18px] md:text-[20px] tracking-[0.25em] uppercase text-slate-700"
      style={{ letterSpacing: '0.25em' }}
    >
      {children}
    </h2>
  );
}

/* ========= Chips con íconos (se mantienen para más adelante) ========= */
function FeatureChips({ p }: { p: Property }) {
  const Item = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <span
      className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-[14px] bg-white/70 backdrop-blur"
      style={{ borderColor: '#D6DEE8', color: BRAND_DARK }}
    >
      {icon}{label}
    </span>
  );

  return (
    <div className="flex flex-wrap gap-2">
      <Item icon={<Bed className="h-4 w-4" />}    label={`${p.dormitorios ?? '—'}`} />
      <Item icon={<ShowerHead className="h-4 w-4" />} label={`${p.banos ?? '—'}`} />
      <Item icon={<Car className="h-4 w-4" />}    label={`${p.estacionamientos ?? '—'}`} />
      <Item icon={<Ruler className="h-4 w-4" />}  label={`${p.superficie_util_m2 != null ? nfINT.format(p.superficie_util_m2) : '—'} m² const.`} />
      <Item icon={<Square className="h-4 w-4" />} label={`${p.superficie_terreno_m2 != null ? nfINT.format(p.superficie_terreno_m2) : '—'} m² terreno`} />
    </div>
  );
}

/* ========= Página ========= */
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [prop, setProp] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  // ====== NUEVO: refs para “igualar” el botón y caja de precio (como en Home)
  const statDormRef = useRef<HTMLDivElement | null>(null);
  const priceBoxRef = useRef<HTMLDivElement | null>(null);
  const actionRef   = useRef<HTMLAnchorElement | null>(null);

  // ====== UF del día para calcular CLP si viene solo UF (mismo patrón que Home)
  const ufHoy = useUf();

  // fetch desde tu API (estaba funcionando)
  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/propiedades/${encodeURIComponent(params.id)}`).catch(() => null as any);
      let data: any = null;
      if (res?.ok) { const j = await res.json().catch(() => null); data = j?.data ?? null; }
      if (!cancel) { setProp(data); setLoading(false); }
    })();
    return () => { cancel = true; };
  }, [params.id]);

  // Imagen hero
  const bg = useMemo(() => getHeroImage(prop), [prop]);

  // Línea secundaria (igual idea que Home)
  const lineaSecundaria = [
    prop?.comuna?.replace(/^lo barnechea/i, 'Lo Barnechea'),
    prop?.tipo,
    prop?.operacion,
  ].filter(Boolean).join(' · ');

  // Precios estilo Home
  const precioUfHero = useMemo(() => {
    if (!prop) return 0;
    if (typeof prop.precio_uf === 'number' && prop.precio_uf > 0) return Math.round(prop.precio_uf);
    if (typeof prop.precio_clp === 'number' && prop.precio_clp > 0 && ufHoy) {
      return Math.round(prop.precio_clp / ufHoy);
    }
    return 0;
  }, [prop, ufHoy]);

  const precioClpHero = useMemo(() => {
    if (!prop) return 0;
    if (typeof prop.precio_clp === 'number' && prop.precio_clp > 0) return Math.round(prop.precio_clp);
    if (typeof prop.precio_uf === 'number' && prop.precio_uf > 0 && ufHoy) {
      return Math.round(prop.precio_uf * ufHoy);
    }
    return 0;
  }, [prop, ufHoy]);

  // Igualar tamaño botón/caja precio (como en Home)
  const applyButtonSize = () => {
    const w = statDormRef.current?.offsetWidth;
    const h = priceBoxRef.current?.offsetHeight;
    const a = actionRef.current;
    if (a && w) a.style.width = `${w}px`;
    if (a && h) a.style.height = `${h}px`;
    if (a) {
      a.style.display = 'inline-flex';
      a.style.alignItems = 'center';
      a.style.justifyContent = 'center';
    }
  };
  useEffect(() => {
    applyButtonSize();
    let ro: ResizeObserver | null = null;
    try {
      if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
        ro = new ResizeObserver(applyButtonSize);
        if (statDormRef.current) ro.observe(statDormRef.current);
        if (priceBoxRef.current) ro.observe(priceBoxRef.current);
      }
    } catch {}
    return () => { try { ro?.disconnect(); } catch {} };
  }, [prop]);

  /* ===================  HERO (full viewport + tarjeta igual a Home)  =================== */
  return (
    <main className="bg-white">
      <section className="relative w-full overflow-hidden isolate">
        {/* Fondo con imagen (full viewport real) */}
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-black/35" aria-hidden />

        {/* Alto mínimo igual a Home para tapar todo lo de abajo */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 min-h-[100svh] md:min-h-[96vh] lg:min-h-[100vh] flex items-end pb-16 md:pb-20">
          <div className="w-full relative">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-none p-4 md:p-5 w-full max-w-[620px]">
              <h1 className="text-[1.4rem] md:text-2xl text-gray-900">
                {prop?.titulo ?? 'Propiedad'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{lineaSecundaria || '—'}</p>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div ref={statDormRef} className="bg-gray-50 p-2.5 md:p-3">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] md:text-xs text-gray-500">
                    <Bed className="h-4 w-4" /> Dormitorios
                  </div>
                  <div className="text-base">{prop?.dormitorios ?? '—'}</div>
                </div>
                <div className="bg-gray-50 p-2.5 md:p-3">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] md:text-xs text-gray-500">
                    <ShowerHead className="h-4 w-4" /> Baños
                  </div>
                  <div className="text-base">{prop?.banos ?? '—'}</div>
                </div>
                <div className="bg-gray-50 p-2.5 md:p-3">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] md:text-xs text-gray-500">
                    <Ruler className="h-4 w-4" /> Área (m²)
                  </div>
                  <div className="text-base">{prop?.superficie_util_m2 ?? '—'}</div>
                </div>
              </div>

              <div className="mt-4 flex items-end gap-3">
                <div>
                  <Link
                    ref={actionRef}
                    href="/contacto"
                    className="inline-flex text-sm tracking-wide rounded-none border border-[#0A2E57] text-[#0A2E57] bg-white"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.95)' }}
                  >
                    Solicitar información
                  </Link>
                </div>

                <div ref={priceBoxRef} className="ml-auto text-right">
                  <div className="text-[1.25rem] md:text-[1.35rem] font-semibold text-[#0A2E57] leading-none">
                    {precioUfHero > 0 ? `UF ${nfUF.format(precioUfHero)}` : (prop?.precio_clp ? `$ ${nfCLP.format(prop.precio_clp)}` : 'Consultar')}
                  </div>
                  <div className="text-sm md:text-base text-slate-600 mt-1">
                    {precioClpHero > 0 ? `$ ${nfCLP.format(precioClpHero)}` : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sin flechas ni indicadores (acá es una sola propiedad) */}
        </div>
      </section>

      {/* ===================  A PARTIR DE AQUÍ SE MANTIENE TU PÁGINA TAL CUAL  =================== */}

      {/* GALERÍA con tabs + lightbox */}
      <GalleryAndDetails prop={prop} />
    </main>
  );
}

/* ---------- Lo de abajo es tu contenido existente (galería, secciones, etc.) ---------- */
/* Para no duplicar un archivo gigante, lo empaqueto en un componente debajo. */
function GalleryAndDetails({ prop }: { prop: Property | null }) {
  const [tab, setTab] = useState<'todas' | 'exterior' | 'interior'>('todas');
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  const images = useMemo(() => {
    const arr = (prop?.imagenes ?? []).filter(Boolean);
    if (!arr.length) {
      return ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop'];
    }
    return arr;
  }, [prop]);

  const imagesByCat = useMemo(() => {
    const all = images.map((url) => ({ url, cat: guessCategory(url) }));
    return {
      todas: all,
      exterior: all.filter((i) => i.cat === 'exterior'),
      interior: all.filter((i) => i.cat === 'interior'),
    };
  }, [images]);

  const list = imagesByCat[tab];

  const openLb = (idx: number) => { setLbIndex(idx); setLbOpen(true); };
  const closeLb = () => setLbOpen(false);
  const prevLb = () => setLbIndex((i) => (i - 1 + list.length) % list.length);
  const nextLb = () => setLbIndex((i) => (i + 1) % list.length);

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Galería</SectionTitle>

        <div className="flex items-center gap-2 mb-4">
          {(['todas','exterior','interior'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cls(
                'px-4 py-2 border rounded-md text-sm',
                tab === t ? 'bg-[var(--brand-50,#E9EFF6)] border-[var(--brand-200,#BFD0E6)] text-slate-900' : 'bg-white border-slate-200 text-slate-700'
              )}
            >
              {t === 'todas' ? 'Todas' : t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
          <span className="ml-auto text-sm text-slate-500">{list.length} {list.length === 1 ? 'foto' : 'fotos'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((it, i) => (
            <button
              key={i}
              onClick={() => openLb(i)}
              className="relative aspect-[4/3] overflow-hidden group border border-slate-200"
            >
              <img src={it.url} alt={`img ${i+1}`} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </button>
          ))}
        </div>
      </section>

      {/* separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* DESCRIPCIÓN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Descripción</SectionTitle>
        <p className="text-slate-700 leading-relaxed">
          {prop?.descripcion || 'Descripción no disponible por el momento.'}
        </p>
      </section>

      {/* separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* (el mapa y otras secciones las ajustamos en el siguiente paso si quieres) */}

      {/* Lightbox */}
      <Lightbox
        open={lbOpen}
        images={list.map((x) => x.url)}
        index={lbIndex}
        onClose={closeLb}
        onPrev={prevLb}
        onNext={nextLb}
      />
    </>
  );
}
