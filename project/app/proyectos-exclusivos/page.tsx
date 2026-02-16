'use client';

import { useEffect, useMemo, useState } from 'react';
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
  Percent,
  ArrowDownUp,
  Layers3,
  BadgeDollarSign,
} from 'lucide-react';
import SmartSelect from '../../components/SmartSelect';

type ProjectSeal = 'bajo_mercado' | 'novacion' | 'flipping' | 'densificacion' | '' | null;

type Proyecto = {
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

  portada_url?: string | null;
  portada_fija_url?: string | null;
  coverImage?: string;

  sello_tipo?: ProjectSeal;
  tasa_novacion?: number | null;
  publicado?: boolean | null;
};

const BRAND_BLUE = '#0A2E57';
const BORDER = '#e5e7eb'; // slate-200-ish

const HERO_IMG =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2400&auto=format&fit=crop';

const CARD_FALLBACK =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop';

const nfUF = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfTASA = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const capFirst = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const fmtMiles = (raw: string) => {
  const digits = (raw || '').replace(/\D+/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(parseInt(digits, 10));
};

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
  Valparaíso: [
    'Casablanca',
    'Viña del Mar',
    'Valparaíso',
    'Concón',
    'Quilpué',
    'Villa Alemana',
    'Limache',
    'Olmué',
  ],
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

const stripDiacritics = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const normalize = (s?: string) => stripDiacritics((s || '').toLowerCase()).replace(/\s+/g, ' ').trim();

function inferRegion(comuna?: string, barrio?: string): string | undefined {
  const cNorm = normalize(comuna);
  const bNorm = normalize(barrio);

  const comunaEfectiva = cNorm === 'tunquen' || bNorm.includes('tunquen') ? 'Casablanca' : comuna || '';
  const c = normalize(comunaEfectiva);
  if (!c) return undefined;

  for (const [reg, comunas] of Object.entries(COMUNAS)) {
    if (comunas.some((co) => normalize(co) === c)) return reg;
  }
  return undefined;
}

/* ---------- Sellos ---------- */
const sealMeta: Record<
  Exclude<ProjectSeal, '' | null>,
  { label: string; short: string }
> = {
  bajo_mercado: { label: 'Precio bajo mercado', short: 'BAJO\nMERCADO' },
  novacion: { label: 'Novación (tasa)', short: 'NOVACIÓN\n(TASA)' },
  flipping: { label: 'Flipping', short: 'FLIPPING' },
  densificacion: { label: 'Densificación', short: 'DENSI\nFICACIÓN' },
};

function SealBadge({ tipo, tasa }: { tipo?: ProjectSeal; tasa?: number | null }) {
  const t = (tipo ?? null) as ProjectSeal | null;
  if (!t) return null;

  const meta = sealMeta[t as Exclude<ProjectSeal, '' | null>];
  if (!meta) return null;

  const showRate = t === 'novacion' && typeof tasa === 'number' && Number.isFinite(tasa);

  return (
    <div className="absolute left-2 top-2 z-10">
      <div
        className="bg-white/95 border border-slate-200 text-slate-900 shadow-sm"
        style={{ borderRadius: 8, padding: showRate ? '8px 8px 6px' : '8px 8px', minWidth: 104 }}
        title={meta.label}
      >
        <div className="text-[10.5px] uppercase tracking-[0.22em] whitespace-pre-line leading-[1.05]">
          {meta.short}
        </div>
        {showRate && (
          <div className="mt-2 text-center font-semibold" style={{ color: BRAND_BLUE, fontSize: 15 }}>
            {nfTASA.format(tasa)}%
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Página ---------------- */
export default function ProyectosExclusivosPage() {
  const [operacion, setOperacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [region, setRegion] = useState<string>('');
  const [comuna, setComuna] = useState('');
  const [barrio, setBarrio] = useState('');

  const [moneda, setMoneda] = useState<'' | 'UF' | 'CLP$' | 'CLP'>('');
  const [minValor, setMinValor] = useState('');
  const [maxValor, setMaxValor] = useState('');

  const [advancedMode, setAdvancedMode] = useState<'rapida' | 'avanzada'>('rapida');
  const [minDorm, setMinDorm] = useState('');
  const [minBanos, setMinBanos] = useState('');
  const [minM2Const, setMinM2Const] = useState('');
  const [minM2Terreno, setMinM2Terreno] = useState('');
  const [estac, setEstac] = useState('');

  // aplicados
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

  const [items, setItems] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);

  const [portadasById, setPortadasById] = useState<Record<string, string>>({});

  const [sortMode, setSortMode] = useState<
    'price-desc' | 'price-asc' | 'bajo_mercado' | 'novacion' | 'flipping' | 'densificacion' | ''
  >('');
  const [sortOpen, setSortOpen] = useState(false);

  const ufValue = useUfValue();

  useEffect(() => {
    setTrigger((v) => v + 1);
  }, []);

  useEffect(() => {
    const p = new URLSearchParams();

    if (aOperacion) p.set('operacion', aOperacion);
    if (aTipo) p.set('tipo', aTipo);
    if (aRegion) p.set('region', aRegion);
    if (aComuna) p.set('comuna', aComuna);
    if (aBarrio) p.set('barrio', aBarrio);

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

    fetch(`/api/proyectos?${p.toString()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (cancel) return;
        setItems(Array.isArray(j?.data) ? (j.data as Proyecto[]) : []);
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
  }, [trigger, ufValue, aOperacion, aTipo, aRegion, aComuna, aBarrio, aMoneda, aMinValor, aMaxValor, aMinDorm, aMinBanos, aMinM2Const, aMinM2Terreno, aEstac]);

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

  const filteredItems = useMemo(() => {
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
      if (aOperacion && normalize(x.operacion) !== normalize(aOperacion)) return false;

      if (aTipo) {
        const xt = normalize(x.tipo);
        const ft = normalize(aTipo);
        if (!xt.startsWith(ft)) return false;
      }

      if (aRegion) {
        const r = inferRegion(x.comuna, x.barrio);
        if (normalize(r) !== normalize(aRegion)) return false;
      }

      if (aComuna) {
        const cItem = normalize(normalize(x.comuna) === 'tunquen' ? 'Casablanca' : x.comuna || '');
        if (cItem !== normalize(aComuna)) return false;
      }

      if (aBarrio) {
        const sel = normalize(aBarrio);
        const bx = normalize(x.barrio);
        if (!bx || !bx.includes(sel)) return false;
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
  }, [items, aOperacion, aTipo, aRegion, aComuna, aBarrio, aMoneda, aMinValor, aMaxValor, aMinDorm, aMinBanos, aMinM2Const, aMinM2Terreno, aEstac, ufValue]);

  const CLPfromUF = useMemo(() => (ufValue && ufValue > 0 ? ufValue : null), [ufValue]);

  const getComparablePriceUF = (p: Proyecto) => {
    if (p.precio_uf && p.precio_uf > 0) return p.precio_uf;
    if (p.precio_clp && p.precio_clp > 0 && CLPfromUF) return p.precio_clp / CLPfromUF;
    return -Infinity;
  };

  const displayedItems = useMemo(() => {
    const arr = filteredItems.slice();

    if (sortMode === 'bajo_mercado' || sortMode === 'novacion' || sortMode === 'flipping' || sortMode === 'densificacion') {
      return arr.filter((x) => (x.sello_tipo || '') === sortMode);
    }

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

    setSortMode('');
    setSortOpen(false);
    setTrigger((v) => v + 1);
  };

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
      <section className="relative min-h-[62svh]">
        <img
          src={HERO_IMG}
          alt="Portada"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 35%' }}
        />
        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute bottom-10 left-0 right-0">
          <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16">
            <h1 className="text-white text-3xl md:text-4xl uppercase tracking-[0.25em]">
              PROYECTOS EXCLUSIVOS
            </h1>
            <p className="text-white/80 mt-1 text-sm">Activos fuera del circuito tradicional.</p>
          </div>
        </div>
      </section>

      {/* TEXTO (compacto, como antes) */}
      <section className="border-b" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16 py-10">
          <h2 className="text-[13px] uppercase tracking-[0.25em]" style={{ color: BRAND_BLUE }}>
            ACTIVOS FUERA DEL CIRCUITO TRADICIONAL
          </h2>

          <div className="mt-5 max-w-4xl text-[13px] leading-[1.85] text-slate-700 space-y-4">
            <p>
              No todas las oportunidades inmobiliarias llegan al mercado abierto. Algunas requieren criterio técnico,
              red estratégica y capacidad de estructuración.
            </p>
            <p>
              En esta sección presentamos activos singulares y proyectos especiales que, por su modelo de negocio,
              oportunidad financiera o particularidad normativa, se gestionan bajo un esquema diferenciado y, en muchos
              casos, confidencial.
            </p>
            <p>
              Aquí encontrarás alternativas que no compiten en el mercado masivo: novaciones estructuradas, operaciones
              de flipping con fundamento técnico, propiedades bajo valor de mercado y activos con potencial de densificación
              o desarrollo.
            </p>
            <p>
              Cada oportunidad es previamente analizada desde su viabilidad normativa, potencial constructivo, escenario de
              valorización y riesgo asociado.
            </p>
            <p>
              El acceso a esta sección es limitado y su disponibilidad cambia constantemente según oportunidades reales detectadas
              y gestionadas por nuestro equipo.
            </p>
            <p>Gesswein Properties no publica volumen. Gestiona oportunidades que requieren visión, estructura y decisión.</p>
          </div>
        </div>
      </section>

      {/* BUSQUEDA (compacta, como screenshot) */}
      <section className="border-b" style={{ borderColor: BORDER }} onKeyDown={handleKeyDownSearch}>
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16 py-8">
          <div className="flex items-center gap-2 mb-4" style={{ color: BRAND_BLUE }}>
            <Filter className="h-4 w-4" />
            <span className="text-[12px] uppercase tracking-[0.25em]">BÚSQUEDA</span>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setAdvancedMode('rapida')}
              className="px-3 py-2 text-[12px] border rounded-none"
              style={{
                borderColor: BORDER,
                background: advancedMode === 'rapida' ? '#f3f4f6' : '#fff',
                color: '#0f172a',
              }}
            >
              Búsqueda rápida
            </button>
            <button
              type="button"
              onClick={() => setAdvancedMode('avanzada')}
              className="px-3 py-2 text-[12px] border rounded-none"
              style={{
                borderColor: BORDER,
                background: advancedMode === 'avanzada' ? '#f3f4f6' : '#fff',
                color: '#0f172a',
              }}
            >
              Búsqueda avanzada
            </button>
          </div>

          {/* Inputs: look plano */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
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

          <div className="mt-2 grid grid-cols-1 lg:grid-cols-5 gap-2">
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
              placeholder="Min"
              className="w-full border px-3 py-2 text-[13px] rounded-none"
              style={{ borderColor: BORDER, background: '#fff' }}
            />

            <input
              value={maxValor}
              onChange={(e) => setMaxValor(fmtMiles(e.target.value))}
              inputMode="numeric"
              placeholder="Máx"
              className="w-full border px-3 py-2 text-[13px] rounded-none"
              style={{ borderColor: BORDER, background: '#fff' }}
            />

            <button
              onClick={handleClear}
              className="w-full px-4 py-2 text-[12px] border rounded-none"
              style={{ borderColor: BRAND_BLUE, background: '#fff', color: '#0f172a' }}
            >
              Limpiar
            </button>

            <button
              onClick={applyAndSearch}
              className="w-full px-4 py-2 text-[12px] rounded-none text-white"
              style={{ background: BRAND_BLUE }}
            >
              Buscar
            </button>
          </div>

          {advancedMode === 'avanzada' && (
            <div className="mt-3 grid grid-cols-1 lg:grid-cols-5 gap-2">
              <input
                value={minDorm}
                onChange={(e) => setMinDorm((e.target.value || '').replace(/\D+/g, ''))}
                inputMode="numeric"
                placeholder="Mín. dormitorios"
                className="w-full border px-3 py-2 text-[13px] rounded-none"
                style={{ borderColor: BORDER, background: '#fff' }}
              />
              <input
                value={minBanos}
                onChange={(e) => setMinBanos((e.target.value || '').replace(/\D+/g, ''))}
                inputMode="numeric"
                placeholder="Mín. baños"
                className="w-full border px-3 py-2 text-[13px] rounded-none"
                style={{ borderColor: BORDER, background: '#fff' }}
              />
              <input
                value={estac}
                onChange={(e) => setEstac((e.target.value || '').replace(/\D+/g, ''))}
                inputMode="numeric"
                placeholder="Estacionamientos"
                className="w-full border px-3 py-2 text-[13px] rounded-none"
                style={{ borderColor: BORDER, background: '#fff' }}
              />
              <input
                value={minM2Const}
                onChange={(e) => setMinM2Const(fmtMiles(e.target.value))}
                inputMode="numeric"
                placeholder="Mín. m² construidos"
                className="w-full border px-3 py-2 text-[13px] rounded-none"
                style={{ borderColor: BORDER, background: '#fff' }}
              />
              <input
                value={minM2Terreno}
                onChange={(e) => setMinM2Terreno(fmtMiles(e.target.value))}
                inputMode="numeric"
                placeholder="Mín. m² terreno"
                className="w-full border px-3 py-2 text-[13px] rounded-none"
                style={{ borderColor: BORDER, background: '#fff' }}
              />
            </div>
          )}
        </div>
      </section>

      {/* GLOSARIO (tarjetas simples como antes) */}
      <section className="border-b" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16 py-8">
          <div className="text-[11px] uppercase tracking-[0.25em]" style={{ color: BRAND_BLUE }}>
            GLOSARIO DE SELLOS
          </div>
          <div className="mt-2 text-[12px] text-slate-600">
            Cada proyecto puede incluir un sello de lectura rápida. Estos sellos no reemplazan el análisis; lo sintetizan.
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="border p-4 flex gap-3 items-start" style={{ borderColor: BORDER }}>
              <BadgeDollarSign className="h-5 w-5 text-slate-600 mt-[2px]" />
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: BRAND_BLUE }}>
                  BAJO MERCADO
                </div>
                <div className="mt-1 text-[12px] text-slate-600">
                  Precio bajo comparables relevantes o condición excepcional.
                </div>
              </div>
            </div>

            <div className="border p-4 flex gap-3 items-start" style={{ borderColor: BORDER }}>
              <Percent className="h-5 w-5 text-slate-600 mt-[2px]" />
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: BRAND_BLUE }}>
                  INNOVACIÓN (TASA)
                </div>
                <div className="mt-1 text-[12px] text-slate-600">
                  Tasa visible en el sello. Indica una oportunidad asociada a condiciones financieras específicas.
                </div>
              </div>
            </div>

            <div className="border p-4 flex gap-3 items-start" style={{ borderColor: BORDER }}>
              <ArrowDownUp className="h-5 w-5 text-slate-600 mt-[2px]" />
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: BRAND_BLUE }}>
                  FLIPPING
                </div>
                <div className="mt-1 text-[12px] text-slate-600">
                  Potencial de revalorización por mejora, regularización o reposicionamiento.
                </div>
              </div>
            </div>

            <div className="border p-4 flex gap-3 items-start" style={{ borderColor: BORDER }}>
              <Layers3 className="h-5 w-5 text-slate-600 mt-[2px]" />
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em]" style={{ color: BRAND_BLUE }}>
                  DENSIFICACIÓN
                </div>
                <div className="mt-1 text-[12px] text-slate-600">
                  Potencial normativo/constructivo para mayor intensidad, desarrollo o cabida.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LISTADO */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16 py-10">
        <div className="flex items-center justify-between mb-4 relative">
          <div>
            <h2 className="text-[13px] uppercase tracking-[0.25em]" style={{ color: BRAND_BLUE }}>
              PROYECTOS DISPONIBLES
            </h2>
          </div>

          <div className="relative flex items-center gap-2">
            <button
              type="button"
              aria-label="Limpiar orden"
              onClick={() => {
                setSortMode('');
                setSortOpen(false);
              }}
              className="inline-flex items-center justify-center w-9 h-9 border rounded-none"
              style={{ background: '#fff', borderColor: '#000', color: '#000' }}
              title="Limpiar orden"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setSortOpen((s) => !s)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-none text-white"
              style={{ background: BRAND_BLUE, border: `1px solid ${BORDER}` }}
              aria-haspopup="menu"
              aria-expanded={sortOpen}
              title="Filtrar / ordenar"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            {sortOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border shadow-lg z-10" style={{ borderColor: BORDER }} role="menu">
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[13px]" onClick={() => { setSortMode('price-desc'); setSortOpen(false); }}>
                  Precio: mayor a menor
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[13px]" onClick={() => { setSortMode('price-asc'); setSortOpen(false); }}>
                  Precio: menor a mayor
                </button>

                <div className="h-px my-1" style={{ background: BORDER }} />

                <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[13px]" onClick={() => { setSortMode('bajo_mercado'); setSortOpen(false); }}>
                  Precio bajo mercado (sello)
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[13px]" onClick={() => { setSortMode('novacion'); setSortOpen(false); }}>
                  Novación (tasa) (sello)
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[13px]" onClick={() => { setSortMode('flipping'); setSortOpen(false); }}>
                  Flipping (sello)
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-[13px]" onClick={() => { setSortMode('densificacion'); setSortOpen(false); }}>
                  Densificación (sello)
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-slate-600 text-[13px]">Cargando proyectos…</p>
        ) : (displayedItems ?? []).length === 0 ? (
          <p className="text-slate-600 text-[13px]">No se encontraron proyectos.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(displayedItems ?? []).map((p) => {
              const showUF = !!(p.precio_uf && p.precio_uf > 0);
              const clp = (() => {
                if (p.precio_clp && p.precio_clp > 0) return p.precio_clp;
                if (showUF && CLPfromUF) return Math.round((p.precio_uf as number) * CLPfromUF);
                return null;
              })();

              const terreno =
                (p.tipo || '').toLowerCase().includes('terreno') ||
                (p.tipo || '').toLowerCase().includes('sitio');
              const bodega = (p.tipo || '').toLowerCase().includes('bodega');
              const linkId = (p.id || p.slug || '').toString();

              const portadaHidratada = p.id ? portadasById[p.id] : '';
              const cardImage =
                (p.portada_url && String(p.portada_url).trim()) ||
                (p.portada_fija_url && String(p.portada_fija_url).trim()) ||
                (portadaHidratada && String(portadaHidratada).trim()) ||
                (p.coverImage && String(p.coverImage).trim()) ||
                CARD_FALLBACK;

              const tipoCap = p.tipo ? capFirst(String(p.tipo)) : '';

              return (
                <Link
                  key={p.id ?? p.slug ?? Math.random().toString(36).slice(2)}
                  href={`/proyectos-exclusivos/${encodeURIComponent(linkId)}`}
                  className="group block border bg-white hover:shadow-md transition"
                  style={{ borderColor: BORDER }}
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <SealBadge tipo={p.sello_tipo} tasa={p.tasa_novacion} />
                    <img
                      src={cardImage}
                      alt={p.titulo || 'Proyecto'}
                      className="w-full h-full object-cover group-hover:opacity-95 transition"
                    />
                  </div>

                  <div className="p-4">
                    <div className="text-[15px] text-slate-900 leading-snug line-clamp-2 min-h-[40px]">
                      {p.titulo || 'Proyecto'}
                    </div>

                    <div className="mt-1 text-[12px] text-slate-600">
                      {[p.comuna || '', tipoCap, p.operacion ? capFirst(String(p.operacion)) : '']
                        .filter(Boolean)
                        .join(' · ')}
                    </div>

                    {!terreno && !bodega ? (
                      <div className="mt-3 grid grid-cols-5 text-center">
                        <div className="border p-2" style={{ borderColor: BORDER }}>
                          <div className="flex items-center justify-center">
                            <Bed className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-[12px]">{p.dormitorios ?? '—'}</div>
                        </div>
                        <div className="border p-2" style={{ borderColor: BORDER }}>
                          <div className="flex items-center justify-center">
                            <ShowerHead className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-[12px]">{p.banos ?? '—'}</div>
                        </div>
                        <div className="border p-2" style={{ borderColor: BORDER }}>
                          <div className="flex items-center justify-center">
                            <Car className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-[12px]">{p.estacionamientos ?? '—'}</div>
                        </div>
                        <div className="border p-2" style={{ borderColor: BORDER }}>
                          <div className="flex items-center justify-center">
                            <Ruler className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-[12px]">
                            {p.superficie_util_m2 != null ? nfINT.format(p.superficie_util_m2) : '—'}
                          </div>
                        </div>
                        <div className="border p-2" style={{ borderColor: BORDER }}>
                          <div className="flex items-center justify-center">
                            <Square className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-[12px]">
                            {p.superficie_terreno_m2 != null ? nfINT.format(p.superficie_terreno_m2) : '—'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 grid grid-cols-5 text-center">
                        <div className="border p-2" style={{ borderColor: BORDER }}>
                          <div className="flex items-center justify-center">
                            <Bed className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-[12px]">—</div>
                        </div>
                        <div className="border p-2" style={{ borderColor: BORDER }}>
                          <div className="flex items-center justify-center">
                            <ShowerHead className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-[12px]">—</div>
                        </div>
                        <div className="border p-2" style={{ borderColor: BORDER }}>
                          <div className="flex items-center justify-center">
                            <Car className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-[12px]">—</div>
                        </div>
                        <div className="border p-2" style={{ borderColor: BORDER }}>
                          <div className="flex items-center justify-center">
                            <Ruler className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-[12px]">—</div>
                        </div>
                        <div className="border p-2" style={{ borderColor: BORDER }}>
                          <div className="flex items-center justify-center">
                            <Square className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="text-[12px]">
                            {p.superficie_terreno_m2 != null ? nfINT.format(p.superficie_terreno_m2) : '—'}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1.5 text-[12px] border rounded-none"
                        style={{ borderColor: BRAND_BLUE, background: '#fff', color: '#0f172a' }}
                      >
                        Ver más
                      </span>
                      <div className="text-right">
                        <div className="font-semibold text-[13px]" style={{ color: BRAND_BLUE }}>
                          {showUF ? `UF ${nfUF.format(p.precio_uf as number)}` : 'Consultar'}
                        </div>
                        <div className="text-[11px] text-slate-500">{clp ? `$ ${nfCLP.format(clp)}` : ''}</div>
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
