'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Filter,
  SlidersHorizontal,
  Trash2,
  ArrowDownCircle,
  Percent,
  Ruler,
} from 'lucide-react';
import SmartSelect from '../../components/SmartSelect';

type Proyecto = {
  id?: string;
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
  imagenes?: string[] | null;

  publicado?: boolean | null;
};

const BRAND_BLUE = '#0A2E57';
const BTN_GRAY_BORDER = '#e2e8f0';

const HERO_IMG =
  'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/Foto%20portada%20-%20Proyectos%20-%20OPTIMIZADA.jpeg';

const CARD_FALLBACK =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop';

const nfUF = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const capFirst = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const normalize = (s?: string) => (s || '').toLowerCase().trim();

function SectionTitle({ title }: { title: string }) {
  // títulos como Servicios (azul + tracking)
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pl-2 sm:pl-4">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.30em] uppercase font-medium">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}

/** Icono flipping: flecha circular continua (propio) */
function FlippingLoopIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* arco continuo + punta */}
      <path d="M20 12a8 8 0 1 1-2.35-5.65" />
      <path d="M20 4v6h-6" />
    </svg>
  );
}

/** Sello circular novación (propio, arriba derecha) */
function NovacionSeal({ tasa }: { tasa?: number | null }) {
  if (tasa == null) return null;

  const tasaTxt = `${tasa.toFixed(1).replace('.', ',')}%`;

  return (
    <div className="absolute top-3 right-3 z-10">
      <div className="relative w-[92px] h-[92px] rounded-full bg-white/95 border border-black/15 shadow-sm">
        {/* texto circular (simple, propio) */}
        <div className="absolute inset-0 grid place-items-center">
          <svg viewBox="0 0 120 120" className="w-[92px] h-[92px]">
            <defs>
              <path
                id="gp-circle"
                d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
              />
            </defs>
            <text
              fontSize="10"
              letterSpacing="2"
              fill="#0A2E57"
              style={{ textTransform: 'uppercase' }}
            >
              <textPath href="#gp-circle" startOffset="50%" textAnchor="middle">
                GESSWEIN PROPERTIES • TASA DE NOVACIÓN •
              </textPath>
            </text>
          </svg>
        </div>

        {/* centro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[18px] font-semibold text-[#0A2E57] leading-none">
            {tasaTxt}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[.22em] text-black/60">
            NOVACIÓN
          </div>
        </div>
      </div>
    </div>
  );
}

/** Glosario compacto desplegable */
function GlosarioSellos() {
  const [open, setOpen] = useState<string | null>(null);

  const items = [
    {
      key: 'bajo_mercado',
      title: 'Bajo mercado',
      icon: <ArrowDownCircle className="h-5 w-5" color={BRAND_BLUE} />,
      text:
        'Activo ofrecido por debajo de comparables relevantes por condición excepcional, urgencia o asimetría de información. No reemplaza el análisis: es una señal de alerta/valor para revisar fundamentos.',
    },
    {
      key: 'novacion',
      title: 'Tasa de Novación',
      icon: <Percent className="h-5 w-5" color={BRAND_BLUE} />,
      text:
        'Novación hipotecaria: modificación o reemplazo de la obligación crediticia asociada al inmueble, ajustando tasa, plazo o estructura. En proyectos con “tasa heredada”, se busca capturar una condición financiera más conveniente que la disponible hoy.',
    },
    {
      key: 'flipping',
      title: 'Flipping',
      icon: <FlippingLoopIcon className="h-5 w-5" />,
      text:
        'Estrategia de compra con potencial de creación de valor en el corto/mediano plazo (mejoras, regularización, reposicionamiento comercial) para vender con valorización.',
    },
    {
      key: 'densificacion',
      title: 'Densificación',
      icon: <Ruler className="h-5 w-5" color={BRAND_BLUE} />,
      text:
        'Potencial normativo y/o físico para aumentar unidades o superficie vendible: por ejemplo, subdivisión, condominio, ampliación, cabida o ajustes que permitan mayor intensidad de uso según normativa y factibilidad técnica.',
    },
  ];

  return (
    <section className="py-10 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pl-2 sm:pl-4">
          <div className="grid gap-3 md:grid-cols-2">
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
                    <span className="ml-auto text-slate-500 text-xs">
                      {isOpen ? 'Cerrar' : 'Ver'}
                    </span>
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
      </div>
    </section>
  );
}

export default function ProyectosExclusivosPage() {
  /* filtros UI (mismo patrón que Propiedades) */
  const [operacion, setOperacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [barrio, setBarrio] = useState('');

  /* aplicados */
  const [aOperacion, setAOperacion] = useState('');
  const [aTipo, setATipo] = useState('');
  const [aRegion, setARegion] = useState('');
  const [aComuna, setAComuna] = useState('');
  const [aBarrio, setABarrio] = useState('');

  const [items, setItems] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);

  /* orden (igual UX que Propiedades) */
  const [sortMode, setSortMode] = useState<'price-desc' | 'price-asc' | 'novacion' | 'flipping' | 'densificacion' | ''>('');
  const [sortOpen, setSortOpen] = useState(false);

  /* carga inicial */
  useEffect(() => { setTrigger((v) => v + 1); }, []);

  /* fetch (solo cuando cambia trigger) */
  useEffect(() => {
    const p = new URLSearchParams();
    if (aOperacion) p.set('operacion', aOperacion);
    if (aTipo) p.set('tipo', aTipo);
    if (aRegion) p.set('region', aRegion);
    if (aComuna) p.set('comuna', aComuna);
    if (aBarrio) p.set('barrio', aBarrio);

    // IMPORTANTE: filtrar publicados
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
  }, [trigger, aOperacion, aTipo, aRegion, aComuna, aBarrio]);

  const applyAndSearch = () => {
    setAOperacion(operacion);
    setATipo(tipo);
    setARegion(region);
    setAComuna(comuna);
    setABarrio(barrio);
    setTrigger((v) => v + 1);
  };

  const handleClear = () => {
    setOperacion(''); setTipo(''); setRegion(''); setComuna(''); setBarrio('');
    setAOperacion(''); setATipo(''); setARegion(''); setAComuna(''); setABarrio('');
    setSortMode(''); setSortOpen(false);
    setTrigger((v) => v + 1);
  };

  const filteredItems = useMemo(() => {
    const ok = (x: Proyecto) => {
      if (aOperacion && normalize(x.operacion) !== normalize(aOperacion)) return false;
      if (aTipo && !normalize(x.tipo).startsWith(normalize(aTipo))) return false;
      if (aRegion && normalize(x.region) !== normalize(aRegion)) return false;
      if (aComuna && normalize(x.comuna) !== normalize(aComuna)) return false;
      if (aBarrio && !normalize(x.barrio).includes(normalize(aBarrio))) return false;
      return true;
    };
    return (items || []).filter(ok);
  }, [items, aOperacion, aTipo, aRegion, aComuna, aBarrio]);

  const getPriceUF = (p: Proyecto) => (p.precio_uf && p.precio_uf > 0 ? p.precio_uf : -Infinity);

  const displayedItems = useMemo(() => {
    const arr = filteredItems.slice();

    if (sortMode === 'price-desc') arr.sort((a, b) => getPriceUF(b) - getPriceUF(a));
    if (sortMode === 'price-asc') arr.sort((a, b) => getPriceUF(a) - getPriceUF(b));

    if (sortMode === 'novacion') arr.sort((a, b) => (b.sello_tipo === 'novacion' ? 1 : 0) - (a.sello_tipo === 'novacion' ? 1 : 0));
    if (sortMode === 'flipping') arr.sort((a, b) => (b.sello_tipo === 'flipping' ? 1 : 0) - (a.sello_tipo === 'flipping' ? 1 : 0));
    if (sortMode === 'densificacion') arr.sort((a, b) => (b.sello_tipo === 'densificacion' ? 1 : 0) - (a.sello_tipo === 'densificacion' ? 1 : 0));

    return arr;
  }, [filteredItems, sortMode]);

  return (
    <main className="bg-white">
      {/* HERO — EXACTO como Propiedades */}
      <section className="relative min-h-[100svh]">
        <img
          src={HERO_IMG}
          alt="Portada"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 35%' }}
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

      {/* DEFINICIÓN (texto corto, ya unificado) */}
      <SectionTitle title="Activos fuera del circuito tradicional" />
      <section className="py-12 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 max-w-4xl text-[14px] text-black/70 leading-relaxed space-y-4">
            <p>
              No todas las oportunidades inmobiliarias llegan al mercado abierto. Algunas requieren criterio técnico,
              red estratégica y capacidad de estructuración.
            </p>
            <p>
              En esta sección agrupamos activos singulares y proyectos especiales que, por su modelo de negocio,
              oportunidad financiera o particularidad normativa, se gestionan de forma confidencial o diferenciada.
            </p>
          </div>
        </div>
      </section>

      {/* BÚSQUEDA — mismo formato que Propiedades (header con ícono y tracking) */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-slate-800 mb-4 pl-2 sm:pl-4">
            <Filter className="h-5 w-5" color={BRAND_BLUE} />
            <span className="text-lg md:text-xl uppercase tracking-[0.25em]">BÚSQUEDA</span>
          </div>

          <div className="pl-2 sm:pl-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
            <SmartSelect
              options={['Venta', 'Arriendo']}
              value={operacion}
              onChange={setOperacion}
              placeholder="Operación"
            />
            <SmartSelect
              options={['Casa', 'Departamento', 'Terreno', 'Oficina', 'Local comercial']}
              value={tipo}
              onChange={setTipo}
              placeholder="Tipo"
            />
            <SmartSelect
              options={['Metropolitana de Santiago', 'Valparaíso']}
              value={region}
              onChange={(v) => { setRegion(v); setComuna(''); setBarrio(''); }}
              placeholder="Región"
            />
            <SmartSelect
              options={
                region === 'Metropolitana de Santiago'
                  ? ['Las Condes', 'Vitacura', 'Lo Barnechea', 'Providencia', 'Santiago', 'Ñuñoa']
                  : region === 'Valparaíso'
                  ? ['Casablanca', 'Viña del Mar', 'Concón', 'Valparaíso']
                  : []
              }
              value={comuna}
              onChange={(v) => { setComuna(v); setBarrio(''); }}
              placeholder="Comuna"
              disabled={!region}
            />
            <SmartSelect
              options={[]}
              value={barrio}
              onChange={setBarrio}
              placeholder="Barrio"
            />
          </div>

          <div className="pl-2 sm:pl-4 mt-3 grid grid-cols-1 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-3" />

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
        </div>
      </section>

      {/* GLOSARIO — compacto desplegable */}
      <SectionTitle title="Glosario de sellos" />
      <GlosarioSellos />

      {/* LISTADO — mismo layout de Propiedades */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4 relative">
          <h2 className="text-xl md:text-2xl text-slate-900 uppercase tracking-[0.25em]">
            PROYECTOS DISPONIBLES
          </h2>

          {/* Acciones de orden (igual Propiedades) */}
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              aria-label="Limpiar orden"
              onClick={() => { setSortMode(''); setSortOpen(false); }}
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
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 shadow-lg z-10" role="menu">
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => { setSortMode('price-desc'); setSortOpen(false); }}>
                  Precio: mayor a menor
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => { setSortMode('price-asc'); setSortOpen(false); }}>
                  Precio: menor a mayor
                </button>
                <div className="h-px bg-slate-200 my-1" />
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => { setSortMode('novacion'); setSortOpen(false); }}>
                  Novación hipotecaria
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => { setSortMode('flipping'); setSortOpen(false); }}>
                  Oportunidad de flipping
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-slate-50" onClick={() => { setSortMode('densificacion'); setSortOpen(false); }}>
                  Oportunidad de densificación
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
            {displayedItems.map((p) => {
              const linkId = (p.id || '').toString();

              const cardImage =
                (p.portada_url && String(p.portada_url).trim()) ||
                (Array.isArray(p.imagenes) && p.imagenes[0]) ||
                CARD_FALLBACK;

              const showUF = !!(p.precio_uf && p.precio_uf > 0);

              return (
                <Link
                  key={p.id ?? Math.random().toString(36).slice(2)}
                  href={`/proyectos-exclusivos/${encodeURIComponent(linkId)}`}
                  className="group block border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <img
                      src={cardImage}
                      alt={p.titulo || 'Proyecto'}
                      className="w-full h-full object-cover group-hover:opacity-95 transition"
                    />

                    {/* sello circular solo si es novación y hay tasa */}
                    {p.sello_tipo === 'novacion' && <NovacionSeal tasa={p.tasa_novacion} />}
                  </div>

                  <div className="p-4 flex flex-col">
                    <h3 className="text-lg text-slate-900 line-clamp-2 min-h-[48px]">
                      {p.titulo || 'Proyecto'}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {[
                        p.comuna || '',
                        p.barrio ? `Barrio ${p.barrio}` : '',
                        p.operacion ? capFirst(String(p.operacion)) : '',
                      ].filter(Boolean).join(' · ')}
                    </p>

                    {/* línea de sellos pequeña */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[.18em] text-slate-700">
                      {p.sello_tipo === 'bajo_mercado' && (
                        <span className="inline-flex items-center gap-2 border border-slate-200 px-2 py-1">
                          <ArrowDownCircle className="h-4 w-4" color={BRAND_BLUE} />
                          Bajo mercado
                        </span>
                      )}
                      {p.sello_tipo === 'novacion' && (
                        <span className="inline-flex items-center gap-2 border border-slate-200 px-2 py-1">
                          <Percent className="h-4 w-4" color={BRAND_BLUE} />
                          Novación
                        </span>
                      )}
                      {p.sello_tipo === 'flipping' && (
                        <span className="inline-flex items-center gap-2 border border-slate-200 px-2 py-1">
                          <FlippingLoopIcon className="h-4 w-4" />
                          Flipping
                        </span>
                      )}
                      {p.sello_tipo === 'densificacion' && (
                        <span className="inline-flex items-center gap-2 border border-slate-200 px-2 py-1">
                          <Ruler className="h-4 w-4" color={BRAND_BLUE} />
                          Densificación
                        </span>
                      )}
                    </div>

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
      </section>
    </main>
  );
}
