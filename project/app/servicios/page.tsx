'use client';

import { useEffect, useRef, useState } from 'react';
import {
  LineChart,
  Building2,
  Gavel,
  Ruler,
  Megaphone,
  ClipboardList,
  TrendingUp,
} from 'lucide-react';

/** =========================================================
 *  Página de Servicios — versión zigzag vertical (sin fotos)
 *  Mantiene identidad: títulos en mayúsculas + tracking,
 *  sin negritas en párrafo, bordes rectos, azul #0A2E57.
 *  ========================================================= */
export default function ServiciosPage() {
  return (
    <main className="bg-white">
      {/* ================= ENCABEZADO SIMPLE (sin foto de fondo) ================= */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="pl-2 sm:pl-4 max-w-3xl">
            <h1 className="text-[#0A2E57] text-3xl md:text-4xl uppercase tracking-[0.25em]">
              SERVICIOS
            </h1>
            <p className="text-black/80 mt-3 text-[14px] leading-relaxed">
              Combinamos datos, diseño y marketing premium para vender o arrendar tu propiedad
              con la mejor experiencia y resultados.
            </p>
          </div>
        </div>
      </section>

      {/* ================= POR QUÉ GESSWEIN PROPERTIES ================= */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 max-w-4xl">
            <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase mb-6">
              ¿Por qué Gesswein Properties?
            </h2>
            <p className="text-black/80 text-[14px] leading-relaxed max-w-3xl">
              En Gesswein Properties nos definimos por un enfoque boutique, que combina excelencia
              técnica, comunicación cercana y una estética moderna aplicada a cada proyecto
              inmobiliario. Nuestro compromiso es ofrecer un servicio profesional, transparente
              y con alto estándar de ejecución.
            </p>

            <div className="mt-10 grid md:grid-cols-2 gap-6">
              <article className="border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-[15px] text-black/90 tracking-wide uppercase mb-2">
                  Misión
                </h3>
                <p className="text-[13px] text-black/70 leading-relaxed">
                  Brindar asesoría inmobiliaria integral, basada en confianza, precisión técnica
                  y diseño, conectando a nuestros clientes con oportunidades únicas de inversión
                  y hogar.
                </p>
              </article>

              <article className="border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-[15px] text-black/90 tracking-wide uppercase mb-2">
                  Visión
                </h3>
                <p className="text-[13px] text-black/70 leading-relaxed">
                  Ser la firma inmobiliaria de referencia en Chile por su excelencia estética,
                  profesionalismo y compromiso con la calidad de vida de quienes confían en nosotros.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ¿QUÉ SERVICIOS OFRECEMOS? — ZIGZAG ================= */}
      <ServiciosZigzagSeccion />

      {/* ================= PROCESO — (opcional) breve refuerzo ================= */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 max-w-4xl">
            <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase mb-6">
              Un proceso claro y transparente
            </h2>
            <p className="text-black/70 text-[14px] leading-relaxed max-w-3xl">
              Metodología probada para lograr un resultado superior, con seguimiento y reportes en cada hito.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================= COMPONENTE PRINCIPAL: SECCIÓN ZIGZAG ================= */
function ServiciosZigzagSeccion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título + Intro + aspiracional */}
        <header className="pl-2 sm:pl-4 max-w-3xl mx-auto text-center">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.30em] uppercase mb-4">
            ¿Qué servicios ofrecemos?
          </h2>
          <p className="text-black/70 text-[15px] leading-relaxed">
            Dominamos cada etapa del proceso inmobiliario — desde la estrategia patrimonial hasta la gestión
            y valorización del activo. Elige solo las etapas que necesitas o recorre el flujo completo.
          </p>
          <p className="mt-3 text-black/80 text-[13px] italic">
            Diseñamos procesos tan claros como los resultados que entregamos.
          </p>

          {/* Nota editorial (centrada) */}
          <div className="mt-6 border border-black/10 bg-[#F9FAFB] text-black/70 text-[13px] leading-relaxed p-4 italic">
            Estas etapas reflejan el proceso completo de compra, venta o arriendo. No es necesario realizarlas todas:
            cada cliente define su propio recorrido y nosotros nos adaptamos, manteniendo el mismo estándar boutique
            en cada paso.
          </div>
        </header>

        {/* Eje vertical central */}
        <div className="relative mt-14">
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#D1D5DB]"
          />

          <ol className="space-y-16 md:space-y-24">
            {ETAPAS.map((etapa, i) => (
              <ZigzagItem
                key={etapa.title}
                etapa={etapa}
                index={i}
                expanded={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ================= ITEM ZIGZAG ================= */
function ZigzagItem({
  etapa,
  index,
  expanded,
  onToggle,
}: {
  etapa: Etapa;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const alignRight = index % 2 === 0; // alterna izquierda/derecha
  const Icon = etapa.icon;

  // Reveal on scroll (sin libs)
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setInView(true);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className={[
        'relative grid md:grid-cols-2 items-stretch',
        alignRight ? '' : 'md:grid-flow-col-dense',
      ].join(' ')}
    >
      {/* Conector al eje (nodo) */}
      <span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 mt-2 md:mt-0 md:top-8 h-[10px] w-[10px] bg-[#0A2E57]"
      />

      {/* Lado A (texto) */}
      <div
        className={[
          'order-2 md:order-none',
          alignRight ? 'md:pr-10' : 'md:pl-10',
          'transition-all duration-700 ease-out',
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[14px]',
        ].join(' ')}
      >
        <article
          className={[
            'border border-black/10 bg-white p-6 shadow-sm',
            'transition duration-300 hover:shadow-md hover:-translate-y-[3px]',
          ].join(' ')}
        >
          <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
            Etapa {index + 1}
          </div>
          <h3 className="mt-1 text-[18px] text-black/90 tracking-wide">
            {etapa.title}
          </h3>
          <p className="mt-2 text-[14px] text-black/70 leading-relaxed">
            {etapa.summary}
          </p>

          <button
            type="button"
            onClick={onToggle}
            className="mt-4 text-[12px] uppercase tracking-[.25em] text-[#0A2E57] underline underline-offset-4"
            aria-expanded={expanded}
            aria-controls={`etapa-${index}-content`}
          >
            {expanded ? 'Cerrar' : 'Ver detalle'}
          </button>

          <div
            id={`etapa-${index}-content`}
            className={[
              'overflow-hidden transition-[max-height,opacity] duration-300 ease-out',
              expanded ? 'max-h-[560px] opacity-100 mt-3' : 'max-h-0 opacity-0',
            ].join(' ')}
          >
            <ul className="space-y-1.5 text-[13px] text-black/80 leading-relaxed">
              {etapa.items.map((it) => (
                <li key={it} className="pl-3 relative">
                  <span className="absolute left-0 top-[9px] h-[5px] w-[5px] bg-[#0A2E57]" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      {/* Lado B (ícono grande y conector) */}
      <div
        className={[
          'relative flex items-start justify-center md:items-start',
          alignRight ? 'md:justify-start' : 'md:justify-end',
          'py-8 md:py-0',
          'transition-all duration-700 ease-out',
          inView
            ? alignRight
              ? 'opacity-100 translate-x-0'
              : 'opacity-100 translate-x-0'
            : alignRight
            ? 'opacity-0 -translate-x-[12px]'
            : 'opacity-0 translate-x-[12px]',
        ].join(' ')}
      >
        {/* línea que toca el eje central en desktop */}
        <span
          aria-hidden
          className={[
            'hidden md:block absolute top-8 h-px w-10 bg-[#D1D5DB]',
            alignRight ? 'left-[calc(50%+1px)]' : 'right-[calc(50%+1px)]',
          ].join(' ')}
        />
        {/* Ícono */}
        <span className="inline-flex h-14 w-14 items-center justify-center">
          <Icon className="h-12 w-12 text-[#0A2E57] transition-transform duration-300 group-hover:scale-105" />
        </span>
      </div>
    </li>
  );
}

/* ================= TIPOS Y DATOS ================= */
type Etapa = {
  title: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
};

const ETAPAS: Etapa[] = [
  {
    title: 'Estrategia patrimonial & planificación financiera',
    summary:
      'Definimos el punto de partida, la capacidad de deuda y la hoja de ruta de inversión o vivienda.',
    icon: LineChart,
    items: [
      'Diagnóstico patrimonial y flujos',
      'Simulaciones hipotecarias y capacidad de crédito',
      'Estrategia de inversión (vivienda, renta o desarrollo)',
      'Lineamientos tributarios y estructura (persona natural, SpA, comunidad)',
      'Plan de acción y cronograma',
    ],
  },
  {
    title: 'Búsqueda, curaduría y evaluación técnica',
    summary: 'Encontramos y comparamos oportunidades alineadas con tus objetivos.',
    icon: Building2,
    items: [
      'Sourcing on/off-market y visitas privadas',
      'Análisis comparativo de mercado (ACM)',
      'Tasación y proyección de valorización',
      'Due diligence técnico, legal y de copropiedad',
      'Informe integral por propiedad (riesgos y plusvalía)',
    ],
  },
  {
    title: 'Estructuración legal y financiera',
    summary: 'Diseñamos y coordinamos la operación completa hasta el cierre.',
    icon: Gavel,
    items: [
      'Negociación de oferta y condiciones',
      'Promesa y escritura con revisión jurídica',
      'Crédito o leasing (banco/mutuaria, CAE y seguros)',
      'Coordinación con notaría y Conservador de Bienes Raíces',
      'Control documental y calendario de hitos',
    ],
  },
  {
    title: 'Diseño, arquitectura y puesta en valor',
    summary: 'Optimizamos la propiedad para maximizar su uso y valor.',
    icon: Ruler,
    items: [
      'Proyecto arquitectónico y/o remodelación',
      'Interiorismo y selección de materiales',
      'Permisos y regularizaciones ante DOM',
      'Project management de obra (calidad, plazos, costos)',
      'Home staging, fotografía, video y tour 360°',
    ],
  },
  {
    title: 'Comercialización y marketing',
    summary: 'Estrategia comercial premium para vender o arrendar con impacto.',
    icon: Megaphone,
    items: [
      'Diagnóstico de precio y posicionamiento',
      'Storytelling visual y fichas optimizadas',
      'Campañas multicanal (pauta + CRM + seguimiento)',
      'Gestión de leads, visitas y reportes de desempeño',
      'Negociación y cierre',
    ],
  },
  {
    title: 'Colocación y administración',
    summary: 'Operamos tu activo con control y previsibilidad.',
    icon: ClipboardList,
    items: [
      'Filtrado y scoring de arrendatarios',
      'Contratos, entrega e inventario',
      'Cobranza y reajustes automáticos',
      'Mantenciones, seguros y siniestros',
      'Reportes mensuales y control financiero',
    ],
  },
  {
    title: 'Postcompra, optimización y valorización',
    summary:
      'Acompañamiento continuo para mejorar rentabilidad y tomar decisiones informadas.',
    icon: TrendingUp,
    items: [
      'Refinanciamiento y consolidación de deuda',
      'Reajuste de renta y mejora de cash flow',
      'Planificación sucesoria y estructuración familiar',
      'Indicadores anuales de rentabilidad y valorización',
      'Asesoría para reinversión o venta estratégica',
    ],
  },
];
