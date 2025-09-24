'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Bed, ShowerHead, Ruler, Gift, Users2 } from 'lucide-react';

/* -------------------- Tipos -------------------- */
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

/* -------------------- Utilidades -------------------- */
const BRAND_BLUE = '#0A2E57';

const fmtInt = (n: number) => new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n);
const fmtUF = (n?: number | null) => (typeof n === 'number' && n > 0 ? `UF ${fmtInt(n)}` : 'Consultar');
const fmtCLP = (n?: number | null) => (typeof n === 'number' && n > 0 ? `$ ${fmtInt(n)}` : '');

const capFirst = (s?: string | null) => {
  if (!s) return '';
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

/* -------------------- Componente -------------------- */
export default function HomePage() {
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [i, setI] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // swipe
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

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
    return () => {
      mounted = false;
    };
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!destacadas.length) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setI((p) => (p + 1) % destacadas.length), 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [destacadas.length]);

  const go = (dir: -1 | 1) => {
    if (!destacadas.length) return;
    setI((p) => {
      const n = destacadas.length;
      return ((p + dir) % n + n) % n;
    });
  };

  // swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }
  };
  const handleTouchEnd = () => {
    const dx = touchDeltaX.current;
    const TH = 50;
    if (Math.abs(dx) > TH) {
      if (dx < 0) go(1);
      else go(-1);
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    if (destacadas.length) {
      timerRef.current = setInterval(() => setI((p) => (p + 1) % destacadas.length), 4000);
    }
  };

  const active = destacadas[i];
  const bg = useMemo(() => {
    if (!active)
      return 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';
    const imgs = active.coverImage || active.imagenes?.[0] || active.images?.[0];
    return (
      imgs || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920'
    );
  }, [active]);

  // Línea secundaria: comuna en Capitalización correcta (p. ej. "Lo Barnechea")
  const comunaTitle = useMemo(() => {
    const c = active?.comuna?.toLowerCase() || '';
    if (!c) return '';
    // manejar prefijos como "Lo", "La", "Las"
    return c
      .split(' ')
      .map((p) => (['lo', 'la', 'las', 'los', 'de', 'del'].includes(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
      .join(' ')
      .replace(/^Lo barnechea/i, 'Lo Barnechea');
  }, [active?.comuna]);

  const lineaSecundaria = [comunaTitle, capFirst(active?.tipo), capFirst(active?.operacion)]
    .filter(Boolean)
    .join(' · ');

  /* ===== Valor UF (para CLP en el hero) ===== */
  const [ufValue, setUfValue] = useState<number | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch('/api/uf', { cache: 'no-store' });
        const j = await r.json();
        // se espera { valor: number }
        const valor = Number(j?.valor);
        if (mounted) setUfValue(Number.isFinite(valor) ? valor : null);
      } catch {
        if (mounted) setUfValue(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const priceUF = active?.precio_uf || null;
  const priceCLP =
    (active?.precio_clp && active.precio_clp > 0 ? active.precio_clp : null) ??
    (priceUF && ufValue ? Math.round(priceUF * ufValue) : null);

  return (
    <main className="bg-white">
      {/* ========= HERO ========= */}
      <section
        className="relative w-full overflow-hidden isolate"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Imagen de fondo a pantalla completa */}
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-black/35" aria-hidden />

        {/* Contenido alineado con el logo, en el borde inferior */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 min-h-[100svh] flex items-end pb-8 md:pb-12 lg:pb-16">
          <div className="w-full">
            <div className="bg-white/75 backdrop-blur-sm shadow-xl rounded-none p-4 md:p-5 w-full max-w-[680px]">
              <h1 className="text-xl md:text-3xl text-gray-900">
                {active?.titulo ?? 'Propiedad destacada'}
              </h1>
              <p className="mt-1 text-sm text-gray-700">{lineaSecundaria || '—'}</p>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 p-2.5 md:p-3">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] md:text-xs text-gray-500">
                    <Bed className="h-4 w-4" /> Dormitorios
                  </div>
                  <div className="text-base">{active?.dormitorios ?? '—'}</div>
                </div>
                <div className="bg-gray-50 p-2.5 md:p-3">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] md:text-xs text-gray-500">
                    <ShowerHead className="h-4 w-4" /> Baños
                  </div>
                  <div className="text-base">{active?.banos ?? '—'}</div>
                </div>
                <div className="bg-gray-50 p-2.5 md:p-3">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] md:text-xs text-gray-500">
                    <Ruler className="h-4 w-4" /> Área (m²)
                  </div>
                  <div className="text-base">{active?.superficie_util_m2 ?? '—'}</div>
                </div>
              </div>

              {/* Acciones: IZQ Ver más | DER Precios (UF y CLP) */}
              <div className="mt-4 flex items-end gap-3">
                <div>
                  {active?.id ? (
                    <Link
                      href={`/propiedades/${active.id}`}
                      className="inline-flex items-center px-4 py-2 text-sm tracking-wide rounded-none border"
                      style={{ color: '#0f172a', borderColor: BRAND_BLUE, background: '#fff' }}
                    >
                      Ver más
                    </Link>
                  ) : null}
                </div>

                <div className="ml-auto text-right">
                  <div className="text-xl md:text-2xl font-semibold text-[color:var(--blue)]" style={{ ['--blue' as any]: BRAND_BLUE }}>
                    {fmtUF(priceUF)}
                  </div>
                  {priceCLP ? (
                    <div className="text-[13px] md:text-sm text-gray-600 mt-0.5">
                      {fmtCLP(priceCLP)}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Flechas (verticalmente centradas respecto al hero) */}
          {destacadas.length > 1 && (
            <>
              <button
                aria-label="Anterior"
                onClick={() => go(-1)}
                className="group absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-2"
              >
                <ChevronLeft className="h-8 w-8 stroke-white/85 group-hover:stroke-white" />
              </button>
              <button
                aria-label="Siguiente"
                onClick={() => go(1)}
                className="group absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-2"
              >
                <ChevronRight className="h-8 w-8 stroke-white/85 group-hover:stroke-white" />
              </button>
            </>
          )}

          {destacadas.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {destacadas.map((_, idx) => (
                <span key={idx} className={`h-1.5 w-6 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========= EQUIPO ========= */}
      <section id="equipo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center gap-3">
          <Users2 className="h-6 w-6 text-[color:var(--blue)]" style={{ ['--blue' as any]: BRAND_BLUE }} />
          <h2 className="text-2xl md:text-3xl tracking-[0.25em] uppercase">EQUIPO</h2>
        </div>

        <p className="mt-3 max-w-4xl text-slate-700">
          En Gesswein Properties nos diferenciamos por un servicio cercano y de alto estándar: cada día combinamos
          criterio arquitectónico, respaldo legal y mirada financiera para que cada decisión inmobiliaria sea segura y
          rentable.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { nombre: 'Carolina San Martín', cargo: 'SOCIA FUNDADORA', profesion: 'Arquitecta', foto: '/team/carolina-san-martin.png' },
            { nombre: 'Alberto Gesswein', cargo: 'SOCIO', profesion: 'Periodista y gestor de proyectos', foto: '/team/alberto-gesswein.png' },
            { nombre: 'Jan Gesswein', cargo: 'SOCIO', profesion: 'Abogado', foto: '/team/jan-gesswein.png' },
            { nombre: 'Kay Gesswein', cargo: 'SOCIO', profesion: 'Ingeniero comercial · Magíster en finanzas', foto: '/team/kay-gesswein.png' },
          ].map((m) => (
            <article
              key={m.nombre}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition"
              tabIndex={0}
            >
              <div className="aspect-[3/4] w-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.foto}
                  alt={m.nombre}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Overlay azul corporativo (vuelve a activarse en hover/touch) */}
              <div className="pointer-events-none absolute inset-0 bg-[color:var(--blue)]/0 group-hover:bg-[color:var(--blue)]/90 group-active:bg-[color:var(--blue)]/90 transition duration-300"
                   style={{ ['--blue' as any]: BRAND_BLUE }} />

              {/* Texto sobre el overlay */}
              <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 group-active:opacity-100 transition duration-300">
                <div className="w-full p-4 text-white">
                  <h3 className="text-lg leading-snug">{m.nombre}</h3>
                  <p className="text-sm mt-1">{m.cargo}</p>
                  <p className="mt-1 text-xs text-white/90">{m.profesion}</p>
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
            {/* Sin negrita en “Referidos”, solo R mayúscula */}
            <h2 className="mt-3 text-2xl md:text-3xl">Programa de Referidos con exclusividad</h2>
            <p className="mt-2 text-slate-600">
              ¿Conoces a alguien que busca propiedad? Refiérelo y obtén beneficios exclusivos.
            </p>
          </div>

          <div className="px-6 pb-8">
            <h3 className="text-lg">Tus datos (referente)</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="tu@email.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>

            <h3 className="mt-8 text-lg">Datos del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="Nombre del referido"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="correo@referido.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>

            <h3 className="mt-8 text-lg">Preferencias del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {/* Estos inputs mantienen estilo rectangular también en iOS */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">¿Qué servicio necesita?</label>
                <select className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 appearance-none">
                  <option>Comprar</option>
                  <option>Vender</option>
                  <option>Arrendar</option>
                  <option>Gestionar un arriendo</option>
                  <option>Consultoría específica</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Tipo de propiedad</label>
                <select className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 appearance-none">
                  <option>Casa</option>
                  <option>Departamento</option>
                  <option>Bodega</option>
                  <option>Oficina</option>
                  <option>Local comercial</option>
                  <option>Terreno</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Región</label>
                <select className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 appearance-none">
                  {/* La lista larga ya la tienes en /propiedades; aquí mantenemos el estilo */}
                  <option>Seleccionar región</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Comuna</label>
                <select
                  disabled
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 appearance-none disabled:bg-gray-100 disabled:text-slate-400"
                >
                  <option>Selecciona una región primero</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto mínimo (UF)</label>
                <input
                  inputMode="numeric"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto máximo (UF)</label>
                <input
                  inputMode="numeric"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Comentarios adicionales</label>
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="Cualquier información adicional que pueda ser útil..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm tracking-wide text-white bg-[color:var(--blue)] rounded-none"
                style={{ ['--blue' as any]: BRAND_BLUE, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.35)' }}
              >
                <Gift className="h-4 w-4" /> Enviar referido
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-slate-500">
              Al enviar este formulario, aceptas nuestros términos del programa de referidos y política de privacidad.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}





