'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Bed, ShowerHead, Ruler, Gift, Users2 } from 'lucide-react';
import useUf from '../hooks/useUf';

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
function fmtUF(n: number) {
  return `UF ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`;
}
function fmtCLP(n: number) {
  return `$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`;
}
function fmtPrecioFallback(pUf?: number | null, pClp?: number | null) {
  if (typeof pUf === 'number' && pUf > 0) return fmtUF(pUf);
  if (typeof pClp === 'number' && pClp > 0) return fmtCLP(pClp);
  return 'Consultar';
}
function capFirst(s?: string | null) {
  if (!s) return '';
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/* -------------------- Datos Chile (para formulario de referidos) -------------------- */
const REGIONES: readonly string[] = [
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
];
type Region = (typeof REGIONES)[number];

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

const TIPO_PROPIEDAD = [
  'Casa',
  'Departamento',
  'Bodega',
  'Oficina',
  'Local comercial',
  'Terreno',
];

/* ===== util: romanos para regiones (solo display) ===== */
const ROMANOS = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI'];
const displayRegion = (r: Region) => {
  const idx = REGIONES.indexOf(r);
  const roman = ROMANOS[idx] ?? '';
  return roman ? `${roman} - ${r}` : r;
};
const extractRegionName = (value: string): Region | '' => {
  // admite "X - Nombre" o "Nombre"
  const v = value.includes(' - ') ? (value.split(' - ').slice(1).join(' - ')) : value;
  const match = REGIONES.find((r) => r.toLowerCase() === v.trim().toLowerCase());
  return (match as Region) || '';
};

/* -------------------- Componente -------------------- */
export default function HomePage() {
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [i, setI] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // refs para medir ancho/alto y ajustar botón "Ver más"
  const statDormRef = useRef<HTMLDivElement | null>(null);
  const priceBoxRef = useRef<HTMLDivElement | null>(null);
  const verMasRef = useRef<HTMLAnchorElement | null>(null);

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
        // si viene "Consultar", asigno 2300 UF para no dejar el precio vacío (solo display)
        const fixed = data.map((p) => {
          if ((p.precio_uf ?? 0) <= 0 && (p.precio_clp ?? 0) <= 0) {
            return { ...p, precio_uf: 2300 };
          }
          return p;
        });
        setDestacadas(fixed);
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
    capFirst(active?.comuna?.replace(/^lo barnechea/i, 'Lo Barnechea')),
    capFirst(active?.tipo),
    capFirst(active?.operacion),
  ].filter(Boolean).join(' · ');

  /* ====== UF del día y precios combinados (UF arriba, CLP abajo) ====== */
  const ufHoy = useUf();

  const precioUfHero = useMemo(() => {
    if (!active) return 0;
    if (typeof active.precio_uf === 'number' && active.precio_uf > 0) return Math.round(active.precio_uf);
    if (typeof active.precio_clp === 'number' && active.precio_clp > 0 && ufHoy) {
      return Math.round(active.precio_clp / ufHoy);
    }
    return 0;
  }, [active, ufHoy]);

  const precioClpHero = useMemo(() => {
    if (!active) return 0;
    if (typeof active.precio_clp === 'number' && active.precio_clp > 0) return Math.round(active.precio_clp);
    if (typeof active.precio_uf === 'number' && active.precio_uf > 0 && ufHoy) {
      return Math.round(active.precio_uf * ufHoy);
    }
    return 0;
  }, [active, ufHoy]);

  /* ====== medir ancho/alto para el botón ====== */
  const applyButtonSize = () => {
    const w = statDormRef.current?.offsetWidth;
    const h = priceBoxRef.current?.offsetHeight;
    const a = verMasRef.current;
    if (a && w) a.style.width = `${w}px`;
    if (a && h) a.style.height = `${h}px`;
    if (a) a.style.display = 'inline-flex';
    if (a) a.style.alignItems = 'center';
    if (a) a.style.justifyContent = 'center';
  };
  useEffect(() => {
    applyButtonSize();
    const ro = new ResizeObserver(applyButtonSize);
    if (statDormRef.current) ro.observe(statDormRef.current);
    if (priceBoxRef.current) ro.observe(priceBoxRef.current);
    return () => ro.disconnect();
  }, [active]);

  /* --------- Estado formulario referidos --------- */
  const [regionInput, setRegionInput] = useState('');   // muestra "X - Nombre" o vacío
  const [comunaInput, setComunaInput] = useState('');
  const [minUF, setMinUF] = useState('');
  const [maxUF, setMaxUF] = useState('');
  const [servicio, setServicio] = useState('Comprar');
  const [tipo, setTipo] = useState('Casa');

  const regionSel = extractRegionName(regionInput);
  const comunas = (regionSel ? COMUNAS_POR_REGION[regionSel] : []);

  const formatUFinput = (raw: string) => {
    const digits = raw.replace(/\D+/g, '');
    if (!digits) return '';
    const n = parseInt(digits, 10);
    return new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n);
  };

  return (
    <main className="bg-white">
      {/* ========= HERO ========= */}
      <section
        className="relative w-full overflow-hidden isolate"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Imagen de fondo full-viewport */}
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-black/35" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 min-h-[100svh] md:min-h-[96vh] lg:min-h-[100vh] flex items-end pb-16 md:pb-20">
          <div className="w-full relative">
            {/* Card del destacado */}
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-none p-4 md:p-5 w-full max-w-[620px]">
              <h1 className="text-[1.4rem] md:text-2xl text-gray-900">
                {active?.titulo ?? 'Propiedad destacada'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">{lineaSecundaria || '—'}</p>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div ref={statDormRef} className="bg-gray-50 p-2.5 md:p-3">
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

              {/* Acciones: IZQ Ver más | DER Precio (UF arriba / CLP abajo) */}
              <div className="mt-4 flex items-end gap-3">
                <div>
                  {active?.id ? (
                    <Link
                      ref={verMasRef}
                      href={`/propiedades/${active.id}`}
                      className="inline-flex text-sm tracking-wide rounded-none border border-[#0A2E57] text-[#0A2E57] bg-white"
                      style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.95)' }}
                    >
                      Ver más
                    </Link>
                  ) : null}
                </div>

                <div ref={priceBoxRef} className="ml-auto text-right">
                  <div className="text-[1.25rem] md:text-[1.35rem] font-semibold text-[#0A2E57] leading-none">
                    {precioUfHero > 0 ? fmtUF(precioUfHero) : fmtPrecioFallback(active?.precio_uf, active?.precio_clp)}
                  </div>
                  <div className="text-sm md:text-base text-slate-600 mt-1">
                    {precioClpHero > 0 ? fmtCLP(precioClpHero) : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flechas */}
          {destacadas.length > 1 && (
            <>
              <button
                aria-label="Anterior"
                onClick={() => go(-1)}
                className="group absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-2"
              >
                <ChevronLeft className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
              <button
                aria-label="Siguiente"
                onClick={() => go(1)}
                className="group absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-2"
              >
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

              {/* Overlay azul (hover/touch) */}
              <div
                className="
                  pointer-events-none absolute inset-0
                  bg-[#0A2E57]/0
                  group-hover:bg-[#0A2E57]/90
                  group-active:bg-[#0A2E57]/90
                  focus-within:bg-[#0A2E57]/90
                  transition duration-300
                "
              />

              {/* Texto sobre la foto al interactuar */}
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

            <h3 className="mt-8 text-lg">Datos del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="Nombre del referido" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="correo@referido.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                <input className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400" placeholder="+56 9 1234 5678" />
              </div>
            </div>

            <h3 className="mt-8 text-lg">Preferencias del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {/* Servicio: input + datalist (escribible y seleccionable) */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">¿Qué servicio necesita?</label>
                <input
                  list="servicios-list"
                  value={servicio}
                  onChange={(e) => setServicio(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
                  placeholder="Seleccionar o escribir…"
                />
                <datalist id="servicios-list">
                  {SERVICIOS.map((s) => <option key={s} value={s} />)}
                </datalist>
              </div>

              {/* Tipo de propiedad: input + datalist */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Tipo de propiedad</label>
                <input
                  list="tipos-prop-list"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
                  placeholder="Seleccionar o escribir…"
                />
                <datalist id="tipos-prop-list">
                  {TIPO_PROPIEDAD.map((t) => <option key={t} value={t} />)}
                </datalist>
              </div>

              {/* Región / Comuna con display romano – nombre (input + datalist) */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Región</label>
                <input
                  list="regiones-list"
                  value={regionInput}
                  onChange={(e) => { setRegionInput(e.target.value); setComunaInput(''); }}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
                  placeholder="Seleccionar o escribir…"
                />
                <datalist id="regiones-list">
                  {REGIONES.map((r) => <option key={r} value={displayRegion(r as Region)} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">Comuna</label>
                <input
                  list="comunas-list"
                  value={comunaInput}
                  onChange={(e) => setComunaInput(e.target.value)}
                  disabled={!regionSel}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-gray-50 text-slate-700 disabled:bg-gray-100 disabled:text-slate-400"
                  placeholder={regionSel ? 'Seleccionar o escribir…' : 'Selecciona una región primero'}
                />
                <datalist id="comunas-list">
                  {regionSel && (COMUNAS_POR_REGION[regionSel] || []).map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>

              {/* Presupuestos UF */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto mínimo (UF)</label>
                <input
                  value={minUF}
                  onChange={(e) => setMinUF(formatUFinput(e.target.value))}
                  inputMode="numeric"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto máximo (UF)</label>
                <input
                  value={maxUF}
                  onChange={(e) => setMaxUF(formatUFinput(e.target.value))}
                  inputMode="numeric"
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700"
                  placeholder="0"
                />
              </div>

              {/* Comentarios */}
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Comentarios adicionales</label>
                <textarea className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700" rows={4} placeholder="Cualquier información adicional que pueda ser útil..." />
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









