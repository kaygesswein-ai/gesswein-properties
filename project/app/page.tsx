'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import SmartSelect from '@/components/SmartSelect';

/* ==================== Datos base (regiones/comunas) ==================== */
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

const COMUNAS: Record<string, string[]> = {
  'Metropolitana de Santiago': [
    'Las Condes',
    'Vitacura',
    'Lo Barnechea',
    'Providencia',
    'Santiago',
    'Ñuñoa',
    'La Reina',
    'Huechuraba',
    'La Florida',
    'Maipú',
    'Puente Alto',
    'Colina',
    'Lampa',
    'Talagante',
  ],
  'Valparaíso': ['Viña del Mar', 'Valparaíso', 'Concón', 'Quilpué', 'Villa Alemana', 'Limache', 'Olmué'],
  'Los Ríos': ['Valdivia', 'Panguipulli', 'La Unión'],
  'Biobío': ['Concepción', 'San Pedro de la Paz', 'Talcahuano', 'Hualpén'],
  'La Araucanía': ['Temuco', 'Villarrica', 'Pucón'],
  'Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle'],
  // agrega las que necesites…
};

/* ==================== Tipos / helpers ==================== */
type FeaturedProp = {
  id: string;
  titulo: string;
  comuna: string;
  region: string;
  operacion: 'venta' | 'arriendo';
  tipo: 'Casa' | 'Departamento' | 'Oficina';
  precio_uf: number;
  precio_clp?: number | null;
  dormitorios: number | null;
  banos: number | null;
  superficie_util_m2: number | null;
  estacionamientos?: number | null;
  coverImage: string;
  destacada: true;
};

const nfUF = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

/* ==================== Página ==================== */
export default function HomePage() {
  /* -------- Estados existentes para preferencias del referido -------- */
  const [servicio, setServicio] = useState('');         // ¿Qué servicio necesita?
  const [tipoProp, setTipoProp] = useState('');         // Tipo de propiedad
  const [regionInput, setRegionInput] = useState('');   // texto libre de región
  const [region, setRegion] = useState<string>('');     // región normalizada
  const [comuna, setComuna] = useState('');             // comuna

  // Derivación simple de regionInput -> region (si ya la tenías, puedes dejar la tuya)
  useEffect(() => {
    const name = regionInput?.trim() || '';
    if (name && REGIONES.includes(name as any)) setRegion(name);
    else setRegion('');
  }, [regionInput]);

  // Para comuna según región
  const comunasDeRegion = useMemo(
    () => (region ? COMUNAS[region] || [] : []),
    [region],
  );

  /* --------- Destacadas (portada) sin tocar tu API / formato ---------- */
  const [featured, setFeatured] = useState<FeaturedProp[]>([]);
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch('/api/featured', { cache: 'no-store' });
        const json = await res.json().catch(() => ([]));
        if (!cancel && Array.isArray(json)) setFeatured(json as FeaturedProp[]);
      } catch { /* noop */ }
    })();
    return () => { cancel = true; };
  }, []);

  return (
    <main className="bg-white">
      {/* ======================= HERO simple ======================= */}
      <section
        className="relative bg-cover bg-center min-h-[60vh]"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2000&auto=format&fit=crop)' }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl md:text-4xl text-white uppercase tracking-[0.25em]">GESSWEIN PROPERTIES</h1>
          <p className="text-white/90 mt-2 max-w-2xl">
            Encuentra tu próxima inversión o tu nuevo hogar.
          </p>
        </div>

        {/* Tarjeta con la primera destacada (se mantiene, no cambiamos comportamiento) */}
        {featured.length > 0 && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-[92%] md:w-[720px]">
            <article className="bg-white/95 backdrop-blur rounded-md shadow border border-slate-200 p-4">
              <h3 className="text-slate-900 text-lg">{featured[0].titulo}</h3>
              <p className="text-slate-600 text-sm">
                {featured[0].comuna} · {featured[0].tipo} · {featured[0].operacion === 'venta' ? 'Venta' : 'Arriendo'}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <Link href="/propiedades" className="px-3 py-1.5 border rounded-none text-sm">
                  Ver más
                </Link>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">UF {nfUF.format(featured[0].precio_uf)}</div>
                  {!!featured[0].precio_clp && (
                    <div className="text-xs text-slate-500">$ {nfCLP.format(featured[0].precio_clp)}</div>
                  )}
                </div>
              </div>
            </article>
          </div>
        )}
      </section>

      {/* =================== Preferencias del referido =================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-lg text-slate-900 mb-4">Preferencias del referido</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Qué servicio necesita */}
          <div>
            <label className="block text-slate-700 text-sm mb-1">¿Qué servicio necesita?</label>
            <SmartSelect
              placeholder="Seleccionar o escribir..."
              value={servicio}
              onChange={setServicio}
              options={[
                'Comprar',
                'Vender',
                'Arrendar',
                'Gestionar un arriendo',
                'Consultoría específica',
              ]}
              className="w-full"
            />
          </div>

          {/* Tipo de propiedad */}
          <div>
            <label className="block text-slate-700 text-sm mb-1">Tipo de propiedad</label>
            <SmartSelect
              placeholder="Seleccionar o escribir..."
              value={tipoProp}
              onChange={setTipoProp}
              options={[
                'Casa',
                'Departamento',
                'Bodega',
                'Oficina',
                'Local comercial',
                'Terreno',
              ]}
              className="w-full"
            />
          </div>

          {/* Región */}
          <div>
            <label className="block text-slate-700 text-sm mb-1">Región</label>
            <SmartSelect
              placeholder="Seleccionar o escribir..."
              value={regionInput}
              onChange={(v) => {
                setRegionInput(v);
                setComuna(''); // limpiar comuna cuando cambia región
              }}
              options={[...REGIONES]}
              className="w-full"
            />
          </div>

          {/* Comuna */}
          <div>
            <label className="block text-slate-700 text-sm mb-1">Comuna</label>
            <SmartSelect
              placeholder={region ? 'Seleccionar o escribir...' : 'Selecciona una región primero'}
              value={comuna}
              onChange={setComuna}
              options={comunasDeRegion}
              disabled={!region}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* ===================== Destacadas (galería simple) ===================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {featured.length > 0 && (
          <>
            <h3 className="text-xl text-slate-900 mb-4">Propiedades destacadas</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  href="/propiedades"
                  className="group block border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-[4/3] bg-slate-100">
                    <img
                      src={p.coverImage}
                      alt={p.titulo}
                      className="w-full h-full object-cover group-hover:scale-[1.01] transition"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-slate-900">{p.titulo}</h4>
                    <p className="text-slate-600 text-sm">
                      {p.comuna} · {p.tipo} · {p.operacion === 'venta' ? 'Venta' : 'Arriendo'}
                    </p>
                    <div className="mt-2 font-semibold text-slate-900">UF {nfUF.format(p.precio_uf)}</div>
                    {!!p.precio_clp && (
                      <div className="text-xs text-slate-500">$ {nfCLP.format(p.precio_clp)}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
