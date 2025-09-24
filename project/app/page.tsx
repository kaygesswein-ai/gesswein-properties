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

function fmtCLP(n?: number | null) {
  if (typeof n === 'number' && n > 0) {
    return `$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`;
  }
  return '';
}
function fmtUF(n?: number | null) {
  if (typeof n === 'number' && n > 0) {
    return `UF ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`;
  }
  return 'Consultar';
}
function capFirst(s?: string | null) {
  if (!s) return '';
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/* -------------------- Datos Chile (para Referidos) -------------------- */
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

const SERVICIOS = ['Comprar', 'Vender', 'Arrendar', 'Gestionar un arriendo', 'Consultoría específica'];

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
        // Si alguna viene con precio "Consultar", dale un valor razonable (solo para mostrar en home)
        const patched = data.map(p =>
          (p.precio_uf || p.precio_clp)
            ? p
            : { ...p, precio_uf: 10500, precio_clp: 420000000 }
        );
        setDestacadas(patched);
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

  /* --------- Estado formulario referidos (datalist + formato UF) --------- */
  const [regionInput, setRegionInput] = useState('');
  const [comunaInput, setComunaInput] = useState('');
  const [minUF, setMinUF] = useState(''); // formateado con miles
  const [maxUF, setMaxUF] = useState('');

  const regionSel = REGIONES.find((r) => r.toLowerCase() === regionInput.toLowerCase()) || '';
  const comunas = (regionSel ? COMUNAS_POR_REGION[regionSel] : []);

  const formatUF = (raw: string) => {
    const digits = raw.replace(/\D+/g, '');
    if (!digits) return '';
    const n = parseInt(digits, 10);
    return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n);
  };

  /* ============== Medidas para igualar VER MÁS y PRECIO ============== */
  // ancho de las tarjetas de stats (Dormitorios/Baños/Área)
  const STAT_WIDTH_CLASS = 'w-[176px] max-w-[176px]'; // igual que la tarjeta de “Dormitorios” (ajusta si cambias ese ancho)
  const PRICE_HEIGHT_CLASS = 'h-14'; // alto del bloque de precio (UF/CLP)

  return (
    <main className="bg-white">
      {/* ========= HERO ========= */}
      <section
        className="relative w-full overflow-hidden isolate"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Imagen cubre todo el alto de la pantalla */}
        <div
          className="h-[100svh] md:h-[100vh] bg-center bg-cover"
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden
        />
        {/* Overlay para oscurecer un poco */}
        <div className="pointer-events-none absolute inset-0 bg-black/35" />

        {/* Tarjeta de información posicionada al fondo, centrada horizontalmente */}
        <div className="absolute inset-x-0 bottom-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/85 backdrop-blur-sm shadow-xl rounded-none p-4 md:p-5 w-full md:max-w-[860px]">
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

              {/* Acciones: IZQ Ver más (mismo ancho STAT y misma altura PRECIO) | DER Precio */}
              <div className="mt-4 flex items-center gap-3">
                <div>
                  {active?.id ? (
                    <Link
                      href={`/propiedades/${active.id}`}
                      className={`inline-flex items-center justify-center ${STAT_WIDTH_CLASS} ${PRICE_HEIGHT_CLASS} text-sm tracking-wide rounded-none border`}
                      style={{
                        color: '#0f172a',
                        borderColor: BRAND_BLUE,
                        background: '#fff',
                      }}
                    >
                      Ver más
                    </Link>
                  ) : null}
                </div>

                <div className={`ml-auto flex flex-col items-end justify-center ${PRICE_HEIGHT_CLASS}`}>
                  {/* UF un poco más pequeña que antes */}
                  <div className="text-[1.15rem] md:text-[1.25rem] font-semibold text-[color:var(--blue)] leading-none"
                       style={{ ['--blue' as any]: BRAND_BLUE }}>
                    {fmtUF(active?.precio_uf) || 'UF —'}
                  </div>
                  <div className="text-slate-600 text-xs md:text-sm leading-none mt-1">
                    {fmtCLP(active?.precio_clp)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Puntos de paginación */}
          {destacadas.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {destacadas.map((_, idx) => (
                <span key={idx} className={`h-1.5 w-6 rounded-full ${i === idx ? 'bg-white' : 'bg-white/60'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Flechas (centradas verticalmente sobre la imagen) */}
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
      </section>

      {/* ========= EQUIPO ========= */}
      <section id="equipo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center gap-3">
          <Users2 className="h-6 w-6 text-[color:var(--blue)]" style={{ ['--blue' as any]: BRAND_BLUE }} />
          <h2 className="text-2xl md:text-3xl uppercase tracking-[0.25em]">EQUIPO</h2>
        </div>

        <p className="mt-3 max-w-4xl text-slate-700">
          En Gesswein Properties nos diferenciamos por un servicio cercano y de alto estándar:
          cada día combinamos criterio arquitectónico, respaldo legal y mirada financiera para que cada decisión inmobiliaria sea segura y rentable.
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
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              </div>

              {/* Overlay azul corporativo al interactuar (se ve la persona detrás) */}
              <div
                className="
                  pointer-events-none absolute inset-0
                  bg-[rgba(10,46,87,0)]
                  group-hover:bg-[rgba(10,46,87,0.9)]
                  group-active:bg-[rgba(10,46,87,0.9)]
                  focus-within:bg-[rgba(10,46,87,0.9)]
                  transition duration-300
                "
              />

              {/* Texto: aparece sobre el overlay */}
              <div
                className="
                  absolute inset-0 flex items-end
                  opacity-0
                  group-hover:opacity-100
                  group-active:opacity-100
                  focus-within:opacity-100
                  transition duration-300
                "
              >
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
                <input className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="Tu nombre completo" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="tu@email.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                <input className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="+56 9 1234 5678" />
              </div>
            </div>

            <h3 className="mt-8 text-lg">Datos del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="Nombre del referido" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="correo@referido.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                <input className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="+56 9 1234 5678" />
              </div>
            </div>

            <h3 className="mt-8 text-lg">Preferencias del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {/* Servicio – rectangular (no ovalado) */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">¿Qué servicio necesita?</label>
                <select className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700">
                  {SERVICIOS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Tipo de propiedad – rectangular */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Tipo de propiedad</label>
                <select className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700">
                  <option>Casa</option>
                  <option>Departamento</option>
                  <option>Bodega</option>
                  <option>Oficina</option>
                  <option>Local comercial</option>
                  <option>Terreno</option>
                </select>
              </div>

              {/* Región – rectangular */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Región</label>
                <select
                  value={regionSel || ''}
                  onChange={(e) => { setRegionInput(e.target.value); setComunaInput(''); }}
                  className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
                >
                  <option value="" disabled>Seleccionar región</option>
                  {REGIONES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Comuna dependiente – rectangular */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Comuna</label>
                <select
                  value={comunaInput}
                  onChange={(e) => setComunaInput(e.target.value)}
                  disabled={!regionSel}
                  className="w-full rounded-none border border-slate-300 px-3 py-2 bg-gray-50 text-slate-700 disabled:bg-gray-100 disabled:text-slate-400"
                >
                  <option value="">{regionSel ? 'Seleccionar comuna' : 'Selecciona una región primero'}</option>
                  {regionSel && comunas.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Presupuestos UF – rectangular */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto mínimo (UF)</label>
                <input
                  value={minUF}
                  onChange={(e) => setMinUF(formatUF(e.target.value))}
                  inputMode="numeric"
                  className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto máximo (UF)</label>
                <input
                  value={maxUF}
                  onChange={(e) => setMaxUF(formatUF(e.target.value))}
                  inputMode="numeric"
                  className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Comentarios adicionales</label>
                <textarea className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" rows={4} placeholder="Cualquier información adicional que pueda ser útil..." />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-2 text-sm tracking-wide text-white rounded-none"
                style={{ background: BRAND_BLUE, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.35)' }}
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








