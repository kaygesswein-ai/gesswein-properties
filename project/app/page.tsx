'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Bed, ShowerHead, Ruler, Gift, Users2 } from 'lucide-react';

/* ===================== Tipos ===================== */
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

/* ===================== Constantes ===================== */
const BRAND_BLUE = '#0A2E57';
const PLACEHOLDER_IMG =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';

/* ===================== Utils ===================== */
const nfCL = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

/** Normaliza “Lo Barnechea” con mayúsculas correctas */
function fixComuna(c?: string) {
  if (!c) return '';
  const s = c.toLowerCase();
  if (s.replace(/\s+/g, '') === 'lobarnechea') return 'Lo Barnechea';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Calcula CLP desde UF si hay factor; si no, usa precio_clp */
function computeCLP(precioUF?: number | null, precioCLP?: number | null, ufFactor?: number) {
  if (typeof precioUF === 'number' && precioUF > 0 && ufFactor && ufFactor > 0) {
    return Math.round(precioUF * ufFactor);
  }
  if (typeof precioCLP === 'number' && precioCLP > 0) return precioCLP;
  return null;
}

/* ===================== Regiones & Comunas ===================== */
/** Metropolitana al final, números romanos delante */
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

const REG_N: Record<Region, number> = {
  'Arica y Parinacota': 1,
  Tarapacá: 2,
  Antofagasta: 3,
  Atacama: 4,
  Coquimbo: 5,
  Valparaíso: 6,
  "O'Higgins": 7,
  Maule: 8,
  'Biobío': 12,
  'La Araucanía': 9,
  'Los Lagos': 10,
  Aysén: 11,
  Magallanes: 15,
  'Metropolitana de Santiago': 13,
  'Ñuble': 16,
  'Los Ríos': 14,
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
const regionLabel = (r: Region) => `${toRoman(REG_N[r])} – ${r}`;

const COMUNAS_POR_REGION: Record<Region, string[]> = {
  'Arica y Parinacota': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
  Tarapacá: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Pica', 'Huara', 'Camiña', 'Colchane'],
  Antofagasta: ['Antofagasta', 'Calama', 'San Pedro de Atacama', 'Mejillones', 'Taltal', 'Tocopilla'],
  Atacama: ['Copiapó', 'Caldera', 'Vallenar', 'Huasco', 'Freirina', 'Chañaral'],
  Coquimbo: ['La Serena', 'Coquimbo', 'Ovalle', 'Vicuña', 'Illapel', 'Los Vilos'],
  Valparaíso: ['Valparaíso', 'Viña del Mar', 'Concón', 'Quilpué', 'Villa Alemana', 'Limache', 'Olmué'],
  "O'Higgins": ['Rancagua', 'Machalí', 'San Fernando', 'Santa Cruz', 'Doñihue', 'Graneros'],
  Maule: ['Talca', 'Curicó', 'Linares', 'Molina', 'Parral'],
  'Ñuble': ['Chillán', 'San Carlos', 'Bulnes', 'Quillón'],
  'Biobío': ['Concepción', 'Talcahuano', 'Hualpén', 'San Pedro de la Paz', 'Chiguayante', 'Los Ángeles'],
  'La Araucanía': ['Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Angol'],
  'Los Ríos': ['Valdivia', 'Panguipulli', 'La Unión'],
  'Los Lagos': ['Puerto Montt', 'Puerto Varas', 'Osorno', 'Castro'],
  Aysén: ['Coyhaique', 'Aysén', 'Chile Chico'],
  Magallanes: ['Punta Arenas', 'Puerto Natales'],
  'Metropolitana de Santiago': [
    'Santiago', 'Providencia', 'Las Condes', 'Vitacura', 'Lo Barnechea', 'Ñuñoa', 'La Reina',
    'Macul', 'Peñalolén', 'La Florida', 'Puente Alto', 'Maipú', 'San Miguel', 'Recoleta',
    'Independencia', 'Estación Central', 'Huechuraba', 'Renca', 'Quilicura', 'Cerro Navia',
    'Pudahuel', 'Lo Prado', 'La Cisterna', 'San Joaquín', 'San Ramón', 'El Bosque', 'La Granja',
    'San Bernardo', 'Peñaflor', 'Talagante', 'Isla de Maipo', 'Colina', 'Lampa', 'Tiltil', 'Pirque',
    'San José de Maipo', 'Curacaví', 'Melipilla', 'Padre Hurtado',
  ],
};

/* ===================== Página ===================== */
export default function HomePage() {
  /* --- destacadas (carrusel) --- */
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [i, setI] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // swipe
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  /* --- UF factor --- */
  const [ufFactor, setUfFactor] = useState<number | null>(null);
  useEffect(() => {
    let mounted = true;
    fetch('/data/uf.json', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        if (!mounted || !j) return;
        const v = Number(j?.value ?? j?.uf ?? j?.UF);
        if (!Number.isNaN(v) && v > 0) setUfFactor(v);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

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
    if (touchStartX.current !== null)
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    const dx = touchDeltaX.current;
    const TH = 50;
    if (Math.abs(dx) > TH) {
      if (dx < 0) go(1); else go(-1);
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    if (destacadas.length)
      timerRef.current = setInterval(() => setI((p) => (p + 1) % destacadas.length), 4000);
  };

  const active = destacadas[i];
  const bg = useMemo(() => {
    if (!active) return PLACEHOLDER_IMG;
    const imgs = active.coverImage || active.imagenes?.[0] || active.images?.[0];
    return imgs || PLACEHOLDER_IMG;
  }, [active]);

  const lineaSecundaria = [
    fixComuna(active?.comuna),
    active?.tipo ? (active.tipo.charAt(0).toUpperCase() + active.tipo.slice(1).toLowerCase()) : '',
    active?.operacion ? (active.operacion.charAt(0).toUpperCase() + active.operacion.slice(1).toLowerCase()) : '',
  ].filter(Boolean).join(' · ');

  /* ======= Referidos (selects) ======= */
  const [region, setRegion] = useState<Region | ''>('');
  const [comuna, setComuna] = useState('');
  const comunas = useMemo(() => (region ? COMUNAS_POR_REGION[region] : []), [region]);

  return (
    <main className="bg-white">
      {/* ========= HERO / DESTACADAS ========= */}
      <section
        className="relative w-full min-h-[100svh] md:min-h-[100vh] overflow-hidden isolate"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Imagen + overlay */}
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-black/35" aria-hidden />

        {/* Contenido; empujado hacia ABAJO (especial mobile) */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 h-full flex items-end pb-6 sm:pb-10 md:pb-14">
          <div className="w-full">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-none p-4 md:p-5 w-full max-w-[680px]">
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

              {/* Acciones: IZQ Ver más (blanco con borde) | DER Precio UF+CLP */}
              <div className="mt-4 flex items-end gap-3">
                {active?.id ? (
                  <Link
                    href={`/propiedades/${active.id}`}
                    className="inline-flex items-center justify-center h-[44px] min-w-[152px] px-4 text-sm tracking-wide rounded-none border"
                    style={{ color: '#0f172a', borderColor: BRAND_BLUE, background: '#fff' }}
                  >
                    Ver más
                  </Link>
                ) : null}

                <div className="ml-auto text-right">
                  <div className="text-[1.35rem] md:text-2xl font-bold text-[color:var(--blue)] leading-6"
                       style={{ ['--blue' as any]: BRAND_BLUE }}>
                    {typeof active?.precio_uf === 'number' && active.precio_uf > 0
                      ? `UF ${nfCL.format(active.precio_uf)}`
                      : 'Consultar'}
                  </div>
                  {/* CLP siempre que exista UF+factor o precio_clp */}
                  {(() => {
                    const clp = computeCLP(active?.precio_uf, active?.precio_clp, ufFactor ?? undefined);
                    return clp ? (
                      <div className="text-[13px] md:text-sm text-slate-600">
                        ${' '}{nfCL.format(clp)}
                      </div>
                    ) : null;
                  })()}
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
                className="group absolute left-3 md:left-6 top-1/2 -translate-y-1/2 p-2"
              >
                <ChevronLeft className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
              <button
                aria-label="Siguiente"
                onClick={() => go(1)}
                className="group absolute right-3 md:right-6 top-1/2 -translate-y-1/2 p-2"
              >
                <ChevronRight className="h-8 w-8 stroke-white/80 group-hover:stroke-white" />
              </button>
            </>
          )}

          {destacadas.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {destacadas.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 w-6 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`}
                />
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
          En Gesswein Properties nos diferenciamos por un servicio cercano y de alto estándar:
          cada día combinamos criterio arquitectónico, respaldo legal y mirada financiera para que cada decisión
          inmobiliaria sea segura y rentable.
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
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition cursor-pointer"
              tabIndex={0}
              role="button"
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

              {/* Overlay azul (hover/tap/focus) */}
              <div
                className="
                  pointer-events-none absolute inset-0
                  bg-[color:var(--blue)]/0
                  group-hover:bg-[color:var(--blue)]/90
                  group-active:bg-[color:var(--blue)]/90
                  group-focus:bg-[color:var(--blue)]/90
                  transition duration-300
                "
                style={{ ['--blue' as any]: BRAND_BLUE }}
              />

              {/* Texto sobre el overlay */}
              <div
                className="
                  absolute inset-0 flex items-end
                  opacity-0
                  group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100
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
            {/* sin negrita en “Referidos” */}
            <h2 className="mt-3 text-2xl md:text-3xl">Programa de referidos con exclusividad</h2>
            <p className="mt-2 text-slate-600">
              ¿Conoces a alguien que busca propiedad? Refiérelo y obtén beneficios exclusivos.
            </p>
          </div>

          <div className="px-6 pb-8">
            {/* ---- Referente ---- */}
            <h3 className="text-lg">Tus datos (referente)</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input className="w-full rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700" placeholder="Tu nombre completo" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input className="w-full rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700" placeholder="tu@email.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                <input className="w-full rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700" placeholder="+56 9 1234 5678" />
              </div>
            </div>

            {/* ---- Referido ---- */}
            <h3 className="mt-8 text-lg">Datos del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input className="w-full rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700" placeholder="Nombre del referido" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input className="w-full rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700" placeholder="correo@referido.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                <input className="w-full rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700" placeholder="+56 9 ...." />
              </div>
            </div>

            <h3 className="mt-8 text-lg">Preferencias del referido</h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {/* Servicio que necesita */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">¿Qué servicio necesita?</label>
                <select
                  className="w-full h-11 rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 text-slate-700"
                  defaultValue="Comprar"
                >
                  <option>Comprar</option>
                  <option>Vender</option>
                  <option>Arrendar</option>
                  <option>Gestionar un arriendo</option>
                  <option>Consultoría específica</option>
                </select>
              </div>

              {/* Tipo de propiedad */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Tipo de propiedad</label>
                <select className="w-full h-11 rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 text-slate-700" defaultValue="Casa">
                  <option>Casa</option>
                  <option>Departamento</option>
                  <option>Bodega</option>
                  <option>Oficina</option>
                  <option>Local comercial</option>
                  <option>Terreno</option>
                </select>
              </div>

              {/* Región (ROMANOS, Metro al final) */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Región</label>
                <select
                  className="w-full h-11 rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 text-slate-700"
                  value={region}
                  onChange={(e) => { setRegion(e.target.value as Region || ''); setComuna(''); }}
                >
                  <option value="">Seleccionar región</option>
                  {REGIONES.map(r => (
                    <option key={r} value={r}>{regionLabel(r)}</option>
                  ))}
                </select>
              </div>

              {/* Comuna dependiente */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Comuna</label>
                <select
                  className="w-full h-11 rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 text-slate-700 disabled:bg-gray-100 disabled:text-slate-400"
                  value={comuna}
                  onChange={(e) => setComuna(e.target.value)}
                  disabled={!region}
                >
                  <option value="">{region ? 'Seleccionar comuna' : 'Selecciona una región primero'}</option>
                  {region && comunas.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Presupuesto (UF) */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto mínimo (UF)</label>
                <input className="w-full rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700" placeholder="0" inputMode="numeric" />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Presupuesto máximo (UF)</label>
                <input className="w-full rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700" placeholder="0" inputMode="numeric" />
              </div>

              {/* Comentarios */}
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Comentarios adicionales</label>
                <textarea className="w-full rounded-none appearance-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700" rows={4} placeholder="Cualquier información adicional que pueda ser útil..." />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm tracking-wide text-white rounded-none"
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




