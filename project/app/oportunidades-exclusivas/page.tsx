// FILE: project/app/proyectos-exclusivos/page.tsx
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
  BadgeDollarSign,
  Percent,
  RotateCw,
  Layers3,
} from 'lucide-react';
import SmartSelect from '../../components/SmartSelect';

type SealType = 'bajo_mercado' | 'innovacion' | 'flipping' | 'densificacion';

type Project = {
  id?: string;
  slug?: string;
  titulo?: string;
  comuna?: string;
  barrio?: string;
  region?: string;
  operacion?: 'venta' | 'arriendo' | string;
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
  createdAt?: string;

  portada_url?: string | null;
  portada_fija_url?: string | null;

  // === SELLOS (NUEVO) ===
  sello_tipo?: SealType | null;
  tasa_innovacion?: number | null; // ej 2.0
};

const BRAND_BLUE = '#0A2E57';
const BTN_GRAY_BORDER = '#e2e8f0';

/* HERO (cámbiala por una portada específica de Proyectos Exclusivos cuando la tengas en Supabase) */
const HERO_IMG =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2400&auto=format&fit=crop';

/* Fallback card */
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

/* ==== Hook UF ==== */
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

/* ==== SOLO RM y Valparaíso ==== */
const REGIONES: string[] = ['Metropolitana de Santiago', 'Valparaíso'];

const COMUNAS: Record<string, string[]> = {
  'Metropolitana de Santiago': [
    'Las Condes',
    'Vitacura',
    'Lo Barnechea',
    'Providencia',
    'Santiago',
    'Ñuñoa',
    'La Reina',
    'Huechuraba',
    'La Florida',
    'Maipú',
    'Puente Alto',
    'Colina',
    'Lampa',
    'Talagante',
    'Peñalolén',
    'Macul',
  ],
  Valparaíso: ['Casablanca', 'Viña del Mar', 'Valparaíso', 'Concón', 'Quilpué', 'Villa Alemana', 'Limache', 'Olmué'],
};

const BARRIOS: Record<string, string[]> = {
  'Las Condes': ['El Golf', 'Nueva Las Condes', 'San Damián', 'Estoril', 'Los Dominicos', 'Cantagallo', 'Apoquindo'],
  Vitacura: ['Santa María de Manquehue', 'Lo Curro', 'Jardín del Este', 'Vitacura Centro', 'Parque Bicentenario'],
  'Lo Barnechea': ['La Dehesa', 'Los Trapenses', 'El Huinganal', 'Valle La Dehesa'],
  Providencia: ['Los Leones', 'Pedro de Valdivia', 'Providencia Centro', 'Bellavista'],
  Ñuñoa: ['Plaza Ñuñoa', 'Villa Frei', 'Irarrazabal', 'Suárez Mujica'],
  Santiago: ['Centro', 'Lastarria', 'Parque Almagro', 'Barrio Brasil', 'Yungay'],
  'La Reina': ['La Reina Alta', 'Nueva La Reina', 'La Reina Centro'],
  Huechuraba: ['Ciudad Empresarial', 'Pedro Fontova'],
  'La Florida': ['Trinidad', 'Walker Martínez', 'Bellavista', 'Gerónimo de Alderete'],
  Maipú: ['Ciudad Satélite', 'El Abrazo', 'Maipú Centro'],
  'Puente Alto': ['Eyzaguirre', 'Malloco Colorado', 'Balmaceda'],
  Colina: ['Chicureo Oriente', 'Chicureo Poniente', 'Piedra Roja', 'Las Brisas', 'Santa Elena'],
  'Peñalolén': ['Los Presidentes', 'San Luis', 'Altos de Peñalolén'],
  Macul: ['Macul Centro', 'Emilio Rojas', 'Los Plátanos'],
  Lampa: ['Valle Grande', 'Chicauma'],
  Talagante: ['Talagante Centro', 'Isla de Maipo Norte'],
  'Viña del Mar': ['Reñaca', 'Jardín del Mar', 'Oriente', 'Centro'],
  Valparaíso: ['Cerro Alegre', 'Cerro Concepción', 'Barón', 'Playa Ancha'],
  Concón: ['Bosques de Montemar', 'Costa de Montemar', 'Concón Centro'],
  Limache: ['Limache Viejo', 'Limache Nuevo', 'San Francisco', 'Lliu Lliu'],
  'Villa Alemana': ['Peñablanca', 'El Álamo', 'El Carmen'],
  Quilpué: ['El Sol', 'Belloto', 'Los Pinos'],
  Olmué: ['Olmué Centro', 'Lo Narváez'],
  Casablanca: ['Tunquén'],
};

/* ==== Normalización y región ==== */
const stripDiacritics = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const normalize = (s?: string) => stripDiacritics((s || '').toLowerCase()).replace(/\s+/g, ' ').trim();

/** Resuelve región a partir de comuna y, si es necesario, por barrio.
 *  Tunquén -> Casablanca -> Valparaíso
 */
function inferRegion(comuna?: string, barrio?: string): string | undefined {
  const cNorm = normalize(comuna);
  const bNorm = normalize(barrio);

  const comunaEfectiva = cNorm === 'tunquen' || bNorm.includes('tunquen') ? 'Casablanca' : (comuna || '');

  const c = normalize(comunaEfectiva);
  if (!c) return undefined;

  for (const [reg, comunas] of Object.entries(COMUNAS)) {
    if (comunas.some((co) => normalize(co) === c)) return reg;
  }
  return undefined;
}

/* ========= SELLOS ========= */
function SealBadge({ tipo, tasa }: { tipo?: SealType | null; tasa?: number | null }) {
  if (!tipo) return null;

  const base =
    'absolute top-3 right-3 z-10 w-[88px] h-[88px] border border-white/70 bg-[#0A2E57]/85 text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] flex items-center justify-center';
  const inner = 'w-full h-full flex flex-col items-center justify-center gap-1 text-center px-2';

  if (tipo === 'bajo_mercado') {
    return (
      <div className={base}>
        <div className={inner}>
          <BadgeDollarSign className="h-6 w-6" />
          <div className="text-[10px] tracking-[.22em] uppercase leading-tight">Bajo mercado</div>
        </div>
      </div>
    );
  }

  if (tipo === 'innovacion') {
    const n = typeof tasa === 'number' ? tasa : null;
    return (
      <div className={base}>
        <div className={inner}>
          <Percent className="h-6 w-6" />
          <div className="text-[10px] tracking-[.22em] uppercase leading-tight">Innovación</div>
          <div className="text-[16px] font-semibold leading-none">{n != null ? `${n}%` : '—'}</div>
        </div>
      </div>
    );
  }

  if (tipo === 'flipping') {
    return (
      <div className={base}>
        <div className={inner}>
          <RotateCw className="h-6 w-6" />
          <div className="text-[10px] tracking-[.22em] uppercase leading-tight">Flipping</div>
        </div>
      </div>
    );
  }

  // densificación
  return (
    <div className={base}>
      <div className={inner}>
        <Layers3 className="h-6 w-6" />
        <div className="text-[10px] tracking-[.22em] uppercase leading-tight">Densificación</div>
      </div>
    </div>
  );
}

function SealsGlossary() {
  const itemBase =
    'flex items-start gap-3 border border-slate-200 bg-white p-4 shadow-sm';
  const iconBox =
    'w-10 h-10 border border-black/10 bg-slate-50 flex items-center justify-center shrink-0';

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="pl-2 sm:pl-4">
          <h3 className="text-slate-900 uppercase tracking-[0.25em] text-[15px]">
            Glosario de sellos
          </h3>
          <p className="text-slate-600 mt-2 text-[13px] leading-relaxed max-w-3xl">
            Cada proyecto puede incluir un sello de lectura rápida. Estos sellos no reemplazan el análisis; lo
            sintetizan.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className={itemBase}>
              <div className={iconBox}>
                <BadgeDollarSign className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <div className="text-[12px] tracking-[.22em] uppercase text-[#0A2E57] font-semibold">
                  Bajo mercado
                </div>
                <div className="mt-1 text-[13px] text-slate-700 leading-relaxed">
                  Precio bajo comparables relevantes o condición excepcional.
                </div>
              </div>
            </div>

            <div className={itemBase}>
              <div className={iconBox}>
                <Percent className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <div className="text-[12px] tracking-[.22em] uppercase text-[#0A2E57] font-semibold">
                  Innovación (tasa)
                </div>
                <div className="mt-1 text-[13px] text-slate-700 leading-relaxed">
                  Tasa visible en el sello. Indica una oportunidad asociada a condiciones financieras específicas.
                </div>
              </div>
            </div>

            <div className={itemBase}>
              <div className={iconBox}>
                <RotateCw className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <div className="text-[12px] tracking-[.22em] uppercase text-[#0A2E57] font-semibold">
                  Flipping
                </div>
                <div className="mt-1 text-[13px] text-slate-700 leading-relaxed">
                  Potencial de revalorización por mejora, regularización o reposicionamiento.
                </div>
              </div>
            </div>

            <div className={itemBase}>
              <div className={iconBox}>
                <Layers3 className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <div className="text-[12px] tracking-[.22em] uppercase text-[#0A2E57] font-semibold">
                  Densificación
                </div>
                <div className="mt-1 text-[13px] text-slate-700 leading-relaxed">
                  Potencial normativo/constructivo para mayor intensidad, desarrollo o cabida.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProyectosExclusivosPage() {
  /* — Filtros UI — */
  const [operacion, setOperacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [region, setRegion] = useState<string>('');
  const [comuna, setComuna] = useState('');
  const [barrio, setBarrio] = useState('');

  /* — UF / CLP UI — */
  const [moneda, setMoneda] = useState<'' | 'UF' | 'CLP$' | 'CLP'>('');
  const [minValor, setMinValor] = useState('');
  const [maxValor, setMaxValor] = useState('');

  /* — Avanzada UI — */
  const [advancedMode, setAdvancedMode] = useState<'rapida' | 'avanzada'>('rapida');
  const [minDorm, setMinDorm] = useState('');
  const [minBanos, setMinBanos] = useState('');
  const [minM2Const, setMinM2Const] = useState('');
  const [minM2Terreno, setMinM2Terreno] = useState('');
  const [estac, setEstac] = useState('');

  /* — APLICADOS — */
  const [aOperacion, setAOperacion] = useState('');
  const [aTipo, setATipo] = useState('');
  const [aRegion, setARegion] = useState<string>('');
  const [aComuna, setAComuna] = useState('');
  const [aBarrio, setABarrio] = useState('');

  const [aMoneda, setAMoneda] = useState<'' | 'UF' | 'CLP$' | 'CLP'>('');
  const [aMinValor, setAMinValor] = useState('');
  const [aMaxValor, setAMaxValor] = useState('');

  const [aMinDorm, setAMinDorm] = useState('');
  const [aMinBanos, setAMinBanos] = useState('');
  const [aMinM2Const, setAMinM2Const] = useState('');
  const [aMinM2Terreno, setAMinM2Terreno] = useState('');
  const [aEstac, setAEstac] = useState('');

  /* — Resultados — */
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);

  /* Portadas “hidratadas” por id cuando la lista no las trae */
  const [portadasById, setPortadasById] = useState<Record<string, string>>({});

  /* Orden */
  const [sortMode, setSortMode] = useState<'price-desc' | 'price-asc' | ''>('');
  const [sortOpen, setSortOpen] = useState(false);

  const ufValue = useUfValue();

  /* Carga inicial */
  useEffect(() => {
    setTrigger((v) => v + 1);
  }, []);

  /* Fetch listado (SOLO al Buscar) */
  useEffect(() => {
    const p = new URLSearchParams();

    if (aOperacion) p.set('operacion', aOperacion);
    if (aTipo) p.set('tipo', aTipo);
    if (aComuna) p.set('comuna', aComuna);
    // NO enviamos 'barrio' al backend; se filtra en cliente.

    const toInt = (s: string) => (s ? parseInt(s.replace(/\./g, ''), 10) : NaN);
    const minN = toInt(aMinValor);
    const maxN = toInt(aMaxValor);
    if (!Number.isNaN(minN) || !Number.isNaN(maxN)) {
      const isCLP = aMoneda === 'CLP' || aMoneda === 'CLP$';
      if (isCLP && typeof ufValue === 'number' && ufValue > 0) {
        const minUF = !Number.isNaN(minN) ? Math.round(minN / ufValue) : NaN;
        const maxUF = !Number.isNaN(maxN) ? Math.round(maxN / ufValue) : NaN;
        if (!Number.isNaN(minUF)) p.set('minUF', String(minUF));
        if (!Number.isNaN(maxUF)) p.set('maxUF', String(maxUF));
      } else {
        if (isCLP) {
          if (!Number.isNaN(minN)) p.set('minCLP', String(minN));
          if (!Number.isNaN(maxN)) p.set('maxCLP', String(maxN));
        } else {
          if (!Number.isNaN(minN)) p.set('minUF', String(minN));
          if (!Number.isNaN(maxN)) p.set('maxUF', String(maxN));
        }
      }
    }

    if (aMinDorm) p.set('minDorm', aMinDorm);
    if (aMinBanos) p.set('minBanos', aMinBanos);
    if (aMinM2Const) p.set('minM2Const', aMinM2Const.replace(/\./g, ''));
    if (aMinM2Terreno) p.set('minM2Terreno', aMinM2Terreno.replace(/\./g, ''));
    if (aEstac) p.set('minEstac', aEstac);

    setLoading(true);
    let cancel = false;

    // ✅ Endpoint proyectos (crea /api/proyectos equivalente a /api/propiedades)
    fetch(`/api/proyectos?${p.toString()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (cancel) return;
        setItems(Array.isArray(j?.data) ? (j.data as Project[]) : []);
      })
      .catch(() => {
        if (!cancel) setItems([]);
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });

    return () => {
      cancel = true;
    };
  }, [trigger, ufValue]);

  /* Hidratación de portadas por id cuando faltan en la lista */
  useEffect(() => {
    const need = (items || [])
      .filter((p) => p.id && !p.portada_url && !p.portada_fija_url)
      .map((p) => p.id!)
      .filter((id) => !portadasById[id]);

    if (need.length === 0) return;

    let cancel = false;
    (async () => {
      const entries: [string, string][] = [];
      for (const id of need) {
        try {
          const r = await fetch(`/api/proyectos/${encodeURIComponent(id)}`, { cache: 'no-store' });
          const j = await r.json();
          const data = j?.data || j;
          const img =
            (data?.portada_url && String(data.portada_url).trim()) ||
            (data?.portada_fija_url && String(data.portada_fija_url).trim()) ||
            (Array.isArray(data?.imagenes) && data.imagenes[0]) ||
            '';
          if (img) entries.push([id, img]);
        } catch {}
      }
      if (!cancel && entries.length) {
        setPortadasById((prev) => {
          const next = { ...prev };
          for (const [k, v] of entries) next[k] = v;
          return next;
        });
      }
    })();

    return () => {
      cancel = true;
    };
  }, [items, portadasById]);

  /* ====== FILTRO EN CLIENTE ====== */
  const filteredItems = useMemo(() => {
    const norm = (s?: string) => normalize(s || '');

    const toInt = (s: string) => (s ? parseInt(s.replace(/\./g, ''), 10) : NaN);
    const minN = toInt(aMinValor);
    const maxN = toInt(aMaxValor);
    const isCLP = aMoneda === 'CLP' || aMoneda === 'CLP$';
    const rate = ufValue || null;

    const minUF =
      Number.isNaN(minN) ? -Infinity : isCLP ? (rate ? minN / rate : -Infinity) : minN;
    const maxUF =
      Number.isNaN(maxN) ? Infinity : isCLP ? (rate ? maxN / rate : Infinity) : maxN;

    const ge = (val: number | null | undefined, min: number) => (val == null ? false : val >= min);

    return (items || []).filter((x) => {
      if (aOperacion && norm(x.operacion) !== norm(aOperacion)) return false;

      if (aTipo) {
        const xt = norm(x.tipo);
        const ft = norm(aTipo);
        if (!xt.startsWith(ft)) return false;
      }

      if (aRegion) {
        const r = inferRegion(x.comuna, x.barrio);
        if (norm(r) !== norm(aRegion)) return false;
      }

      if (aComuna) {
        const cItem = normalize(normalize(x.comuna) === 'tunquen' ? 'Casablanca' : (x.comuna || ''));
        if (cItem !== norm(aComuna)) return false;
      }

      if (aBarrio) {
        const sel = norm(aBarrio);
        const bx = norm(x.barrio);
        const cx = norm(x.comuna);
        const passBarrio = (bx && bx.includes(sel)) || (!bx && cx === 'tunquen');
        if (!passBarrio) return false;
      }

      let vUF: number | null = null;
      if (x.precio_uf && x.precio_uf > 0) vUF = x.precio_uf;
      else if (x.precio_clp && x.precio_clp > 0 && rate) vUF = x.precio_clp / rate;

      if (vUF != null) {
        if (vUF < minUF || vUF > maxUF) return false;
      } else if (minUF !== -Infinity || maxUF !== Infinity) {
        return false;
      }

      if (aMinDorm && !ge(x.dormitorios, parseInt(aMinDorm, 10))) return false;
      if (aMinBanos && !ge(x.banos, parseInt(aMinBanos, 10))) return false;
      if (aMinM2Const) {
        const m = parseInt(aMinM2Const.replace(/\./g, ''), 10);
        if (!ge(x.superficie_util_m2, m)) return false;
      }
      if (aMinM2Terreno) {
        const m = parseInt(aMinM2Terreno.replace(/\./g, ''), 10);
        if (!ge(x.superficie_terreno_m2, m)) return false;
      }
      if (aEstac && !ge(x.estacionamientos, parseInt(aEstac, 10))) return false;

      return true;
    });
  }, [
    items,
    aOperacion,
    aTipo,
    aRegion,
    aComuna,
    aBarrio,
    aMoneda,
    aMinValor,
    aMaxValor,
    aMinDorm,
    aMinBanos,
    aMinM2Const,
    aMinM2Terreno,
    aEstac,
    ufValue,
  ]);

  /* Ordenamiento */
  const CLPfromUF = useMemo(() => (ufValue && ufValue > 0 ? ufValue : null), [ufValue]);
  const getComparablePriceUF = (p: Project) => {
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

  /* LIMPIAR */
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

    setAOperacion('');
    setATipo('');
    setARegion('');
    setAComuna('');
    setABarrio('');
    setAMoneda('');
    setAMinValor('');
    setAMaxValor('');
    setAMinDorm('');
    setAMinBanos('');
    setAMinM2Const('');
    setAMinM2Terreno('');
    setAEstac('');

    setTrigger((v) => v + 1);
  };

  /* BUSCAR */
  const applyAndSearch = () => {
    setAOperacion(operacion);
    setATipo(tipo);
    setARegion(region);
    setAComuna(comuna);
    setABarrio(barrio);

    setAMoneda(moneda);
    setAMinValor(minValor);
    setAMaxValor(maxValor);

    setAMinDorm(minDorm);
    setAMinBanos(minBanos);
    setAMinM2Const(minM2Const);
    setAMinM2Terreno(minM2Terreno);
    setAEstac(estac);

    setTrigger((v) => v + 1);
  };

  /* ENTER -> Buscar (atajo) */
  const handleKeyDownSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyAndSearch();
    }
  };

  const regionOptions = REGIONES;
  const comunaOptions = region ? COMUNAS[region] || [] : [];
  const barrioOptions = comuna && BARRIOS[comuna] ? BARRIOS[comuna] : [];

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative min-h-[100svh]">
        <img
          src={HERO_IMG}
          alt="Portada"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 45%' }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pl-2 sm:pl-4">
              <div className="max-w-3xl">
                <h1 className="text-white text-3xl md:text-4xl uppercase tracking-[0.25em]">
                  PROYECTOS EXCLUSIVOS
                </h1>
                <p className="text-white/85 mt-2">
                  Activos fuera del circuito tradicional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO (antes del buscador) */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="pl-2 sm:pl-4 max-w-4xl">
            <h2 className="text-slate-900 uppercase tracking-[0.25em] text-[15px]">
              Activos fuera del circuito tradicional
            </h2>

            <div className="mt-6 space-y-4 text-slate-700 text-[14px] leading-relaxed text-justify">
              <p>
                No todas las oportunidades inmobiliarias llegan al mercado abierto. Algunas requieren criterio
                técnico, red estratégica y capacidad de estructuración.
              </p>
              <p>
                En esta sección presentamos activos singulares y proyectos especiales que, por su modelo de
                negocio, oportunidad financiera o particularidad normativa, se gestionan bajo un esquema
                diferenciado y, en muchos casos, confidencial.
              </p>
              <p>
                Aquí encontrarás alternativas que no compiten en el mercado masivo: novaciones estructuradas,
                operaciones de flipping con fundamento técnico, propiedades bajo valor de mercado y activos con
                potencial de densificación o desarrollo.
              </p>
              <p>
                Cada oportunidad es previamente analizada desde su viabilidad normativa, potencial constructivo,
                escenario de valorización y riesgo asociado. No se trata solo de “precio atractivo”, sino de
                activos con lógica financiera y fundamento técnico.
              </p>
              <p>
                El acceso a esta sección es limitado y su disponibilidad cambia constantemente según oportunidades
                reales detectadas y gestionadas por nuestro equipo.
              </p>
              <p>
                Gesswein Properties no publica volumen. Gestiona oportunidades que requieren visión, estructura y
                decisión.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BÚSQUEDA */}
      <section className="bg-white border-b border-slate-200" onKeyDown={handleKeyDownSearch}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-slate-800 mb-4 pl-2 sm:pl-4">
            <Filter className="h-5 w-5" color={BRAND_BLUE} />
            <span className="text-lg md:text-xl uppercase tracking-[0.25em]">BÚSQUEDA</span>
          </div>

          {/* modo */}
          <div className="pl-2 sm:pl-4 mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setAdvancedMode('rapida')}
              className={`px-3 py-2 text-sm rounded-none border ${
                advancedMode === 'rapida'
                  ? 'bg-gray-200 border-gray-300 text-slate-900'
                  : 'bg-gray-50 border-gray-300 text-slate-700'
              }`}
            >
              Búsqueda rápida
            </button>
            <button
              type="button"
              onClick={() => setAdvancedMode('avanzada')}
              className={`px-3 py-2 text-sm rounded-none border ${
                advancedMode === 'avanzada'
                  ? 'bg-gray-200 border-gray-300 text-slate-900'
                  : 'bg-gray-50 border-gray-300 text-slate-700'
              }`}
            >
              Búsqueda avanzada
            </button>
          </div>

          {/* === RÁPIDA === */}
          {advancedMode === 'rapida' && (
            <>
              <div className="pl-2 sm:pl-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
                <SmartSelect
                  options={['Venta', 'Arriendo']}
                  value={operacion}
                  onChange={setOperacion}
                  placeholder="Operación"
                />
                <SmartSelect
                  options={['Casa', 'Departamento', 'Bodega', 'Oficina', 'Local comercial', 'Terreno']}
                  value={tipo}
                  onChange={setTipo}
                  placeholder="Tipo de propiedad"
                />
                <SmartSelect
                  options={regionOptions}
                  value={region}
                  onChange={(v) => {
                    setRegion(v);
                    setComuna('');
                    setBarrio('');
                  }}
                  placeholder="Región"
                />
                <SmartSelect
                  options={comunaOptions}
                  value={comuna}
                  onChange={(v) => {
                    setComuna(v);
                    setBarrio('');
                  }}
                  placeholder="Comuna"
                  disabled={!region}
                />
                <SmartSelect
                  options={barrioOptions}
                  value={barrio}
                  onChange={setBarrio}
                  placeholder="Barrio"
                  disabled={!comuna || !barrioOptions.length}
                />
              </div>

              <div className="pl-2 sm:pl-4 mt-3 grid grid-cols-1 lg:grid-cols-5 gap-3">
                <SmartSelect
                  options={['UF', 'CLP$']}
                  value={moneda}
                  onChange={(v) => setMoneda((v as any) || '')}
                  placeholder="UF/CLP$"
                />
                <input
                  value={minValor}
                  onChange={(e) => setMinValor(fmtMiles(e.target.value))}
                  inputMode="numeric"
                  placeholder="Mín"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                />
                <input
                  value={maxValor}
                  onChange={(e) => setMaxValor(fmtMiles(e.target.value))}
                  inputMode="numeric"
                  placeholder="Máx"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                />
                <button
                  onClick={handleClear}
                  className="w-full px-5 py-2 text-sm rounded-none border"
                  style={{ color: '#0f172a', borderColor: BRAND_BLUE, background: '#fff' }}
                >
                  Limpiar
                </button>
                <button
                  onClick={applyAndSearch}
                  className="w-full px-5 py-2 text-sm text-white rounded-none"
                  style={{
                    background: BRAND_BLUE,
                    boxShadow:
                      'inset 0 0 0 1px rgba(255,255,255,.95), inset 0 0 0 3px rgba(255,255,255,.35)',
                  }}
                >
                  Buscar
                </button>
              </div>
            </>
          )}

          {/* === AVANZADA === */}
          {advancedMode === 'avanzada' && (
            <>
              <div className="pl-2 sm:pl-4">
                <div className="h-px bg-slate-200 my-4" />
              </div>

              <div className="pl-2 sm:pl-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
                <SmartSelect
                  options={['Venta', 'Arriendo']}
                  value={operacion}
                  onChange={setOperacion}
                  placeholder="Operación"
                />
                <SmartSelect
                  options={['Casa', 'Departamento', 'Bodega', 'Oficina', 'Local comercial', 'Terreno']}
                  value={tipo}
                  onChange={setTipo}
                  placeholder="Tipo de propiedad"
                />
                <SmartSelect
                  options={regionOptions}
                  value={region}
                  onChange={(v) => {
                    setRegion(v);
                    setComuna('');
                    setBarrio('');
                  }}
                  placeholder="Región"
                />
                <SmartSelect
                  options={comunaOptions}
                  value={comuna}
                  onChange={(v) => {
                    setComuna(v);
                    setBarrio('');
                  }}
                  placeholder="Comuna"
                  disabled={!region}
                />
                <SmartSelect
                  options={barrioOptions}
                  value={barrio}
                  onChange={setBarrio}
                  placeholder="Barrio"
                  disabled={!comuna || !barrioOptions.length}
                />
              </div>

              <div className="pl-2 sm:pl-4 mt-3 grid grid-cols-1 lg:grid-cols-5 gap-3">
                <SmartSelect
                  options={['UF', 'CLP', 'CLP$']}
                  value={moneda}
                  onChange={(v) => setMoneda((v as any) || '')}
                  placeholder="UF/CLP$"
                />
                <input
                  value={minValor}
                  onChange={(e) => setMinValor(fmtMiles(e.target.value))}
                  inputMode="numeric"
                  placeholder="Mín"
                  className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500"
                />
                <input
                  value={maxValor}
                  onChange={(e) => setMaxValor(fmtMiles(e.target.value))}
                  inputMode="numeric"
                  placeholder="Máx"
                  className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500"
                />
                <input
                  value={minDorm}
                  onChange={(e) => setMinDorm((e.target.value || '').replace(/\D+/g, ''))}
                  inputMode="numeric"
                  placeholder="Mín. dormitorios"
                  className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500"
                />
                <input
                  value={minBanos}
                  onChange={(e) => setMinBanos((e.target.value || '').replace(/\D+/g, ''))}
                  inputMode="numeric"
                  placeholder="Mín. baños"
                  className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500"
                />
                <input
                  value={estac}
                  onChange={(e) => setEstac((e.target.value || '').replace(/\D+/g, ''))}
                  inputMode="numeric"
                  placeholder="Estacionamientos"
                  className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500"
                />
                <input
                  value={minM2Const}
                  onChange={(e) => setMinM2Const(fmtMiles(e.target.value))}
                  inputMode="numeric"
                  placeholder="Mín. m² construidos"
                  className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500"
                />
                <input
                  value={minM2Terreno}
                  onChange={(e) => setMinM2Terreno(fmtMiles(e.target.value))}
                  inputMode="numeric"
                  placeholder="Mín. m² terreno"
                  className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500"
                />
                <button
                  onClick={handleClear}
                  className="w-full px-5 py-2 text-sm rounded-none border"
                  style={{ color: '#0f172a', borderColor: BRAND_BLUE, background: '#fff' }}
                >
                  Limpiar
                </button>
                <button
                  onClick={applyAndSearch}
                  className="w-full px-5 py-2 text-sm text-white rounded-none"
                  style={{
                    background: BRAND_BLUE,
                    boxShadow:
                      'inset 0 0 0 1px rgba(255,255,255,.95), inset 0 0 0 3px rgba(255,255,255,.35)',
                  }}
                >
                  Buscar
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* GLOSARIO (debajo de búsqueda y antes del listado) */}
      <SealsGlossary />

      {/* LISTADO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4 relative">
          <h2 className="text-xl md:text-2xl text-slate-900 uppercase tracking-[0.25em]">
            PROYECTOS DISPONIBLES
          </h2>

          {/* Acciones de orden */}
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              aria-label="Limpiar orden"
              onClick={() => {
                setSortMode('');
                setSortOpen(false);
              }}
              className="inline-flex items-center justify-center px-3 py-2 rounded-none"
              style={{ background: '#fff', border: '1px solid #000', color: '#000' }}
              title="Limpiar orden"
            >
              <Trash2 className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setSortOpen((s) => !s)}
              className="inline-flex items-center justify-center px-3 py-2 rounded-none text-white"
              style={{ background: BRAND_BLUE, border: `1px solid ${BTN_GRAY_BORDER}` }}
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              title="Filtrar / ordenar"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>

            {sortOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 shadow-lg z-10"
                role="menu"
              >
                <button
                  className="w-full text-left px-4 py-2 hover:bg-slate-50"
                  onClick={() => {
                    setSortMode('price-desc');
                    setSortOpen(false);
                  }}
                >
                  Precio: mayor a menor
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-slate-50"
                  onClick={() => {
                    setSortMode('price-asc');
                    setSortOpen(false);
                  }}
                >
                  Precio: menor a mayor
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-slate-600">Cargando proyectos…</p>
        ) : (displayedItems ?? []).length === 0 ? (
          <p className="text-slate-600">No se encontraron proyectos.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(displayedItems ?? []).map((p) => {
              const showUF = !!(p.precio_uf && p.precio_uf > 0);
              const clp = (() => {
                if (p.precio_clp && p.precio_clp > 0) return p.precio_clp;
                if (showUF && CLPfromUF) return Math.round((p.precio_uf as number) * CLPfromUF);
                return null;
              })();

              const terreno =
                (p.tipo || '').toLowerCase().includes('terreno') || (p.tipo || '').toLowerCase().includes('sitio');
              const bodega = (p.tipo || '').toLowerCase().includes('bodega');
              const linkId = (p.id || p.slug || '').toString();

              const portadaHidratada = p.id ? portadasById[p.id] : '';
              const cardImage =
                (p.portada_url && String(p.portada_url).trim()) ||
                (p.portada_fija_url && String(p.portada_fija_url).trim()) ||
                (portadaHidratada && String(portadaHidratada).trim()) ||
                (p.coverImage && String(p.coverImage).trim()) ||
                (Array.isArray(p.imagenes) && p.imagenes[0]) ||
                CARD_FALLBACK;

              const tipoCap = p.tipo ? capFirst(String(p.tipo)) : '';

              return (
                <Link
                  key={p.id ?? p.slug ?? Math.random().toString(36).slice(2)}
                  href={`/proyectos-exclusivos/${encodeURIComponent(linkId)}`}
                  className="group block border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <img
                      src={cardImage}
                      alt={p.titulo || 'Proyecto'}
                      className="w-full h-full object-cover group-hover:opacity-95 transition"
                    />

                    {/* SELLO */}
                    <SealBadge tipo={p.sello_tipo ?? null} tasa={p.tasa_innovacion ?? null} />
                  </div>

                  <div className="p-4 flex flex-col">
                    <h3 className="text-lg text-slate-900 line-clamp-2 min-h-[48px]">
                      {p.titulo || 'Proyecto'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {[p.comuna || '', tipoCap, p.operacion ? capFirst(String(p.operacion)) : '']
                        .filter(Boolean)
                        .join(' · ')}
                    </p>

                    {!terreno && !bodega ? (
                      <div className="mt-3 grid grid-cols-5 text-center">
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <Bed className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">{p.dormitorios ?? '—'}</div>
                        </div>
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <ShowerHead className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">{p.banos ?? '—'}</div>
                        </div>
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <Car className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">{p.estacionamientos ?? '—'}</div>
                        </div>
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <Ruler className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">
                            {p.superficie_util_m2 != null ? nfINT.format(p.superficie_util_m2) : '—'}
                          </div>
                        </div>
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <Square className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">
                            {p.superficie_terreno_m2 != null ? nfINT.format(p.superficie_terreno_m2) : '—'}
                          </div>
                        </div>
                      </div>
                    ) : terreno ? (
                      <div className="mt-3 grid grid-cols-5 text-center">
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <Bed className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">—</div>
                        </div>
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <ShowerHead className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">—</div>
                        </div>
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <Car className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">—</div>
                        </div>
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <Ruler className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">—</div>
                        </div>
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <Square className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">
                            {p.superficie_terreno_m2 != null ? nfINT.format(p.superficie_terreno_m2) : '—'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 grid grid-cols-4 text-center">
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <Bed className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">{p.dormitorios ?? '—'}</div>
                        </div>
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <ShowerHead className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">{p.banos ?? '—'}</div>
                        </div>
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <Ruler className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">
                            {p.superficie_util_m2 != null ? nfINT.format(p.superficie_util_m2) : '—'}
                          </div>
                        </div>
                        <div className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center">
                            <Car className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-sm">{p.estacionamientos ?? '—'}</div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <span
                        className="inline-flex items-center px-3 py-1.5 text-sm rounded-none border"
                        style={{ color: '#0f172a', borderColor: BRAND_BLUE, background: '#fff' }}
                      >
                        Ver más
                      </span>
                      <div className="text-right">
                        <div className="font-semibold" style={{ color: BRAND_BLUE }}>
                          {showUF ? `UF ${nfUF.format(p.precio_uf as number)}` : 'Consultar'}
                        </div>
                        <div className="text-xs text-slate-500">{clp ? `$ ${nfCLP.format(clp)}` : ''}</div>
                      </div>
                    </div>
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
