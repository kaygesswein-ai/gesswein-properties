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
function fmtPrecio(pUf?: number | null, pClp?: number | null) {
  if (typeof pUf === 'number' && pUf > 0) return `UF ${new Intl.NumberFormat('es-CL').format(pUf)}`;
  if (typeof pClp === 'number' && pClp > 0) return `$ ${new Intl.NumberFormat('es-CL').format(pClp)}`;
  return 'Consultar';
}
function capFirst(s?: string | null) {
  if (!s) return '';
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/* -------------------- Datos Chile -------------------- */
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

const COMUNAS_POR_REGION: Record<Region, string[]> = {
  'Arica y Parinacota': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
  Tarapacá: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica', 'Huara', 'Camiña', 'Colchane'],
  Antofagasta: ['Antofagasta', 'Mejillones', 'Taltal', 'Sierra Gorda', 'Calama', 'San Pedro de Atacama', 'María Elena', 'Tocopilla'],
  Atacama: ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Vallenar', 'Huasco', 'Freirina', 'Chañaral', 'Diego de Almagro'],
  Coquimbo: ['La Serena', 'Coquimbo', 'Andacollo', 'Vicuña', 'Ovalle', 'Monte Patria', 'Punitaqui', 'Illapel', 'Los Vilos', 'Salamanca'],
  Valparaíso: ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana', 'Quillota', 'La Calera', 'San Antonio', 'Casablanca', 'Quintero', 'Puchuncaví', 'Limache', 'Olmué'],
  "O'Higgins": ['Rancagua', 'Machalí', 'Graneros', 'Mostazal', 'Doñihue', 'San Vicente', 'Santa Cruz', 'San Fernando', 'Pichilemu'],
  Maule: ['Talca', 'Maule', 'San Clemente', 'Cauquenes', 'Curicó', 'Molina', 'Rauco', 'Linares', 'Parral'],
  'Ñuble': ['Chillán', 'Chillán Viejo', 'San Carlos', 'Coihueco', 'Bulnes', 'Quirihue'],
  'Biobío': ['Concepción', 'Talcahuano', 'Hualpén', 'San Pedro de la Paz', 'Chiguayante', 'Coronel', 'Lota', 'Los Ángeles', 'Arauco', 'Curanilahue'],
  'La Araucanía': ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Angol', 'Victoria', 'Nueva Imperial'],
  'Los Ríos': ['Valdivia', 'Lanco', 'Panguipulli', 'Los Lagos', 'La Unión', 'Río Bueno'],
  'Los Lagos': ['Puerto Montt', 'Puerto Varas', 'Frutillar', 'Osorno', 'Castro', 'Ancud', 'Quellón'],
  Aysén: ['Coyhaique', 'Aysén', 'Cisnes', 'Chile Chico'],
  Magallanes: ['Punta Arenas', 'Puerto Natales', 'Porvenir', 'Cabo de Hornos'],
  'Metropolitana de Santiago': [
    'Santiago', 'Providencia', 'Las Condes', 'Vitacura', 'Lo Barnechea', 'Ñuñoa', 'La Reina',
    'Macul', 'Peñalolén', 'La Florida', 'Puente Alto', 'San Joaquín', 'San Miguel', 'La Cisterna',
    'Cerrillos', 'Estación Central', 'Quinta Normal', 'Recoleta', 'Independencia', 'Huechuraba',
    'Conchalí', 'Renca', 'Quilicura', 'Pudahuel', 'Lo Prado', 'Cerro Navia', 'Maipú',
    'Pedro Aguirre Cerda', 'San Ramón', 'El Bosque', 'La Granja', 'Lo Espejo', 'San Bernardo',
    'Buin', 'Paine', 'Calera de Tango', 'Talagante', 'Peñaflor', 'Isla de Maipo', 'El Monte',
    'Padre Hurtado', 'Colina', 'Lampa', 'Tiltil', 'Melipilla', 'Curacaví', 'María Pinto',
    'San José de Maipo', 'Pirque'
  ],
};

const SERVICIOS = [
  'Comprar',
  'Vender',
  'Arrendar',
  'Gestionar un arriendo',
  'Consultoría específica',
];

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
    return () => { mounted = false; };
  }, []);

  // Auto-slide
  useEffect(() => {
    if (!destacadas.length) return;
    if (timerRef.current) clearInterval(timerRef.current);
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
      if (dx < 0) go(1); else go(-1);
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
    return imgs || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';
  }, [active]);

  const lineaSecundaria = [
    capFirst(active?.comuna),
    capFirst(active?.tipo),
    capFirst(active?.operacion),
  ].filter(Boolean).join(' · ');

  /* --------- Estado formulario referidos (inputs con datalist) --------- */
  const [regionInput, setRegionInput] = useState('');
  const [comunaInput, setComunaInput] = useState('');
  const regionSel = REGIONES.find((r) => r.toLowerCase() === regionInput.toLowerCase()) || '';
  const comunas = (regionSel ? COMUNAS_POR_REGION[regionSel] : []);

  return (
    <main className="bg-white">
      {/* ========= HERO ========= */}
      <section
        className="relative w-full overflow-hidden isolate"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 -z-10 bg-center bg-cover" style={{ backgroundImage: `url(${bg})` }} aria-hidden />
        <div className="absolute inset-0 -z-10 bg-black/35" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 min-h-[100svh] md:min-h-[96vh] lg:min-h-[100vh] flex items-end pb-16 md:pb-20">
          <div className="w-full relative">
            <div className="bg-white/65 backdrop-blur-sm shadow-xl rounded-none p-4 md:p-5 w-full max-w-[520px]">
              <h1 className="text-[1.4rem] md:text-2xl text-gray-900">
                {active?.titulo ?? 'Propiedad destacada'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{lineaSecundaria || '—'}</p>

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

              {/* Acciones: IZQ Ver más | DER Precio (mismo tamaño que título y en negrita) */}
              <div className="mt-4 flex items-center gap-3">
                <div>
                  {active?.id ? (
                    <Link
                      href={`/propiedades/${active.id}`}
                      className="inline-flex items-center px-3 py-2 text-sm tracking-wide text-white bg-[#0A2E57] rounded-none"
                      style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.35)' }}
                    >
                      Ver más
                    </Link>
                  ) : null}
                </div>

                <div className="ml-auto text-[1.4rem] md:text-2xl font-bold text-[#0A2E57]">
                  {fmtPrecio(active?.precio_uf, active?.precio_clp)}
                </div>
              </div>
            </div>
          </div>

          {/* Flechas */}
          {destacadas.length > 1 && (
            <>
              <button aria-label="Anterior" onClick={() => go(-1)} className="group absolute left-4 md:left-6 top-[42%] md:top-[45%] -translate-y-1/2 p-2">
                <ChevronLeft className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
              <button aria-label="Siguiente" onClick={() => go(1)} className="group absolute right-4 md:right-6 top-[42%] md:top-[45%] -translate-y-1/2 p-2">
                <ChevronRight className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
            </>
          )}

          {destacadas.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
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
          <Users2 className="h-6 w-6 text-[#0A2E57]" />
          <h2 className="text-2xl md:text-3xl">Equipo</h2>
        </div>

        <p className="mt-3 max-w-4xl text-slate-700">
          En Gesswein Properties nos diferenciamos por un servicio cercano y de alto estándar:
          cada día combinamos criterio arquitectónico, respaldo legal y mirada financiera para que cada decisión inmobiliaria sea segura y rentable.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { nombre: 'Carolina San Martín', cargo: 'Socia fundadora', profesion: 'Arquitecta', foto: '/team/carolina-san-martin.png' },
            { nombre: 'Alberto Gesswein', cargo: 'Socio', profesion: 'Periodista y gestor de proyectos', foto: '/team/alberto-gesswein.png' },
            { nombre: 'Jan Gesswein', cargo: 'Socio', profesion: 'Abogado', foto: '/team/jan-gesswein.png' },
            { nombre: 'Kay Gesswein', cargo: 'Socio', profesion: 'Ingeniero comercial · Magíster en finanzas', foto: '/team/kay-gesswein.png' },
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
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              {/* Overlay: oculto por defecto; aparece en hover/active/focus */}
              <div className="
                pointer-events-none absolute inset-0
                bg-[#0A2E57]/0
                group-hover:bg-[#0A2E57]/90
                group-active:bg-[#0A2E57]/90
                focus-within:bg-[#0A2E57]/90
                transition duration-300
              " />

              {/* Texto: aparece solo al interactuar */}
              <div className="
                absolute inset-0 flex items-end
                opacity-0
                group-hover:opacity-100
                group-active:opacity-100
                focus-within:opacity-100
                transition duration-300
              ">
                <div className="w-full p-4 text-white">
                  <h3 className="text-lg leading-snug">{m.nombre}</h3>
                  {/* invertimos tamaños: cargo más grande y profesión más pequeña */}
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
            <h2 className="mt-3 text-2xl md:text-3xl">Programa de referidos con exclusividad</h2>
            <p className="mt-2 text-slate-600">
              ¿Conoces a alguien que busca propiedad? Refiérelo y obtén beneficios exclusivos.
            </p>
          </div>

          <div className="px-6 pb-8">
            <h3 className="text-lg">Tus datos (referente)</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="Tu nombre completo" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="tu@email.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="+56 9 1234 5678" />
              </div>
            </div>

            <h3 className="mt-8 text-lg">Preferencias del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {/* Servicio necesita - con datalist (buscable) */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">¿Qué servicio necesita?</label>
                <input
                  list="servicios-list"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-500 placeholder-slate-400"
                  placeholder="Seleccionar"
                />
                <datalist id="servicios-list">
                  {SERVICIOS.map((s) => <option key={s} value={s} />)}
                </datalist>
              </div>

              {/* Tipo de propiedad - datalist */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Tipo de propiedad</label>
                <input
                  list="tipo-prop-list"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-500 placeholder-slate-400"
                  placeholder="Seleccionar tipo"
                />
                <datalist id="tipo-prop-list">
                  <option value="Casa" />
                  <option value="Departamento" />
                  <option value="Oficina" />
                  <option value="Terreno" />
                </datalist>
              </div>

              {/* Región - datalist (buscable) */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Región</label>
                <input
                  list="regiones-list"
                  value={regionInput}
                  onChange={(e) => {
                    setRegionInput(e.target.value);
                    setComunaInput(''); // limpiar comuna si cambia región
                  }}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-500 placeholder-slate-400"
                  placeholder="Seleccionar región"
                />
                <datalist id="regiones-list">
                  {REGIONES.map((r) => <option key={r} value={r} />)}
                </datalist>
              </div>

              {/* Comuna dependiente - datalist */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Comuna</label>
                <input
                  list="comunas-list"
                  value={comunaInput}
                  onChange={(e) => setComunaInput(e.target.value)}
                  disabled={!regionSel}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-gray-50 text-slate-500 placeholder-slate-400 disabled:bg-gray-100 disabled:text-slate-400"
                  placeholder={regionSel ? 'Seleccionar comuna' : 'Selecciona una región primero'}
                />
                <datalist id="comunas-list">
                  {regionSel && comunas.map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>

              {/* Presupuestos UF */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto mínimo (UF)</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="0" inputMode="numeric" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto máximo (UF)</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="0" inputMode="numeric" />
              </div>

              {/* Comentarios */}
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Comentarios adicionales</label>
                <textarea className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" rows={4} placeholder="Cualquier información adicional que pueda ser útil..." />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm tracking-wide text-white bg-[#0A2E57] rounded-none"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.35)' }}
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

