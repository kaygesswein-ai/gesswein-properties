'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bed,
  ShowerHead,
  Ruler,
  Search,
  Filter,
  Home,
  Building2,
  ArrowDownAZ,
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
  createdAt?: string; // para ordenar por “publicación”
};

const BRAND_BLUE = '#0A2E57';

const fmtUF = (n?: number | null) =>
  typeof n === 'number' && n > 0
    ? `UF ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`
    : 'Consultar';

const fmtCLP = (n?: number | null) =>
  typeof n === 'number' && n > 0
    ? `$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`
    : 'Consultar';

const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');

/* ===== Regiones (Metropolitana primero) y comunas (subset amplio) ===== */
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
    'Santiago','Providencia','Las Condes','Vitacura','Lo Barnechea','Ñuñoa','La Reina','Macul','Peñalolén',
    'La Florida','Puente Alto','Maipú','Huechuraba','Independencia','Recoleta','Conchalí','Renca',
    'Quilicura','Pudahuel','Cerro Navia','Lo Prado','Estación Central','Quinta Normal','San Miguel',
    'San Joaquín','La Cisterna','San Ramón','La Granja','El Bosque','Pedro Aguirre Cerda','Cerrillos',
    'San Bernardo','Buin','Paine','Calera de Tango','Colina','Lampa','Tiltil','Talagante','Peñaflor',
    'Isla de Maipo','El Monte','Padre Hurtado','Melipilla','Curacaví','María Pinto',
  ],
  'Arica y Parinacota': ['Arica','Camarones','Putre','General Lagos'],
  Tarapacá: ['Iquique','Alto Hospicio','Pozo Almonte','Pica','Huara','Camiña','Colchane'],
  Antofagasta: ['Antofagasta','Mejillones','Taltal','Sierra Gorda','Calama','San Pedro de Atacama','Tocopilla','María Elena'],
  Atacama: ['Copiapó','Caldera','Tierra Amarilla','Vallenar','Huasco','Freirina','Chañaral','Diego de Almagro'],
  Coquimbo: ['La Serena','Coquimbo','Andacollo','Vicuña','Ovalle','Monte Patria','Punitaqui','Illapel','Los Vilos','Salamanca'],
  Valparaíso: ['Valparaíso','Viña del Mar','Concón','Quilpué','Villa Alemana','Limache','Olmué','Quillota','La Calera','San Antonio','Casablanca','Quintero','Puchuncaví'],
  "O'Higgins": ['Rancagua','Machalí','Graneros','Doñihue','San Vicente','Santa Cruz','San Fernando','Pichilemu'],
  Maule: ['Talca','Maule','San Clemente','Cauquenes','Curicó','Molina','Rauco','Linares','Parral','San Javier'],
  'Ñuble': ['Chillán','Chillán Viejo','San Carlos','Coihueco','Bulnes','Quirihue'],
  'Biobío': ['Concepción','Talcahuano','Hualpén','Chiguayante','San Pedro de la Paz','Coronel','Lota','Los Ángeles','Arauco','Curanilahue'],
  'La Araucanía': ['Temuco','Padre Las Casas','Villarrica','Pucón','Angol','Victoria','Nueva Imperial'],
  'Los Ríos': ['Valdivia','Lanco','Panguipulli','Los Lagos','La Unión','Río Bueno'],
  'Los Lagos': ['Puerto Montt','Puerto Varas','Frutillar','Osorno','Castro','Ancud','Quellón'],
  Aysén: ['Coyhaique','Aysén','Cisnes','Chile Chico'],
  Magallanes: ['Punta Arenas','Puerto Natales','Porvenir','Cabo de Hornos'],
};

/* ===== Tipos (amplios, para parecerse al sitio de referencia) ===== */
const TIPOS = [
  'Todos',
  'Casa',
  'Casa poblada',
  'Casa en playa',
  'Departamento',
  'Bodega',
  'Oficina',
  'Local comercial',
  'Terreno',
  'Parcela',
  'Sitio',
  'Industrial',
  'Campo',
] as const;

/* Sectores sugeridos (libre + datalist) */
const SECTORES_SUG = [
  'El Golf','San Damián','Santa María de Manquehue','Los Trapenses','La Dehesa','El Alba',
  'Barrio El Bosque','Barrio Italia','Lastarria','Centro','Costa','Cordillera','Oriente','Poniente',
];

/* Formatting de inputs */
const fmtUFInput = (raw: string) => {
  const digits = raw.replace(/\D+/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(parseInt(digits, 10));
};
const fmtCLPInput = fmtUFInput;

/* ===========================================
   Página
=========================================== */
export default function PropiedadesPage() {
  /* ------- Filtros visibles ------- */
  const [estado, setEstado] = useState<'venta'|'arriendo'|'todos'>('todos');
  const [tipo, setTipo] = useState<typeof TIPOS[number]>('Todos');
  const [region, setRegion] = useState<Region | ''>('');
  const [comuna, setComuna] = useState('');
  const [sector, setSector] = useState('');
  const [q, setQ] = useState('');

  const [minUF, setMinUF] = useState('');
  const [maxUF, setMaxUF] = useState('');
  const [minCLP, setMinCLP] = useState('');
  const [maxCLP, setMaxCLP] = useState('');

  const comunasRegion = useMemo(() => (region ? COMUNAS[region] : []), [region]);

  /* ------- Búsqueda / orden ------- */
  const [trigger, setTrigger] = useState(0); // buscar solo al apretar “Buscar”
  const [order, setOrder] = useState<'recientes'|'precio-asc'|'precio-desc'>('recientes');

  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (estado !== 'todos') params.set('operacion', estado);
    if (tipo !== 'Todos') params.set('tipo', tipo);
    if (region) params.set('region', region);
    if (comuna) params.set('comuna', comuna);
    if (sector) params.set('sector', sector);
    if (minUF) params.set('minUF', minUF.replace(/\./g, ''));
    if (maxUF) params.set('maxUF', maxUF.replace(/\./g, ''));
    if (minCLP) params.set('minCLP', minCLP.replace(/\./g, ''));
    if (maxCLP) params.set('maxCLP', maxCLP.replace(/\./g, ''));

    setLoading(true);
    fetch(`/api/propiedades?${params.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then(json => {
        const data: Property[] = Array.isArray(json?.data) ? json.data : [];
        setItems(data);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]); // <- se ejecuta sólo al presionar “Buscar”

  const itemsOrdenados = useMemo(() => {
    const arr = [...items];
    if (order === 'precio-asc') {
      arr.sort((a, b) => (a.precio_uf ?? 0) - (b.precio_uf ?? 0));
    } else if (order === 'precio-desc') {
      arr.sort((a, b) => (b.precio_uf ?? 0) - (a.precio_uf ?? 0));
    } else {
      // recientes (si existe createdAt), sino dejamos tal cual
      arr.sort((a, b) =>
        (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime())
      );
    }
    return arr;
  }, [items, order]);

  return (
    <main className="bg-white">
      {/* ====== HERO con foto genérica (50vh) ====== */}
      <section
        className="relative bg-center bg-cover min-h-[50vh]"
        style={{ backgroundImage: "url('/hero/propiedades-generic.jpg')" }}
      >
        {/* Si la imagen no existe aún, crea /public/hero/propiedades-generic.jpg con una
           foto elegante (interior/exterior). Cambia la ruta si usas otro nombre. */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <h1 className="text-white text-3xl md:text-4xl">Propiedades</h1>
          <p className="text-white/85 mt-2 max-w-2xl">
            Encuentra tu próxima inversión o tu nuevo hogar.
          </p>
        </div>
      </section>

      {/* ====== BARRA DE FILTROS (estilo “búsqueda” de referencia) ====== */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-slate-700 mb-3">
            <Filter className="h-4 w-4 text-[color:var(--blue)]" />
            <span className="text-sm">Filtros</span>
          </div>

          {/* 1) FILA SUPERIOR: Estado, Tipo, Región, Comuna, Sector */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* Estado (Venta / Arriendo / Todos) */}
            <select
              value={estado}
              onChange={(e)=>setEstado(e.target.value as any)}
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
            >
              <option value="todos">Estado: Todos</option>
              <option value="venta">Venta</option>
              <option value="arriendo">Arriendo</option>
            </select>

            {/* Tipo (lista ampliada) */}
            <select
              value={tipo}
              onChange={(e)=>setTipo(e.target.value as any)}
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
            >
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {/* Región (datalist buscable) */}
            <div>
              <input
                list="dl-regiones"
                value={region}
                onChange={(e)=>{ setRegion(e.target.value as Region); setComuna(''); }}
                placeholder="Región"
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
              <datalist id="dl-regiones">
                {REGIONES.map(r => <option key={r} value={r} />)}
              </datalist>
            </div>

            {/* Comuna dependiente (datalist) */}
            <div>
              <input
                list="dl-comunas"
                value={comuna}
                onChange={(e)=>setComuna(e.target.value)}
                placeholder={region ? 'Comuna' : 'Elige región primero'}
                disabled={!region}
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400 disabled:bg-gray-100 disabled:text-slate-400"
              />
              <datalist id="dl-comunas">
                {region && comunasRegion.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            {/* Sector (libre + sugerencias) */}
            <div>
              <input
                list="dl-sectores"
                value={sector}
                onChange={(e)=>setSector(e.target.value)}
                placeholder="Sector (opcional)"
                className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
              <datalist id="dl-sectores">
                {SECTORES_SUG.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
          </div>

          {/* 2) FILA INFERIOR: buscador libre + UF/CLP + botón Buscar */}
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-6 gap-3">
            {/* Texto libre */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e)=>setQ(e.target.value)}
                  placeholder="Buscar por título, calle, etc."
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-9 py-2 text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            {/* UF */}
            <div className="grid grid-cols-2 gap-3">
              <input
                value={minUF}
                onChange={(e)=>setMinUF(fmtUFInput(e.target.value))}
                inputMode="numeric"
                placeholder="UF mínima"
                className="rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
              <input
                value={maxUF}
                onChange={(e)=>setMaxUF(fmtUFInput(e.target.value))}
                inputMode="numeric"
                placeholder="UF máxima"
                className="rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
            </div>

            {/* CLP */}
            <div className="grid grid-cols-2 gap-3">
              <input
                value={minCLP}
                onChange={(e)=>setMinCLP(fmtCLPInput(e.target.value))}
                inputMode="numeric"
                placeholder="$ mínima"
                className="rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
              <input
                value={maxCLP}
                onChange={(e)=>setMaxCLP(fmtCLPInput(e.target.value))}
                inputMode="numeric"
                placeholder="$ máxima"
                className="rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
            </div>

            {/* Botón Buscar */}
            <div className="flex items-stretch">
              <button
                onClick={()=>setTrigger((n)=>n+1)}
                className="w-full lg:w-auto px-5 py-2 text-sm text-white rounded-none"
                style={{
                  background: BRAND_BLUE,
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.95), inset 0 0 0 3px rgba(255,255,255,.35)',
                }}
              >
                Buscar
              </button>
            </div>

            {/* Ordenar por */}
            <div className="lg:col-span-1">
              <div className="relative">
                <ArrowDownAZ className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={order}
                  onChange={(e)=>setOrder(e.target.value as any)}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 pl-9 pr-3 py-2 text-slate-700"
                >
                  <option value="recientes">Más recientes</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                </select>
              </div>
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
                {/* Imagen */}
                <div className="aspect-[4/3] bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage || '/placeholder.jpg'}
                    alt={p.titulo || 'Propiedad'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Contenido */}
                <div className="p-4 flex flex-col">
                  <h3 className="text-lg text-slate-900 line-clamp-2 min-h-[48px]">
                    {p.titulo || 'Propiedad'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {[cap(p.comuna), cap(p.tipo), cap(p.operacion)].filter(Boolean).join(' · ')}
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


