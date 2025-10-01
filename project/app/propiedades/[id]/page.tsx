/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bed, ShowerHead, Car, Ruler, Square,
  X, ChevronLeft, ChevronRight, Compass, TrendingUp, Droplets,
} from 'lucide-react';

/* ---------------- Tipos ---------------- */
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

/* ---------------- Nº formatters ---------------- */
const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

/* ---------------- Utils ---------------- */
const HERO_FALLBACK =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';
const cls = (...s: (string | false | null | undefined)[]) => s.filter(Boolean).join(' ');
const cap = (s?: string | null) => s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '';
const capWords = (s?: string | null) => (s ?? '').split(' ').map(cap).join(' ').trim();
const getHeroImage = (p?: Property | null) =>
  p?.imagenes?.[0]?.trim()?.length ? p.imagenes![0] : HERO_FALLBACK;

/* ---------- helpers perdidos ---------- */
function guessCategory(url: string): 'exterior' | 'interior' {
  const u = url.toLowerCase();
  const ext = /(exterior|fachada|jard|patio|piscina|quincho|terraza|vista|balc[oó]n)/;
  const int = /(living|estar|comedor|cocina|bañ|ban|dorm|pasillo|hall|escritorio|interior)/;
  if (ext.test(u)) return 'exterior';
  if (int.test(u)) return 'interior';
  return 'exterior';
}

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

/* ---------------- UF local hook ---------------- */
function useUf() {
  const [v, setV] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('https://mindicador.cl/api/uf', { cache: 'no-store' });
        const j = await r.json().catch(() => null);
        const num = Number(j?.serie?.[0]?.valor);
        if (alive && Number.isFinite(num)) setV(num);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);
  return v;
}

/* ---------------- SectionTitle ---------------- */
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

/* ---------------- Stat tiles ---------------- */
function StatTiles({ p }: { p: Property | null }) {
  const dash = '—';
  const items = [
    { icon: <Bed className="h-5 w-5" />,  v: p?.dormitorios },
    { icon: <ShowerHead className="h-5 w-5" />, v: p?.banos },
    { icon: <Car className="h-5 w-5" />, v: p?.estacionamientos },
    { icon: <Ruler className="h-5 w-5" />, v: p?.superficie_util_m2 ? nfINT.format(p.superficie_util_m2) : null },
    { icon: <Square className="h-5 w-5" />, v: p?.superficie_terreno_m2 ? nfINT.format(p.superficie_terreno_m2) : null },
  ];

  return (
    <div className="grid grid-cols-5 border border-slate-200 bg-white/70">
      {items.map((it, i) => (
        <div
          key={i}
          className={cls(
            'flex flex-col items-center justify-center gap-1 py-2 md:py-[10px]',
            i < 4 && 'border-r border-slate-200'
          )}
        >
          <div className="text-[#6C819B]">{it.icon}</div>
          <div className="text-sm text-slate-800 leading-none">{it.v ?? dash}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Lightbox ---------------- */
function Lightbox(props: {
  open: boolean; images: string[]; index: number;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const { open, images, index, onClose, onPrev, onNext } = props;
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose, onPrev, onNext]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded">
        <X className="text-white h-6 w-6" />
      </button>
      <button onClick={onPrev} className="absolute left-3 md:left-6 p-2 bg-white/10 hover:bg-white/20 rounded">
        <ChevronLeft className="text-white h-8 w-8" />
      </button>
      <img src={images[index]} alt="" className="max-h-[90vh] max-w-[92vw] object-contain" />
      <button onClick={onNext} className="absolute right-3 md:right-6 p-2 bg-white/10 hover:bg-white/20 rounded">
        <ChevronRight className="text-white h-8 w-8" />
      </button>
    </div>
  );
}

/* ---------------- Página ---------------- */
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

  /* ----- hero helpers ----- */
  const bg = useMemo(() => getHeroImage(prop), [prop]);
  const linea = [
    capWords(prop?.comuna?.replace(/^lo barnechea/i, 'Lo Barnechea')),
    cap(prop?.tipo),
    cap(prop?.operacion),
  ].filter(Boolean).join(' · ');

  const uf = prop?.precio_uf ?? (prop?.precio_clp && ufHoy ? Math.round(prop.precio_clp / ufHoy) : null);
  const clp = prop?.precio_clp ?? (prop?.precio_uf && ufHoy ? Math.round(prop.precio_uf * ufHoy) : null);

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative w-full isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }} />
        <div className="absolute inset-0 -z-10

