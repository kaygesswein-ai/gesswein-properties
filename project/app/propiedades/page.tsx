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
  superficie_terreno_m2?: number | null;
  coverImage?: string;
  createdAt?: string;
  estilo?: string | null;
};

const BRAND_BLUE = '#0A2E57';
const HERO_IMG =
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2000&auto=format&fit=crop';

const fmtUF = (n?: number | null) =>
  typeof n === 'number' && n > 0
    ? `UF ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`
    : 'Consultar';

const fmtCLP = (n?: number | null) =>
  typeof n === 'number' && n > 0
    ? `$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`
    : '';

const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');

/* ===== Regiones con numeración romana ===== */
const REGIONES = [
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
  'Metropolitana de Santiago',
] as const;
type Region = typeof REGIONES[number];

const REG_N_ARABIC: Record<Region, number> = {
  'Arica y Parinacota': 1,
  Tarapacá: 2,
  Antofagasta: 3,
  Atacama: 4,
  Coquimbo: 5,
  Valparaíso: 6,
  "O'Higgins": 7,
  Maule: 8,
  'Ñuble': 16,
  'Biobío': 12,
  'La Araucanía': 9,
  'Los Ríos': 14,
  'Los Lagos': 10,
  Aysén: 11,
  Magallanes: 15,
  'Metropolitana de Santiago': 13,
};

const toRoman = (n: number) => {
  const m: [number, string][] = [
    [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
    [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
    [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I'],
  ];
  let s = '';
  let x = n;
  for (const [v, r] of m) { while (x >= v) { s += r; x -= v; } }
  return s;
};
const regionDisplay = (r: Region) => `${toRoman(REG_N_ARABIC[r])} - ${r}`;

/* ===== Comunas por región (compacto) ===== */
const COMUNAS: Record<Region, string[]> = {
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
  'Metropolitana de Santiago': [
    'Las Condes','Vitacura','Lo Barnechea','Providencia','Santiago','Ñuñoa','La Reina','Huechuraba',
    'La Florida','Maipú','Puente Alto','Colina','Lampa','Talagante','Peñalolén','Macul'
  ],
};

/* ===== Barrios (semilla ampliable, RM) ===== */
const BARRIOS: Record<string, string[]> = {
  'Las Condes': ['El Golf','Nueva Las Condes','San Damián','Estoril','Los Dominicos','Cantagallo','Apoquindo'],
  'Vitacura': ['Santa María de Manquehue','Lo Curro','Jardín del Este','Vitacura Centro','Parque Bicentenario'],
  'Lo Barnechea': ['La Dehesa','Los Trapenses','El Huinganal','Valle La Dehesa'],
  'Providencia': ['Los Leones','Pedro de Valdivia','Providencia Centro','Bellavista'],
  'Ñuñoa': ['Plaza Ñuñoa','Villa Frei','Irarrazabal','Suárez Mujica'],
  'Santiago': ['Centro','Lastarria','Parque Almagro','Barrio Brasil','Yungay'],
  'La Reina': ['La Reina Alta','Nueva La Reina','La Reina Centro'],
  'Huechuraba': ['Ciudad Empresarial','Pedro Fontova'],
  'La Florida': ['Trinidad','Walker Martínez','Bellavista','Gerónimo de Alderete'],
  'Maipú': ['Ciudad Satélite','El Abrazo','Maipú Centro'],
  'Puente Alto': ['Eyzaguirre','Malloco Colorado','Balmaceda'],
  'Colina': ['Chicureo Oriente','Chicureo Poniente','Piedra Roja','Las Brisas','Santa Elena'],
  'Peñalolén': ['Los Presidentes','San Luis','Altos de Peñalolén'],
  'Macul': ['Macul Centro','Emilio Rojas','Los Plátanos'],
  'Lampa': ['Valle Grande','Chicauma'],
  'Talagante': ['Talagante Centro','Isla de Maipo Norte'],
  'Limache': ['Limache Viejo','Limache Nuevo','San Francisco','Lliu Lliu'],
  'Viña del Mar': ['Reñaca','Jardín del Mar','Oriente','Centro'],
  'Concón': ['Bosques de Montemar','Costa de Montemar','Concón Centro'],
  'Valdivia': ['Isla Teja','Torreones','Las Ánimas','Regional'],
};

/* ===== Tipos y estilos ===== */
const TIPOS = [
  'Casa',
  'Departamento',
  'Bodega',
  'Oficina',
  'Local comercial',
  'Terreno',
] as const;

const ESTILOS = [
  'Mediterráneo','Colonial','Barroco','Neoclásico','Moderno','Contemporáneo',
  'Rústico','Minimalista','Industrial',
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

  /* Filtros base */
  const [operacion, setOperacion] = useState('');     // venta / arriendo
  const [tipo, setTipo] = useState('');
  const [regionInput, setRegionInput] = useState(''); // con romano (XIII - ...)
  const [region, setRegion] = useState<Region | ''>('');
  const [comuna, setComuna] = useState('');
  const comunasRegion = useMemo(() => (region ? COMUNAS[region] : []), [region]);

  const [barrio, setBarrio] = useState('');
  const barriosComuna = useMemo(() => (comuna && BARRIOS[comuna]) || [], [comuna]);

  const [moneda, setMoneda] = useState<'UF'|'CLP$'>('UF');
  const [minValor, setMinValor] = useState('');
  const [maxValor, setMaxValor] = useState('');

  const [advancedMode, setAdvancedMode] = useState<'rapida'|'avanzada'>('rapida');
  const [minDorm, setMinDorm] = useState('');
  const [minBanos, setMinBanos] = useState('');
  const [minM2Const, setMinM2Const] = useState('');
  const [minM2Terreno, setMinM2Terreno] = useState('');
  const [estilo, setEstilo] = useState('');

  const [trigger, setTrigger] = useState(0);
  const [order, setOrder] = useState<'recientes'|'precio-asc'|'precio-desc'>('recientes');

  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  /* Parseo región desde input "XIII - Nombre" */
  useEffect(() => {
    const m = regionInput.match(/^\s*[IVXLCDM]+\s*-\s*(.+)$/i);
    const name = (m ? m[1] : regionInput) as Region;
    if (name && (REG_N_ARABIC as any)[name]) {
      setRegion(name);
    } else {
      setRegion('');
    }
  }, [regionInput]);

  useEffect(() => {
    const controller = new AbortController();
    const p = new URLSearchParams();

    if (qTop.trim()) p.set('q', qTop.trim());
    if (operacion) p.set('operacion', operacion as any);
    if (tipo) p.set('tipo', tipo);
    if (region) p.set('region', region);
    if (comuna) p.set('comuna', comuna);
    if (barrio) p.set('barrio', barrio);
    if (minValor) p.set(moneda === 'UF' ? 'minUF' : 'minCLP', minValor.replace(/\./g, ''));
    if (maxValor) p.set(moneda === 'UF' ? 'maxUF' : 'maxCLP', maxValor.replace(/\./g, ''));

    if (advancedMode === 'avanzada') {
      if (minDorm) p.set('minDorm', minDorm);
      if (minBanos) p.set('minBanos', minBanos);
      if (minM2Const) p.set('minM2Const', minM2Const.replace(/\./g, ''));
      if (minM2Terreno) p.set('minM2Terreno', minM2Terreno.replace(/\./g, ''));
      if (estilo) p.set('estilo', estilo);
    }

    setLoading(true);
    fetch(`/api/propiedades?${p.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then(json => {
        const data: Property[] = Array.isArray(json?.data) ? json.data : [];
        setItems(data);
        if (qTop && data.length && !region && !comuna) {
          const f = data[0];
          if (f?.region && (REG_N_ARABIC as any)[f.region]) {
            setRegionInput(regionDisplay(f.region as Region));
          }
          if (f?.comuna) setComuna(f.comuna);
        }
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, advancedMode]);

  const itemsOrdenados = useMemo(() => {
    const arr = [...items];
    if (order === 'precio-asc') arr.sort((a, b) => (a.precio_uf ?? 0) - (b.precio_uf ?? 0));
    else if (order === 'precio-desc') arr.sort((a, b) => (b.precio_uf ?? 0) - (a.precio_uf ?? 0));
    else arr.sort((a, b) => (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime()));
    return arr;
  }, [items, order]);

  return (
    <main className="bg-white">
      {/* ===== HERO ===== */}
      <section
        className="relative bg-cover min-h-[72vh]"
        style={{
          backgroundImage: `url(${HERO_IMG})`,
          /* Invertido: mostramos más “arriba” de la foto (menos sofá) */
          backgroundPosition: '50% 82%',
        }}
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

              {/* Buscador superior */}
              <div className="mt-4 max-w-2xl">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/90" />
                  <input
                    value={qTop}
                    onChange={(e)=>setQTop(e.target.value)}
                    placeholder="Buscar por calle (ej. Alameda 13800)"
                    className="w-full rounded-md bg-white/95 backdrop-blur px-10 py-3 text-slate-900 placeholder-slate-500"
                  />
                  <button
                    onClick={()=>setTrigger(v=>v+1)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-2 text-sm text-white rounded-none"
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

      {/* ===== FILTROS ===== */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-slate-800 mb-4 pl-2 sm:pl-4">
            <Filter className="h-5 w-5" color={BRAND_BLUE} />
            <span className="text-lg md:text-xl uppercase tracking-[0.25em]">FILTROS</span>
          </div>

          {/* Tabs: rápida / avanzada */}
          <div className="pl-2 sm:pl-4 mb-4 flex gap-2">
            <button
              type="button"
              onClick={()=>setAdvancedMode('rapida')}
              className={`px-3 py-2 text-sm rounded-none border ${
                advancedMode==='rapida'
                  ? 'bg-gray-200 border-gray-300 text-slate-900'
                  : 'bg-gray-50 border-gray-300 text-slate-700'
              }`}
            >
              Búsqueda rápida
            </button>
            <button
              type="button"
              onClick={()=>setAdvancedMode('avanzada')}
              className={`px-3 py-2 text-sm rounded-none border ${
                advancedMode==='avanzada'
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
              {/* Fila 1: 5 columnas iguales */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                {/* Operación */}
                <div>
                  <input
                    list="dl-operacion"
                    value={operacion}
                    onChange={(e)=>setOperacion(e.target.value)}
                    placeholder="Operación"
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  />
                  <datalist id="dl-operacion">
                    <option value="Venta" />
                    <option value="Arriendo" />
                  </datalist>
                </div>

                {/* Tipo */}
                <div>
                  <input
                    list="dl-tipos"
                    value={tipo}
                    onChange={(e)=>setTipo(e.target.value)}
                    placeholder="Tipo de propiedad"
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  />
                  <datalist id="dl-tipos">
                    {['Casa','Departamento','Bodega','Oficina','Local comercial','Terreno'].map(t => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>

                {/* Región con romano */}
                <div>
                  <input
                    list="dl-regiones"
                    value={regionInput}
                    onChange={(e)=>{ setRegionInput(e.target.value); setComuna(''); setBarrio(''); }}
                    placeholder="Región"
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  />
                  <datalist id="dl-regiones">
                    {REGIONES.map(r => <option key={r} value={regionDisplay(r)} />)}
                  </datalist>
                </div>

                {/* Comuna */}
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
                    {region && COMUNAS[region].map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>

                {/* Barrio */}
                <div>
                  <input
                    list="dl-barrios"
                    value={barrio}
                    onChange={(e)=>setBarrio(e.target.value)}
                    placeholder={comuna ? 'Barrio' : 'Elige comuna primero'}
                    disabled={!comuna || !BARRIOS[comuna]}
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400 disabled:bg-gray-100 disabled:text-slate-400"
                  />
                  <datalist id="dl-barrios">
                    {comuna && (BARRIOS[comuna] || []).map(b => <option key={b} value={b} />)}
                  </datalist>
                </div>
              </div>

              {/* Fila 2: mismas 5 columnas → alineado perfecto */}
              <div className="mt-3 grid grid-cols-1 lg:grid-cols-5 gap-3">
                {/* Moneda como input + datalist (mismo look) */}
                <div>
                  <input
                    list="dl-moneda"
                    value={moneda}
                    onChange={(e)=>setMoneda((e.target.value as 'UF'|'CLP$') || 'UF')}
                    placeholder="UF"
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  />
                  <datalist id="dl-moneda">
                    <option value="UF" />
                    <option value="CLP$" />
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

                {/* Botón buscar */}
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

                {/* Espaciador */}
                <div className="hidden lg:block" />
              </div>
            </>
          )}

          {/* AVANZADA */}
          {advancedMode === 'avanzada' && (
            <>
              <div className="pl-2 sm:pl-4">
                <div className="h-px bg-slate-200 my-4" />
              </div>

              {/* Copiamos base */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                <div>
                  <input list="dl-operacion" value={operacion} onChange={(e)=>setOperacion(e.target.value)}
                    placeholder="Operación"
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
                </div>
                <div>
                  <input list="dl-tipos" value={tipo} onChange={(e)=>setTipo(e.target.value)}
                    placeholder="Tipo de propiedad"
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
                </div>
                <div>
                  <input list="dl-regiones" value={regionInput} onChange={(e)=>{ setRegionInput(e.target.value); setComuna(''); setBarrio(''); }}
                    placeholder="Región"
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
                </div>
                <div>
                  <input list="dl-comunas" value={comuna} onChange={(e)=>{ setComuna(e.target.value); setBarrio(''); }}
                    placeholder={region ? 'Comuna' : 'Elige región primero'}
                    disabled={!region}
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400 disabled:bg-gray-100 disabled:text-slate-400" />
                </div>
                <div>
                  <input list="dl-barrios" value={barrio} onChange={(e)=>setBarrio(e.target.value)}
                    placeholder={comuna ? 'Barrio' : 'Elige comuna primero'}
                    disabled={!comuna || !BARRIOS[comuna]}
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400 disabled:bg-gray-100 disabled:text-slate-400" />
                </div>
              </div>

              {/* Avanzado: métricas */}
              <div className="mt-3 grid grid-cols-1 lg:grid-cols-5 gap-3">
                <div>
                  <input list="dl-moneda" value={moneda} onChange={(e)=>setMoneda((e.target.value as 'UF'|'CLP$') || 'UF')}
                    placeholder="UF"
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
                </div>
                <input value={minValor} onChange={(e)=>setMinValor(fmtMiles(e.target.value))}
                  inputMode="numeric" placeholder="Mín"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
                <input value={maxValor} onChange={(e)=>setMaxValor(fmtMiles(e.target.value))}
                  inputMode="numeric" placeholder="Máx"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
                <input value={minDorm} onChange={(e)=>setMinDorm(e.target.value.replace(/\D+/g,''))}
                  inputMode="numeric" placeholder="Mín. dormitorios"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
                <input value={minBanos} onChange={(e)=>setMinBanos(e.target.value.replace(/\D+/g,''))}
                  inputMode="numeric" placeholder="Mín. baños"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
              </div>

              <div className="mt-3 grid grid-cols-1 lg:grid-cols-5 gap-3">
                <input value={minM2Const} onChange={(e)=>setMinM2Const(fmtMiles(e.target.value))}
                  inputMode="numeric" placeholder="Mín. m² construidos"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
                <input value={minM2Terreno} onChange={(e)=>setMinM2Terreno(fmtMiles(e.target.value))}
                  inputMode="numeric" placeholder="Mín. m² terreno"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
                <div>
                  <input list="dl-estilos" value={estilo} onChange={(e)=>setEstilo(e.target.value)}
                    placeholder="Estilo (opcional)"
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
                  <datalist id="dl-estilos">
                    {ESTILOS.map(es => <option key={es} value={es} />)}
                  </datalist>
                </div>
                <div className="hidden lg:block" />
                <div className="flex lg:justify-end">
                  <button
                    onClick={()=>setTrigger(v=>v+1)}
                    className="w-full lg:w-auto px-5 py-2 text-sm text-white rounded-none"
                    style={{
                      background: BRAND_BLUE,
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.95), inset 0 0 0 3px rgba(255,255,255,.35)',
                    }}
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== LISTADO ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl text-slate-900 uppercase tracking-[0.25em]">
            PROPIEDADES DISPONIBLES
          </h2>

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
              <Link
                key={p.id}
                href={`/propiedades/${p.id}`}
                className="group block border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="aspect-[4/3] bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.coverImage || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop'}
                    alt={p.titulo || 'Propiedad'}
                    className="w-full h-full object-cover group-hover:opacity-95 transition"
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

                  {/* Clic en toda la tarjeta; Ver más a la IZQUIERDA, precio a la derecha */}
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className="inline-flex items-center px-3 py-1.5 text-sm text-white rounded-none"
                      style={{
                        background: BRAND_BLUE,
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.95), inset 0 0 0 3px rgba(255,255,255,.35)',
                      }}
                    >
                      Ver más
                    </span>

                    <div className="text-right font-semibold text-[color:var(--blue)]" style={{ ['--blue' as any]: BRAND_BLUE }}>
                      <div>{fmtUF(p.precio_uf)}</div>
                      {p.precio_clp ? <div className="text-slate-500 text-xs">{fmtCLP(p.precio_clp)}</div> : null}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}










