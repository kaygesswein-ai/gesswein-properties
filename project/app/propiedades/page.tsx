'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bed,
  ShowerHead,
  Ruler,
  Filter,
  Car,
  Square,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import SmartSelect from '../../components/SmartSelect';

type Property = {
  id?: string;
  slug?: string;
  titulo?: string;
  comuna?: string;
  barrio?: string;
  region?: string;
  operacion?: string;
  tipo?: string;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  superficie_util_m2?: number | null;
  superficie_terreno_m2?: number | null;
  estacionamientos?: number | null;
  coverImage?: string;
  imagenes?: string[] | null;
  portada_url?: string | null;
  portada_fija_url?: string | null;
};

const BRAND_BLUE = '#0A2E57';
const BTN_GRAY_BORDER = '#e2e8f0';

// ✅ Hero personalizado desde Supabase
const HERO_IMG =
  'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/IMG_2884.jpeg';

// Fallback general
const CARD_FALLBACK =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop';

const nfUF = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const capFirst = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const fmtMiles = (raw: string) => {
  const digits = (raw || '').replace(/\D+/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(parseInt(digits, 10));
};

// ==== UF hook ====
function useUfValue() {
  const [uf, setUf] = useState<number | null>(null);
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await fetch('/api/uf', { cache: 'no-store' });
        const j = await r.json().catch(() => ({} as any));
        const value = typeof j?.uf === 'number' ? j.uf : null;
        if (!cancel) setUf(value);
      } catch {
        if (!cancel) setUf(null);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);
  return uf;
}

/* === Listas de regiones, comunas y barrios === */
const REGIONES: string[] = ['Metropolitana de Santiago', 'Valparaíso'];

const COMUNAS: Record<string, string[]> = {
  'Metropolitana de Santiago': [
    'Las Condes', 'Vitacura', 'Lo Barnechea', 'Providencia', 'Santiago',
    'Ñuñoa', 'La Reina', 'Huechuraba', 'La Florida', 'Maipú',
    'Puente Alto', 'Colina', 'Lampa', 'Talagante', 'Peñalolén', 'Macul',
  ],
  Valparaíso: [
    'Viña del Mar', 'Valparaíso', 'Concón', 'Quilpué', 'Villa Alemana', 'Limache', 'Olmué',
  ],
};

const BARRIOS: Record<string, string[]> = {
  'Las Condes': ['Los Dominicos', 'San Damián', 'El Golf', 'Cantagallo'],
  Vitacura: ['Lo Curro', 'Jardín del Este'],
  'Lo Barnechea': ['La Dehesa', 'Los Trapenses', 'El Huinganal'],
  Providencia: ['Pedro de Valdivia', 'Los Leones', 'Providencia Centro'],
  Ñuñoa: ['Plaza Ñuñoa', 'Villa Frei'],
  'La Reina': ['La Reina Alta', 'Nueva La Reina'],
  Valparaíso: ['Cerro Alegre', 'Cerro Concepción'],
  'Viña del Mar': ['Reñaca', 'Jardín del Mar'],
  Concón: ['Costa de Montemar'],
};

/* === Normalización === */
const normalize = (s?: string) =>
  (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

export default function PropiedadesPage() {
  // filtros
  const [operacion, setOperacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [barrio, setBarrio] = useState('');
  const [moneda, setMoneda] = useState<'' | 'UF' | 'CLP$' | 'CLP'>('');
  const [minValor, setMinValor] = useState('');
  const [maxValor, setMaxValor] = useState('');
  const [minDorm, setMinDorm] = useState('');
  const [minBanos, setMinBanos] = useState('');
  const [minM2Const, setMinM2Const] = useState('');
  const [minM2Terreno, setMinM2Terreno] = useState('');
  const [estac, setEstac] = useState('');
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);

  // ordenamiento
  const [sortMode, setSortMode] = useState<'price-desc' | 'price-asc' | ''>('');
  const [sortOpen, setSortOpen] = useState(false);

  const ufValue = useUfValue();

  // carga inicial
  useEffect(() => {
    setTrigger((v) => v + 1);
  }, []);

  // === FETCH principal ===
  useEffect(() => {
    let cancel = false;
    setLoading(true);
    fetch('/api/propiedades', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (!cancel) setItems(Array.isArray(j?.data) ? (j.data as Property[]) : []);
      })
      .catch(() => !cancel && setItems([]))
      .finally(() => !cancel && setLoading(false));
    return () => {
      cancel = true;
    };
  }, [trigger]);

  /* === FILTRO local (front) === */
  const filteredItems = useMemo(() => {
    const toInt = (s: string) => (s ? parseInt(s.replace(/\./g, ''), 10) : NaN);
    const minUF = toInt(minValor);
    const maxUF = toInt(maxValor);
    const dMin = toInt(minDorm);
    const bMin = toInt(minBanos);
    const cMin = toInt(minM2Const);
    const tMin = toInt(minM2Terreno);
    const eMin = toInt(estac);

    return (items || []).filter((x) => {
      if (operacion && normalize(x.operacion) !== normalize(operacion)) return false;
      if (tipo && !normalize(x.tipo).includes(normalize(tipo))) return false;
      if (region && normalize(x.region) !== normalize(region)) return false;
      if (comuna && normalize(x.comuna) !== normalize(comuna)) return false;
      if (barrio && normalize(x.barrio) !== normalize(barrio)) return false;
      if (!Number.isNaN(minUF) && (x.precio_uf ?? 0) < minUF) return false;
      if (!Number.isNaN(maxUF) && (x.precio_uf ?? 0) > maxUF) return false;
      if (!Number.isNaN(dMin) && (x.dormitorios ?? 0) < dMin) return false;
      if (!Number.isNaN(bMin) && (x.banos ?? 0) < bMin) return false;
      if (!Number.isNaN(cMin) && (x.superficie_util_m2 ?? 0) < cMin) return false;
      if (!Number.isNaN(tMin) && (x.superficie_terreno_m2 ?? 0) < tMin) return false;
      if (!Number.isNaN(eMin) && (x.estacionamientos ?? 0) < eMin) return false;
      return true;
    });
  }, [
    items, operacion, tipo, region, comuna, barrio,
    minValor, maxValor, minDorm, minBanos, minM2Const, minM2Terreno, estac,
  ]);

  // ordenar
  const CLPfromUF = useMemo(() => (ufValue && ufValue > 0 ? ufValue : null), [ufValue]);
  const getComparablePriceUF = (p: Property) => {
    if (p.precio_uf && p.precio_uf > 0) return p.precio_uf;
    if (p.precio_clp && p.precio_clp > 0 && CLPfromUF) return p.precio_clp / CLPfromUF;
    return -Infinity;
  };
  const displayedItems = useMemo(() => {
    const arr = filteredItems.slice();
    if (sortMode === 'price-desc') arr.sort((a, b) => getComparablePriceUF(b) - getComparablePriceUF(a));
    else if (sortMode === 'price-asc') arr.sort((a, b) => getComparablePriceUF(a) - getComparablePriceUF(b));
    return arr;
  }, [filteredItems, sortMode, CLPfromUF]);

  const handleClear = () => {
    setOperacion('');
    setTipo('');
    setRegion('');
    setComuna('');
    setBarrio('');
    setMoneda('');
    setMinValor('');
    setMaxValor('');
    setMinDorm('');
    setMinBanos('');
    setMinM2Const('');
    setMinM2Terreno('');
    setEstac('');
    setTrigger((v) => v + 1);
  };

  return (
    <main className="bg-white">
      {/* HERO */}
      <section
        className="relative bg-cover min-h-[100svh]"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pl-2 sm:pl-4">
              <div className="max-w-3xl">
                <h1 className="text-white text-3xl md:text-4xl uppercase tracking-[0.25em]">
                  PROPIEDADES
                </h1>
                <p className="text-white/85 mt-2">
                  Encuentra tu próxima inversión o tu nuevo hogar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LISTADO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4 relative">
          <h2 className="text-xl md:text-2xl text-slate-900 uppercase tracking-[0.25em]">
            PROPIEDADES DISPONIBLES
          </h2>

          {/* Botones */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => { setSortMode(''); setSortOpen(false); }}
              className="inline-flex items-center justify-center px-3 py-2 rounded-none"
              style={{ background: '#fff', border: '1px solid #000', color: '#000' }}
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSortOpen((s) => !s)}
              className="inline-flex items-center justify-center px-3 py-2 rounded-none text-white"
              style={{ background: BRAND_BLUE, border: `1px solid ${BTN_GRAY_BORDER}` }}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-600">Cargando propiedades…</p>
        ) : (displayedItems ?? []).length === 0 ? (
          <p className="text-slate-600">No se encontraron propiedades.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedItems.map((p) => {
              const linkId = (p.id || p.slug || '').toString();
              const cardImage =
                (p.portada_url && p.portada_url.trim()) ||
                (p.portada_fija_url && p.portada_fija_url.trim()) ||
                (p.coverImage && p.coverImage.trim()) ||
                (Array.isArray(p.imagenes) && p.imagenes[0]) ||
                CARD_FALLBACK;
              const tipoCap = p.tipo ? capFirst(p.tipo) : '';
              return (
                <Link
                  key={p.id ?? p.slug ?? Math.random().toString(36).slice(2)}
                  href={`/propiedades/${encodeURIComponent(linkId)}`}
                  className="group block border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-[4/3] bg-slate-100">
                    <img
                      src={cardImage}
                      alt={p.titulo || 'Propiedad'}
                      className="w-full h-full object-cover group-hover:opacity-95 transition"
                    />
                  </div>
                  <div className="p-4 flex flex-col">
                    <h3 className="text-lg text-slate-900 line-clamp-2 min-h-[48px]">
                      {p.titulo || 'Propiedad'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {[p.comuna || '', tipoCap, p.operacion ? capFirst(p.operacion) : '']
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
