'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Filter, SlidersHorizontal, Trash2, Percent, Layers } from 'lucide-react';
import SmartSelect from '../../components/SmartSelect';

type Proyecto = {
  id?: string;
  slug?: string;
  titulo?: string;

  operacion?: 'venta' | 'arriendo' | string;
  tipo?: string;

  region?: string;
  comuna?: string;
  barrio?: string;

  precio_uf?: number | null;

  sello_tipo?: 'flipping' | 'bajo_mercado' | 'novacion' | 'densificacion' | null;
  tasa_novacion?: number | null;

  portada_url?: string | null;
  portada_fija_url?: string | null;
  imagenes?: string[] | null;

  publicado?: boolean | null;
};

const BRAND_BLUE = '#0A2E57';
const BTN_GRAY_BORDER = '#e2e8f0';

/** HERO (dron / vista aérea urbana) */
const HERO_IMG =
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2400&auto=format&fit=crop';

const CARD_FALLBACK =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop';

const nfUF = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const capFirst = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

/* ==== SOLO RM y Valparaíso (igual Propiedades) ==== */
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
    'Casablanca', // Tunquén pertenece a Casablanca
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
  'Las Condes': [
    'El Golf',
    'Nueva Las Condes',
    'San Damián',
    'Estoril',
    'Los Dominicos',
    'Cantagallo',
    'Apoquindo',
  ],
  Vitacura: [
    'Santa María de Manquehue',
    'Lo Curro',
    'Jardín del Este',
    'Vitacura Centro',
    'Parque Bicentenario',
  ],
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

/** Resuelve región a partir de comuna y, si es necesario, por barrio. */
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

/* ===== TÍTULOS (idénticos a Servicios) ===== */
function SectionTitle({ title }: { title: string }) {
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pl-2 sm:pl-4">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.30em] uppercase font-medium">{title}</h2>
        </div>
      </div>
    </div>
  );
}

function SectionTitleWithIcon({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pl-2 sm:pl-4 flex items-center gap-3">
          <span className="shrink-0">{icon}</span>
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.30em] uppercase font-medium">{title}</h2>
        </div>
      </div>
    </div>
  );
}

/* ===== ICONOS PROPIOS ===== */

/** Flipping: flecha circular continua */
function FlippingLoopIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-3.2-6.9" />
      <path d="M21 5v6h-6" />
    </svg>
  );
}

/** Bajo mercado: $ + flecha abajo */
function BajoMercadoIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v18" />
      <path d="M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.1 2.5 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3" />
      <path d="M20 10v8" />
      <path d="M18 16l2 2 2-2" />
    </svg>
  );
}

/* ===== SELLOS (CUADRADOS, 1 SOLO ARRIBA DERECHA) ===== */

function SquareSeal({
  title,
  icon,
  bottom,
}: {
  title: string;
  icon?: React.ReactNode;
  bottom?: React.ReactNode;
}) {
  return (
    <div className="absolute top-3 right-3 z-10">
      <div
        className="w-[92px] h-[92px] bg-white/95 shadow-sm overflow-hidden"
        style={{ border: '1px solid rgba(0,0,0,.14)' }}
      >
        <div className="h-1/2 px-2 flex items-center justify-center gap-2">
          {icon ? <span className="shrink-0">{icon}</span> : null}
          <span className="text-[10px] tracking-[.20em] uppercase text-slate-700 text-center leading-tight">
            {title}
          </span>
        </div>
        <div className="h-px bg-black/10" />
        <div className="h-1/2 flex items-center justify-center">{bottom}</div>
      </div>
    </div>
  );
}

function SealForProyecto(p: Proyecto) {
  const s = p.sello_tipo || null;
  if (!s) return null;

  if (s === 'novacion') {
    if (p.tasa_novacion == null) return null;
    const tasaTxt = `${p.tasa_novacion.toFixed(1).replace('.', ',')}%`;
    return (
      <SquareSeal
        title="Novación"
        icon={<Percent className="h-4 w-4" color={BRAND_BLUE} />}
        bottom={<div className="text-[18px] font-semibold" style={{ color: BRAND_BLUE }}>{tasaTxt}</div>}
      />
    );
  }

  if (s === 'bajo_mercado') {
    return (
      <SquareSeal
        title="Bajo mercado"
        icon={<span style={{ color: BRAND_BLUE }}><BajoMercadoIcon className="h-4 w-4" /></span>}
        bottom={<div className="text-[10px] tracking-[.18em] uppercase text-black/55">Oportunidad</div>}
      />
    );
  }

  if (s === 'flipping') {
    return (
      <SquareSeal
        title="Flipping"
        icon={<span style={{ color: BRAND_BLUE }}><FlippingLoopIcon className="h-4 w-4" /></span>}
        bottom={<div className="text-[10px] tracking-[.18em] uppercase text-black/55">Revalorización</div>}
      />
    );
  }

  // densificación
  return (
    <SquareSeal
      title="Densificación"
      icon={<Layers className="h-4 w-4" color={BRAND_BLUE} />}
      bottom={<div className="text-[10px] tracking-[.18em] uppercase text-black/55">Potencial</div>}
    />
  );
}

/* ===== Glosario compacto (subtítulo bajo “Proyectos disponibles”) ===== */
function GlosarioSellosCompacto() {
  const [open, setOpen] = useState<string | null>(null);

  const items = [
    {
      key: 'bajo_mercado',
      title: 'Bajo mercado',
      icon: <span style={{ color: BRAND_BLUE }}><BajoMercadoIcon className="h-5 w-5" /></span>,
      text:
        'Activo ofrecido por debajo de comparables relevantes por condición excepcional, urgencia o asimetría de información. Es una señal para revisar fundamentos, no reemplaza el análisis.',
    },
    {
      key: 'novacion',
      title: 'Tasa de novación',
      icon: <Percent className="h-5 w-5" color={BRAND_BLUE} />,
      text:
        'Novación hipotecaria: modificación o reemplazo de la obligación crediticia asociada al inmueble, ajustando tasa, plazo o estructura para capturar una condición financiera más conveniente.',
    },
    {
      key: 'flipping',
      title: 'Flipping',
      icon: <span style={{ color: BRAND_BLUE }}><FlippingLoopIcon className="h-5 w-5" /></span>,
      text:
        'Estrategia de compra con potencial de creación de valor (mejoras, regularización, reposicionamiento) para vender con valorización en el corto/mediano plazo.',
    },
    {
      key: 'densificacion',
      title: 'Densificación',
      icon: <Layers className="h-5 w-5" color={BRAND_BLUE} />,
      text:
        'Potencial normativo y/o físico para aumentar unidades o superficie vendible: subdivisión, condominio, ampliación, cabida o mayor intensidad de uso según normativa y factibilidad técnica.',
    },
  ];

  return (
    <div className="mt-6 max-w-3xl">
      <div className="text-[12px] tracking-[.22em] uppercase text-slate-600 mb-2">
        Glosario de sellos
      </div>

      <div className="flex flex-col gap-2">
        {items.map((it) => {
          const isOpen = open === it.key;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => setOpen(isOpen ? null : it.key)}
              className="text-left border border-slate-200 bg-white px-4 py-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0">{it.icon}</span>
                <div className="text-[12px] uppercase tracking-[.25em] text-slate-900">
                  {it.title}
                </div>
                <span className="ml-auto text-slate-500 text-xs">{isOpen ? 'Cerrar' : 'Ver'}</span>
              </div>

              {isOpen && (
                <p className="mt-3 text-[13px] text-black/70 leading-relaxed">
                  {it.text}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProyectosExclusivosPage() {
  /* — Filtros UI — */
  const [advancedMode, setAdvancedMode] = useState<'rapida' | 'avanzada'>('rapida');

  const [operacion, setOperacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [region, setRegion] = useState<string>('');
  const [comuna, setComuna] = useState('');
  const [barrio, setBarrio] = useState('');

  /* precio (UF) */
  const [minUF, setMinUF] = useState('');
  const [maxUF, setMaxUF] = useState('');

  /* — APLICADOS — */
  const [aOperacion, setAOperacion] = useState('');
  const [aTipo, setATipo] = useState('');
  const [aRegion, setARegion] = useState<string>('');
  const [aComuna, setAComuna] = useState('');
  const [aBarrio, setABarrio] = useState('');

  const [aMinUF, setAMinUF] = useState('');
  const [aMaxUF, setAMaxUF] = useState('');

  /* — Resultados — */
  const [items, setItems] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);

  /* Portadas hidratadas */
  const [portadasById, setPortadasById] = useState<Record<string, string>>({});

  /* Orden + filtro sello (separado, para que funcione como esperas) */
  const [sortMode, setSortMode] = useState<'price-desc' | 'price-asc' | ''>('');
  const [selloFilter, setSelloFilter] = useState<'novacion' | 'bajo_mercado' | 'flipping' | 'densificacion' | ''>('');

  const [menuOpen, setMenuOpen] = useState(false);
  const menuWrapRef = useRef<HTMLDivElement | null>(null);

  /* Carga inicial */
  useEffect(() => { setTrigger((v) => v + 1); }, []);

  /* Cerrar menú al click afuera */
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      const el = menuWrapRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [menuOpen]);

  /* Fetch listado (SOLO al Buscar) */
  useEffect(() => {
    const p = new URLSearchParams();

    if (aOperacion) p.set('operacion', aOperacion);
    if (aTipo) p.set('tipo', aTipo);
    if (aComuna) p.set('comuna', aComuna);

    p.set('publicado', 'true');

    setLoading(true);
    let cancel = false;

    fetch(`/api/proyectos?${p.toString()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (cancel) return;
        const data = Array.isArray(j?.data) ? (j.data as Proyecto[]) : Array.isArray(j) ? (j as Proyecto[]) : [];
        setItems(data);
      })
      .catch(() => { if (!cancel) setItems([]); })
      .finally(() => { if (!cancel) setLoading(false); });

    return () => { cancel = true; };
  }, [trigger]);

  /* Hidratación portadas */
  useEffect(() => {
    const need = (items || [])
      .filter(p => p.id && !p.portada_url && !p.portada_fija_url)
      .map(p => p.id!)
      .filter(id => !portadasById[id]);

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
        setPortadasById(prev => {
          const next = { ...prev };
          for (const [k, v] of entries) next[k] = v;
          return next;
        });
      }
    })();

    return () => { cancel = true; };
  }, [items, portadasById]);

  const applyAndSearch = () => {
    setAOperacion(operacion);
    setATipo(tipo);
    setARegion(region);
    setAComuna(comuna);
    setABarrio(barrio);

    setAMinUF(minUF);
    setAMaxUF(maxUF);

    setTrigger((v) => v + 1);
  };

  const handleClear = () => {
    setOperaciónSafe('');
    function setOperaciónSafe(v: string) { setOperacion(v); } // evita lint raro

    setOperacion(''); setTipo(''); setRegion(''); setComuna(''); setBarrio('');
    setMinUF(''); setMaxUF('');

    setAOperacion(''); setATipo(''); setARegion(''); setAComuna(''); setABarrio('');
    setAMinUF(''); setAMaxUF('');

    setSortMode(''); setSelloFilter(''); setMenuOpen(false);
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

  const filteredItems = useMemo(() => {
    const norm = (s?: string) => normalize(s || '');

    const toNum = (s: string) => {
      const t = (s || '').replace(/[^\d]/g, '');
      return t ? parseInt(t, 10) : NaN;
    };
    const minN = toNum(aMinUF);
    const maxN = toNum(aMaxUF);

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
        const cItem = normalize(
          normalize(x.comuna) === 'tunquen' ? 'Casablanca' : (x.comuna || '')
        );
        if (cItem !== norm(aComuna)) return false;
      }

      if (aBarrio) {
        const sel = norm(aBarrio);
        const bx = norm(x.barrio);
        const cx = norm(x.comuna);
        const passBarrio = (bx && bx.includes(sel)) || (!bx && cx === 'tunquen');
        if (!passBarrio) return false;
      }

      if (selloFilter) {
        if ((x.sello_tipo || '') !== selloFilter) return false;
      }

      // rango precio UF (cliente)
      const puf = x.precio_uf && x.precio_uf > 0 ? x.precio_uf : null;
      if (puf == null && (!Number.isNaN(minN) || !Number.isNaN(maxN))) return false;

      if (puf != null) {
        if (!Number.isNaN(minN) && puf < minN) return false;
        if (!Number.isNaN(maxN) && puf > maxN) return false;
      }

      return true;
    });
  }, [items, aOperacion, aTipo, aRegion, aComuna, aBarrio, aMinUF, aMaxUF, selloFilter]);

  const displayedItems = useMemo(() => {
    const getPriceUF = (p: Proyecto) => (p.precio_uf && p.precio_uf > 0 ? p.precio_uf : -Infinity);
    const arr = filteredItems.slice();
    if (sortMode === 'price-desc') arr.sort((a, b) => getPriceUF(b) - getPriceUF(a));
    else if (sortMode === 'price-asc') arr.sort((a, b) => getPriceUF(a) - getPriceUF(b));
    return arr;
  }, [filteredItems, sortMode]);

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
                <p className="text-white/85 mt-2">Activos fuera del circuito tradicional.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE 1 (sin líneas separadoras, solo cambio de color) */}
      <section className="bg-white">
        <SectionTitle title="Activos fuera del circuito tradicional" />
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pl-2 sm:pl-4">
              <div className="max-w-none text-[14px] text-black/70 leading-relaxed text-justify space-y-4">
                {/* Párrafos con el patrón que pediste */}
                <p>
                  No todas las oportunidades inmobiliarias llegan al mercado abierto. Algunas requieren criterio
                  técnico, red estratégica y capacidad de estructuración.
                </p>

                <p>
                  En esta sección presentamos activos singulares y proyectos especiales que, por su modelo de negocio,
                  oportunidad financiera o particularidad normativa, se gestionan bajo un esquema diferenciado y, en
                  muchos casos, confidencial. Aquí encontrarás alternativas que no compiten en el mercado masivo:
                  novaciones hipotecarias, oportunidades de flipping con fundamento técnico, propiedades con valor de
                  mercado bajo y activos con potencial de densificación o desarrollo. Cada oportunidad es previamente
                  analizada desde su viabilidad normativa, potencial constructivo, escenario de valorización y riesgo
                  asociado. El acceso a esta sección es limitado y su disponibilidad cambia constantemente según
                  oportunidades reales detectadas, gestionadas e identificadas por nuestro equipo.
                </p>

                <p>
                  Gesswein Properties no publica volumen. Gestiona oportunidades que requieren visión, estructura y
                  decisión.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE 2 (gris, sin líneas) */}
      <section className="bg-slate-50" onKeyDown={handleKeyDownSearch}>
        <SectionTitleWithIcon title="Búsqueda" icon={<Filter className="h-5 w-5" color={BRAND_BLUE} />} />

        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* RÁPIDA */}
            {advancedMode === 'rapida' && (
              <>
                <div className="pl-2 sm:pl-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
                  <SmartSelect options={['Venta', 'Arriendo']} value={operacion} onChange={setOperacion} placeholder="Operación" />
                  <SmartSelect
                    options={['Casa', 'Departamento', 'Bodega', 'Oficina', 'Local comercial', 'Terreno']}
                    value={tipo}
                    onChange={setTipo}
                    placeholder="Tipo de proyecto"
                  />
                  <SmartSelect
                    options={regionOptions}
                    value={region}
                    onChange={(v) => { setRegion(v); setComuna(''); setBarrio(''); }}
                    placeholder="Región"
                  />
                  <SmartSelect
                    options={comunaOptions}
                    value={comuna}
                    onChange={(v) => { setComuna(v); setBarrio(''); }}
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
                  <input
                    value={minUF}
                    onChange={(e) => setMinUF((e.target.value || '').replace(/[^\d]/g, ''))}
                    inputMode="numeric"
                    placeholder="Mín UF"
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  />
                  <input
                    value={maxUF}
                    onChange={(e) => setMaxUF((e.target.value || '').replace(/[^\d]/g, ''))}
                    inputMode="numeric"
                    placeholder="Máx UF"
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  />
                  <div className="lg:col-span-1" />
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
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.95), inset 0 0 0 3px rgba(255,255,255,.35)',
                    }}
                  >
                    Buscar
                  </button>
                </div>
              </>
            )}

            {/* AVANZADA (por ahora: misma base + precio UF, estructura igual a Propiedades) */}
            {advancedMode === 'avanzada' && (
              <>
                <div className="pl-2 sm:pl-4"><div className="h-px bg-slate-200 my-4" /></div>

                <div className="pl-2 sm:pl-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
                  <SmartSelect options={['Venta', 'Arriendo']} value={operacion} onChange={setOperacion} placeholder="Operación" />
                  <SmartSelect
                    options={['Casa', 'Departamento', 'Bodega', 'Oficina', 'Local comercial', 'Terreno']}
                    value={tipo}
                    onChange={setTipo}
                    placeholder="Tipo de proyecto"
                  />
                  <SmartSelect
                    options={regionOptions}
                    value={region}
                    onChange={(v) => { setRegion(v); setComuna(''); setBarrio(''); }}
                    placeholder="Región"
                  />
                  <SmartSelect
                    options={comunaOptions}
                    value={comuna}
                    onChange={(v) => { setComuna(v); setBarrio(''); }}
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
                  <input
                    value={minUF}
                    onChange={(e) => setMinUF((e.target.value || '').replace(/[^\d]/g, ''))}
                    inputMode="numeric"
                    placeholder="Mín UF"
                    className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500"
                  />
                  <input
                    value={maxUF}
                    onChange={(e) => setMaxUF((e.target.value || '').replace(/[^\d]/g, ''))}
                    inputMode="numeric"
                    placeholder="Máx UF"
                    className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500"
                  />
                  <div className="lg:col-span-1" />
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
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.95), inset 0 0 0 3px rgba(255,255,255,.35)',
                    }}
                  >
                    Buscar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* BLOQUE 3 (gris suave, sin líneas) */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-2 relative" ref={menuWrapRef}>
            <h2 className="text-[#0A2E57] text-[17px] tracking-[.30em] uppercase font-medium">
              Proyectos disponibles
            </h2>

            <div className="relative flex items-center gap-2">
              <button
                type="button"
                aria-label="Limpiar orden y filtros"
                onClick={() => { setSortMode(''); setSelloFilter(''); setMenuOpen(false); }}
                className="inline-flex items-center justify-center px-3 py-2 rounded-none"
                style={{ background: '#fff', border: '1px solid #000', color: '#000' }}
                title="Limpiar"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setMenuOpen((s) => !s)}
                className="inline-flex items-center justify-center px-3 py-2 rounded-none text-white"
                style={{ background: BRAND_BLUE, border: `1px solid ${BTN_GRAY_BORDER}` }}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                title="Filtrar / ordenar"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 shadow-lg z-10" role="menu">
                  <div className="px-4 pt-3 pb-1 text-[11px] tracking-[.22em] uppercase text-slate-500">
                    Orden
                  </div>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => { setSortMode('price-desc'); setMenuOpen(false); }}>
                    Precio: mayor a menor
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => { setSortMode('price-asc'); setMenuOpen(false); }}>
                    Precio: menor a mayor
                  </button>

                  <div className="h-px bg-slate-200 my-1" />

                  <div className="px-4 pt-2 pb-1 text-[11px] tracking-[.22em] uppercase text-slate-500">
                    Filtrar por sello
                  </div>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => { setSelloFilter('novacion'); setMenuOpen(false); }}>
                    Tasa de novación
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => { setSelloFilter('bajo_mercado'); setMenuOpen(false); }}>
                    Bajo mercado
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => { setSelloFilter('flipping'); setMenuOpen(false); }}>
                    Oportunidad de flipping
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => { setSelloFilter('densificacion'); setMenuOpen(false); }}>
                    Oportunidad de densificación
                  </button>

                  <div className="h-px bg-slate-200 my-1" />
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-600" onClick={() => { setSortMode(''); setSelloFilter(''); setMenuOpen(false); }}>
                    Sin orden / sin filtro
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Glosario va AQUÍ: entre el título y el grid */}
          <div className="pl-2 sm:pl-4">
            <GlosarioSellosCompacto />
          </div>

          <div className="mt-10">
            {loading ? (
              <p className="text-slate-600">Cargando proyectos…</p>
            ) : (displayedItems ?? []).length === 0 ? (
              <p className="text-slate-600">No se encontraron proyectos.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {(displayedItems ?? []).map((p) => {
                  const linkId = (p.id || p.slug || '').toString();
                  const showUF = !!(p.precio_uf && p.precio_uf > 0);

                  const portadaHidratada = p.id ? portadasById[p.id] : '';
                  const cardImage =
                    (p.portada_url && String(p.portada_url).trim()) ||
                    (p.portada_fija_url && String(p.portada_fija_url).trim()) ||
                    (portadaHidratada && String(portadaHidratada).trim()) ||
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

                        {/* 1 SOLO SELLO ARRIBA DERECHA */}
                        <SealForProyecto {...p} />
                      </div>

                      <div className="p-4 flex flex-col">
                        <h3 className="text-lg text-slate-900 line-clamp-2 min-h-[48px]">
                          {p.titulo || 'Proyecto'}
                        </h3>

                        {/* Incluye barrio para que tenga sentido buscar por barrio */}
                        <p className="mt-1 text-sm text-slate-600">
                          {[
                            p.comuna || '',
                            p.barrio ? `Barrio ${p.barrio}` : '',
                            tipoCap,
                            p.operacion ? capFirst(String(p.operacion)) : '',
                          ].filter(Boolean).join(' · ')}
                        </p>

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
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
