/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bed,
  ShowerHead,
  Ruler,
  Gift,
  Car,
  Square,
} from 'lucide-react';
import useUf from '../hooks/useUf';
import SmartSelect from '../components/SmartSelect';

/* ------------------------------------------------------------------ */
/*                               TIPOS                                */
/* ------------------------------------------------------------------ */
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
  estacionamientos?: number | null;
  superficie_util_m2?: number | null;
  superficie_terreno_m2?: number | null;
  imagenes?: string[];
  images?: string[];
  coverImage?: string;
  destacada?: boolean;

  // pueden venir o no en el listado
  portada_url?: string | null;
  portada_fija_url?: string | null;
};

/* ------------------------------------------------------------------ */
/*                             UTILIDADES                             */
/* ------------------------------------------------------------------ */
const fmtUF = (n: number) =>
  `UF ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`;
const fmtCLP = (n: number) =>
  `$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`;

const fmtPrecioFallback = (pUf?: number | null, pClp?: number | null) =>
  typeof pUf === 'number' && pUf > 0
    ? fmtUF(pUf)
    : typeof pClp === 'number' && pClp > 0
      ? fmtCLP(pClp)
      : 'Consultar';

const capFirst = (s?: string | null) => {
  if (!s) return '';
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

/* capitaliza cada palabra (“las condes” → “Las Condes”) */
const capWords = (s?: string | null) =>
  (s ?? '')
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ')
    .trim();

const HERO_FALLBACK =
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920';

/* ✅ PRIORIDAD de portada */
function getHeroImage(p?: Partial<Property>) {
  if (!p) return HERO_FALLBACK;
  const anyP: any = p;
  const cand: (string | undefined | null)[] = [
    p.portada_url,
    p.portada_fija_url,
    p.coverImage,
    anyP.imagen,
    anyP.image,
    anyP.foto,
    p.images?.[0],
    p.imagenes?.[0],
  ];
  const src = cand.find((s) => typeof s === 'string' && s.trim().length > 4);
  return (src as string) || HERO_FALLBACK;
}

/* ------------------------------------------------------------------ */
/*                 REGIONES (solo para el formulario)                  */
/* ------------------------------------------------------------------ */
const REGIONES_UI: readonly string[] = [
  'XV - Arica y Parinacota',
  'I - Tarapacá',
  'II - Antofagasta',
  'III - Atacama',
  'IV - Coquimbo',
  'V - Valparaíso',
  'RM - Región Metropolitana de Santiago',
  'VI - Libertador General Bernardo O’Higgins',
  'VII - Maule',
  'XVI - Ñuble',
  'VIII - Biobío',
  'IX - La Araucanía',
  'XIV - Los Ríos',
  'X - Los Lagos',
  'XI - Aysén',
  'XII - Magallanes y la Antártica Chilena',
];

/* 🔹 Comunas por región para habilitar el selector */
const COMUNAS_UI: Record<string, string[]> = {
  'RM - Región Metropolitana de Santiago': [
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
    'Peñalolén',
    'Macul',
  ],
  'V - Valparaíso': [
    'Casablanca',
    'Viña del Mar',
    'Valparaíso',
    'Concón',
    'Quilpué',
    'Villa Alemana',
    'Limache',
    'Olmué',
  ],
  // Puedes ir agregando más regiones/comunas cuando quieras
};

const SERVICIOS = ['Comprar', 'Vender', 'Arrendar', 'Gestionar un arriendo', 'Consultoría específica'];
const TIPO_PROPIEDAD = ['Casa', 'Departamento', 'Bodega', 'Oficina', 'Local comercial', 'Terreno'];

/* ------------------------------------------------------------------ */
/*                IMÁGENES (secciones nuevas bajo el hero)             */
/* ------------------------------------------------------------------ */
const WHY_IMG =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop';
const OPORT_IMG =
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop';

/* ------------------------------------------------------------------ */
/*                              HOME PAGE                             */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [i, setI] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 🔹 cache con portadas traídas por id (hidratación)
  const [detailById, setDetailById] = useState<
    Record<string, { portada_url?: string | null; portada_fija_url?: string | null }>
  >({});

  const priceBoxRef = useRef<HTMLDivElement | null>(null);
  const verMasRef = useRef<HTMLAnchorElement | null>(null);

  /* ---------- fetch propiedades destacadas ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/propiedades?destacada=true&limit=6', { cache: 'no-store' });
        const j = await res.json().catch(() => null);
        if (!mounted) return;
        const data: Array<Property> = Array.isArray(j?.data) ? j.data : [];
        const fixed = data.map((p) =>
          (p.precio_uf ?? 0) <= 0 && (p.precio_clp ?? 0) <= 0 ? { ...p, precio_uf: 2300 } : p
        );
        setDestacadas(fixed);
      } catch {
        if (mounted) setDestacadas([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------- HIDRATAR portadas por id si no vinieron en el listado ---------- */
  useEffect(() => {
    const need = destacadas
      .filter((p) => !(p.portada_url || p.portada_fija_url))
      .map((p) => p.id)
      .filter((id) => !detailById[id]);

    if (need.length === 0) return;

    let cancel = false;
    (async () => {
      for (const id of need) {
        try {
          const r = await fetch(`/api/propiedades/${encodeURIComponent(id)}`, { cache: 'no-store' });
          const j = await r.json().catch(() => null);
          const d = j?.data || j || {};
          const portada_url = d?.portada_url || null;
          const portada_fija_url = d?.portada_fija_url || null;
          if (cancel) return;
          setDetailById((prev) => ({ ...prev, [id]: { portada_url, portada_fija_url } }));
        } catch {
          /* ignore */
        }
      }
    })();

    return () => {
      cancel = true;
    };
  }, [destacadas, detailById]);

  /* ---------- autoplay con “reset” al navegar manual ---------- */
  const startAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setI((p) => (p + 1) % Math.max(destacadas.length, 1)), 5000);
  };
  useEffect(() => {
    if (!destacadas.length) return;
    startAutoplay();
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
    // reset del temporizador al navegar manual
    startAutoplay();
  };

  /* ---------- teclado: flechas izquierda/derecha ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [destacadas.length]);

  /* ---------- touch swipe ---------- */
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }
  };
  const onTouchEnd = () => {
    const dx = touchDeltaX.current;
    if (Math.abs(dx) > 50) {
      dx < 0 ? go(1) : go(-1);
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    if (destacadas.length) startAutoplay();
  };

  /* ---------- hero data ---------- */
  const active = destacadas[i];
  // mezcla el detalle hidratado si existe
  const enrichedActive = active ? { ...active, ...(detailById[active.id] || {}) } : undefined;
  const bg = useMemo(() => getHeroImage(enrichedActive), [enrichedActive]);

  const lineaSecundaria = [
    capWords(active?.comuna?.replace(/^lo barnechea/i, 'Lo Barnechea')),
    capFirst(active?.tipo),
    capFirst(active?.operacion),
  ]
    .filter(Boolean)
    .join(' · ');

  const ufHoy = useUf();
  const precioUfHero =
    typeof active?.precio_uf === 'number' && active.precio_uf > 0
      ? Math.round(active.precio_uf)
      : active?.precio_clp && ufHoy
        ? Math.round(active.precio_clp / ufHoy)
        : 0;

  const precioClpHero =
    typeof active?.precio_clp === 'number' && active.precio_clp > 0
      ? Math.round(active.precio_clp)
      : active?.precio_uf && ufHoy
        ? Math.round(active.precio_uf * ufHoy)
        : 0;

  /* ---------- sincronizar alto del botón ---------- */
  useEffect(() => {
    const sync = () => {
      const h = priceBoxRef.current?.offsetHeight;
      if (verMasRef.current && h) {
        verMasRef.current.style.height = `${h}px`;
        verMasRef.current.style.display = 'inline-flex';
        verMasRef.current.style.alignItems = 'center';
        verMasRef.current.style.justifyContent = 'center';
        verMasRef.current.style.padding = '0 16px';
      }
    };
    sync();
    let ro: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(sync);
      if (priceBoxRef.current) ro.observe(priceBoxRef.current);
    }
    return () => {
      try {
        ro?.disconnect();
      } catch {}
    };
  }, [active]);

  const dash = '—';
  const fmtInt = (n: number | null | undefined) =>
    typeof n === 'number' ? new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n) : dash;

  /* ================== ESTADO SOLO PARA REGION/COMUNA (FORM) ================== */
  const [regionRef, setRegionRef] = useState('');
  const [comunaRef, setComunaRef] = useState('');
  const comunaOpts = regionRef ? COMUNAS_UI[regionRef] || [] : [];

  /* ================== ESTADO REFERIDOS (VALIDACIÓN) ================== */
  const [refNombre, setRefNombre] = useState('');
  const [refEmail, setRefEmail] = useState('');
  const [refTelefono, setRefTelefono] = useState('');

  const [refdNombre, setRefdNombre] = useState('');
  const [refdEmail, setRefdEmail] = useState('');
  const [refdTelefono, setRefdTelefono] = useState('');

  const [servicio, setServicio] = useState('');
  const [tipoProp, setTipoProp] = useState('');

  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [comentarios, setComentarios] = useState('');

  const isValid =
    refNombre.trim() &&
    refEmail.trim() &&
    refTelefono.trim() &&
    refdNombre.trim() &&
    refdEmail.trim() &&
    refdTelefono.trim() &&
    servicio.trim() &&
    tipoProp.trim() &&
    regionRef.trim() &&
    comunaRef.trim() &&
    precioMin.trim() &&
    precioMax.trim();

  const onSubmitReferido = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    // Conecta aquí tu endpoint real
    alert('Referido listo para enviar (conecta aquí tu endpoint).');
  };

  /* ------------------------------------------------------------------ */
  return (
    <main className="bg-white">
      {/* ================= HERO ================= */}
      {/* ⚠️ NO TOCAR CARRUSEL */}
      <section
        className="relative w-full overflow-hidden isolate"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="absolute inset-0 -z-10 bg-center bg-cover" style={{ backgroundImage: `url(${bg})` }} />
        <div className="absolute inset-0 -z-10 bg-black/35" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 min-h-[100svh] flex items-end pb-16 md:pb-20">
          <div className="w-full">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl p-4 md:p-5 w-full md:max-w-[480px]">
              <h1 className="text-[1.4rem] md:text-2xl text-gray-900">{active?.titulo ?? 'Propiedad destacada'}</h1>
              <p className="mt-1 text-sm text-gray-600">{lineaSecundaria || '—'}</p>

              {/* ---------- Tiles ---------- */}
              <div className="mt-4">
                <div className="grid grid-cols-5 border border-slate-200 bg-white/70">
                  {[
                    { icon: <Bed className="h-5 w-5 text-[#6C819B]" />, v: active?.dormitorios },
                    { icon: <ShowerHead className="h-5 w-5 text-[#6C819B]" />, v: active?.banos },
                    { icon: <Car className="h-5 w-5 text-[#6C819B]" />, v: active?.estacionamientos },
                    { icon: <Ruler className="h-5 w-5 text-[#6C819B]" />, v: fmtInt(active?.superficie_util_m2) },
                    { icon: <Square className="h-5 w-5 text-[#6C819B]" />, v: fmtInt(active?.superficie_terreno_m2) },
                  ].map((t, idx) => (
                    <div
                      key={idx}
                      className={`${idx < 4 ? 'border-r border-slate-200 ' : ''} flex flex-col items-center justify-center gap-1 py-2 md:py-[10px]`}
                    >
                      {t.icon}
                      <span className="text-sm text-slate-800 leading-none">{(t as any).v ?? dash}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ---------- Botón + precio ---------- */}
              <div className="mt-4 flex items-end gap-3">
                {active?.id && (
                  <Link
                    ref={verMasRef}
                    href={`/propiedades/${active.id}`}
                    className="inline-flex text-sm tracking-wide rounded-none border border-[#0A2E57] text-[#0A2E57] bg-white"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.95)' }}
                  >
                    Ver más
                  </Link>
                )}

                <div ref={priceBoxRef} className="ml-auto text-right">
                  <div className="text-[1.15rem] md:text-[1.25rem] font-semibold text-[#0A2E57] leading-none">
                    {precioUfHero ? fmtUF(precioUfHero) : fmtPrecioFallback(active?.precio_uf, active?.precio_clp)}
                  </div>
                  {precioClpHero > 0 && (
                    <div className="text-sm md:text-base text-slate-600 mt-[2px]">{fmtCLP(precioClpHero)}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

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
      {/* ✅ FIN CARRUSEL */}

      {/* ================= ¿POR QUÉ GESSWEIN PROPERTIES? ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 items-stretch">
            {/* Texto */}
            <div className="md:order-1 order-2">
              <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
                ¿Por qué Gesswein Properties?
              </h2>
              <div className="text-[14px] text-black/70 leading-relaxed space-y-4">
                <p>
                  (Texto placeholder) Aquí va tu discurso de venta: cómo trabajas, en qué te diferencias, por qué
                  el estándar boutique, el rigor técnico y la experiencia integral cambian el resultado.
                </p>
                <p>
                  (Texto placeholder) Puedes reforzar método, transparencia, estética y ejecución comercial — y
                  explicar por qué eso genera mejor precio, mejor proceso y mejor experiencia.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/servicios"
                  className="inline-flex items-center justify-center px-5 py-3 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
                >
                  Ver más
                </Link>
              </div>
            </div>

            {/* Imagen */}
            <div className="md:order-2 order-1">
              <div className="w-full h-[260px] md:h-full overflow-hidden border border-black/10">
                <img src={WHY_IMG} alt="¿Por qué Gesswein Properties?" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OPORTUNIDADES EXCLUSIVAS ================= */}
      <section className="py-20 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 items-stretch">
            {/* Texto */}
            <div className="md:order-1 order-2">
              <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
                Oportunidades Exclusivas
              </h2>
              <div className="text-[14px] text-black/70 leading-relaxed space-y-4">
                <p>
                  (Texto placeholder) Explica qué son las oportunidades exclusivas: acceso temprano, propiedades
                  curadas, condiciones especiales, oportunidades off-market, etc.
                </p>
                <p>
                  (Texto placeholder) Puedes agregar cómo se accede, qué tipo de activo incluye, y por qué esto
                  le conviene al cliente.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/oportunidades-exclusivas"
                  className="inline-flex items-center justify-center px-5 py-3 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
                >
                  Ver más
                </Link>
              </div>
            </div>

            {/* Imagen */}
            <div className="md:order-2 order-1">
              <div className="w-full h-[260px] md:h-full overflow-hidden border border-black/10">
                <img src={OPORT_IMG} alt="Oportunidades Exclusivas" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REFERIDOS (VOLVER AL FORMATO QUE TENÍAN) ================= */}
      <section id="referidos" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* encabezado */}
          <div className="px-6 py-8 text-center">
            <div className="mx-auto h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Gift className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="mt-3 text-xl md:text-2xl uppercase tracking-[0.25em]">
              PROGRAMA DE REFERIDOS CON EXCLUSIVIDAD
            </h2>
            <p className="mt-2 text-slate-600">
              ¿Conoces a alguien que busca propiedad? Refiérelo y obtén beneficios exclusivos.
            </p>
          </div>

          {/* formulario */}
          <form className="px-6 pb-8" onSubmit={onSubmitReferido}>
            {/* ---------- referente ---------- */}
            <h3 className="text-sm md:text-base uppercase tracking-[0.25em]">
              TUS DATOS (REFERENTE)
            </h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input
                  required
                  value={refNombre}
                  onChange={(e) => setRefNombre(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="Tu nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input
                  required
                  type="email"
                  value={refEmail}
                  onChange={(e) => setRefEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="tu@email.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono *</label>
                <input
                  required
                  value={refTelefono}
                  onChange={(e) => setRefTelefono(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>

            {/* ---------- referido ---------- */}
            <h3 className="mt-8 text-sm md:text-base uppercase tracking-[0.25em]">
              DATOS DEL REFERIDO
            </h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                <input
                  required
                  value={refdNombre}
                  onChange={(e) => setRefdNombre(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="Nombre del referido"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Email *</label>
                <input
                  required
                  type="email"
                  value={refdEmail}
                  onChange={(e) => setRefdEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="correo@referido.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Teléfono *</label>
                <input
                  required
                  value={refdTelefono}
                  onChange={(e) => setRefdTelefono(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>

            {/* ---------- preferencias ---------- */}
            <h3 className="mt-8 text-sm md:text-base uppercase tracking-[0.25em]">
              PREFERENCIAS DEL REFERIDO
            </h3>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {/* servicio */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">¿Qué servicio necesita? *</label>
                <SmartSelect
                  options={SERVICIOS}
                  value={servicio}
                  onChange={setServicio}
                  placeholder="Seleccionar o escribir…"
                  className="w-full"
                />
              </div>

              {/* tipo propiedad */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Tipo de propiedad *</label>
                <SmartSelect
                  options={TIPO_PROPIEDAD}
                  value={tipoProp}
                  onChange={setTipoProp}
                  placeholder="Seleccionar o escribir…"
                  className="w-full"
                />
              </div>

              {/* región → TU LISTA LITERAL */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Región *</label>
                <SmartSelect
                  options={REGIONES_UI as string[]}
                  value={regionRef}
                  onChange={(v) => {
                    setRegionRef(v);
                    setComunaRef('');
                  }}
                  placeholder="Seleccionar o escribir…"
                  className="w-full"
                />
              </div>

              {/* comuna (habilitada solo si hay región) */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Comuna *</label>
                <SmartSelect
                  options={comunaOpts}
                  value={comunaRef}
                  onChange={setComunaRef}
                  placeholder={regionRef ? 'Seleccionar o escribir…' : 'Selecciona una región primero'}
                  disabled={!regionRef || comunaOpts.length === 0}
                  className="w-full"
                />
              </div>

              {/* precio */}
              <div>
                <label className="block text-sm text-slate-700 mb-1">Precio mínimo (UF) *</label>
                <input
                  required
                  inputMode="numeric"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-700 mb-1">Precio máximo (UF) *</label>
                <input
                  required
                  inputMode="numeric"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="0"
                />
              </div>

              {/* contexto adicional (NO requerido) */}
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-700 mb-1">Contexto adicional</label>
                <textarea
                  rows={4}
                  value={comentarios}
                  onChange={(e) => setComentarios(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400"
                  placeholder="Cualquier información adicional que pueda ser útil…"
                />
              </div>
            </div>

            {/* botón enviar (sin texto abajo) */}
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                disabled={!isValid}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm tracking-wide text-white bg-[#0A2E57] rounded-none transition ${
                  !isValid ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-95'
                }`}
                style={{
                  boxShadow:
                    'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.35)',
                }}
              >
                <Gift className="h-4 w-4" /> Enviar referido
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
