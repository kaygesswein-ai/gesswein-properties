'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bed, ShowerHead, Ruler, Search, Filter, Home, Building2 } from 'lucide-react';

/* ===========================================
   Utilidades y tipos
=========================================== */
type Property = {
  id: string;
  titulo?: string;
  comuna?: string;
  region?: string;
  operacion?: 'venta' | 'arriendo';
  tipo?: 'Casa' | 'Departamento' | 'Oficina' | 'Terreno' | string;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  superficie_util_m2?: number | null;
  coverImage?: string;
};

const BRAND = {
  blue: '#0A2E57',
};

const fmtUF = (n?: number | null) =>
  typeof n === 'number' && n > 0
    ? `UF ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`
    : 'Consultar';

const capFirst = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

/* Regiones (Metropolitana primero) y comunas (subset útil) */
const REGIONES = [
  'Metropolitana de Santiago',
  'Valparaíso',
  'Los Ríos',
  'Biobío',
  'La Araucanía',
  'Ñuble',
  'Maule',
  'Coquimbo',
  'Antofagasta',
  'Atacama',
  "O'Higgins",
  'Los Lagos',
  'Aysén',
  'Magallanes',
  'Arica y Parinacota',
  'Tarapacá',
] as const;
type Region = typeof REGIONES[number];

const COMUNAS: Record<Region, string[]> = {
  'Metropolitana de Santiago': [
    'Santiago','Providencia','Las Condes','Vitacura','Lo Barnechea','Ñuñoa','La Reina',
    'Macul','Peñalolén','La Florida','Puente Alto','San Miguel','La Cisterna','Maipú',
  ],
  Valparaíso: ['Valparaíso','Viña del Mar','Concón','Quilpué','Villa Alemana','Quillota'],
  'Los Ríos': ['Valdivia','Panguipulli','La Unión','Río Bueno'],
  'Biobío': ['Concepción','San Pedro de la Paz','Talcahuano','Hualpén','Chiguayante'],
  'La Araucanía': ['Temuco','Padre Las Casas','Villarrica','Pucón'],
  'Ñuble': ['Chillán','San Carlos'],
  Maule: ['Talca','Curicó','Linares'],
  Coquimbo: ['La Serena','Coquimbo','Ovalle'],
  Antofagasta: ['Antofagasta','Calama'],
  Atacama: ['Copiapó','Caldera'],
  "O'Higgins": ['Rancagua','Machalí'],
  'Los Lagos': ['Puerto Montt','Puerto Varas','Osorno'],
  Aysén: ['Coyhaique'],
  Magallanes: ['Punta Arenas'],
  'Arica y Parinacota': ['Arica'],
  Tarapacá: ['Iquique','Alto Hospicio'],
};

/* ===========================================
   Página Propiedades (lista en 4 columnas)
=========================================== */
export default function PropiedadesPage() {
  // Filtros (look & feel inspirado en la página de referencia)
  const [texto, setTexto] = useState('');
  const [operacion, setOperacion] = useState<'venta'|'arriendo'|'todas'>('todas');
  const [tipo, setTipo] = useState<'Casa'|'Departamento'|'Oficina'|'Terreno'|'Todos'>('Todos');
  const [region, setRegion] = useState<Region | ''>('');
  const [comuna, setComuna] = useState('');
  const [minUF, setMinUF] = useState('');
  const [maxUF, setMaxUF] = useState('');
  const comunasDisponibles = useMemo(
    () => (region ? COMUNAS[region] : []),
    [region]
  );

  const formatUFInput = (raw: string) => {
    const digits = raw.replace(/\D+/g, '');
    if (!digits) return '';
    return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(parseInt(digits, 10));
  };

  // Datos
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch simétrico a /api/propiedades con filtros como querystring
  useEffect(() => {
    const controller = new AbortController();
    const q = new URLSearchParams();
    if (texto.trim()) q.set('q', texto.trim());
    if (operacion !== 'todas') q.set('operacion', operacion);
    if (tipo !== 'Todos') q.set('tipo', tipo);
    if (region) q.set('region', region);
    if (comuna) q.set('comuna', comuna);
    if (minUF) q.set('minUF', minUF.replace(/\./g, ''));
    if (maxUF) q.set('maxUF', maxUF.replace(/\./g, ''));

    setLoading(true);
    fetch(`/api/propiedades?${q.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then(json => {
        const data: Property[] = Array.isArray(json?.data) ? json.data : [];
        setItems(data);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [texto, operacion, tipo, region, comuna, minUF, maxUF]);

  return (
    <main className="bg-white">
      {/* ======= HERO LIGERO CON TÍTULO ======= */}
      <section className="bg-[url('/hero/props-blur.jpg')] bg-center bg-cover">
        <div className="bg-black/35">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-white text-3xl md:text-4xl">Propiedades</h1>
            <p className="text-white/80 mt-1">Encuentra tu próxima inversión o tu nuevo hogar.</p>
          </div>
        </div>
      </section>

      {/* ======= BARRA DE FILTROS (estilo compacto, botones alineados) ======= */}
      <section className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-slate-700 mb-3">
            <Filter className="h-4 w-4 text-[color:var(--brand-blue)]" />
            <span className="text-sm">Filtros</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Texto libre */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Buscar por título, calle, etc."
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-9 py-2 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Operación */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setOperacion('todas')}
                className={`px-3 py-2 text-sm border rounded-none ${operacion==='todas' ? 'text-white' : 'text-slate-700'} `}
                style={{ borderColor: BRAND.blue, background: operacion==='todas'? BRAND.blue : 'transparent' }}
              >Todos</button>
              <button
                onClick={() => setOperacion('venta')}
                className={`px-3 py-2 text-sm border rounded-none ${operacion==='venta' ? 'text-white' : 'text-slate-700'}`}
                style={{ borderColor: BRAND.blue, background: operacion==='venta'? BRAND.blue : 'transparent' }}
              >Venta</button>
              <button
                onClick={() => setOperacion('arriendo')}
                className={`px-3 py-2 text-sm border rounded-none ${operacion==='arriendo' ? 'text-white' : 'text-slate-700'}`}
                style={{ borderColor: BRAND.blue, background: operacion==='arriendo'? BRAND.blue : 'transparent' }}
              >Arriendo</button>
            </div>

            {/* Tipo */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setTipo('Todos')}
                className={`px-3 py-2 text-sm border rounded-none ${tipo==='Todos' ? 'text-white' : 'text-slate-700'}`}
                style={{ borderColor: BRAND.blue, background: tipo==='Todos'? BRAND.blue : 'transparent' }}
              >
                <Home className="inline h-4 w-4 mr-1" /> Todos
              </button>
              <button
                onClick={() => setTipo('Casa')}
                className={`px-3 py-2 text-sm border rounded-none ${tipo==='Casa' ? 'text-white' : 'text-slate-700'}`}
                style={{ borderColor: BRAND.blue, background: tipo==='Casa'? BRAND.blue : 'transparent' }}
              >
                Casa
              </button>
              <button
                onClick={() => setTipo('Departamento')}
                className={`px-3 py-2 text-sm border rounded-none ${tipo==='Departamento' ? 'text-white' : 'text-slate-700'}`}
                style={{ borderColor: BRAND.blue, background: tipo==='Departamento'? BRAND.blue : 'transparent' }}
              >
                <Building2 className="inline h-4 w-4 mr-1" /> Depto
              </button>
            </div>

            {/* Región + Comuna (datalist buscable) */}
            <div>
              <input
                list="dl-regiones"
                value={region}
                onChange={(e) => { setRegion(e.target.value as Region); setComuna(''); }}
                placeholder="Región"
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 placeholder-slate-400 text-slate-600"
              />
              <datalist id="dl-regiones">
                {REGIONES.map(r => <option key={r} value={r} />)}
              </datalist>
            </div>
            <div>
              <input
                list="dl-comunas"
                value={comuna}
                onChange={(e) => setComuna(e.target.value)}
                placeholder={region ? 'Comuna' : 'Elige región primero'}
                disabled={!region}
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 placeholder-slate-400 text-slate-600 disabled:bg-gray-100 disabled:text-slate-400"
              />
              <datalist id="dl-comunas">
                {region && comunasDisponibles.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            {/* Precio UF (accounting miles) */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              <input
                value={minUF}
                onChange={(e)=>setMinUF(formatUFInput(e.target.value))}
                placeholder="UF mínima"
                inputMode="numeric"
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 placeholder-slate-400 text-slate-700"
              />
              <input
                value={maxUF}
                onChange={(e)=>setMaxUF(formatUFInput(e.target.value))}
                placeholder="UF máxima"
                inputMode="numeric"
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 placeholder-slate-400 text-slate-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======= LISTA 4 COLUMNAS ======= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <p className="text-slate-500">Cargando propiedades…</p>
        ) : items.length === 0 ? (
          <p className="text-slate-500">No encontramos resultados con estos filtros.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((p) => (
              <article key={p.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                {/* Imagen */}
                <div className="aspect-[4/3] bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage || '/placeholder.jpg'}
                    alt={p.titulo || 'Propiedad'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  {/* Título */}
                  <h3 className="text-lg text-slate-900 line-clamp-2">
                    {p.titulo || 'Propiedad'}
                  </h3>
                  {/* Sublinea */}
                  <p className="mt-1 text-sm text-slate-600">
                    {[capFirst(p.comuna), capFirst(p.tipo), capFirst(p.operacion)].filter(Boolean).join(' · ')}
                  </p>

                  {/* Specs */}
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

                  {/* Precio + CTA */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-[color:var(--brand-blue)] font-semibold" style={{ ['--brand-blue' as any]: BRAND.blue }}>
                      {fmtUF(p.precio_uf)}
                    </div>
                    <Link
                      href={`/propiedades/${p.id}`}
                      className="inline-flex items-center px-3 py-1.5 text-sm text-white rounded-none"
                      style={{
                        background: BRAND.blue,
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.35)',
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

