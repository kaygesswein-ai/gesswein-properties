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

      {/* ================= POR QUÉ GESSWEIN PROPERTIES ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 max-w-4xl">
            <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
              ¿Por qué Gesswein Properties?
            </h2>
            <p className="text-black/80 text-[14px] leading-relaxed max-w-3xl">
              En Gesswein Properties nos definimos por un enfoque boutique, que combina excelencia
              técnica, comunicación cercana y una estética moderna aplicada a cada proyecto
              inmobiliario. Nuestro compromiso es ofrecer un servicio profesional, transparente
              y con alto estándar de ejecución.
            </p>

            <div className="mt-12 grid md:grid-cols-2 gap-6">
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

      {/* ================= QUÉ SERVICIOS OFRECEMOS (ZIGZAG VERTICAL) ================= */}
      <ServiciosEtapasSeccion />

      {/* ================= PROCESO — LÍNEA DE TIEMPO (SE DEJA IGUAL) ================= */}
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
    </main>
  );
}

/* ================= COMPONENTE: SECCIÓN DE ETAPAS (ZIGZAG RE-DESIGN) ================= */
function ServiciosEtapasSeccion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Título + Intro + aspiracional */}
        <div className="pl-2 sm:pl-4 max-w-3xl mx-auto text-center">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.30em] uppercase font-medium mb-4">
            ¿Qué servicios ofrecemos?
          </h2>

          <p className="text-black/70 text-[15px] leading-relaxed">
            Dominamos cada etapa del proceso inmobiliario — desde la estrategia patrimonial hasta la gestión
            y valorización del activo. Elige solo las etapas que necesitas o recorre el flujo completo.
          </p>

          {/* Frase aspiracional */}
          <p className="mt-3 text-black/80 text-[13px] italic">
            Diseñamos procesos tan claros como los resultados que entregamos.
          </p>

          {/* Nota editorial */}
          <div className="mt-6 border border-black/10 bg-[#F9FAFB] text-black/70 text-[13px] leading-relaxed p-4 italic">
            Estas etapas reflejan el proceso completo de compra, venta o arriendo. No es necesario realizarlas todas:
            cada cliente define su propio recorrido y nosotros nos adaptamos, manteniendo el mismo estándar boutique
            en cada paso.
          </div>
        </div>

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

  // Reveal on scroll (sin librerías)
  const ref = useRef<HTMLLIElement>(null);
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
      {/* Nodo en eje */}
      <span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 md:top-8 h-[10px] w-[10px] bg-[#0A2E57]"
      />

      {/* Bloque texto */}
      <div
        className={[
          'order-2 md:order-none',
          alignRight ? 'md:pr-10' : 'md:pl-10',
          'transition-all duration-700 ease-out',
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[14px]',
        ].join(' ')}
      >
        <article
          className="border border-black/10 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md hover:-translate-y-[3px]"
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

      {/* Bloque icono + conector al eje */}
      <div
        className={[
          'relative flex items-start justify-center md:items-start',
          alignRight ? 'md:justify-start' : 'md:justify-end',
          'py-8 md:py-0',
          'transition-all duration-700 ease-out',
          inView ? 'opacity-100' : alignRight ? 'opacity-0 -translate-x-[12px]' : 'opacity-0 translate-x-[12px]',
        ].join(' ')}
      >
        {/* línea hacia el eje (solo desktop) */}
        <span
          aria-hidden
          className={[
            'hidden md:block absolute top-8 h-px w-10 bg-[#D1D5DB]',
            alignRight ? 'left-[calc(50%+1px)]' : 'right-[calc(50%+1px)]',
          ].join(' ')}
        />
        <span className="inline-flex h-14 w-14 items-center justify-center">
          <Icon className="h-12 w-12 text-[#0A2E57] transition-transform duration-300 group-hover:scale-105" />
        </span>
      </div>
    </li>
  );
}

/* ================= DATOS NUEVA SECCIÓN ================= */
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
    summary:
      'Encontramos y comparamos oportunidades alineadas con tus objetivos.',
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
    summary:
      'Diseñamos y coordinamos la operación completa hasta el cierre.',
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
    summary:
      'Optimizamos la propiedad para maximizar su uso y valor.',
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
    summary:
      'Estrategia comercial premium para vender o arrendar con impacto.',
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
    summary:
      'Operamos tu activo con control y previsibilidad.',
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

/* ================= PROCESO (SE MANTIENE DEL ARCHIVO ORIGINAL) ================= */
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
