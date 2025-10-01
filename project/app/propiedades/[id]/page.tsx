'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bed, ShowerHead, Car, Ruler, Square,
  X, ChevronLeft, ChevronRight, Compass, TrendingUp, Droplets,
} from 'lucide-react';

/* ======================= Tipos ======================= */
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
  // opcionales futuros:
  orientacion?: string | null;   // ej: "norte"
  plusvalia?: boolean | null;    // true/false
  derechos_agua?: boolean | null;
};

/* =================== Formateadores =================== */
const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

/* ===================== Utilidades ==================== */
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

/* ========= UF local (para no depender de imports externos) ========= */
function useUf() {
  const [uf, setUf] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('https://mindicador.cl/api/uf', { cache: 'no-store' });
        const json = await res.json().catch(() => null);
        const v = Number(json?.serie?.[0]?.valor);
        if (alive && Number.isFinite(v)) setUf(v);
      } catch {
        // si falla, dejamos uf en null y mostramos solo UF
      }
    })();
    return () => { alive = false; };
  }, []);
  return uf;
}

/* =================== Lightbox simple =================== */
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

/* ===== Encabezado de sección (mismo look que “BÚSQUEDA”) ===== */
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

/* ===== Tiles de stats dentro del HERO (5 columnas) ===== */
function HeroStatTiles({ p }: { p: Property | null }) {
  const dash = '—';
  const vDorm = p?.dormitorios ?? null;
  const vBanos = p?.banos ?? null;
  const vEst  = p?.estacionamientos ?? null;
  const vCons = p?.superficie_util_m2 ?? null;
  const vTerr = p?.superficie_terreno_m2 ?? null;

  const Tile = ({ icon, value, rightBorder = true }: { icon: React.ReactNode; value: React.ReactNode; rightBorder?: boolean }) => (
    <div className={`flex flex-col items-center justify-center gap-1 py-2 md:py-3 bg-white ${rightBorder ? 'border-r border-slate-200' : ''}`}>
      <div className="text-[#6C819B]">{icon}</div>
      <div className="text-lg text-slate-800 leading-none">{value}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-5 border border-slate-200 bg-white">
      <Tile icon={<Bed className="h-5 w-5" />}       value={vDorm ?? dash} />
      <Tile icon={<ShowerHead className="h-5 w-5" />} value={vBanos ?? dash} />
      <Tile icon={<Car className="h-5 w-5" />}        value={vEst  ?? dash} />
      <Tile icon={<Ruler className="h-5 w-5" />}      value={vCons != null ? nfINT.format(vCons) : dash} />
      <Tile icon={<Square className="h-5 w-5" />}     value={vTerr != null ? nfINT.format(vTerr) : dash} rightBorder={false} />
    </div>
  );
}

/* ====== Features dinámicas (lee BD o infiere por texto) ====== */
function buildFeatures(p: Property | null): { icon: JSX.Element; text: string }[] {
  if (!p) return [];

  const txt = `${p.titulo ?? ''} ${p.descripcion ?? ''}`.toLowerCase();
  const feats: { icon: JSX.Element; text: string }[] = [];

  const orient = (p as any)?.orientacion as string | undefined;
  if (orient && orient.trim()) {
    feats.push({ icon: <Compass className="h-4 w-4 text-slate-600" />, text: `Orientación ${orient}` });
  } else if (/\bnorte\b/.test(txt)) {
    feats.push({ icon: <Compass className="h-4 w-4 text-slate-600" />, text: 'Orientación norte' });
  }

  const plusFlag = (p as any)?.plusvalia === true;
  if (plusFlag || /plusval[íi]a|inversi[oó]n/.test(txt)) {
    feats.push({ icon: <TrendingUp className="h-4 w-4 text-slate-600" />, text: 'Potencial de plusvalía' });
  }

  const waterFlag = (p as any)?.derechos_agua === true;
  if (waterFlag || /derechos? de agua/.test(txt)) {
    feats.push({ icon: <Droplets className="h-4 w-4 text-slate-600" />, text: 'Derechos de agua' });
  }

  return feats;
}

/* ======================= Página ======================= */
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [prop, setProp] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const statDormRef = useRef<HTMLDivElement | null>(null);
  const priceBoxRef = useRef<HTMLDivElement | null>(null);
  const actionRef   = useRef<HTMLAnchorElement | null>(null);

  const ufHoy = useUf();

  // fetch desde tu API
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

  // Línea secundaria (comuna · tipo · operación)
  const capFirst = (s?: string | null) => {
    if (!s) return '';
    const lower = s.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };
  const lineaSecundaria = [
    capFirst(prop?.comuna?.replace(/^lo barnechea/i, 'Lo Barnechea')),
    capFirst(prop?.tipo),
    capFirst(prop?.operacion),
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
  }, [prop]);

  /* ===================  HERO =================== */
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

        {/* tarjeta como en Home, y la barra de 5 tiles adentro */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 min-h-[100svh] md:min-h-[96vh] lg:min-h-[100vh] flex items-end pb-16 md:pb-20">
          <div className="w-full relative">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-none p-4 md:p-5 w-full max-w-[620px]">
              <h1 className="text-[1.4rem] md:text-2xl text-gray-900">
                {prop?.titulo ?? 'Propiedad'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{lineaSecundaria || '—'}</p>

              {/* Barra de 5 tiles */}
              <div className="mt-4">
                <HeroStatTiles p={prop} />
              </div>

              <div className="mt-4 flex items-end gap-3">
                <div ref={statDormRef} className="bg-transparent" />
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
          {/* Sin flechas ni indicadores (una sola propiedad) */}
        </div>
      </section>

      {/* ===================  GALERÍA =================== */}
      <GalleryAndDetails prop={prop} />
    </main>
  );
}

/* ---------- Galería + Descripción + Features + Mapa ---------- */
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

      {/* CARACTERÍSTICAS DESTACADAS (dinámicas) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Características destacadas</SectionTitle>
        {(() => {
          const features = buildFeatures(prop);
          if (!features.length) {
            return <p className="text-slate-500">Información próximamente.</p>;
          }
          return (
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-slate-800">
              {features.map((f, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-slate-300">
                    {f.icon}
                  </span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          );
        })()}
      </section>

      {/* separador */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200 my-10" />
      </div>

      {/* EXPLORA EL SECTOR (mapa con overlay circular) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <SectionTitle>Explora el sector</SectionTitle>
        <div className="relative w-full h-[420px] border border-slate-200 overflow-hidden">
          <div className="pointer-events-none absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] aspect-square rounded-full border border-white/60 shadow-[0_0_0_2000px_rgba(255,255,255,0.25)]" />
          <iframe
            title="mapa"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d33338.286!2d-70.527!3d-33.406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2scl!4v1713000000000"
          />
        </div>
      </section>

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
