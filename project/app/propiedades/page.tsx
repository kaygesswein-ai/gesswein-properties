'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Bed, ShowerHead, Ruler, Search, Filter } from 'lucide-react';
import { featuredApiPath } from '../../lib/featured';

// …(tipos y helpers iguales a tu versión)… //
const BRAND_BLUE = '#0A2E57';
const HERO_IMG = 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2000&auto=format&fit=crop';

const nfUF = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const capFirst = (s: string) => (s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s);

// ===== Hook UF (igual al tuyo previo) =====
function useUfValue() {
  const [uf, setUf] = useState<number | null>(null);
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await fetch('/api/uf', { cache: 'no-store' });
        const j = await r.json().catch(() => ({} as any));
        if (!cancel) setUf(typeof j?.uf === 'number' ? j.uf : null);
      } catch { if (!cancel) setUf(null); }
    })();
    return () => { cancel = true; };
  }, []);
  return uf;
}

type CardProp = {
  id: string;
  titulo: string;
  comuna: string;
  region: string;
  operacion: 'venta' | 'arriendo';
  tipo:
    | 'Casa'
    | 'Departamento'
    | 'Oficina'
    | 'Local comercial'
    | 'Terreno'
    | 'Bodega';
  precio_uf: number;
  precio_clp?: number | null;
  dormitorios: number | null;
  banos: number | null;
  superficie_util_m2: number | null;
  estacionamientos?: number | null;
  coverImage: string;
  destacada?: boolean;
};

function PriceTag({ priceUF, priceCLP, ufValue, className }:{
  priceUF?: number | null; priceCLP?: number | null; ufValue?: number | null; className?: string;
}) {
  let uf = priceUF ?? null;
  let clp = priceCLP ?? null;
  if (uf == null && clp != null && ufValue) uf = clp / ufValue;
  if (clp == null && uf != null && ufValue) clp = uf * ufValue;

  return (
    <div className={className}>
      <div className="font-semibold" style={{ color: BRAND_BLUE }}>
        {uf != null && uf > 0 ? `UF ${nfUF.format(uf)}` : 'Consultar'}
      </div>
      <div className="text-xs text-slate-500">
        {clp != null && clp > 0 ? `$ ${nfCLP.format(clp)}` : ''}
      </div>
    </div>
  );
}

export default function PropiedadesPage() {
  const [qTop, setQTop] = useState('');
  const [operacion, setOperacion] = useState('');
  const [tipo, setTipo] = useState('');
  const [regionInput, setRegionInput] = useState('');
  const [region, setRegion] = useState<string>('');
  const [comuna, setComuna] = useState('');
  const [barrio, setBarrio] = useState('');
  const [moneda, setMoneda] = useState<'UF' | 'CLP$'>('UF');
  const [minValor, setMinValor] = useState('');
  const [maxValor, setMaxValor] = useState('');
  const [trigger, setTrigger] = useState(0);
  const [items, setItems] = useState<CardProp[]>([]);

  // region parser simple (tu lógica previa aquí si la tenías)
  useEffect(() => {
    const m = regionInput.match(/^\s*[IVXLCDM]+\s*-\s*(.+)$/i);
    const name = (m ? m[1] : regionInput) as string;
    if (name) setRegion(name); else setRegion('');
  }, [regionInput]);

  // cargar propiedades con filtros (mock server-side por query)
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

    (async () => {
      const r = await fetch(`/api/propiedades?${p.toString()}`, { cache: 'no-store' });
      const j = await r.json().catch(() => ({} as any));
      setItems(Array.isArray(j?.data) ? j.data : []);
    })();
  }, [trigger, qTop, operacion, tipo, region, comuna, barrio, moneda, minValor, maxValor]);

  const ufValue = useUfValue();

  return (
    <main className="bg-white">
      {/* HERO */}
      <section
        className="relative bg-cover min-h-[56vh]"
        style={{ backgroundImage: `url(${HERO_IMG})`, backgroundPosition: '50% 82%' }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pl-2 sm:pl-4">
              <div className="max-w-3xl">
                <h1 className="text-white text-3xl md:text-4xl uppercase tracking-[0.25em]">PROPIEDADES</h1>
                <p className="text-white/85 mt-2">Encuentra tu próxima inversión o tu nuevo hogar.</p>
              </div>
              <div className="mt-4 max-w-2xl">
                <div className="relative">
                  {/* quitamos el ícono para empujar más a la izquierda */}
                  <input
                    value={qTop}
                    onChange={(e) => setQTop(e.target.value)}
                    placeholder="Buscar por calle"
                    className="w-full rounded-md bg-white/95 backdrop-blur pl-3 pr-28 py-3 text-slate-900 placeholder-slate-500"
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

          {/* Búsqueda rápida */}
          <div className="pl-2 sm:pl-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
            <input list="dl-operacion" value={operacion} onChange={(e) => setOperacion(e.target.value)}
              placeholder="Operación"
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
            <datalist id="dl-operacion">
              <option value="Venta" /><option value="Arriendo" />
            </datalist>

            <input list="dl-tipos" value={tipo} onChange={(e) => setTipo(e.target.value)}
              placeholder="Tipo de propiedad"
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
            <datalist id="dl-tipos">
              <option value="Casa" /><option value="Departamento" /><option value="Bodega" />
              <option value="Oficina" /><option value="Local comercial" /><option value="Terreno" />
            </datalist>

            <input list="dl-regiones" value={regionInput} onChange={(e) => { setRegionInput(e.target.value); setComuna(''); }}
              placeholder="Región"
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
            <datalist id="dl-regiones">
              <option value="XIII - Metropolitana de Santiago" />
            </datalist>

            <input list="dl-comunas" value={comuna} onChange={(e) => setComuna(e.target.value)}
              placeholder="Comuna"
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
            <datalist id="dl-comunas">
              <option value="Vitacura" /><option value="Providencia" /><option value="Lo Barnechea" />
              <option value="Las Condes" /><option value="Ñuñoa" /><option value="Santiago" />
              <option value="La Reina" /><option value="Huechuraba" /><option value="Colina" />
              <option value="Maipú" />
            </datalist>
          </div>

          <div className="pl-2 sm:pl-4 mt-3 grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* Moneda con CLP$ */}
            <input list="dl-moneda" value={moneda} onChange={(e) => setMoneda((e.target.value as 'UF' | 'CLP$') || 'UF')}
              placeholder="UF"
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
            <datalist id="dl-moneda">
              <option value="UF" /><option value="CLP$" />
            </datalist>

            <input value={minValor} onChange={(e) => setMinValor(e.target.value.replace(/\D+/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'))}
              inputMode="numeric" placeholder="Mín"
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />
            <input value={maxValor} onChange={(e) => setMaxValor(e.target.value.replace(/\D+/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.'))}
              inputMode="numeric" placeholder="Máx"
              className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" />

            <button
              onClick={() => setTrigger((v) => v + 1)}
              className="w-full px-5 py-2 text-sm text-white rounded-none"
              style={{ background: BRAND_BLUE, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.95), inset 0 0 0 3px rgba(255,255,255,.35)' }}
            >
              Buscar
            </button>
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      {/* LISTADO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl md:text-2xl text-slate-900 uppercase tracking-[0.25em] mb-4">
          PROPIEDADES DISPONIBLES
        </h2>

        {items.length === 0 ? (
          <p className="text-slate-600">No se encontraron propiedades.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => {
              const showEst = ['Casa', 'Departamento', 'Oficina', 'Local comercial'].includes(p.tipo);
              const stats: Array<{ key: string; label: string; value: number | null; icon: JSX.Element }> = [
                ...(p.dormitorios != null ? [{
                  key: 'dorm', label: 'Dorm.', value: p.dormitorios, icon: <Bed className="h-4 w-4" />
                }] : []),
                ...(p.banos != null ? [{
                  key: 'banos', label: 'Baños', value: p.banos, icon: <ShowerHead className="h-4 w-4" />
                }] : []),
                ...(showEst && p.estacionamientos != null ? [{
                  key: 'est', label: 'Est.', value: p.estacionamientos, icon: <span className="text-xs font-semibold">P</span>
                }] : []),
                ...(p.superficie_util_m2 != null ? [{
                  key: 'm2', label: 'm²', value: p.superficie_util_m2, icon: <Ruler className="h-4 w-4" />
                }] : []),
              ];

              return (
                <Link key={p.id} href="#" className="group block border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                  <div className="aspect-[4/3] bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.coverImage} alt={p.titulo} className="w-full h-full object-cover group-hover:opacity-95 transition" />
                  </div>
                  <div className="p-4 flex flex-col">
                    <h3 className="text-lg text-slate-900 line-clamp-2 min-h-[48px]">{p.titulo}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {p.comuna} · {p.tipo} · {capFirst(p.operacion)}
                    </p>

                    <div className="mt-3 grid grid-cols-3 gap-y-2 text-center">
                      {stats.map((s) => (
                        <div key={s.key} className="border border-slate-200 p-2">
                          <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                            {s.icon} {s.label}
                          </div>
                          <div className="text-sm">{s.value ?? '—'}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1.5 text-sm rounded-none border"
                        style={{ color: '#0f172a', borderColor: BRAND_BLUE, background: '#fff' }}>
                        Ver más
                      </span>
                      <PriceTag priceUF={p.precio_uf} priceCLP={p.precio_clp ?? null} ufValue={ufValue} className="text-right" />
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
