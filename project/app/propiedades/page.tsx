'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bed, ShowerHead, Ruler, Search, Filter } from 'lucide-react';

/* ================== Tipos + helpers ================== */
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
  // Foto genérica elegante
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2000&auto=format&fit=crop';

const fmtUF = (n?: number | null) =>
  typeof n === 'number' && n > 0
    ? `UF ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`
    : 'Consultar';

const fmtCLP = (n?: number | null) =>
  typeof n === 'number' && n > 0
    ? `$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`
    : 'Consultar';

const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');

/* ===== Regiones y comunas ===== */
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

/* ===== Barrios (ejemplos) ===== */
const BARRIOS: Record<string, string[]> = {
  'Las Condes': ['El Golf','San Damián','Estoril','Los Dominicos','Apoquindo'],
  'Vitacura': ['Santa María de Manquehue','Lo Curro','Jardín del Este'],
  'Lo Barnechea': ['La Dehesa','Los Trapenses','El Huinganal'],
  'Providencia': ['Los Leones','Pedro de Valdivia','Providencia Centro'],
  'Limache': ['Limache Viejo','Limache Nuevo','San Francisco de Limache','Lliu Lliu','Villa Queronque'],
  'Viña del Mar': ['Reñaca','Jardín del Mar','Oriente','Centro'],
  'Concón': ['Bosques de Montemar','Costa de Montemar','Concón Centro'],
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

/* Números con puntos de miles (sin decimales) */
const fmtMiles = (raw: string) => {
  const digits = raw.replace(/\D+/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(parseInt(digits, 10));
};

/* ================== Página ================== */
export default function PropiedadesPage() {
  /* Buscador superior */
  const [qTop, setQTop] = useState('');

  /* Filtros */
  const [estado, setEstado] = useState(''); // venta / arriendo
  const [tipo, setTipo] = useState('');
  const [region, setRegion] = useState<Region | ''>('');
  const [comuna, setComuna] = useState('');
  const comunasRegion = useMemo(() => (region ? COMUNAS[region] : []), [region]);

  const [barrio, setBarrio] = useState('');
  const barriosComuna = useMemo(() => (comuna && BARRIOS[comuna]) || [], [comuna]);

  const [moneda, setMoneda] = useState<'UF'|'CLP'>('UF');
  const [minValor, setMinValor] = useState('');
  const [maxValor, setMaxValor] = useState('');

  const [trigger, setTrigger] = useState(0);
  const [order, setOrder] = useState<'recientes'|'precio-asc'|'precio-desc'>('recientes');

  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const p = new URLSearchParams();

    if (qTop.trim()) p.set('q', qTop.trim());
    if (estado) p.set('operacion', estado as any);
    if (tipo) p.set('tipo', tipo);
    if (region) p.set('region', region);
    if (comuna) p.set('comuna', comuna);
    if (barrio) p.set('barrio', barrio);
    if (minValor) p.set(moneda === 'UF' ? 'minUF' : 'minCLP', minValor.replace(/\./g, ''));
    if (maxValor) p.set(moneda === 'UF' ? 'maxUF' : 'maxCLP', maxValor.replace(/\./g, ''));

    setLoading(true);
    fetch(`/api/propiedades?${p.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then(json => {
        const data: Property[] = Array.isArray(json?.data) ? json.data : [];
        setItems(data);
        if (qTop && data.length && !region && !comuna) {
          const f = data[0];
          if (f?.region) setRegion(f.region as Region);
          if (f?.comuna) setComuna(f.comuna);
        }
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const itemsOrdenados = useMemo(() => {
    const arr = [...items];
    if (order === 'precio-asc') arr.sort((a, b) => (a.precio_uf ?? 0) - (b.precio_uf ?? 0));
    else if (order === 'precio-desc') arr.sort((a, b) => (b.precio_uf ?? 0) - (a.precio_uf ?? 0));
    else arr.sort((a, b) => (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()));
    return arr;
  }, [items, order]);

  return (
    <main className="bg-white">
      {/* ===== HERO (contenido pegado abajo; se ve foto + buscador + separador) ===== */}
      <section
        className="relative bg-center bg-cover min-h-[70vh]"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          {/* Espaciador para “pegar” el contenido abajo sin tocar el logo */}
          <div className="flex flex-col h-full">
            <div className="flex-1" />
            <div className="pb-8">
              <div className="max-w-3xl">
                <h1 className="text-white text-3xl md:text-4xl">Propiedades</h1>
                <p className="text-white/85 mt-2">
                  Encuentra tu próxima inversión o tu nuevo hogar.
                </p>
              </div>

              {/* Buscador superior */}
              <div className="mt-6 max-w-2xl">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/90" />
                  <input
                    value={qTop}
                    onChange={(e)=>setQTop(e.target.value)}
                    placeholder="Buscar por calle (ej. Alameda)"
                    className="w-full rounded-md bg-white/95 backdrop-blur px-10 py-3 text-slate-900 placeholder-slate-500"
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
          </div>
        </div>
      </section>

      {/* ===== REFINAR BÚSQUEDA (inputs gris claro, todos iguales) ===== */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-slate-800 mb-3">
            <Filter className="h-5 w-5 text-[color:var(--blue)]" />
            <span className="text-lg md:text-xl uppercase" style={{ ['--blue' as any]: BRAND_BLUE }}>
              REFINAR BÚSQUEDA
            </span>
          </div>

          {/* Fila 1: 5 columnas iguales */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* Estado como input + datalist (igual estilo que el resto) */}
            <div>
              <input
                list="dl-estado"
                value={estado}
                onChange={(e)=>setEstado(e.target.value)}
                placeholder="Estado"
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
              <datalist id="dl-estado">
                <option value="Venta" />
                <option value="Arriendo" />
              </datalist>
            </div>

            <div>
              <input
                list="dl-tipos"
                value={tipo}
                onChange={(e)=>setTipo(e.target.value)}
                placeholder="Tipo de propiedad"
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
              <datalist id="dl-tipos">
                {TIPOS.map(t => <option key={t} value={t} />)}
              </datalist>
            </div>

            <div>
              <input
                list="dl-regiones"
                value={region}
                onChange={(e)=>{ setRegion(e.target.value as Region); setComuna(''); setBarrio(''); }}
                placeholder="Región"
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
              <datalist id="dl-regiones">
                {REGIONES.map(r => <option key={r} value={r} />)}
              </datalist>
            </div>

            <div>
              <input
                list="dl-comunas"
                value={comuna}
                onChange={(e)=>{ setComuna(e.target.value); setBarrio(''); }}
                placeholder={region ? 'Comuna' : 'Elige región primero'}
                disabled={!region}
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400 disabled:bg-gray-100 disabled:text-slate-400"
              />
              <datalist id="dl-comunas">
                {region && comunasRegion.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div>
              <input
                list="dl-barrios"
                value={barrio}
                onChange={(e)=>setBarrio(e.target.value)}
                placeholder={comuna ? 'Barrio' : 'Elige comuna primero'}
                disabled={!comuna || barriosComuna.length===0}
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400 disabled:bg-gray-100 disabled:text-slate-400"
              />
              <datalist id="dl-barrios">
                {comuna && barriosComuna.map(b => <option key={b} value={b} />)}
              </datalist>
            </div>
          </div>

          {/* Fila 2: mismas 5 columnas (mismo ancho por control) */}
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* Moneda como input + datalist (igual estilo) */}
            <div>
              <input
                list="dl-moneda"
                value={moneda}
                onChange={(e)=>setMoneda((e.target.value as 'UF'|'CLP') || 'UF')}
                placeholder="Moneda"
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
              <datalist id="dl-moneda">
                <option value="UF" />
                <option value="CLP" />
              </datalist>
            </div>

            <input
              value={minValor}
              onChange={(e)=>setMinValor(fmtMiles(e.target.value))}
              inputMode="numeric"
              placeholder="Mín"
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
            />

            <input
              value={maxValor}
              onChange={(e)=>setMaxValor(fmtMiles(e.target.value))}
              inputMode="numeric"
              placeholder="Máx"
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
            />

            {/* Columna vacía para mantener layout simétrico */}
            <div className="w-full" />

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
      </section>

      {/* ===== LISTADO ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl text-slate-900 uppercase">PROPIEDADES DISPONIBLES</h2>

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





