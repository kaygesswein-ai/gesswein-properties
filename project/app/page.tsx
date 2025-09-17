'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Bed, ShowerHead, Ruler, Gift, Users2 } from 'lucide-react';

type Property = {
  id: string;
  titulo?: string;
  comuna?: string;
  operacion?: 'venta' | 'arriendo';
  tipo?: string;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  superficie_util_m2?: number | null;
  imagenes?: string[];
  images?: string[];
  coverImage?: string;
  destacada?: boolean;
};

function fmtPrecio(pUf?: number | null, pClp?: number | null) {
  if (typeof pUf === 'number' && pUf > 0) return `UF ${new Intl.NumberFormat('es-CL').format(pUf)}`;
  if (typeof pClp === 'number' && pClp > 0) return `$ ${new Intl.NumberFormat('es-CL').format(pClp)}`;
  return 'Consultar';
}

export default function HomePage() {
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [i, setI] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Carga destacadas
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/propiedades?destacada=true&limit=6', { cache: 'no-store' });
        const json = await res.json();
        if (!mounted) return;
        const data: Property[] = Array.isArray(json?.data) ? json.data : [];
        setDestacadas(data);
      } catch {
        if (mounted) setDestacadas([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!destacadas.length) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setI((p) => (p + 1) % destacadas.length), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [destacadas.length]);

  const go = (dir: -1 | 1) => {
    if (!destacadas.length) return;
    setI((p) => {
      const n = destacadas.length;
      return ((p + dir) % n + n) % n;
    });
  };

  const active = destacadas[i];
  const bg = useMemo(() => {
    if (!active)
      return 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';
    const imgs = active.coverImage || active.imagenes?.[0] || active.images?.[0];
    return imgs || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';
  }, [active]);

  return (
    <main className="bg-white">
      {/* ========= HERO / CARRUSEL ========= */}
      <section className="relative w-full overflow-hidden isolate">
        <div className="absolute inset-0 -z-10 bg-center bg-cover" style={{ backgroundImage: `url(${bg})` }} aria-hidden />
        <div className="absolute inset-0 -z-10 bg-black/35" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[72vh] md:min-h-[78vh] flex items-end pb-10 md:pb-14">
          <div className="w-full relative">
            {/* BOTÓN: ahora forzado a Montserrat */}
            <div className="ml-6 md:ml-10 mb-3">
              <Link
                href="/propiedades"
                className="inline-flex items-center px-4 py-2 text-sm font-normal tracking-wide text-white bg-[#0A2E57] rounded-none font-sans"
                style={{
                  boxShadow:
                    'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.35)',
                }}
              >
                Ver Propiedades
              </Link>
            </div>

            {/* TARJETA RESUMEN */}
            <div className="ml-6 md:ml-10 bg-white/65 backdrop-blur-sm shadow-xl p-4 md:p-5 rounded-none max-w-md">
              <h1 className="heading-serif text-[1.4rem] md:text-2xl font-semibold text-gray-900">
                {active?.titulo ?? 'Propiedad destacada'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {active?.comuna ? `${active.comuna} · ` : ''}{active?.tipo ?? '—'} · {active?.operacion ?? '—'}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50/70 p-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <Bed className="h-4 w-4" /> Dormitorios
                  </div>
                  <div className="text-base font-semibold">{active?.dormitorios ?? '—'}</div>
                </div>
                <div className="bg-gray-50/70 p-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <ShowerHead className="h-4 w-4" /> Baños
                  </div>
                  <div className="text-base font-semibold">{active?.banos ?? '—'}</div>
                </div>
                <div className="bg-gray-50/70 p-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <Ruler className="h-4 w-4" /> Área útil (m²)
                  </div>
                  <div className="text-base font-semibold">{active?.superficie_util_m2 ?? '—'}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xl font-extrabold text-[#C1272D]">
                  {fmtPrecio(active?.precio_uf, active?.precio_clp)}
                </div>
                {active?.id ? (
                  <Link
                    href={`/propiedades/${active.id}`}
                    className="inline-flex items-center border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-none font-sans"
                  >
                    Ver detalle
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          {destacadas.length > 1 && (
            <>
              <button
                aria-label="Anterior"
                onClick={() => go(-1)}
                className="group absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2"
              >
                <ChevronLeft className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
              <button
                aria-label="Siguiente"
                onClick={() => go(1)}
                className="group absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2"
              >
                <ChevronRight className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
            </>
          )}

          {destacadas.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {destacadas.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 w-6 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-2 md:h-4" />
      </section>

      {/* ========= EQUIPO ========= */}
      <section id="equipo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center gap-3">
          <Users2 className="h-6 w-6 text-[#0A2E57]" />
          <h2 className="heading-serif text-2xl md:text-3xl font-semibold">Equipo</h2>
        </div>

        <p className="mt-3 max-w-4xl text-slate-700">
          En Gesswein Properties nos diferenciamos por un servicio cercano y de alto estándar:
          cada día combinamos <span className="font-semibold">criterio arquitectónico</span>, <span className="font-semibold">respaldo legal</span> y <span className="font-semibold">mirada financiera</span> para que cada decisión inmobiliaria sea <span className="font-semibold">segura y rentable</span>.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { nombre: 'Carolina San Martín', cargo: 'SOCIA FUNDADORA', profesion: 'Arquitecta', foto: '/team/carolina-san-martin.png' },
            { nombre: 'Alberto Gesswein', cargo: 'SOCIO', profesion: 'Periodista y Gestor de Proyectos', foto: '/team/alberto-gesswein.png' },
            { nombre: 'Jan Gesswein', cargo: 'SOCIO', profesion: 'Abogado', foto: '/team/jan-gesswein.png' },
            { nombre: 'Kay Gesswein', cargo: 'SOCIO', profesion: 'Ingeniero Comercial · Magíster en Finanzas', foto: '/team/kay-gesswein.png' },
          ].map((m) => (
            <article key={m.nombre} className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition">
              <div className="aspect-[3/4] w-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.foto}
                  alt={m.nombre}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              {/* Overlay */}
              <div className="pointer-events-none absolute inset-0 bg-[#0A2E57]/0 group-hover:bg-[#0A2E57]/90 transition duration-300" />
              <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="w-full p-4 text-white">
                  <h3 className="heading-serif text-lg font-semibold leading-snug">{m.nombre}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider mt-1">{m.cargo}</p>
                  <p className="mt-1 text-sm text-white/90">{m.profesion}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ========= REFERIDOS ========= */}
      <section id="referidos" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Gift className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="heading-serif mt-3 text-2xl md:text-3xl font-semibold">
              Programa de Referidos con Exclusividad
            </h2>
            <p className="mt-2 text-slate-600">
              ¿Conoces a alguien que busca propiedad? Refierelo y obtén beneficios exclusivos.
            </p>
          </div>

          <div className="px-6 pb-8">
            <h3 className="heading-serif text-lg font-semibold">Tus datos (Referente)</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Tu nombre completo" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="tu@email.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="+56 9 1234 5678" />
              </div>
            </div>

            <h3 className="heading-serif mt-8 text-lg font-semibold">Datos del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Nombre del referido" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="email@referido.com" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Teléfono del referido</label>
                <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="+56 9 1234 5678" />
              </div>
              <div />
            </div>

            <h3 className="heading-serif mt-8 text-lg font-semibold">Preferencias del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Tipo de propiedad</label>
                <select className="w-full rounded-md border border-slate-300 px-3 py-2">
                  <option>Seleccionar tipo</option>
                  <option>Casa</option>
                  <option>Departamento</option>
                  <option>Oficina</option>
                  <option>Terreno</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Comuna de interés</label>
                <select className="w-full rounded-md border border-slate-300 px-3 py-2">
                  <option>Seleccionar comuna</option>
                  <option>Las Condes</option>
                  <option>Vitacura</option>
                  <option>Lo Barnechea</option>
                  <option>Providencia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto mínimo (CLP)</label>
                <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto máximo (CLP)</label>
                <input className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="0" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Comentarios adicionales</label>
                <textarea className="w-full rounded-md border border-slate-300 px-3 py-2" rows={4} placeholder="Cualquier información adicional que pueda ser útil..." />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-neutral-900 px-4 py-3 text-white text-sm font-medium hover:bg-black"
              >
                <Gift className="h-4 w-4" /> Enviar referido
              </button>
              <p className="mt-3 text-center text-xs text-slate-500">
                Al enviar este formulario, aceptas nuestros términos del programa de referidos y política de privacidad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

