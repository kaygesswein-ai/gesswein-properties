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
import HeroImage from '../components/HeroImage';

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
  portada_url?: string | null;
  portada_fija_url?: string | null;
};

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

const capWords = (s?: string | null) =>
  (s ?? '')
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ')
    .trim();

function getHeroImage(p?: Partial<Property>) {
  if (!p) return '';
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
  return (src as string) || '';
}

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
};

const SERVICIOS = ['Comprar', 'Vender', 'Arrendar', 'Gestionar un arriendo', 'Consultoría específica'];
const TIPO_PROPIEDAD = ['Casa', 'Departamento', 'Bodega', 'Oficina', 'Local comercial', 'Terreno'];

export default function HomePage() {
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [i, setI] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [detailById, setDetailById] = useState<
    Record<string, { portada_url?: string | null; portada_fija_url?: string | null }>
  >({});

  const priceBoxRef = useRef<HTMLDivElement | null>(null);
  const verMasRef = useRef<HTMLAnchorElement | null>(null);

  const [regionRef, setRegionRef] = useState('');
  const [comunaRef, setComunaRef] = useState('');
  const comunaOpts = regionRef ? COMUNAS_UI[regionRef] || [] : [];

  const [refNombre, setRefNombre] = useState('');
  const [refEmail, setRefEmail] = useState('');
  const [refTelefono, setRefTelefono] = useState('');

  const [cliNombre, setCliNombre] = useState('');
  const [cliEmail, setCliEmail] = useState('');
  const [cliTelefono, setCliTelefono] = useState('');

  const [servicioNeed, setServicioNeed] = useState('');
  const [tipoProp, setTipoProp] = useState('');

  const [precioMinUf, setPrecioMinUf] = useState('');
  const [precioMaxUf, setPrecioMaxUf] = useState('');
  const [comentarios, setComentarios] = useState('');

  const [termsOpen, setTermsOpen] = useState(false);
  const [sendingRef, setSendingRef] = useState(false);
  const [refSuccess, setRefSuccess] = useState('');
  const [refError, setRefError] = useState('');

  const [currentHeroReady, setCurrentHeroReady] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

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
    startAutoplay();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [destacadas.length]);

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

  const active = destacadas[i];
  const enrichedActive = active ? { ...active, ...(detailById[active.id] || {}) } : undefined;
  const bg = useMemo(() => getHeroImage(enrichedActive), [enrichedActive]);

  const heroReady = Boolean(active?.id && bg && currentHeroReady);

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
  }, [active, currentHeroReady]);

  const dash = '—';
  const fmtInt = (n: number | null | undefined) =>
    typeof n === 'number' ? new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n) : dash;

  async function onSubmitReferidos(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    setRefSuccess('');
    setRefError('');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSendingRef(true);

    try {
      const payload = {
        referente_nombre: refNombre.trim(),
        referente_email: refEmail.trim(),
        referente_telefono: refTelefono.trim(),
        referido_nombre: cliNombre.trim(),
        referido_email: cliEmail.trim(),
        referido_telefono: cliTelefono.trim(),
        servicio_necesita: servicioNeed.trim(),
        tipo_propiedad: tipoProp.trim(),
        region: regionRef.trim(),
        comuna: comunaRef.trim(),
        precio_min_uf: precioMinUf ? Number(precioMinUf) : null,
        precio_max_uf: precioMaxUf ? Number(precioMaxUf) : null,
        comentarios: comentarios.trim(),
      };

      const res = await fetch('/api/referidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || 'No fue posible enviar el referido.');
      }

      setRefNombre('');
      setRefEmail('');
      setRefTelefono('');
      setCliNombre('');
      setCliEmail('');
      setCliTelefono('');
      setServicioNeed('');
      setTipoProp('');
      setRegionRef('');
      setComunaRef('');
      setPrecioMinUf('');
      setPrecioMaxUf('');
      setComentarios('');

      setRefSuccess('Tu referido fue enviado correctamente. Te contactaremos si necesitamos más información.');
      formRef.current?.reset();
    } catch (err: any) {
      setRefError(err?.message || 'Ocurrió un error al enviar el referido.');
    } finally {
      setSendingRef(false);
    }
  }

  const WHY_IMG =
    'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/Inicio/0100005.JPG';
  const OPPS_IMG =
    'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/Inicio/0100034.JPG';

  return (
    <main className="bg-white">
      <section
        className="relative w-full overflow-hidden isolate"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <HeroImage
          src={bg}
          alt={active?.titulo || 'Propiedad destacada'}
          objectPosition="50% 50%"
          showInitialBrandOverlay
          minInitialOverlayMs={900}
          persistAcrossRoutes
          mediaMode="all"
          onCurrentReadyChange={setCurrentHeroReady}
        />

        {heroReady ? <div className="absolute inset-0 -z-10 bg-black/35" /> : null}

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 min-h-[100svh] flex items-end pb-16 md:pb-20">
          <div className="w-full">
            {heroReady ? (
              <div className="bg-white/70 backdrop-blur-sm shadow-xl p-4 md:p-5 w-full md:max-w-[480px]">
                <h1 className="text-[1.4rem] md:text-2xl text-gray-900">
                  {active?.titulo ?? 'Propiedad destacada'}
                </h1>
                <p className="mt-1 text-sm text-gray-600">{lineaSecundaria || '—'}</p>

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
            ) : null}
          </div>

          {heroReady && destacadas.length > 1 && (
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

          {heroReady && destacadas.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {destacadas.map((_, idx) => (
                <span key={idx} className={`h-1.5 w-6 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-10 md:grid-cols-2 items-stretch">
            <div className="md:order-1 order-2">
              <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
                ¿Por qué Gesswein Properties?
              </h2>

              <div className="text-[14px] text-black/70 leading-relaxed space-y-4">
                <p>Porque el corretaje tradicional intermedia. Nosotros gestionamos activos.</p>
                <p>
                  En Chile, la mayoría de las corredoras opera con un enfoque transaccional: captación, fotos, publicación, coordinación de visitas y negociación. Ese modelo funciona cuando la propiedad es simple y el mercado está “fácil”. Pero en propiedades premium —y especialmente en activos con complejidad normativa, potencial de transformación o alto valor patrimonial— ese enfoque deja valor en la mesa y eleva el riesgo.
                </p>
                <p>
                  Gesswein Properties trabaja dstinto al integrar arquitectura, normativa y estrategia comercial para gestionar propiedades como verdaderos activos inmobiliarios. A diferencia del corretaje tradicional, no nos limitamos a intermediar: analizamos el potencial técnico, constructivo y normativo de cada propiedad antes de salir al mercado, anticipamos riesgos y diseñamos una estrategia que maximiza su valor real.
                </p>
                <p>
                  Nuestro enfoque permite tomar decisiones inmobiliarias con claridad, respaldo profesional y control del proceso, reduciendo incertidumbre y elevando el estándar de la operación.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/equipo"
                  className="inline-flex items-center justify-center px-4 py-2 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
                >
                  Ver más
                </Link>
              </div>
            </div>

            <div className="md:order-2 order-1">
              <div className="w-full h-[260px] md:h-full overflow-hidden border border-black/10">
                <img src={WHY_IMG} alt="¿Por qué Gesswein Properties?" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-10 md:grid-cols-2 items-stretch">
            <div className="md:order-1 order-2">
              <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
                Proyectos Exclusivos
              </h2>

              <div className="text-[14px] text-black/70 leading-relaxed space-y-4">
                <p>
                  No todas las oportunidades inmobiliarias llegan al mercado abierto. Algunas requieren criterio técnico, red estratégica y capacidad de estructuración.
                </p>
                <p>
                  En esta sección presentamos activos singulares y proyectos especiales que, por su modelo de negocio, oportunidad financiera o particularidad normativa, se gestionan bajo un esquema diferenciado y, en muchos casos, confidencial. Aquí encontrarás alternativas que no compiten en el mercado masivo: novaciones hipotecarias, oportunidades de flipping con fundamento técnico, propiedades con valor de mercado bajo y activos con potencial de densificación o desarrollo. Cada oportunidad es previamente analizada desde su viabilidad normativa, potencial constructivo, escenario de valorización y riesgo asociado. El acceso a esta sección es limitado y su disponibilidad cambia constantemente según oportunidades reales detectadas, gestionadas e identificadas por nuestro equipo.
                </p>
                <p>
                  Gesswein Properties no publica volumen. Gestiona oportunidades que requieren visión, estructura y decisión.
                </p>
              </div>

              <div className="mt-8">
                <Link
                  href="/proyectos-exclusivos"
                  className="inline-flex items-center justify-center px-4 py-2 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
                >
                  Ver más
                </Link>
              </div>
            </div>

            <div className="md:order-2 order-1">
              <div className="w-full h-[260px] md:h-full overflow-hidden border border-black/10 bg-white">
                <img src={OPPS_IMG} alt="Oportunidades Exclusivas" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="referidos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-black/10 bg-white flex items-center justify-center">
              <Gift className="h-5 w-5 text-[#0A2E57]" />
            </div>
            <div className="max-w-3xl">
              <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
                Programa de Referidos
              </h2>
              <p className="mt-2 text-[14px] text-black/70 leading-relaxed">
                ¿Conoces a alguien que busca propiedad? Refiérelo y accede a beneficios exclusivos. Completa los datos y
                nuestro equipo hará el seguimiento con el estándar Gesswein Properties.
              </p>
            </div>
          </div>

          <form ref={formRef} onSubmit={onSubmitReferidos} className="mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="border border-slate-200 bg-white shadow-sm p-6">
                <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
                  Tus datos (Referente)
                </div>

                <div className="mt-5 grid gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                    <input
                      required
                      value={refNombre}
                      onChange={(e) => setRefNombre(e.target.value)}
                      className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400"
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
                      className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Teléfono *</label>
                    <input
                      required
                      value={refTelefono}
                      onChange={(e) => setRefTelefono(e.target.value)}
                      className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 bg-white shadow-sm p-6">
                <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
                  Datos del Referido
                </div>

                <div className="mt-5 grid gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Nombre completo *</label>
                    <input
                      required
                      value={cliNombre}
                      onChange={(e) => setCliNombre(e.target.value)}
                      className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400"
                      placeholder="Nombre del referido"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Email *</label>
                    <input
                      required
                      type="email"
                      value={cliEmail}
                      onChange={(e) => setCliEmail(e.target.value)}
                      className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400"
                      placeholder="correo@referido.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Teléfono *</label>
                    <input
                      required
                      value={cliTelefono}
                      onChange={(e) => setCliTelefono(e.target.value)}
                      className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 bg-white shadow-sm p-6">
                <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
                  Preferencias
                </div>

                <div className="mt-5 grid gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">¿Qué servicio necesita? *</label>
                    <SmartSelect
                      options={SERVICIOS}
                      value={servicioNeed}
                      onChange={setServicioNeed}
                      placeholder="Seleccionar o escribir…"
                      className="w-full"
                    />
                    <input required value={servicioNeed} onChange={() => {}} className="hidden" />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Tipo de propiedad *</label>
                    <SmartSelect
                      options={TIPO_PROPIEDAD}
                      value={tipoProp}
                      onChange={setTipoProp}
                      placeholder="Seleccionar o escribir…"
                      className="w-full"
                    />
                    <input required value={tipoProp} onChange={() => {}} className="hidden" />
                  </div>

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
                    <input required value={regionRef} onChange={() => {}} className="hidden" />
                  </div>

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
                    <input required value={comunaRef} onChange={() => {}} className="hidden" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Precio mínimo (UF) *</label>
                      <input
                        required
                        inputMode="numeric"
                        value={precioMinUf}
                        onChange={(e) => setPrecioMinUf(e.target.value)}
                        className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">Precio máximo (UF) *</label>
                      <input
                        required
                        inputMode="numeric"
                        value={precioMaxUf}
                        onChange={(e) => setPrecioMaxUf(e.target.value)}
                        className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 border border-slate-200 bg-white shadow-sm p-6">
                <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
                  Contexto adicional
                </div>

                <div className="mt-5">
                  <label className="block text-sm text-slate-700 mb-1">Comentarios</label>
                  <textarea
                    rows={5}
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400"
                    placeholder="Cualquier información adicional que pueda ser útil…"
                  />
                </div>
              </div>

              <div className="border border-slate-200 bg-white shadow-sm p-6 flex flex-col">
                <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">Enviar</div>
                <div className="mt-1 text-[16px] text-black/90">Confirmación</div>

                <p className="mt-4 text-[13px] text-black/70 leading-relaxed">
                  Al enviar este formulario, aceptas nuestros{' '}
                  <button
                    type="button"
                    onClick={() => setTermsOpen(true)}
                    className="underline underline-offset-2 hover:text-[#0A2E57]"
                  >
                    términos del programa de referidos y política de privacidad
                  </button>.
                </p>

                <button
                  type="submit"
                  disabled={sendingRef}
                  className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm tracking-[.25em] uppercase text-white bg-[#0A2E57] rounded-none disabled:opacity-70"
                  style={{
                    boxShadow:
                      'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.35)',
                  }}
                >
                  <Gift className="h-4 w-4" />
                  {sendingRef ? 'Enviando...' : 'Enviar referido'}
                </button>

                {refSuccess && (
                  <div className="mt-4 text-[12px] text-green-700 text-center">
                    {refSuccess}
                  </div>
                )}

                {refError && (
                  <div className="mt-4 text-[12px] text-red-700 text-center">
                    {refError}
                  </div>
                )}

                {!refSuccess && !refError && (
                  <div className="mt-3 text-center text-[12px] text-black/60">Responderemos a la brevedad.</div>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      {termsOpen && (
        <div className="fixed inset-0 z-[100] bg-black/45 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white border border-black/10 shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-[#0A2E57] text-[14px] tracking-[.22em] uppercase font-medium">
                Términos del Programa de Referidos y Política de Privacidad
              </h3>
              <button
                type="button"
                onClick={() => setTermsOpen(false)}
                className="text-sm border border-black/15 px-3 py-1 hover:bg-[#0A2E57] hover:text-white transition"
              >
                Cerrar
              </button>
            </div>

            <div className="px-6 py-6 text-[14px] text-black/75 leading-relaxed space-y-5">
              <div>
                <h4 className="text-[#0A2E57] font-medium mb-2">1. Finalidad del formulario</h4>
                <p>
                  Este formulario tiene por objeto recibir datos de contacto del referente y de la persona referida para evaluar una posible gestión comercial o asesoría inmobiliaria por parte de Gesswein Properties.
                </p>
              </div>

              <div>
                <h4 className="text-[#0A2E57] font-medium mb-2">2. Autorización de contacto</h4>
                <p>
                  Al enviar este formulario, declaras que cuentas con autorización suficiente para compartir los datos del referido con el fin de que Gesswein Properties pueda contactarlo en relación con los servicios solicitados o con oportunidades inmobiliarias relacionadas.
                </p>
              </div>

              <div>
                <h4 className="text-[#0A2E57] font-medium mb-2">3. Uso de los datos</h4>
                <p>
                  Los datos serán utilizados exclusivamente para fines de contacto comercial, seguimiento del referido, evaluación de necesidades inmobiliarias, coordinación de reuniones y gestión interna del programa de referidos. Gesswein Properties no vende esta información a terceros ni la utiliza para fines ajenos a la operación comercial propia de la empresa.
                </p>
              </div>

              <div>
                <h4 className="text-[#0A2E57] font-medium mb-2">4. Resguardo de información</h4>
                <p>
                  Gesswein Properties adoptará medidas razonables de resguardo y seguridad sobre la información recibida. Sin perjuicio de lo anterior, ningún sistema tecnológico es completamente infalible, por lo que no puede garantizarse una seguridad absoluta frente a eventos externos, ataques informáticos u otras contingencias fuera de control razonable.
                </p>
              </div>

              <div>
                <h4 className="text-[#0A2E57] font-medium mb-2">5. Exactitud de la información</h4>
                <p>
                  El usuario que envía el formulario es responsable de que la información proporcionada sea veraz, actualizada y pertinente. Gesswein Properties podrá abstenerse de gestionar referencias incompletas, inexactas o que no cumplan estándares mínimos de validación interna.
                </p>
              </div>

              <div>
                <h4 className="text-[#0A2E57] font-medium mb-2">6. Beneficios del programa</h4>
                <p>
                  La recepción de un referido no implica, por sí sola, la generación automática de beneficios, pagos o contraprestaciones. Cualquier beneficio asociado al programa de referidos estará sujeto a validación interna, a la efectiva trazabilidad del referido y a las condiciones comerciales que Gesswein Properties determine en cada caso.
                </p>
              </div>

              <div>
                <h4 className="text-[#0A2E57] font-medium mb-2">7. Solicitudes de eliminación o actualización</h4>
                <p>
                  Si deseas solicitar corrección, actualización o eliminación de los datos enviados, puedes escribir a contacto@gessweinproperties.cl indicando los datos involucrados y tu solicitud.
                </p>
              </div>

              <div>
                <h4 className="text-[#0A2E57] font-medium mb-2">8. Modificaciones</h4>
                <p>
                  Gesswein Properties podrá actualizar estos términos cuando sea necesario para mejorar la operación del programa o adecuar sus procesos internos. La versión publicada al momento del envío será la aplicable al formulario respectivo.
                </p>
              </div>

              <div className="pt-2 border-t border-black/10 text-[12px] text-black/55">
                Texto base de uso comercial general. Para una versión legal definitiva y cerrada, conviene revisión por abogado.
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
