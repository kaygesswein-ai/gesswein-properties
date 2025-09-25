'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

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
};

const BRAND_BLUE = '#0A2E57';
const HERO_IMG =
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2000&auto=format&fit=crop';

/* ===== Helpers ===== */
const fmtMiles = (raw: string) => {
  const digits = raw.replace(/\D+/g, '');
  if (!digits) return '';
  return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(
    parseInt(digits, 10),
  );
};

const nfUF = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

/* ===== UF del día desde /api/uf ===== */
function useUfValue() {
  const [uf, setUf] = useState<number | null>(null);
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await fetch('/api/uf', { cache: 'no-store' });
        const j = await r.json().catch(() => ({}));
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

/* ===== Mapa Regiones/Comunas ===== */
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
type Region = (typeof REGIONES)[number];

/* Números oficiales para romanos (Metropolitana = 13) */
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
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let s = '';
  let x = n;
  for (const [v, r] of m) while (x >= v) { s += r; x -= v; }
  return s;
};
const regionDisplay = (r: Region) => `${toRoman(REG_N_ARABIC[r])} - ${r}`;

const COMUNAS: Record<Region, string[]> = {
  'Arica y Parinacota': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
  Tarapacá: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica'],
  Antofagasta: ['Antofagasta', 'Calama', 'San Pedro de Atacama'],
  Atacama: ['Copiapó', 'Caldera', 'Vallenar'],
  Coquimbo: ['La Serena', 'Coquimbo', 'Ovalle'],
  Valparaíso: ['Viña del Mar', 'Valparaíso', 'Concón', 'Quilpué', 'Villa Alemana', 'Limache', 'Olmué'],
  "O'Higgins": ['Rancagua', 'Machalí', 'San Fernando', 'Santa Cruz'],
  Maule: ['Talca', 'Curicó', 'Linares'],
  'Ñuble': ['Chillán', 'San Carlos'],
  'Biobío': ['Concepción', 'San Pedro de la Paz', 'Talcahuano', 'Hualpén'],
  'La Araucanía': ['Temuco', 'Villarrica', 'Pucón'],
  'Los Ríos': ['Valdivia', 'Panguipulli', 'La Unión'],
  'Los Lagos': ['Puerto Montt', 'Puerto Varas', 'Osorno', 'Castro', 'Ancud'],
  Aysén: ['Coyhaique', 'Aysén'],
  Magallanes: ['Punta Arenas', 'Puerto Natales'],
  'Metropolitana de Santiago': [
    'Las Condes', 'Vitacura', 'Lo Barnechea', 'Providencia', 'Santiago', 'Ñuñoa', 'La Reina', 'Huechuraba',
    'La Florida', 'Maipú', 'Puente Alto', 'Colina', 'Lampa', 'Talagante', 'Peñalolén', 'Macul',
  ],
};

const BARRIOS: Record<string, string[]> = {
  'Las Condes': ['El Golf', 'Nueva Las Condes', 'San Damián', 'Estoril', 'Los Dominicos', 'Cantagallo', 'Apoquindo'],
  Vitacura: ['Santa María de Manquehue', 'Lo Curro', 'Jardín del Este', 'Vitacura Centro', 'Parque Bicentenario'],
  'Lo Barnechea': ['La Dehesa', 'Los Trapenses', 'El Huinganal', 'Valle La Dehesa'],
  Providencia: ['Los Leones', 'Pedro de Valdivia', 'Providencia Centro', 'Bellavista'],
  'Ñuñoa': ['Plaza Ñuñoa', 'Villa Frei', 'Irarrazabal', 'Suárez Mujica'],
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
  Limache: ['Limache Viejo', 'Limache Nuevo', 'San Francisco', 'Lliu Lliu'],
  'Viña del Mar': ['Reñaca', 'Jardín del Mar', 'Oriente', 'Centro'],
  Concón: ['Bosques de Montemar', 'Costa de Montemar', 'Concón Centro'],
  Valdivia: ['Isla Teja', 'Torreones', 'Las Ánimas', 'Regional'],
};

export default function PropiedadesPage() {
  /* — Buscador superior — */
  const [qTop, setQTop] = useState('');

  /* — Filtros — */
  const [operacion, setOperacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [regionInput, setRegionInput] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [barrio, setBarrio] = useState('');

  /* — Moneda — */
  const [moneda, setMoneda] = useState<'UF' | '$CLP'>('UF');
  const [minValor, setMinValor] = useState('');
  const [maxValor, setMaxValor] = useState('');

  /* — Avanzada — */
  const [advancedMode, setAdvancedMode] = useState<'rapida' | 'avanzada'>('rapida');
  const [minDorm, setMinDorm] = useState('');
  const [minBanos, setMinBanos] = useState('');
  const [minM2Const, setMinM2Const] = useState('');
  const [minM2Terreno, setMinM2Terreno] = useState('');
  const [estac, setEstac] = useState('');

  const [trigger, setTrigger] = useState(0);

  /* Region: de “X - Nombre” a “Nombre” */
  useEffect(() => {
    const m = regionInput.match(/^\s*[IVXLCDM]+\s*-\s*(.+)$/i);
    const name = (m ? m[1] : regionInput) as Region | string;
    if (name && (REGIONES as readonly string[]).includes(name)) setRegion(name);
    else setRegion('');
  }, [regionInput]);

  /* Build params y fetch (solo con lo rellenado) */
  useEffect(() => {
    const p = new URLSearchParams();
    if (qTop.trim()) p.set('q', qTop.trim());
    if (operacion) p.set('operacion', operacion);
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
      if (estac) p.set('estacionamientos', estac);
    }
    // Solo disparamos el fetch (tu backend ya filtra con params)
    fetch(`/api/propiedades?${p.toString()}`).catch(() => {});
  }, [
    trigger,
    advancedMode,
    qTop,
    operacion,
    tipo,
    region,
    comuna,
    barrio,
    minValor,
    maxValor,
    moneda,
    minDorm,
    minBanos,
    minM2Const,
    minM2Terreno,
    estac,
  ]);

  const tieneBarrios = !!BARRIOS[comuna];
  const ufValue = useUfValue();

  return (
    <main className="bg-white">
      {/* ===== Hero con buscador por calle ===== */}
      <section
        className="relative w-full bg-center bg-cover"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.35em] text-white">
            PROPIEDADES
          </h1>
          <p className="mt-2 text-white/90">
            Encuentra tu próxima inversión o tu nuevo hogar.
          </p>

          <div className="mt-6 relative">
            <input
              value={qTop}
              onChange={(e) => setQTop(e.target.value)}
              placeholder=""                 {/* ← sin ejemplo */}
              className="w-full rounded-md bg-white/95 backdrop-blur px-3 py-3 text-slate-900 placeholder-slate-500" /* ← texto a la izquierda */
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
      </section>

      {/* ===== BÚSQUEDA ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-semibold mb-4">BÚSQUEDA</h2>

        {/* modo */}
        <div className="flex gap-3 mb-6">
          <button
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
            <div className="grid gap-4 md:grid-cols-2">
              {/* Operación (escribible + seleccionable) */}
              <div>
                <input
                  list="operacion-list"
                  value={operacion}
                  onChange={(e) => setOperacion(e.target.value)}
                  placeholder="Operación"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                />
                <datalist id="operacion-list">
                  <option value="venta" />
                  <option value="arriendo" />
                </datalist>
              </div>

              {/* Tipo (escribible + seleccionable) */}
              <div>
                <input
                  list="tipo-list"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  placeholder="Tipo de propiedad"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                />
                <datalist id="tipo-list">
                  {['Casa', 'Departamento', 'Bodega', 'Oficina', 'Local comercial', 'Terreno'].map(
                    (t) => (
                      <option key={t} value={t} />
                    ),
                  )}
                </datalist>
              </div>

              {/* Región (formato romano - nombre) */}
              <div>
                <input
                  list="regiones-list"
                  value={regionInput}
                  onChange={(e) => {
                    setRegionInput(e.target.value);
                    setComuna('');
                    setBarrio('');
                  }}
                  placeholder="Región"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                />
                <datalist id="regiones-list">
                  {REGIONES.map((r) => (
                    <option key={r} value={regionDisplay(r)} />
                  ))}
                </datalist>
              </div>

              {/* Comuna */}
              <div>
                <input
                  list="comunas-list"
                  value={comuna}
                  onChange={(e) => setComuna(e.target.value)}
                  placeholder="Comuna"
                  disabled={!region}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400 disabled:bg-gray-100 disabled:text-slate-400"
                />
                <datalist id="comunas-list">
                  {region &&
                    (COMUNAS[region as Region] || []).map((c) => (
                      <option key={c} value={c} />
                    ))}
                </datalist>
              </div>

              {/* Barrio (si aplica) */}
              <div>
                <input
                  list="barrios-list"
                  value={barrio}
                  onChange={(e) => setBarrio(e.target.value)}
                  placeholder="Barrio"
                  disabled={!comuna || !BARRIOS[comuna]}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400 disabled:bg-gray-100 disabled:text-slate-400"
                />
                <datalist id="barrios-list">
                  {comuna &&
                    (BARRIOS[comuna] || []).map((b) => <option key={b} value={b} />)}
                </datalist>
              </div>

              {/* Moneda + rangos */}
              <div className="grid grid-cols-3 gap-3 md:col-span-2">
                <div>
                  <input
                    list="moneda-list"
                    value={moneda}
                    onChange={(e) => setMoneda(e.target.value === '$CLP' ? '$CLP' : 'UF')}
                    placeholder="UF"
                    className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  />
                  <datalist id="moneda-list">
                    <option value="UF" />
                    <option value="$CLP" />
                  </datalist>
                </div>
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
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setTrigger((v) => v + 1)}
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

        {/* === AVANZADA === (mismo criterio, campos en gris notorio) */}
        {advancedMode === 'avanzada' && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {/* compartidos */}
              <div className="grid grid-cols-3 gap-3 md:col-span-2">
                <div>
                  <input
                    list="moneda-list"
                    value={moneda}
                    onChange={(e) => setMoneda(e.target.value === '$CLP' ? '$CLP' : 'UF')}
                    placeholder="UF"
                    className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-400"
                  />
                </div>
                <input
                  value={minValor}
                  onChange={(e) => setMinValor(fmtMiles(e.target.value))}
                  inputMode="numeric"
                  placeholder="Mín"
                  className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-400"
                />
                <input
                  value={maxValor}
                  onChange={(e) => setMaxValor(fmtMiles(e.target.value))}
                  inputMode="numeric"
                  placeholder="Máx"
                  className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-400"
                />
              </div>

              <input
                value={minDorm}
                onChange={(e) => setMinDorm(fmtMiles(e.target.value))}
                inputMode="numeric"
                placeholder="Mín. dormitorios"
                className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
              <input
                value={minBanos}
                onChange={(e) => setMinBanos(fmtMiles(e.target.value))}
                inputMode="numeric"
                placeholder="Mín. baños"
                className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
              <input
                value={minM2Const}
                onChange={(e) => setMinM2Const(fmtMiles(e.target.value))}
                inputMode="numeric"
                placeholder="Mín. m² construidos"
                className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
              <input
                value={minM2Terreno}
                onChange={(e) => setMinM2Terreno(fmtMiles(e.target.value))}
                inputMode="numeric"
                placeholder="Mín. m² terreno"
                className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
              <input
                value={estac}
                onChange={(e) => setEstac(fmtMiles(e.target.value))}
                inputMode="numeric"
                placeholder="Estacionamientos"
                className="w-full rounded-md border border-slate-300 bg-gray-100 px-3 py-2 text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="mt-5">
              <button
                onClick={() => setTrigger((v) => v + 1)}
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
      </section>
    </main>
  );
}


















