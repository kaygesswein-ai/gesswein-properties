'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, Filter, Wrench } from 'lucide-react';

type Operacion = 'venta' | 'arriendo';
type Moneda = 'UF' | 'CLP$';

const AZUL = '#0A2E57';

/* === estilos consistentes (UF = mismo estilo que Operación) === */
const baseInput =
  'w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-[15px] leading-none text-slate-700 placeholder:text-slate-400 outline-none focus:border-slate-400';
const baseSelect =
  'appearance-none w-full h-11 rounded-md border border-slate-300 bg-white px-3 text-[15px] leading-none text-slate-700 outline-none focus:border-slate-400';
const softInput =
  'w-full h-11 rounded-md border border-slate-300 bg-slate-100 px-3 text-[15px] leading-none text-slate-700 placeholder:text-slate-500 outline-none focus:border-slate-400';
const pill = 'inline-flex items-center justify-center h-11 rounded-md px-4 text-white shadow-sm';
const pillPrimary = `${pill} bg-[${AZUL}] hover:opacity-90`;
const trackingCaps = 'font-normal tracking-[0.28em] uppercase';

export default function PropiedadesPage() {
  // Rápida
  const [operacion, setOperacion] = useState<Operacion | ''>('');
  const [tipo, setTipo] = useState('');
  const [region, setRegion] = useState('');
  const [comuna, setComuna] = useState('');
  const [barrio, setBarrio] = useState('');
  const [moneda, setMoneda] = useState<Moneda>('UF');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  // Avanzada
  const [showAvanzada, setShowAvanzada] = useState(false);
  const [minDorm, setMinDorm] = useState('');
  const [minBan, setMinBan] = useState('');
  const [minMC, setMinMC] = useState('');
  const [minMT, setMinMT] = useState('');
  const [estac, setEstac] = useState('');

  const regiones = useMemo(
    () => [
      { id: 'I', label: 'I Tarapacá' },
      { id: 'II', label: 'II Antofagasta' },
      { id: 'III', label: 'III Atacama' },
      { id: 'IV', label: 'IV Coquimbo' },
      { id: 'V', label: 'V Valparaíso' },
      { id: 'RM', label: 'XIII Metropolitana de Santiago' },
      { id: 'VI', label: 'VI O’Higgins' },
      { id: 'VII', label: 'VII Maule' },
      { id: 'VIII', label: 'VIII Biobío' },
      { id: 'IX', label: 'IX La Araucanía' },
      { id: 'X', label: 'X Los Lagos' },
      { id: 'XI', label: 'XI Aysén' },
      { id: 'XII', label: 'XII Magallanes' },
      { id: 'XIV', label: 'XIV Los Ríos' },
      { id: 'XV', label: 'XV Arica y Parinacota' },
      { id: 'XVI', label: 'XVI Ñuble' },
    ],
    []
  );

  return (
    <main className="bg-white">
      {/* =================== HERO =================== */}
      <section className="relative isolate">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          {/* fondo */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1920&auto=format&fit=crop"
              alt="Interior elegante"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_30%]" /* crop hacia ARRIBA */
            />
            <div className="absolute inset-0 bg-black/35" />
          </div>

          {/* títulos y buscador, alineados exacto con el logo (contenedor) */}
          <h1 className={`text-4xl sm:text-5xl text-white ${trackingCaps}`}>Propiedades</h1>
          <p className="mt-2 text-white/90">Encuentra tu próxima inversión o tu nuevo hogar.</p>

          <div className="mt-6 max-w-3xl">
            <div className="flex gap-2">
              <input
                className="flex-1 h-11 rounded-md border border-white/70 bg-white/95 px-3 text-slate-800 placeholder:text-slate-500 outline-none"
                placeholder="Buscar por calle (ej. Alameda 13800)"
              />
              <button className={pillPrimary}>
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =================== FILTROS =================== */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* encabezado */}
          <div className="mb-2 flex items-center gap-3">
            <Filter className="h-5 w-5 text-slate-700" />
            <h2 className={`text-lg text-slate-900 ${trackingCaps}`}>Filtros</h2>
          </div>

          {/* con padding a la izquierda para alinear con los toggles */}
          <div className="pl-8">
            {/* toggles */}
            <div className="mb-6 flex gap-3">
              <button
                onClick={() => setShowAvanzada(false)}
                className={`h-10 rounded-md border px-3 text-sm ${
                  !showAvanzada ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'
                } border-slate-300`}
              >
                Búsqueda rápida
              </button>
              <button
                onClick={() => setShowAvanzada(true)}
                className={`h-10 rounded-md border px-3 text-sm inline-flex items-center gap-2 ${
                  showAvanzada ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-700'
                } border-slate-300`}
              >
                <Wrench className="h-4 w-4" />
                Búsqueda avanzada
              </button>
            </div>

            {/* RÁPIDA */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {/* Operación */}
              <select
                value={operacion}
                onChange={(e) => setOperacion(e.target.value as Operacion | '')}
                className={baseSelect}
              >
                <option value="">Operación</option>
                <option value="venta">Venta</option>
                <option value="arriendo">Arriendo</option>
              </select>

              {/* Tipo */}
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={baseSelect}>
                <option value="">Tipo de propiedad</option>
                <option>Casa</option>
                <option>Departamento</option>
                <option>Bodega</option>
                <option>Oficina</option>
                <option>Local comercial</option>
                <option>Terreno</option>
              </select>

              {/* Región (número romano + nombre) */}
              <select
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setComuna('');
                  setBarrio('');
                }}
                className={baseSelect}
              >
                <option value="">Región</option>
                {regiones.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>

              {/* Comuna (texto siempre “Comuna”) */}
              <select
                value={comuna}
                onChange={(e) => {
                  setComuna(e.target.value);
                  setBarrio('');
                }}
                className={baseSelect}
                disabled={!region}
              >
                <option value="">{'Comuna'}</option>
                {region === 'RM' && (
                  <>
                    <option>Las Condes</option>
                    <option>Providencia</option>
                    <option>Vitacura</option>
                  </>
                )}
              </select>

              {/* Barrio (texto siempre “Barrio”) */}
              <select
                value={barrio}
                onChange={(e) => setBarrio(e.target.value)}
                className={baseSelect}
                disabled={!comuna}
              >
                <option value="">{'Barrio'}</option>
                {comuna === 'Las Condes' && (
                  <>
                    <option>El Golf</option>
                    <option>San Carlos de Apoquindo</option>
                  </>
                )}
                {comuna === 'Providencia' && (
                  <>
                    <option>Pedro de Valdivia Norte</option>
                    <option>Santa Isabel</option>
                  </>
                )}
              </select>

              {/* Moneda + rangos (UF = mismo look que Operación) */}
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value as Moneda)}
                  className={baseSelect}
                >
                  <option value="UF">UF</option>
                  <option value="CLP$">CLP$</option>
                </select>
                <input
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  inputMode="numeric"
                  placeholder="Mín"
                  className={baseInput}
                />
                <input
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  inputMode="numeric"
                  placeholder="Máx"
                  className={baseInput}
                />
              </div>
            </div>

            {/* AVANZADA (solo los NUEVOS con relleno gris) */}
            {showAvanzada && (
              <>
                <div className="my-6 h-px w-full bg-slate-200" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
                  <input
                    value={minDorm}
                    onChange={(e) => setMinDorm(e.target.value)}
                    inputMode="numeric"
                    placeholder="Mínimo dormitorios"
                    className={softInput}
                  />
                  <input
                    value={minBan}
                    onChange={(e) => setMinBan(e.target.value)}
                    inputMode="numeric"
                    placeholder="Mínimo baños"
                    className={softInput}
                  />
                  <input
                    value={minMC}
                    onChange={(e) => setMinMC(e.target.value)}
                    inputMode="numeric"
                    placeholder="Mín m² construidos"
                    className={softInput}
                  />
                  <input
                    value={minMT}
                    onChange={(e) => setMinMT(e.target.value)}
                    inputMode="numeric"
                    placeholder="Mín m² de terreno"
                    className={softInput}
                  />
                  <input
                    value={estac}
                    onChange={(e) => setEstac(e.target.value)}
                    inputMode="numeric"
                    placeholder="Estacionamientos"
                    className={softInput}
                  />
                  {/* Botón buscar (mismo tamaño que un input) */}
                  <button className={`${pillPrimary} w-full`}>Buscar</button>
                </div>
              </>
            )}

            {!showAvanzada && (
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-6 gap-3">
                <div className="lg:col-start-6">
                  <button className={`${pillPrimary} w-full`}>Buscar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =================== LISTADO =================== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <h3 className={`mb-6 mt-8 text-xl text-slate-900 ${trackingCaps}`}>
            Propiedades disponibles
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {['Depto luminoso en Vitacura', 'Casa familiar en Lo Barnechea', 'Oficina en Providencia'].map(
              (t, idx) => (
                <a
                  key={t}
                  href={`/propiedades/${idx + 1}`}
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="aspect-[4/3] bg-slate-100" />
                  <div className="p-4">
                    <h4 className="text-lg text-slate-900">{t}</h4>
                    <p className="mt-1 text-sm text-slate-600">Vitacura · Departamento · Venta</p>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Ver más a la izquierda, BLANCO con borde y texto azul */}
                      <span
                        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-[color:var(--gp-azul,#0A2E57)]"
                        style={{ ['--gp-azul' as any]: AZUL }}
                      >
                        Ver más
                      </span>
                      <span className="text-base font-medium text-slate-900">
                        {idx === 2 ? 'Consultar' : `${moneda} ${idx === 0 ? '10.500' : '23.000'}`}
                      </span>
                    </div>
                  </div>
                </a>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}















