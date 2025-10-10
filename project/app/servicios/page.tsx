'use client';

import {
  Home, Key, Scale, Brush, Megaphone, FileText,
} from 'lucide-react';

const BRAND_BLUE = '#0A2E57';

export default function ServiciosPage() {
  return (
    <main className="bg-white">

      {/* ================= HERO (idéntico a Propiedades) ================= */}
      <section className="relative min-h-[100svh]">
        <img
          src="https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/IMG_5437%20(1).jpeg"
          alt="Portada Servicios"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '50% 35%' }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Alineado a la izquierda como Propiedades */}
            <div className="pl-2 sm:pl-4">
              <div className="max-w-3xl">
                <h1 className="text-white text-3xl md:text-4xl uppercase tracking-[0.25em]">
                  SERVICIOS
                </h1>
                <p className="mt-2 text-white/85 text-sm md:text-base">
                  Combinamos datos, diseño y marketing premium para vender o arrendar tu propiedad
                  con la mejor experiencia y resultados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ¿POR QUÉ GESSWEIN PROPERTIES? ================= */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl pl-2 sm:pl-4">
            <h2 className="mb-6 text-[17px] font-normal uppercase tracking-[.28em]" style={{ color: BRAND_BLUE }}>
              ¿Por qué Gesswein Properties?
            </h2>
            <p className="max-w-3xl text-[14px] leading-relaxed text-black/80">
              En Gesswein Properties nos definimos por un enfoque boutique, que combina excelencia
              técnica, comunicación cercana y una estética moderna aplicada a cada proyecto
              inmobiliario. Nuestro compromiso es ofrecer un servicio profesional, transparente
              y con alto estándar de ejecución.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <article className="border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-[15px] font-normal uppercase tracking-wide text-black/90">
                  Misión
                </h3>
                <p className="text-[13px] leading-relaxed text-black/70">
                  Brindar asesoría inmobiliaria integral, basada en confianza, precisión técnica
                  y diseño, conectando a nuestros clientes con oportunidades únicas de inversión
                  y hogar.
                </p>
              </article>

              <article className="border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-[15px] font-normal uppercase tracking-wide text-black/90">
                  Visión
                </h3>
                <p className="text-[13px] leading-relaxed text-black/70">
                  Ser la firma inmobiliaria de referencia en Chile por su excelencia estética,
                  profesionalismo y compromiso con la calidad de vida de quienes confían en nosotros.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ¿QUÉ HACEMOS POR TI? ================= */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl pl-2 sm:pl-4">
            <h2 className="mb-6 text-[17px] font-normal uppercase tracking-[.28em]" style={{ color: BRAND_BLUE }}>
              ¿Qué hacemos por ti?
            </h2>
            <p className="mb-12 text-[14px] leading-relaxed text-black/70">
              Un servicio integral, enfocado en la excelencia, que cubre cada etapa del ciclo inmobiliario.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((s) => (
              <article
                key={s.title}
                className="relative border border-black/10 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md"
              >
                <s.icon className="absolute right-5 top-5 size-5 text-[#0A2E57]/70" />
                <div className="mb-1 text-[11px] font-medium uppercase tracking-[.25em]" style={{ color: BRAND_BLUE }}>
                  {s.kicker}
                </div>
                <h3 className="text-[15px] font-normal tracking-wide text-black/90">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-black/70">{s.description}</p>
                {s.items && (
                  <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-black/80">
                    {s.items.map((it) => (
                      <li key={it} className="relative pl-3">
                        <span className="absolute left-0 top-[9px] h-[5px] w-[5px]" style={{ background: BRAND_BLUE }} />
                        {it}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROCESO — LÍNEA DE TIEMPO (desktop horizontal / móvil vertical) ================= */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-4xl pl-2 sm:pl-4">
            <h2 className="mb-6 text-[17px] font-normal uppercase tracking-[.28em]" style={{ color: BRAND_BLUE }}>
              Un proceso claro y transparente
            </h2>
            <p className="text-[14px] leading-relaxed text-black/70">
              Metodología probada para lograr un resultado superior.
            </p>
          </div>

          {/* Wrapper: gestiona las líneas principales horizontales/verticales */}
          <div className="relative pl-8 sm:pl-4">
            {/* Línea vertical (solo móvil) */}
            <div className="absolute left-3 top-1.5 bottom-1.5 w-px bg-[#0A2E57]/25 sm:hidden" />

            {/* Línea horizontal (solo sm+) */}
            <div className="absolute left-[5%] right-[5%] top-4 hidden h-px bg-[#0A2E57]/25 sm:block" />

            <ol
              role="list"
              className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between"
            >
              {PROCESO.map((p, i) => (
                <li
                  key={p.title}
                  className="relative sm:flex-1 sm:px-4 sm:text-center"
                >
                  {/* Punto + aro (móvil: a la izquierda / desktop: centrado sobre la línea) */}
                  <span
                    className="
                      absolute z-10 h-2 w-2 rounded-full
                      -left-[5px] top-[6px] sm:left-1/2 sm:top-0
                      sm:-translate-x-1/2
                    "
                    style={{ background: BRAND_BLUE }}
                  />
                  <span
                    className="
                      absolute z-0 h-3.5 w-3.5 rounded-full opacity-30
                      -left-[8.5px] top-[2.5px] sm:left-1/2 sm:top-[-3px]
                      sm:-translate-x-1/2
                    "
                    style={{ border: `2px solid ${BRAND_BLUE}` }}
                  />

                  {/* Conector vertical entre ítems (solo móvil y no en el último) */}
                  {i < PROCESO.length - 1 && (
                    <span className="absolute left-[3px] top-[22px] block h-[calc(100%-22px)] w-px bg-[#0A2E57]/25 sm:hidden" />
                  )}

                  <div className="sm:pt-5">
                    <div className="mb-1 text-[11px] font-medium uppercase tracking-[.25em]" style={{ color: BRAND_BLUE }}>
                      Paso {i + 1}
                    </div>
                    <h3 className="text-[14px] font-normal text-black/90">{p.title}</h3>
                    <p className="mt-1 max-w-[260px] text-[13px] leading-relaxed text-black/70 sm:mx-auto sm:max-w-[280px]">
                      {p.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================= DATA ================= */
const SERVICIOS = [
  {
    kicker: 'Compra-Venta',
    title: 'Comercialización integral',
    description:
      'Diagnóstico de precio, preparación, plan de marketing y acompañamiento total hasta la escritura.',
    icon: Home,
    items: [
      'Análisis comparativo de mercado (ACM)',
      'Plan de difusión digital',
      'Reportes de interés y visitas',
      'Negociación y cierre',
    ],
  },
  {
    kicker: 'Arriendo',
    title: 'Colocación y administración',
    description:
      'Encontramos a tu arrendatario ideal y, si lo deseas, administramos el contrato mes a mes.',
    icon: Key,
    items: ['Filtrado y scoring de candidatos', 'Contrato y entrega', 'Gestión mensual opcional'],
  },
  {
    kicker: 'Asesoría',
    title: 'Legal y financiera',
    description:
      'Acompañamiento en promesas, financiamiento y documentos hasta el final del proceso.',
    icon: Scale,
    items: ['Revisión documental', 'Coordinación con bancos y notarías'],
  },
  {
    kicker: 'Preparación',
    title: 'Home staging & producción visual',
    description:
      'Pequeños cambios, gran impacto. Fotos profesionales, video y tour 360.',
    icon: Brush,
    items: ['Check de reparaciones', 'Home staging liviano', 'Producción audiovisual'],
  },
  {
    kicker: 'Marketing',
    title: 'Campañas premium',
    description:
      'Contenido atractivo y pauta inteligente para maximizar alcance y calidad de leads.',
    icon: Megaphone,
    items: ['Fichas optimizadas', 'CRM + seguimiento', 'Pauta digital multicanal'],
  },
  {
    kicker: 'Valoración',
    title: 'Tasación orientativa',
    description:
      'Estimación de valor para definir estrategia comercial con fundamentos objetivos.',
    icon: FileText,
    items: ['Inspección técnica', 'ACM + tendencias por zona'],
  },
];

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
];
