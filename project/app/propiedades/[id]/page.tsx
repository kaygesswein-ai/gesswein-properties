'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Bed, ShowerHead, Car, Ruler, Square, Compass, TrendingUp
} from 'lucide-react';

/* ====== Brand (mismo set que venimos usando) ====== */
const BRAND_BLUE = '#0A2E57';
const BRAND_DARK = '#0f172a';

/* ====== Tipos ====== */
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
  descripcion?: string | null;
  imagenes?: string[] | null;
  created_at?: string | null;
};

/* ====== Utiles ====== */
const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** PostgREST directo desde el cliente (anon key) */
async function pgGetOneBy(column: 'id'|'slug', value: string): Promise<Property | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  const qs = new URLSearchParams();
  qs.set('select', '*');
  qs.set(column, `eq.${value}`);
  qs.set('limit', '1');

  const res = await fetch(`${SUPABASE_URL}/rest/v1/propiedades?${qs.toString()}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  }).catch(() => null as any);

  if (!res || !res.ok) return null;
  const data = await res.json().catch(() => null as any);
  return Array.isArray(data) && data.length ? (data[0] as Property) : null;
}

/* ====== Categorización simple por nombre de archivo ======
   (si luego guardamos categorías en BD, reemplazamos esta función)
*/
function guessCategory(url: string): 'exterior'|'interior'|'todas' {
  const u = url.toLowerCase();
  const exteriorHints = ['exterior','jardin','patio','fachada','terraza','pool','piscina','quincho','balcon','balcón','vista','front','frente'];
  const interiorHints = ['living','estar','comedor','cocina','dorm','hall','baño','bano','escalera','interior','sala'];

  if (exteriorHints.some(h => u.includes(h))) return 'exterior';
  if (interiorHints.some(h => u.includes(h))) return 'interior';
  return 'todas';
}

/* ====== Lightbox muy simple (sin librerías) ====== */
function Lightbox({
  images, index, onClose, onPrev, onNext
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  if (index < 0) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center">
      <button aria-label="Cerrar" onClick={onClose} className="absolute top-4 right-4 text-white text-2xl">✕</button>
      <button aria-label="Anterior" onClick={onPrev} className="absolute left-3 md:left-6 text-white text-3xl">‹</button>
      <img
        src={images[index]}
        alt={`Foto ${index+1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />
      <button aria-label="Siguiente" onClick={onNext} className="absolute right-3 md:right-6 text-white text-3xl">›</button>
      <div className="absolute bottom-4 text-white text-sm">{index+1} / {images.length}</div>
    </div>
  );
}

/* ====== Componente Chip (icono + label) ====== */
function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1.5 border text-sm rounded-none"
      style={{ borderColor: BRAND_BLUE, color: BRAND_DARK }}
    >
      {icon}{label}
    </span>
  );
}

/* ====== Título de sección (replica estilo del sitio: uppercase + tracking) ====== */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mt-12 mb-5 text-slate-900 uppercase tracking-[0.15em] text-sm font-semibold"
      // Mismo aire visual que “BÚSQUEDA” en la lista (sin tocar globals.css)
    >
      {children}
    </h2>
  );
}

/* ====== Separador fino ====== */
function Separator() {
  return <div className="h-px w-full bg-slate-200 my-10" />;
}

/* ====== Página ====== */
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [prop, setProp] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  // lightbox
  const [lbOpenIndex, setLbOpenIndex] = useState(-1);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      const param = decodeURIComponent(params.id);
      let row = await pgGetOneBy('id', param);
      if (!row) row = await pgGetOneBy('slug', param);
      if (!cancel) {
        setProp(row);
        setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [params.id]);

  // imágenes (todas)
  const allImages = useMemo(() => {
    const imgs: string[] = Array.isArray(prop?.imagenes) ? prop!.imagenes!.filter(Boolean) : [];
    // fallback si no hay fotos
    if (imgs.length === 0)
      imgs.push('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop');
    return imgs;
  }, [prop?.imagenes]);

  // portada = primera
  const cover = allImages[0];

  // clasificaciones
  const byCategory = useMemo(() => {
    const map: Record<'todas'|'exterior'|'interior', string[]> = { todas: [], exterior: [], interior: [] };
    for (const url of allImages) {
      const k = guessCategory(url);
      map[k].push(url);
      map.todas.push(url);
    }
    return map;
  }, [allImages]);

  const [tab, setTab] = useState<'todas'|'exterior'|'interior'>('todas');
  const visibleImages = byCategory[tab];

  const showUF = !!(prop?.precio_uf && prop.precio_uf > 0);
  const showCLP = !!(prop?.precio_clp && prop.precio_clp > 0);

  /* ------- “Highlights” (iconos + texto) -------
     HOY: los definimos acá rápido (por id o slug). 
     MAÑANA: los movemos a la tabla con una columna JSON (p.ej. "highlights").
  */
  const highlights: { icon: React.ReactNode; text: string }[] = useMemo(() => {
    const base: { icon: React.ReactNode; text: string }[] = [];
    // ejemplo con brújula (orientación) + inversión/plusvalía
    base.push({ icon: <Compass className="h-4 w-4" />, text: 'Orientación predominante: Norte' });
    base.push({ icon: <TrendingUp className="h-4 w-4" />, text: 'Excelente potencial de renta/plusvalía' });
    // agrega más items si quieres
    return base;
  }, []);

  return (
    <main className="bg-white">

      {/* Volver */}
      <div className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center">
          <Link href="/propiedades" className="inline-flex items-center gap-2 text-sm" style={{ color: BRAND_BLUE }}>
            <ArrowLeft className="h-4 w-4" />
            Volver a propiedades
          </Link>
        </div>
      </div>

      {/* HERO: foto a pantalla completa + franja delgada con título/ubicación/precio/CTA */}
      <section className="relative w-full">
        {/* imagen de fondo, full-bleed */}
        <div className="w-full">
          <img
            src={cover}
            alt={prop?.titulo ?? 'Propiedad'}
            className="w-full h-[52vh] sm:h-[60vh] lg:h-[68vh] object-cover"
          />
        </div>

        {/* franja delgada (overlay) */}
        <div className="absolute left-0 right-0 bottom-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="backdrop-blur bg-white/70 shadow-sm"
              style={{ borderLeft: `4px solid ${BRAND_BLUE}` }}
            >
              <div className="px-4 py-3 md:py-4">
                <div className="text-xl md:text-2xl lg:text-3xl text-slate-900">
                  {loading ? 'Cargando…' : (prop?.titulo ?? 'Propiedad')}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 text-slate-700">
                  <span className="inline-flex items-center gap-1 text-sm">
                    <MapPin className="h-4 w-4" />
                    {loading ? '—' : [prop?.comuna, prop?.region].filter(Boolean).join(', ')}
                  </span>

                  {/* Precio (UF + CLP si existe) */}
                  <span className="text-sm md:text-base font-medium" style={{ color: BRAND_BLUE }}>
                    {loading ? '—' : (showUF ? `UF ${nfUF.format(prop!.precio_uf as number)}` : 'Consultar')}
                    {(!loading && showCLP) ? ` · ${nfCLP.format(prop!.precio_clp as number)}` : ''}
                  </span>

                  {/* CTA */}
                  <Link
                    href="/contacto"
                    className="ml-auto px-4 py-2 text-white text-sm md:text-[15px] rounded-none"
                    style={{ background: BRAND_BLUE }}
                  >
                    Solicitar información
                  </Link>
                </div>

                {/* Chips rápidos (como en tarjetas del sitio) */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip icon="🏷️" label={loading ? '—' : (prop?.tipo ?? '—')} />
                  <Chip icon={<Bed className="h-4 w-4" />} label={`${prop?.dormitorios ?? '—'} Dorm.`} />
                  <Chip icon={<ShowerHead className="h-4 w-4" />} label={`${prop?.banos ?? '—'} Baños`} />
                  <Chip icon={<Car className="h-4 w-4" />} label={`${prop?.estacionamientos ?? '—'} Estac.`} />
                  <Chip icon={<Ruler className="h-4 w-4" />} label={`${prop?.superficie_util_m2 != null ? nfINT.format(prop!.superficie_util_m2!) : '—'} m² const.`} />
                  <Chip icon={<Square className="h-4 w-4" />} label={`${prop?.superficie_terreno_m2 != null ? nfINT.format(prop!.superficie_terreno_m2!) : '—'} m² terreno`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Tabs de galería (Todas / Exterior / Interior) */}
        <SectionTitle>GALERÍA</SectionTitle>

        <div className="flex items-center gap-2 mb-4">
          {(['todas','exterior','interior'] as const).map(k => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-3 py-1.5 border text-sm rounded-none ${tab===k ? 'text-white' : 'text-slate-700'}`}
              style={{ background: tab===k ? BRAND_BLUE : 'transparent', borderColor: BRAND_BLUE }}
            >
              {k === 'todas' ? 'Todas' : (k === 'exterior' ? 'Exterior' : 'Interior')}
            </button>
          ))}
          <div className="ml-auto text-sm text-slate-500">{visibleImages.length} fotos</div>
        </div>

        {/* Grid de fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleImages.map((url, i) => (
            <button
              key={`${tab}-${i}`}
              onClick={() => setLbOpenIndex(allImages.indexOf(url))}
              className="relative group aspect-[4/3] w-full overflow-hidden bg-slate-100"
            >
              <img src={url} alt={`Foto ${i+1}`} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
              {/* overlay “estilo JE” */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute right-2 bottom-2 text-xs px-2 py-1 bg-black/60 text-white">{i+1}</div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        <Lightbox
          images={allImages}
          index={lbOpenIndex}
          onClose={() => setLbOpenIndex(-1)}
          onPrev={() => setLbOpenIndex(v => (v <= 0 ? allImages.length-1 : v-1))}
          onNext={() => setLbOpenIndex(v => (v >= allImages.length-1 ? 0 : v+1))}
        />

        <Separator />

        {/* Descripción */}
        <SectionTitle>DESCRIPCIÓN</SectionTitle>
        <div className="text-slate-700 leading-relaxed max-w-3xl">
          {loading
            ? 'Cargando…'
            : (prop?.descripcion || 'Descripción no disponible por el momento.')
          }
        </div>

        <Separator />

        {/* Características destacadas con iconos */}
        <SectionTitle>CARACTERÍSTICAS DESTACADAS</SectionTitle>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-slate-700">
          {highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-[2px]" style={{ color: BRAND_BLUE }}>{h.icon}</span>
              <span>{h.text}</span>
            </li>
          ))}
        </ul>

        <Separator />

        {/* Explora el sector (mapa embebido) */}
        <SectionTitle>EXPLORA EL SECTOR</SectionTitle>
        <div className="relative">
          <div className="w-full h-[420px] bg-slate-200">
            {/* Sencillo: centramos en la comuna; cuando tengas coordenadas, cambiamos el query. */}
            <iframe
              title="mapa"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${prop?.comuna || ''}, ${prop?.region || ''}`)}&output=embed`}
            />
            {/* Opcional: pin semi-transparente “zona referencial” */}
            <div className="absolute left-4 top-4 px-3 py-1.5 text-xs bg-white/80 border border-slate-200">
              Zona referencial (sin dirección exacta)
            </div>
          </div>
        </div>

        <div className="mb-16" /> {/* aire antes del footer */}
      </section>
    </main>
  );
}
