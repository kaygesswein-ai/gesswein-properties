'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bed,
  ShowerHead,
  Ruler,
  Search,
  Filter,
} from 'lucide-react';

/* ===========================================
   Tipos + helpers
=========================================== */
type Property = {
  id: string;
  titulo?: string;
  comuna?: string;
  region?: string;
  operacion?: 'venta' | 'arriendo';
  tipo?: string;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  superficie_util_m2?: number | null;
  coverImage?: string;
  createdAt?: string;
};

const BRAND_BLUE = '#0A2E57';
const HERO_IMG =
  // Foto genérica elegante (Unsplash, libre) – cámbiala cuando quieras.
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop';

const fmtUF = (n?: number | null) =>
  typeof n === 'number' && n > 0
    ? `UF ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`
    : 'Consultar';

const fmtCLP = (n?: number | null) =>
  typeof n === 'number' && n > 0
    ? `$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`
    : 'Consultar';

const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');

/* ===== Regiones (Metropolitana primero) y comunas ===== */
const REGIONES = [
  'Metropolitana de Santiago',
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  "O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes',
] as const;
type Region = typeof REGIONES[number];

const COMUNAS: Record<Region, string[]> = {
  'Metropolitana de Santiago': [
    'Las Condes','Vitacura','Lo Barnechea','Providencia','Santiago','Ñuñoa','La Reina','Huechuraba',
    'La Florida','Maipú','Puente Alto','Colina','Lampa','Talagante','Peñalolén','Macul',
  ],
  'Arica y Parinacota': ['Arica','Camarones','Putre','General Lagos'],
  Tarapacá: ['Iquique','Alto Hospicio','Pozo Almonte','Pica'],
  Antofagasta: ['Antofagasta','Calama','San Pedro de Atacama'],
  Atacama: ['Copiapó','Caldera','Vallenar'],
  Coquimbo: ['La Serena','Coquimbo','Ovalle'],
  Valparaíso: ['Viña del Mar','Valparaíso','Concón','Quilpué','Villa Alemana','Limache','Olmué'],
  "O'Higgins": ['Rancagua','Machalí','San Fernando','Santa Cruz'],
  Maule: ['Talca','Curicó','Linares'],
  'Ñuble': ['Chillán','San Carlos'],
  'Biobío': ['Concepción','San Pedro de la Paz','Talcahuano','Hualpén'],
  'La Araucanía': ['Temuco','Villarrica','Pucón'],
  'Los Ríos': ['Valdivia','Panguipulli','La Unión'],
  'Los Lagos': ['Puerto Montt','Puerto Varas','Osorno','Castro','Ancud'],
  Aysén: ['Coyhaique','Aysén'],
  Magallanes: ['Punta Arenas','Puerto Natales'],
};

/* ===== Sectores por comuna (muestra) ===== */
const SECTORES: Record<string, string[]> = {
  // RM
  'Las Condes': ['El Golf','San Damián','Estoril','Los Dominicos','Apoquindo'],
  'Vitacura': ['Santa María de Manquehue','Lo Curro','Jardín del Este'],
  'Lo Barnechea': ['La Dehesa','Los Trapenses','El Huinganal'],
  'Providencia': ['Los Leones','Pedro de Valdivia','Providencia Centro'],
  // Valparaíso
  'Limache': ['Limache Viejo','Limache Nuevo','San Francisco de Limache','Lliu Lliu','Villa Queronque'],
  'Viña del Mar': ['Reñaca','Jardín del Mar','Oriente','Centro'],
  'Concón': ['Bosques de Montemar','Costa de Montemar','Concón Centro'],
  // Los Ríos
  'Valdivia': ['Isla Teja','Torreones','Las Ánimas','Regional'],
};

/* ===== Tipos ===== */
const TIPOS = [
  'Casa',
  'Casa amoblada',
  'Casa en playa',
  'Casa de campo',
  'Departamento sin amoblar',
  'Departamento amoblado',
  'Bodega',
  'Oficina',
  'Local comercial',
  'Terreno',
  'Parcela',
] as const;

/* ===== util inputs ===== */
const fmtMiles = (raw: string) => {
  const digits = raw.replace(/\D+/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(parseInt(digits, 10));
};

/* ===========================================
   Página
=========================================== */
export default function PropiedadesPage() {
  /* ------- Buscador superior (título/calle) ------- */
  const [qTop, setQTop] = useState('');

  /* ------- Filtros ------- */
  const [estado, setEstado] = useState<'venta'|'arriendo'|''>(''); // sin "Todos"
  const [tipo, setTipo] = useState<string>('');                    // placeholder no seleccionable
  const [region, setRegion] = useState<Region | ''>('');
  const [comuna, setComuna] = useState('');
  const comunasRegion = useMemo(() => (region ? COMUNAS[region] : []), [region]);

  const [sector, setSector] = useState('');
  const sectoresComuna = useMemo(() => (comuna && SECTORES[comuna]) || [], [comuna]);

  // Moneda (UF/CLP) + rango
  const [moneda, setMoneda] = useState<'UF'|'CLP'>('UF');
  const [minValor, setMinValor] = useState('');
  const [maxValor, setMaxValor] = useState('');

  // Disparo de búsqueda (solo con botón)
  const [trigger, setTrigger] = useState(0);
  const [order, setOrder] = useState<'recientes'|'precio-asc'|'precio-desc'>('recientes');

  /* ------- Datos ------- */
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  // Buscar (se ejecuta solo cuando apretas "Buscar" o el botón del buscador superior)
  useEffect(() => {
    const controller = new AbortController();
    const p = new URLSearchParams();

    // top search
    if (qTop.trim()) p.set('q', qTop.trim());
    // filtros
    if (estado) p.set('operacion', estado);
    if (tipo) p.set('tipo', tipo);
    if (region) p.set('region', region);
    if (comuna) p.set('comuna', comuna);
    if (sector) p.set('sector', sector);
    if (minValor) p.set(moneda === 'UF' ? 'minUF' : 'minCLP', minValor.replace(/\./g, ''));
    if (maxValor) p.set(moneda === 'UF' ? 'maxUF' : 'maxCLP', maxValor.replace(/\./g, ''));

    setLoading(true);
    fetch(`/api/propiedades?${p.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then(json => {
        const data: Property[] = Array.isArray(json?.data) ? json.data : [];
        setItems(data);

        // Si el usuario buscó por texto y no fijó región/comuna, infiere desde el primer resultado.
        if (qTop && data.length && !region && !comuna) {
          const first = data[0];
          if (first?.region) setRegion(first.region as Region);
          if (first?.comuna) setComuna(first.comuna);
        }
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const itemsOrdenados = useMemo(() => {
    const arr = [...items];
    if (order === 'precio-asc') {
      arr.sort((a, b) => (a.precio_uf ?? 0) - (b.precio_uf ?? 0));
    } else if (order === 'precio-desc') {
      arr.sort((a, b) => (b.precio_uf ?? 0) - (a.precio_uf ?? 0));
    } else {
      arr.sort((a, b) =>
        (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime())
      );
    }
    return arr;
  }, [items, order]);

  return (
    <main className="bg-white">
      {/* ====== HERO con foto genérica (más alto: ~70vh) ====== */}
      <section
        className="relative bg-center bg-cover min-h-[70vh]"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-10">
          <div>
            <h1 className="text-white text-3xl md:text-4xl">Propiedades</h1>
            <p className="text-white/85 mt-2 max-w-2xl">
              Encuentra tu próxima inversión o tu nuevo hogar.
            </p>
          </div>

          {/* Buscador superior (título/calle) – separado del bloque de filtros */}
          <div className="mt-6 w-full">
            <div className="relative max-w-2xl">
              <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/80" />
              <input
                value={qTop}
                onChange={(e)=>setQTop(e.target.value)}
                placeholder="Buscar por título o calle (ej. Camino Mirasol)"
                className="w-full rounded-md bg-white/90 backdrop-blur px-10 py-3 text-slate-900 placeholder-slate-500"
              />
              <button
                onClick={()=>setTrigger(v=>v+1)}
                className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-2 text-sm text-white rounded-md"
                style={{ background: BRAND_BLUE }}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====== BLOQUE DE FILTROS (debajo del hero) ====== */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-slate-700">
              <Filter className="h-4 w-4 text-[color:var(--blue)]" />
              <span className="text-sm">Refinar búsqueda</span>
            </div>

            {/* Ordenar por */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Ordenar por:</span>
              <select
                value={order}
                onChange={(e)=>setOrder(e.target.value as any)}
                className="rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
              >
                <option value="recientes">Más recientes</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
              </select>
            </div>
          </div>

          {/* Fila 1: Estado, Tipo, Región, Comuna, Sector */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* Estado (sin “Todos” y con placeholder no seleccionable) */}
            <select
              value={estado}
              onChange={(e)=>setEstado(e.target.value as any)}
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
            >
              <option value="" disabled hidden>Estado</option>
              <option value="venta">Venta</option>
              <option value="arriendo">Arriendo</option>
            </select>

            {/* Tipo (placeholder no seleccionable) */}
            <select
              value={tipo}
              onChange={(e)=>setTipo(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
            >
              <option value="" disabled hidden>Tipo de propiedad</option>
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {/* Región */}
            <select
              value={region}
              onChange={(e)=>{ setRegion(e.target.value as Region); setComuna(''); setSector(''); }}
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
            >
              <option value="" disabled hidden>Región</option>
              {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            {/* Comuna dependiente */}
            <select
              value={comuna}
              onChange={(e)=>{ setComuna(e.target.value); setSector(''); }}
              disabled={!region}
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 disabled:bg-gray-100 disabled:text-slate-400"
            >
              <option value="" disabled hidden>{region ? 'Comuna' : 'Elige región primero'}</option>
              {comunasRegion.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Sector dependiente de comuna */}
            <select
              value={sector}
              onChange={(e)=>setSector(e.target.value)}
              disabled={!comuna || sectoresComuna.length===0}
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 disabled:bg-gray-100 disabled:text-slate-400"
            >
              <option value="" disabled hidden>{comuna ? 'Sector' : 'Elige comuna primero'}</option>
              {sectoresComuna.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Fila 2: Moneda + rango + botón Buscar */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-6 gap-3">
            {/* Moneda */}
            <div className="md:col-span-1">
              <select
                value={moneda}
                onChange={(e)=>{ setMoneda(e.target.value as any); setMinValor(''); setMaxValor(''); }}
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
              >
                <option value="UF">UF</option>
                <option value="CLP">$ CLP</option>
              </select>
            </div>

            {/* Min / Max */}
            <input
              value={minValor}
              onChange={(e)=>setMinValor(fmtMiles(e.target.value))}
              inputMode="numeric"
              placeholder="Mín"
              className="rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
            />
            <input
              value={maxValor}
              onChange={(e)=>setMaxValor(fmtMiles(e.target.value))}
              inputMode="numeric"
              placeholder="Máx"
              className="rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
            />

            {/* espacio flexible */}
            <div className="hidden md:block md:col-span-2" />

            {/* Botón Buscar (filtros) */}
            <div className="md:col-span-1 flex">
              <button
                onClick={()=>setTrigger(v=>v+1)}
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
        </div>
      </section>

      {/* ====== LISTA (4 columnas XL) ====== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <p className="text-slate-500">Cargando propiedades…</p>
        ) : itemsOrdenados.length === 0 ? (
          <p className="text-slate-500">No encontramos resultados con estos filtros.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {itemsOrdenados.map((p) => (
              <article key={p.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                <div className="aspect-[4/3] bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop'}
                    alt={p.titulo || 'Propiedad'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col">
                  <h3 className="text-lg text-slate-900 line-clamp-2 min-h-[48px]">
                    {p.titulo || 'Propiedad'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {[cap(p.comuna), cap(p.tipo), cap(p.operacion)].filter(Boolean).join(' · ')}
                  </p>

                  <div className="mt-3 grid grid-cols-3 text-center">
                    <div className="border border-slate-200 p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                        <Bed className="h-4 w-4" /> Dorm.
                      </div>
                      <div className="text-sm">{p.dormitorios ?? '—'}</div>
                    </div>
                    <div className="border border-slate-200 p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                        <ShowerHead className="h-4 w-4" /> Baños
                      </div>
                      <div className="text-sm">{p.banos ?? '—'}</div>
                    </div>
                    <div className="border border-slate-200 p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                        <Ruler className="h-4 w-4" /> m²
                      </div>
                      <div className="text-sm">{p.superficie_util_m2 ?? '—'}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-[color:var(--blue)] font-semibold space-y-0.5" style={{ ['--blue' as any]: BRAND_BLUE }}>
                      <div>{fmtUF(p.precio_uf)}</div>
                      {p.precio_clp ? <div className="text-slate-500 text-xs">{fmtCLP(p.precio_clp)}</div> : null}
                    </div>
                    <Link
                      href={`/propiedades/${p.id}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm text-white rounded-none"
                      style={{
                        background: BRAND_BLUE,
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.95), inset 0 0 0 3px rgba(255,255,255,.35)',
                      }}
                    >
                      Ver más
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}


