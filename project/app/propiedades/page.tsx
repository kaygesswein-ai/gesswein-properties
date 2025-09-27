'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Bed, ShowerHead, Ruler, Search, Filter, Car, Square } from 'lucide-react';
import SmartSelect from '../../components/SmartSelect';

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
  estacionamientos?: number | null;
  coverImage?: string;
  createdAt?: string;
  destacada?: boolean;
};

const BRAND_BLUE = '#0A2E57';
const HERO_IMG =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=2000';

/* ==== Helpers ==== */
const fmtMiles = (raw: string) => {
  const digits = (raw || '').replace(/\D+/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(
    parseInt(digits, 10),
  );
};
const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfINT = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const capFirst = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

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
    return () => { cancel = true; };
  }, []);
  return uf;
}

/* ==== Regiones (UI) ==== */
/** Metropolitana primero */
const REGIONES = [
  'Metropolitana de Santiago',
  'Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo','Valparaíso',"O'Higgins",
  'Maule','Ñuble','Biobío','La Araucanía','Los Ríos','Los Lagos','Aysén','Magallanes',
] as const;

const REG_N_ARABIC: Record<string, number> = {
  'Arica y Parinacota': 15, Tarapacá: 1, Antofagasta: 2, Atacama: 3, Coquimbo: 4, Valparaíso: 5,
  "O'Higgins": 6, Maule: 7, Ñuble: 16, Biobío: 8, 'La Araucanía': 9, 'Los Ríos': 14, 'Los Lagos': 10,
  Aysén: 11, Magallanes: 12, 'Metropolitana de Santiago': 13,
};
const toRoman = (n?: number) => {
  if (!n || Number.isNaN(n)) return '';
  const m: [number, string][]= [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
  let s = '', x = n; for (const [v,r] of m) while (x>=v){s+=r;x-=v;} return s;
};
/** Mostrar “RM - …” para Metropolitana; resto con romanos */
const regionDisplay = (r: string) => {
  if (r === 'Metropolitana de Santiago') return `RM - ${r}`;
  const num = REG_N_ARABIC[r];
  const roman = toRoman(num);
  return roman ? `${roman} - ${r}` : r;
};

/* ==== Normalización y utilidades de región ==== */
const stripDiacritics = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const normalize = (s?: string) => stripDiacritics((s || '').toLowerCase())
  .replace(/regi[oó]n/g, '')
  .replace(/\bmetropolitana(?:\s+de\s+santiago)?/g, 'metropolitana')
  .replace(/\brm\b/g, 'metropolitana')
  .replace(/\bde\b|\bdel\b|\bla\b|\bel\b/g, '')
  .replace(/^\s*(?:[ivxlcdm]+)\s*-\s*/i, '')
  .replace(/\s+/g, ' ')
  .trim();

const sameRegion = (a?: string, b?: string) => {
  const na = normalize(a), nb = normalize(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
};

/* Para inferir región desde la comuna si la ficha no trae region */
const COMUNAS: Record<string, string[]> = {
  'Arica y Parinacota': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
  'Tarapacá': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica'],
  'Antofagasta': ['Antofagasta', 'Calama', 'San Pedro de Atacama'],
  'Atacama': ['Copiapó', 'Caldera', 'Vallenar'],
  'Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle'],
  'Valparaíso': ['Viña del Mar', 'Valparaíso', 'Concón', 'Quilpué', 'Villa Alemana', 'Limache', 'Olmué'],
  "O'Higgins": ['Rancagua', 'Machalí', 'San Fernando', 'Santa Cruz'],
  'Maule': ['Talca', 'Curicó', 'Linares'],
  'Ñuble': ['Chillán', 'San Carlos'],
  'Biobío': ['Concepción', 'San Pedro de la Paz', 'Talcahuano', 'Hualpén'],
  'La Araucanía': ['Temuco', 'Villarrica', 'Pucón'],
  'Los Ríos': ['Valdivia', 'Panguipulli', 'La Unión'],
  'Los Lagos': ['Puerto Montt', 'Puerto Varas', 'Osorno', 'Castro', 'Ancud'],
  'Aysén': ['Coyhaique', 'Aysén'],
  'Magallanes': ['Punta Arenas', 'Puerto Natales'],
  'Metropolitana de Santiago': [
    'Las Condes','Vitacura','Lo Barnechea','Providencia','Santiago','Ñuñoa','La Reina',
    'Huechuraba','La Florida','Maipú','Puente Alto','Colina','Lampa','Talagante','Peñalolén','Macul',
  ],
};

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

/** Devuelve la región “confiable” de una ficha (prop.region o inferida por comuna) */
function inferRegion(prop: Property): string | undefined {
  if (prop.region && normalize(prop.region)) return prop.region!;
  const c = prop.comuna ? normalize(prop.comuna) : '';
  if (!c) return undefined;
  for (const [reg, comunas] of Object.entries(COMUNAS)) {
    if (comunas.some(co => normalize(co) === c)) return reg;
  }
  return undefined;
}

export default function PropiedadesPage() {
  /* — Buscador superior — */
  const [qTop, setQTop] = useState('');

  /* — Filtros comunes — */
  const [operacion, setOperacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [regionInput, setRegionInput] = useState('');
  const [region, setRegion] = useState<string>(''); // nombre “bonito” (p.ej. “Metropolitana de Santiago”)
  const [comuna, setComuna] = useState('');
  const [barrio, setBarrio] = useState('');

  /* — UF / CLP — */
  const [moneda, setMoneda] = useState<'' | 'UF' | 'CLP$' | 'CLP'>('');
  const [minValor, setMinValor] = useState('');
  const [maxValor, setMaxValor] = useState('');

  /* — Avanzada — */
  const [advancedMode, setAdvancedMode] = useState<'rapida' | 'avanzada'>('rapida');
  const [minDorm, setMinDorm] = useState('');
  const [minBanos, setMinBanos] = useState('');
  const [minM2Const, setMinM2Const] = useState('');
  const [minM2Terreno, setMinM2Terreno] = useState('');
  const [estac, setEstac] = useState('');

  /* — Resultados — */
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const [trigger, setTrigger] = useState(0);

  /* Region: acepta “RM - …”, “X - …” o solo el nombre */
  useEffect(() => {
    const cleaned = (regionInput || '').trim();
    const m = cleaned.match(/^\s*(?:[IVXLCDM]+|RM)\s*-\s*(.+)$/i);
    const name = (m ? m[1] : cleaned) as string;
    if (name && REG_N_ARABIC[name] != null) setRegion(name);
    else setRegion('');
  }, [regionInput]);

  const ufValue = useUfValue();

  // búsqueda inicial
  useEffect(() => { setTrigger((v) => v + 1); }, []);

  /* Build params + fetch (sin caché) — SOLO cuando cambia "trigger" */
  useEffect(() => {
    const p = new URLSearchParams();

    if (qTop.trim()) p.set('q', qTop.trim());
    if (operacion) p.set('operacion', operacion);
    if (tipo) p.set('tipo', tipo);
    if (region) p.set('region', region); // volvemos a enviar al backend
    if (comuna) p.set('comuna', comuna);
    if (barrio) p.set('barrio', barrio);
    if (minDorm) p.set('minDorm', minDorm);
    if (minBanos) p.set('minBanos', minBanos);
    if (minM2Const) p.set('minM2Const', minM2Const.replace(/\./g, ''));
    if (minM2Terreno) p.set('minM2Terreno', minM2Terreno.replace(/\./g, ''));
    if (estac) p.set('minEstac', estac);

    // --- MIN/MAX con UF o CLP ---
    const toInt = (s: string) => (s ? parseInt(s.replace(/\./g, ''), 10) : NaN);
    const minN = toInt(minValor);
    const maxN = toInt(maxValor);
    if (!Number.isNaN(minN) || !Number.isNaN(maxN)) {
      const isCLP = moneda === 'CLP' || moneda === 'CLP$';
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

    let cancel = false;
    setLoading(true);
    fetch(`/api/propiedades?${p.toString()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (cancel) return;
        let arr = Array.isArray(j?.data) ? (j.data as Property[]) : [];

        // Respaldo: filtro en el cliente por región (usa inferencia por comuna y normalización)
        if (region) {
          arr = arr.filter((prop) => {
            const effectiveRegion = inferRegion(prop);
            return sameRegion(effectiveRegion, region);
          });
        }

        setItems(arr);
      })
      .catch(() => { if (!cancel) setItems([]); })
      .finally(() => { if (!cancel) setLoading(false); });

    return () => { cancel = true; };
  }, [trigger, ufValue, region]); // si cambia región, vuelve a ejecutar

  // botón LIMPIAR
  const handleClear = () => {
    setQTop('');
    setOperacion('');
    setTipo('');
    setRegionInput('');
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

  const isTerreno = (p: Property) =>
    (p.tipo || '').toLowerCase().includes('terreno') || (p.tipo || '').toLowerCase().includes('sitio');

  const isBodega = (p: Property) =>
    (p.tipo || '').toLowerCase().includes('bodega');

  const CLPfromUF = useMemo(() => (ufValue && ufValue > 0 ? ufValue : null), [ufValue]);

  return (
    <main className="bg-white">
      {/* HERO */}
      <section
        className="relative bg-cover min-h-[100svh]"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundPosition: '50% 82%' }}
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
              <div className="mt-4 max-w-2xl">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-2 top-1/2 -translate-y-1/2 text-white/90"/>
                  <input
                    value={qTop}
                    onChange={(e) => setQTop(e.target.value)}
                    placeholder="Buscar por calle"
                    className="w-full rounded-md bg-white/95 backdrop-blur pl-8 pr-24 py-3 text-slate-900 placeholder-slate-500"
                  />
                  <button
                    onClick={() => setTrigger((v) => v + 1)}
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

      {/* BÚSQUEDA */}
      <section className="bg-white border-b border-slate-200">
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
                <SmartSelect options={['Venta', 'Arriendo']} value={operacion} onChange={setOperacion} placeholder="Operación" />
                <SmartSelect options={['Casa','Departamento','Bodega','Oficina','Local comercial','Terreno']} value={tipo} onChange={setTipo} placeholder="Tipo de propiedad" />
                <SmartSelect options={REGIONES.map((r)=>regionDisplay(r))} value={regionInput} onChange={(v)=>{ setRegionInput(v); setComuna(''); setBarrio(''); }} placeholder="Región" />
                <SmartSelect options={region ? (COMUNAS[region]||[]) : []} value={comuna} onChange={(v)=>{ setComuna(v); setBarrio(''); }} placeholder="Comuna" disabled={!region} />
                <SmartSelect options={comuna && BARRIOS[comuna] ? BARRIOS[comuna] : []} value={barrio} onChange={setBarrio} placeholder="Barrio" disabled={!comuna || !BARRIOS[comuna]} />
              </div>

              <div className="pl-2 sm:pl-4 mt-3 grid grid-cols-1 lg:grid-cols-5 gap-3">
                <SmartSelect options={['UF', 'CLP$']} value={moneda} onChange={(v)=>setMoneda((v as any) || '')} placeholder="UF/CLP$" />
                <input value={minValor} onChange={(e)=>setMinValor(fmtMiles(e.target.value))} inputMode="numeric" placeholder="Mín" className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
                <input value={maxValor} onChange={(e)=>setMaxValor(fmtMiles(e.target.value))} inputMode="numeric" placeholder="Máx" className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
                <button onClick={handleClear} className="w-full px-5 py-2 text-sm rounded-none border" style={{ color: '#0f172a', borderColor: BRAND_BLUE, background: '#fff' }}>Limpiar</button>
                <button onClick={()=>setTrigger((v)=>v+1)} className="w-full px-5 py-2 text-sm text-white rounded-none" style={{ background: BRAND_BLUE, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.95), inset 0 0 0 3px rgba(255,255,255,.35)' }}>Buscar</button>
              </div>
            </>
          )}

          {/* === AVANZADA === */}
          {advancedMode === 'avanzada' && (
            <>
              <div className="pl-2 sm:pl-4"><div className="h-px bg-slate-200 my-4" /></div>

              <div className="pl-2 sm:pl-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
                <SmartSelect options={['Venta','Arriendo']} value={operacion} onChange={setOperacion} placeholder="Operación" />
                <SmartSelect options={['Casa','Departamento','Bodega','Oficina','Local comercial','Terreno']} value={tipo} onChange={setTipo} placeholder="Tipo de propiedad" />
                <SmartSelect options={REGIONES.map((r)=>regionDisplay(r))} value={regionInput} onChange={(v)=>{ setRegionInput(v); setComuna(''); setBarrio(''); }} placeholder="Región" />
                <SmartSelect options={region ? (COMUNAS[region]||[]) : []} value={comuna} onChange={(v)=>{ setComuna(v); setBarrio(''); }} placeholder="Comuna" disabled={!region} />
                <SmartSelect options={comuna && BARRIOS[comuna] ? BARRIOS[comuna] : []} value={barrio} onChange={setBarrio} placeholder="Barrio" disabled={!comuna || !BARRIOS[comuna]} />
              </div>

              <div className="pl-2 sm:pl-4 mt-3 grid grid-cols-1 lg:grid-cols-5 gap-3">
                <SmartSelect options={['UF','CLP','CLP$']} value={moneda} onChange={(v)=>setMoneda((v as any)||'')} placeholder="UF/CLP$" />
                <input value={minValor} onChange={(e)=>setMinValor(fmtMiles(e.target.value))} inputMode="numeric" placeholder="Mín" className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500" />
                <input value={maxValor} onChange={(e)=>setMaxValor(fmtMiles(e.target.value))} inputMode="numeric" placeholder="Máx" className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500" />
                <input value={minDorm} onChange={(e)=>setMinDorm((e.target.value||'').replace(/\D+/g,''))} inputMode="numeric" placeholder="Mín. dormitorios" className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500" />
                <input value={minBanos} onChange={(e)=>setMinBanos((e.target.value||'').replace(/\D+/g,''))} inputMode="numeric" placeholder="Mín. baños" className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500" />
                <input value={minM2Const} onChange={(e)=>setMinM2Const(fmtMiles(e.target.value))} inputMode="numeric" placeholder="Mín. m² construidos" className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500" />
                <input value={minM2Terreno} onChange={(e)=>setMinM2Terreno(fmtMiles(e.target.value))} inputMode="numeric" placeholder="Mín. m² terreno" className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500" />
                <input value={estac} onChange={(e)=>setEstac((e.target.value||'').replace(/\D+/g,''))} inputMode="numeric" placeholder="Estacionamientos" className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-500" />
                <button onClick={handleClear} className="w-full px-5 py-2 text-sm rounded-none border" style={{ color: '#0f172a', borderColor: BRAND_BLUE, background: '#fff' }}>Limpiar</button>
                <button onClick={()=>setTrigger((v)=>v+1)} className="w-full px-5 py-2 text-sm text-white rounded-none" style={{ background: BRAND_BLUE, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.95), inset 0 0 0 3px rgba(255,255,255,.35)' }}>Buscar</button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* LISTADO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl text-slate-900 uppercase tracking-[0.25em]">
            PROPIEDADES DISPONIBLES
          </h2>
        </div>

        {loading ? (
          <p className="text-slate-600">Cargando propiedades…</p>
        ) : (items ?? []).length === 0 ? (
          <p className="text-slate-600">No se encontraron propiedades.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(items ?? []).map((p) => {
              const showUF = !!(p.precio_uf && p.precio_uf > 0);
              const clp = (() => {
                if (p.precio_clp && p.precio_clp > 0) return p.precio_clp;
                if (showUF && CLPfromUF) return Math.round((p.precio_uf as number) * CLPfromUF);
                return null;
              })();

              const terreno = isTerreno(p);
              const bodega = isBodega(p);

              return (
                <Link
                  key={p.id}
                  href="#"
                  className="group block border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-[4/3] bg-slate-100">
                    <img
                      src={
                        p.coverImage ||
                        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop'
                      }
                      alt={p.titulo || 'Propiedad'}
                      className="w-full h-full object-cover group-hover:opacity-95 transition"
                    />
                  </div>
                  <div className="p-4 flex flex-col">
                    <h3 className="text-lg text-slate-900 line-clamp-2 min-h-[48px]">
                      {p.titulo || 'Propiedad'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {[p.comuna || '', p.tipo ? String(p.tipo) : '', p.operacion ? capFirst(String(p.operacion)) : ''].filter(Boolean).join(' · ')}
                    </p>

                    {!terreno && !bodega ? (
                      <div className="mt-3 grid grid-cols-5 text-center">
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><Bed className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{p.dormitorios ?? '—'}</div></div>
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><ShowerHead className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{p.banos ?? '—'}</div></div>
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><Car className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{p.estacionamientos ?? '—'}</div></div>
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><Ruler className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{p.superficie_util_m2 != null ? nfINT.format(p.superficie_util_m2) : '—'}</div></div>
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><Square className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{p.superficie_terreno_m2 != null ? nfINT.format(p.superficie_terreno_m2) : '—'}</div></div>
                      </div>
                    ) : terreno ? (
                      <div className="mt-3 grid grid-cols-5 text-center">
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><Bed className="h-4 w-4 text-slate-500" /></div><div className="text-sm">—</div></div>
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><ShowerHead className="h-4 w-4 text-slate-500" /></div><div className="text-sm">—</div></div>
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><Car className="h-4 w-4 text-slate-500" /></div><div className="text-sm">—</div></div>
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><Ruler className="h-4 w-4 text-slate-500" /></div><div className="text-sm">—</div></div>
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><Square className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{p.superficie_terreno_m2 != null ? nfINT.format(p.superficie_terreno_m2) : '—'}</div></div>
                      </div>
                    ) : (
                      <div className="mt-3 grid grid-cols-4 text-center">
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><Bed className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{p.dormitorios ?? '—'}</div></div>
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><ShowerHead className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{p.banos ?? '—'}</div></div>
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><Ruler className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{p.superficie_util_m2 != null ? nfINT.format(p.superficie_util_m2) : '—'}</div></div>
                        <div className="border border-slate-200 p-2"><div className="flex items-center justify-center"><Car className="h-4 w-4 text-slate-500" /></div><div className="text-sm">{p.estacionamientos ?? '—'}</div></div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1.5 text-sm rounded-none border" style={{ color: '#0f172a', borderColor: BRAND_BLUE, background: '#fff' }}>Ver más</span>
                      <div className="text-right">
                        <div className="font-semibold" style={{ color: BRAND_BLUE }}>
                          {showUF ? `UF ${nfUF.format(p.precio_uf as number)}` : 'Consultar'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {clp ? `$ ${nfCLP.format(clp)}` : ''}
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
