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
  orientacion?: string | null;
  plusvalia?: boolean | null;
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
  return src && src.trim().length > 4 ? src : HERO_FALLBACK;
}

const capFirst = (s?: string | null) => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '');
const capWords = (s?: string | null) => (s ?? '').split(' ').map(capFirst).join(' ').trim();

/** adivina categoría por nombre de archivo (para tabs de galería) */
function guessCategory(url: string): 'exterior' | 'interior' {
  const u = url.toLowerCase();
  const ext = /(exterior|fachada|jard|patio|piscina|quincho|terraza|vista|balc[oó]n)/;
  const int = /(living|estar|comedor|cocina|bañ|ban|dorm|pasillo|hall|escritorio|interior)/;
  if (ext.test(u)) return 'exterior';
  if (int.test(u)) return 'interior';
  return 'exterior';
}

/* ========= UF local ========= */
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

/* =================== Lightbox =================== */
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

/* ===== Tiles de stats (5) ===== */
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

/* ====== Features dinámicas ====== */
function buildFeatures(p: Property | null) {
  if (!p) return [];
  const txt = `${p.titulo ?? ''} ${p.descripcion ?? ''}`.toLowerCase();
  const feats: { icon: JSX.Element; text: string }[] = [];

  const orient = (p as any)?.orientacion as string | undefined;
  if (orient?.trim()) feats.push({ icon: <Compass className="h-4 w-4 text-slate-600" />, text: `Orientación ${orient}` });
  else if (/\bnorte\b/.test(txt)) feats.push({ icon: <Compass className="h-4 w-4 text-slate-600" />, text: 'Orientación norte' });

  const plus = (p as any)?.plusvalia === true || /plusval[íi]a|inversi[oó]n/.test(txt);
  if (plus) feats.push({ icon: <TrendingUp className="h-4 w-4 text-slate-600" />, text: 'Potencial de plusvalía' });

  const water = (p as any)?.derechos_agua === true || /derechos? de agua/.test(txt);
  if (water) feats.push({ icon: <Droplets className="h-4 w-4 text-slate-600" />, text: 'Derechos de agua' });

  return feats;
}

/* ======================= Página ======================= */
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

  const uf = prop?.precio_uf ?? (prop?.precio_clp && ufHoy ? Math.round(prop.precio_clp / ufHoy) : null);
  const clp = prop?.precio_clp ?? (prop?.precio_uf && ufHoy ? Math.round(prop.precio_uf * ufHoy) : null);

  /* ---------------- Render ---------------- */
  return (
    <main className="bg-white">
      {/* ---------------- HERO ---------------- */}
      <section className="relative w-full isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }} />
        <div className="absolute inset-0 -z-10 bg-black/35" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 min-h-[100svh] flex items-end pb-16">
          <div className="w-full">
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
                <Link
                  href="/contacto"
                  className="inline-flex px-3 py-[6px] text-sm rounded-none border border-[#0A2E57] text-[#0A2E57] bg-white"
                >
                  Solicitar información
                </Link>

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

      {/* ---------------- GALERÍA + DETALLES (igual que antes) ---------------- */}
      <GalleryAndDetails prop={prop} />
    </main>
  );
}

/* ---------- Galería + Descripción + Features + Mapa (sin cambios) ---------- */
function GalleryAndDetails({ prop }: { prop: Property | null }) {
  const [tab, setTab] = useState<'todas' | 'exterior' | 'interior'>('todas');
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);

  const images = useMemo(() => {
    const arr = (prop?.imagenes ?? []).filter(Boolean);
    return arr.length ? arr : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop'];
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
  const openLb = (i: number) => { setLbIndex(i); setLbOpen(true); };
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
              <img src={it.url} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="h-px bg-slate-200 my-10" /></div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Descripción</SectionTitle>
        <p className="text-slate-700 leading-relaxed">
          {prop?.descripcion || 'Descripción no disponible por el momento.'}
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="h-px bg-slate-200 my-10" /></div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Características destacadas</SectionTitle>
        {(() => {
          const feats = buildFeatures(prop);
          if (!feats.length) return <p className="text-slate-500">Información próximamente.</p>;
          return (
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-slate-800">
              {feats.map((f, idx) => (
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="h-px bg-slate-200 my-10" /></div>

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
