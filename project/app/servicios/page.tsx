'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Megaphone,
  LineChart,
  Building2,
  Gavel,
  Ruler,
  ClipboardList,
  TrendingUp,
} from 'lucide-react';

/** =========================================================
 *  Página de Servicios — coherente con Inicio y Propiedades
 *  ========================================================= */
export default function ServiciosPage() {
  return (
    <main className="bg-white">

      {/* ================= HERO (igual a Propiedades) ================= */}
      <section className="relative min-h-[100svh]">
        <img
          src="https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/Foto%20portada%20-%20Servicios%20-%20ORIGINAL.jpeg"
          alt="Portada Servicios"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 35%' }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pl-2 sm:pl-4">
              <div className="max-w-3xl">
                <h1 className="text-white text-3xl md:text-4xl uppercase tracking-[0.25em]">
                  SERVICIOS
                </h1>
                <p className="text-white/85 mt-2">
                  Combinamos datos, diseño y marketing premium para vender o arrendar tu propiedad
                  con la mejor experiencia y resultados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= (MOVIDO AL INICIO) PROCESO — LÍNEA DE TIEMPO ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 max-w-4xl mb-12">
            <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
              Un proceso claro y transparente
            </h2>
            <p className="text-black/70 text-[14px] leading-relaxed">
              Estructuramos nuestro proceso en etapas cuidadosamente diseñadas, aplicables de manera transversal a cada servicio, garantizando una experiencia coherente, transparente y de excelencia en todos nuestros proyectos.
            </p>
          </div>

          {/* DESKTOP / TABLET — NO TOCAR */}
          <div className="hidden sm:block relative">
            <div className="absolute left-[5%] right-[5%] top-8 h-px bg-[#0A2E57]/30" />
            <div className="grid grid-cols-4 gap-8 text-center">
              {PROCESO.map((p, i) => (
                <div key={p.title} className="pt-10">
                  <span className="mx-auto -mt-7 mb-5 block h-2 w-2 bg-[#0A2E57] ring-2 ring-[#0A2E57]/25" />
                  <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
                    Paso {i + 1}
                  </div>
                  <h3 className="mt-1 text-[14px] text-black/90">{p.title}</h3>
                  <p className="mt-2 text-[13px] text-black/70 leading-relaxed max-w-[260px] mx-auto">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* MÓVIL — sin puntos, misma línea vertical y tipografía */}
          <div className="sm:hidden relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-[#0A2E57]/25" />
            <ol className="flex flex-col gap-8">
              {PROCESO.map((p, i) => (
                <li key={p.title} className="relative">
                  <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase ml-1">
                    Paso {i + 1}
                  </div>
                  <h3 className="mt-1 text-[14px] text-black/90">{p.title}</h3>
                  <p className="mt-1 text-[13px] text-black/70 leading-relaxed">
                    {p.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ================= NUEVA SECCIÓN: SERVICIOS GESSWEIN PROPERTIES ================= */}
      <ServiciosEtapasSeccion />
    </main>
  );
}

/* ============================================================================
 *  SECCIÓN “Servicios Gesswein Properties”
 *  - Dos bloques con cards interactivas
 *  - Overlay que sube desde abajo y, al clic, EXPANDE a toda la foto con el detalle
 * ========================================================================== */
function ServiciosEtapasSeccion() {
  // índice de card expandida (full overlay). null = ninguna
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // cerrar al presionar Escape (accesibilidad)
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpandedIdx(null); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header sección */}
        <header className="pl-2 sm:pl-4 max-w-4xl">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.30em] uppercase font-medium">
            Servicios Gesswein Properties
          </h2>

          {/* Línea 1 */}
          <p className="text-black/70 text-[14px] leading-relaxed mt-3">
            Dominamos cada etapa del proceso inmobiliario — desde la estrategia patrimonial hasta la gestión y
            valorización del activo, con el fin de acompañarte en cada decisión y ser el sustento que necesitas
            para llevar a cabo tu inversión y tu proyecto de vida.
          </p>

          {/* Línea 2 */}
          <p className="text-black/70 text-[14px] leading-relaxed mt-2">
            Nuestros servicios se agrupan en dos áreas complementarias: Gestión del Activo Inmobiliario y
            Gestión Patrimonial & Familiar.
          </p>

          {/* Nota editorial */}
          <div className="mt-6 border border-black/10 bg-[#F9FAFB] text-black/70 text-[13px] leading-relaxed p-4 italic">
            Cada servicio forma parte de una cadena integral que cubre todo el ciclo inmobiliario.<br />
            Podemos ejecutarlos de manera independiente o combinada, diseñando la solución que mejor se adapta a tus
            objetivos, tu momento y tu inversión.
          </div>
        </header>

        {/* ======= BLOQUE I ======= */}
        <div className="mt-12 pl-2 sm:pl-4">
          <div className="text-[#0A2E57] text-[13px] tracking-[.25em] uppercase">
            Gestión del Activo Inmobiliario
          </div>
          <p className="mt-2 text-[13px] text-black/70 italic max-w-3xl">
            Cuidamos cada detalle del activo físico: su valor, su potencial y su expresión arquitectónica.
          </p>
        </div>

        <CardsGrid
          cards={ACTIVO_CARDS}
          expandedIdx={expandedIdx}
          setExpandedIdx={setExpandedIdx}
          cols={{ md: 2, xl: 3 }}
          className="mt-8"
        />

        {/* ======= BLOQUE II ======= */}
        <div className="mt-16 pl-2 sm:pl-4">
          <div className="text-[#0A2E57] text-[13px] tracking-[.25em] uppercase">
            Gestión Patrimonial & Familiar
          </div>
          <p className="mt-2 text-[13px] text-black/70 italic max-w-3xl">
            Acompañamos a las personas y familias detrás de cada inversión, con visión financiera, legal y humana.
          </p>
        </div>

        <CardsGrid
          cards={PATRIMONIAL_CARDS}
          expandedIdx={expandedIdx}
          setExpandedIdx={setExpandedIdx}
          cols={{ md: 2, xl: 3 }}
          className="mt-8"
        />
      </div>
    </section>
  );
}

/* ====== GRID DE CARDS (overlay desde abajo → full overlay al clic) ====== */
function CardsGrid({
  cards,
  expandedIdx,
  setExpandedIdx,
  cols,
  className = '',
}: {
  cards: ServiceCard[];
  expandedIdx: number | null;
  setExpandedIdx: (v: number | null) => void;
  cols: { md: number; xl: number };
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean[]>(Array(cards.length).fill(false));

  // reveal on scroll
  useEffect(() => {
    const nodes = containerRef.current?.querySelectorAll('[data-card]') ?? [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.index);
            setVisible((v) => {
              const n = [...v];
              n[idx] = true;
              return n;
            });
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [cards.length]);

  const gridClass = [
    'grid gap-6 xl:gap-8',
    'grid-cols-1',
    `md:grid-cols-${cols.md}`,
    `xl:grid-cols-${cols.xl}`,
  ].join(' ');

  return (
    <div ref={containerRef} className={`${gridClass} ${className}`}>
      {cards.map((c, i) => {
        const isExpanded = expandedIdx === i;

        const toggle = () => setExpandedIdx(isExpanded ? null : i);

        return (
          <article
            key={c.title}
            data-card
            data-index={i}
            className={[
              'group relative overflow-hidden border border-slate-200 bg-white shadow-sm select-none',
              'transition transform',
              'hover:-translate-y-[4px] hover:shadow-md',
              visible[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
            ].join(' ')}
            style={{ transitionDuration: '600ms', transitionTimingFunction: 'ease-out' }}
          >
            {/* Imagen + click en cualquier parte */}
            <div
              className="relative aspect-[4/3] cursor-pointer"
              onClick={toggle}
            >
              <img
                src={c.img}
                alt={c.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay: bottom sheet en hover → FULL overlay al clic */}
              <div
                className={[
                  // base
                  'absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-[1px] border-t border-black/10',
                  // animación de entrada tipo "desde abajo"
                  'translate-y-full opacity-0',
                  'group-hover:translate-y-0 group-hover:opacity-100',
                  'transition-[transform,opacity] duration-300 ease-out',
                  // estado expandido: cubrir toda la foto
                  isExpanded ? 'inset-0 !translate-y-0 !opacity-100 overflow-auto' : '',
                ].join(' ')}
              >
                <div className="p-5 sm:p-6">
                  {/* Título tipo kicker (se mantiene el mismo formato) */}
                  <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
                    {c.title}
                  </div>

                  {/* Resumen */}
                  <p className="mt-2 text-[13px] text-black/70 leading-relaxed">{c.summary}</p>

                  {/* Detalle: SOLO visible cuando está expandido (dentro de la misma card) */}
                  <div
                    className={[
                      'overflow-hidden transition-[max-height,opacity] duration-300 ease-out',
                      isExpanded ? 'max-h-[560px] opacity-100 mt-3' : 'max-h-0 opacity-0',
                    ].join(' ')}
                  >
                    <ul className="space-y-1.5 text-[13px] text-black/80 leading-relaxed">
                      {c.details.map((it) => (
                        <li key={it} className="pl-3 relative">
                          <span className="absolute left-0 top-[9px] h-[5px] w-[5px] bg-[#0A2E57]" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA: Ver más → Cerrar (toggle) */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggle(); }}
                      className="inline-flex items-center justify-center px-4 py-2 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
                    >
                      {isExpanded ? 'Cerrar' : 'Ver más'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ====================== TIPOS Y DATOS ====================== */
type ServiceCard = {
  kicker: string;
  title: string;
  summary: string;
  details: string[];
  img: string;
};

/* BLOQUE I — Gestión del Activo Inmobiliario (5 cards) */
const ACTIVO_CARDS: ServiceCard[] = [
  {
    kicker: 'Compra-Venta',
    title: 'Compra-venta de propiedades',
    summary:
      'Acompañamos todo el proceso de compra o venta, desde la búsqueda hasta el cierre, con estrategia y control absoluto.',
    details: [
      'Búsqueda on/off market y análisis comparativo de mercado (ACM)',
      'Tasación, due diligence técnica y legal',
      'Negociación de oferta y condiciones comerciales',
      'Firma notarial e inscripción del título de propiedad en el Conservador de Bienes Raíces',
      'Control documental y seguimiento post-cierre',
      'Estrategia de venta con storytelling visual y gestión comercial premium',
    ],
    img: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Servicios/Compra-venta.jpeg',
  },
  {
    kicker: 'Arriendos',
    title: 'Arriendos y gestión integral',
    summary:
      'Buscamos o administramos tu propiedad en arriendo, con un enfoque personalizado y financiero.',
    details: [
      'Búsqueda de propiedades de arriendo según tus necesidades',
      'Asesoría contractual y negociación de condiciones',
      'Scoring y selección de arrendatarios',
      'Cobranza, reajustes, mantenciones y seguros',
      'Administración integral con reportes mensuales',
      'Estrategias de rentabilidad y control de flujos',
    ],
    img: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Servicios/Depto.jpg',
  },
  {
    kicker: 'Valoración',
    title: 'Tasación y valoración inmobiliaria',
    summary:
      'Determinamos el valor real de tus activos con rigor profesional y enfoque integral de valorización.',
    details: [
      'Tasación de mercado, reposición y flujo descontado',
      'Estudio normativo, entorno y plusvalía',
      'Benchmark comparativo de zona y tendencias',
      'Modelos financieros de valorización y sensibilidad',
      'Informes técnicos con respaldo profesional y certificación',
    ],
    img: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop',
  },
  {
    kicker: 'Arquitectura',
    title: 'Arquitectura y remodelación',
    summary:
      'Desarrollamos proyectos arquitectónicos y remodelaciones integrales con control de calidad y diseño coherente.',
    details: [
      'Anteproyecto y diseño arquitectónico',
      'Regularización y permisos municipales (DOM)',
      'Remodelaciones parciales o integrales',
      'Licitación y supervisión de contratistas',
      'Gestión de plazos, costos y calidad',
      'Recepción de obra y entrega llave en mano',
    ],
    img: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Servicios/Arquitectura.jpg',
  },
  {
    kicker: 'Interiores',
    title: 'Diseño de interiores',
    summary:
      'Creamos espacios que combinan estética, funcionalidad y valorización patrimonial.',
    details: [
      'Diseño interior residencial o corporativo',
      'Selección de materiales, mobiliario y luminarias',
      'Propuesta estética alineada al perfil del cliente',
      'Supervisión de implementación y detalles finales',
      'Home staging para potenciar venta o arriendo',
    ],
    img: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Servicios/IMG_5373.jpeg',
  },
];

/* BLOQUE II — Gestión Patrimonial & Familiar (3 cards) */
const PATRIMONIAL_CARDS: ServiceCard[] = [
  {
    kicker: 'Asesoría integral',
    title: 'Asesoría legal, tributaria y financiera',
    summary:
      'Estrategia personalizada que integra lo legal, tributario y financiero para optimizar tus decisiones inmobiliarias.',
    details: [
      'Diagnóstico patrimonial y análisis crediticio',
      'Definición de la estructura jurídica ideal (natural, SpA, sociedad familiar)',
      'Optimización tributaria y planificación sucesoria',
      'Búsqueda y negociación de financiamiento con bancos o mutuarias',
      'Estructuración de operaciones en UF o USD según perfil de riesgo',
      'Estrategia de inversión y gestión de activos',
    ],
    img: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Servicios/job-5382501_1920.jpg',
  },
  {
    kicker: 'Gestión continua',
    title: 'Gestión activa y asesoría continua',
    summary:
      'Supervisamos tu portafolio inmobiliario de forma permanente, asegurando control, eficiencia y crecimiento sostenido.',
    details: [
      'Revisión de tasas y refinanciamiento hipotecario',
      'Evaluación de ROI, flujos y rentas netas',
      'Estrategias de reinversión o desinversión',
      'Consolidación de deuda y proyección de valorización',
      'Reportes anuales de performance inmobiliario',
      'Planificación patrimonial y sucesoria familiar',
    ],
    img: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Servicios/Asesoria%20Continua.jpg',
  },
  {
    kicker: 'Relocation',
    title: 'Relocation & asesoría internacional',
    summary:
      'Acompañamos a familias, ejecutivos o embajadas en su instalación en Chile, gestionando un proceso llave en mano.',
    details: [
      'Búsqueda y adecuación de vivienda (compra o arriendo)',
      'Remodelación, diseño y entrega lista para habitar',
      'Coordinación con colegios, bancos y servicios',
      'Asistencia legal y logística de instalación',
      'Seguimiento post-arribo y gestión personalizada',
    ],
    img: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Servicios/move-2481718_1920.jpg',
  },
];

/* ================= PROCESO (SE MANTIENE, SOLO SE MOVIÓ ARRIBA) ================= */
const PROCESO = [
  {
    title: 'Alcance del Trabajo & Propuesta de servicios',
    text: 'Iniciamos con una reunión personalizada y una evaluación detallada de los requerimientos, para luego presentar una propuesta de valor a medida, diseñada para reflejar las verdaderas necesidades y aspiraciones del cliente.',
  },
  {
    title: 'Puesta en Marcha',
    text: 'Transformamos los objetivos del cliente en un plan de acción concreto, definiendo cada etapa con precisión y poniendo en movimiento las gestiones necesarias para materializar su visión.',
  },
  {
    title: 'Ejecución & Seguimiento',
    text: 'Llevamos a cabo el plan definido, supervisando los avances y asegurando una comunicación constante con el cliente para garantizar alineación y resultados coherentes con sus expectativas.',
  },
  {
    title: 'Cierre & Satisfacción',
    text: 'Consolidamos los resultados, verificamos el cumplimiento de cada detalle y nos aseguramos de que la experiencia final refleje plenamente la calidad y excelencia que distinguen a nuestra firma.',
  },
] as const;
