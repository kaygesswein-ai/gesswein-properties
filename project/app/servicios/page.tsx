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
              Metodología probada para lograr un resultado superior.
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
 *  - Estilo sobrio, corporativo, sin bordes redondeados (regla del proyecto)
 * ========================================================================== */
function ServiciosEtapasSeccion() {
  // Estado del modal
  const [modal, setModal] = useState<null | { block: 'ACTIVO' | 'PATRIMONIAL'; index: number }>(null);

  // Accesibilidad: bloquear scroll y manejar ESC
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal(null);
    };
    if (modal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onEsc);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onEsc);
    };
  }, [modal]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header sección */}
        <header className="pl-2 sm:pl-4 max-w-4xl">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.30em] uppercase font-medium">
            Servicios Gesswein Properties
          </h2>
          <p className="text-black/70 text-[14px] leading-relaxed mt-3">
            Combinamos datos, estrategia y diseño para acompañarte en cada etapa del ciclo inmobiliario.
            Nuestros servicios se agrupan en dos áreas complementarias: Gestión del Activo Inmobiliario y
            Gestión Patrimonial & Familiar.
          </p>
        </header>

        {/* ======= BLOQUE I — Gestión del Activo Inmobiliario ======= */}
        <div className="mt-12 pl-2 sm:pl-4">
          <div className="text-[13px] uppercase tracking-[.25em] text-[#0A2E57]">
            BLOQUE I
          </div>
          <h3 className="mt-1 text-[18px] text-black/90">
            Gestión del Activo Inmobiliario
          </h3>
          <p className="mt-2 text-[13px] text-black/70 italic max-w-3xl">
            Cuidamos cada detalle del activo físico: su valor, su potencial y su expresión arquitectónica.
          </p>
        </div>

        <CardsGrid
          cards={ACTIVO_CARDS}
          onOpen={(i) => setModal({ block: 'ACTIVO', index: i })}
          cols={{ base: 1, md: 2, xl: 3 }}
          className="mt-8"
        />

        {/* ======= BLOQUE II — Gestión Patrimonial & Familiar ======= */}
        <div className="mt-16 pl-2 sm:pl-4">
          <div className="text-[13px] uppercase tracking-[.25em] text-[#0A2E57]">
            BLOQUE II
          </div>
          <h3 className="mt-1 text-[18px] text-black/90">
            Gestión Patrimonial & Familiar
          </h3>
          <p className="mt-2 text-[13px] text-black/70 italic max-w-3xl">
            Acompañamos a las personas y familias detrás de cada inversión, con visión financiera, legal y humana.
          </p>
        </div>

        <CardsGrid
          cards={PATRIMONIAL_CARDS}
          onOpen={(i) => setModal({ block: 'PATRIMONIAL', index: i })}
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

/* ====== GRID DE CARDS ====== */
function CardsGrid({
  cards,
  onOpen,
  cols,
  className = '',
}: {
  cards: ServiceCard[];
  onOpen: (index: number) => void;
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
      {cards.map((c, i) => (
        <article
          key={c.title}
          data-card
          data-index={i}
          className={[
            'relative overflow-hidden border border-slate-200 bg-white shadow-sm',
            'transition transform',
            'hover:-translate-y-[4px] hover:shadow-md',
            visible[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
          ].join(' ')}
          style={{ transitionDuration: '600ms', transitionTimingFunction: 'ease-out' }}
        >
          {/* Imagen */}
          <div className="relative aspect-[4/3]">
            <img
              src={c.img}
              alt={c.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300" />
          </div>

          {/* Contenido */}
          <div className="p-6">
            <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
              {c.kicker}
            </div>
            <h4 className="mt-1 text-[16px] text-black/90">{c.title}</h4>
            <p className="mt-2 text-[13px] text-black/70 leading-relaxed">{c.summary}</p>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => onOpen(i)}
                className="inline-flex items-center justify-center px-4 py-2 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
              >
                Ver más
              </button>
            </div>
          </div>
        </article>
      ))}
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

  // Focus trap simple
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
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        style={{ contain: 'content' }}
      >
        <div
          className={[
            'w-full max-w-[720px] bg-white border border-black/10 shadow-xl',
            'opacity-100 scale-100',
            'transition duration-200',
          ].join(' ')}
        >
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
    img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop',
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
    img: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop',
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
    img: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=1600&auto=format&fit=crop',
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
    img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
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
    img: 'https://images.unsplash.com/photo-1554224155-3a589877462f?q=80&w=1600&auto=format&fit=crop',
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
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
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
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
  },
];

/* ================= PROCESO (SE MANTIENE, SOLO SE MOVIÓ ARRIBA) ================= */
const PROCESO = [
  {
    title: 'Diagnóstico & precio',
    text: 'Reunión, inspección y propuesta de valor basada en datos.',
  },
  {
    title: 'Preparación',
    text: 'Ajustes rápidos y producción visual profesional.',
  },
  {
    title: 'Lanzamiento',
    text: 'Publicación, segmentación y respuesta ágil a interesados.',
  },
  {
    title: 'Negociación & cierre',
    text: 'Aseguramos el mejor acuerdo y acompañamos hasta la escritura.',
  },
] as const;
