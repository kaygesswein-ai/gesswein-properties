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
  X,
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
          src="https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/IMG_5437%20(1).jpeg"
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
 *  - Dos bloques con cards interactivas y modal de ficha técnica
 *  - Overlay que sube desde abajo sobre la foto (hover/touch)
 * ========================================================================== */
function ServiciosEtapasSeccion() {
  const [modal, setModal] = useState<null | { block: 'ACTIVO' | 'PATRIMONIAL'; index: number }>(null);
  const [isCoarse, setIsCoarse] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // Accesibilidad + detección de puntero táctil
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setModal(null); };
    if (modal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onEsc);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEsc);
    };
  }, [modal]);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    setIsCoarse(mq.matches);
    const listener = (e: MediaQueryListEvent) => setIsCoarse(e.matches);
    mq.addEventListener?.('change', listener);
    return () => mq.removeEventListener?.('change', listener);
  }, []);

  useEffect(() => {
    if (modal) setActiveIdx(null);
  }, [modal]);

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

          {/* Nota editorial — TEXTO ACTUALIZADO */}
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
          onOpen={(i) => setModal({ block: 'ACTIVO', index: i })}
          onToggleOverlay={(i) => isCoarse && setActiveIdx((curr) => (curr === i ? null : i))}
          isOverlayActive={(i) => (isCoarse ? activeIdx === i : false)}
          cols={{ base: 1, md: 2, xl: 3 }}
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
          onOpen={(i) => setModal({ block: 'PATRIMONIAL', index: i })}
          onToggleOverlay={(i) => isCoarse && setActiveIdx((curr) => (curr === i ? null : i))}
          isOverlayActive={(i) => (isCoarse ? activeIdx === i : false)}
          cols={{ base: 1, md: 2, xl: 3 }}
          className="mt-8"
        />
      </div>

      {/* Modal */}
      {modal && (
        <ServiceModal
          title={
            modal.block === 'ACTIVO'
              ? ACTIVO_CARDS[modal.index].title
              : PATRIMONIAL_CARDS[modal.index].title
          }
          summary={
            modal.block === 'ACTIVO'
              ? ACTIVO_CARDS[modal.index].summary
              : PATRIMONIAL_CARDS[modal.index].summary
          }
          items={
            modal.block === 'ACTIVO'
              ? ACTIVO_CARDS[modal.index].details
              : PATRIMONIAL_CARDS[modal.index].details
          }
          onClose={() => setModal(null)}
        />
      )}
    </section>
  );
}

/* ====== GRID DE CARDS (overlay desde abajo) ====== */
function CardsGrid({
  cards,
  onOpen,
  onToggleOverlay,
  isOverlayActive,
  cols,
  className = '',
}: {
  cards: ServiceCard[];
  onOpen: (index: number) => void;
  onToggleOverlay: (index: number) => void;
  isOverlayActive: (index: number) => boolean;
  cols: { base: number; md: number; xl: number };
  className?: string;
}) {
  // Reveal on scroll (stagger)
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean[]>(Array(cards.length).fill(false));

  useEffect(() => {
    const nodes = containerRef.current?.querySelectorAll('[data-card]') ?? [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.index);
            setVisible((v) => {
              const next = [...v];
              next[idx] = true;
              return next;
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
    `grid-cols-1`,
    `md:grid-cols-${cols.md}`,
    `xl:grid-cols-${cols.xl}`,
  ].join(' ');

  return (
    <div ref={containerRef} className={`${gridClass} ${className}`}>
      {cards.map((c, i) => {
        const showOverlay = isOverlayActive(i);
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
            {/* Imagen */}
            <div
              className="relative aspect-[4/3] cursor-pointer"
              onClick={() => onToggleOverlay(i)}
            >
              <img
                src={c.img}
                alt={c.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay: sube desde abajo (hover en desktop / toggle en touch) */}
              <div
                className={[
                  'absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-[1px] border-t border-black/10',
                  'translate-y-full opacity-0',
                  'group-hover:translate-y-0 group-hover:opacity-100',
                  'transition-transform duration-300 ease-out',
                  showOverlay ? '!translate-y-0 !opacity-100' : '',
                ].join(' ')}
              >
                <div className="p-5">
                  {/* ÚNICA LÍNEA DE ENCABEZADO (formato kicker) */}
                  <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
                    {c.title}
                  </div>

                  {/* Resumen */}
                  <p className="mt-2 text-[13px] text-black/70 leading-relaxed">{c.summary}</p>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(i);
                      }}
                      className="inline-flex items-center justify-center px-4 py-2 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
                    >
                      Ver más
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

/* ====== MODAL ====== */
function ServiceModal({
  title,
  summary,
  items,
  onClose,
}: {
  title: string;
  summary: string;
  items: string[];
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    firstBtnRef.current?.focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = backdropRef.current?.querySelectorAll<HTMLElement>(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
      prev?.focus();
    };
  }, []);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[80] bg-black/50"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[720px] bg-white border border-black/10 shadow-xl transition duration-200">
          <div className="flex items-start justify-between p-6 border-b border-black/10">
            <div>
              <h4 className="text-[16px] text-black/90">{title}</h4>
              <p className="mt-1 text-[13px] text-black/70">{summary}</p>
            </div>
            <button
              ref={firstBtnRef}
              onClick={onClose}
              aria-label="Cerrar modal"
              className="p-2 border border-black/20 hover:bg-slate-50 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6">
            <ul className="space-y-1.5 text-[13px] text-black/80 leading-relaxed">
              {items.map((it) => (
                <li key={it} className="pl-3 relative">
                  <span className="absolute left-0 top-[9px] h-[5px] w-[5px] bg-[#0A2E57]" />
                  {it}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================== TIPOS Y DATOS ====================== */
type ServiceCard = {
  kicker: string; // ya no se muestra en la card, pero lo mantenemos por si se usa luego
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
