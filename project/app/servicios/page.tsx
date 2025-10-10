'use client';

import {
  Home,
  Key,
  Scale,
  Brush,
  Megaphone,
  FileText,
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
                <h3 className="text-[15px] font-medium text-black/90 tracking-wide uppercase mb-2">
                  Misión
                </h3>
                <p className="text-[13px] text-black/70 leading-relaxed">
                  Brindar asesoría inmobiliaria integral, basada en confianza, precisión técnica
                  y diseño, conectando a nuestros clientes con oportunidades únicas de inversión
                  y hogar.
                </p>
              </article>

              <article className="border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-[15px] font-medium text-black/90 tracking-wide uppercase mb-2">
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

      {/* ================= QUÉ HACEMOS POR TI ================= */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 max-w-4xl">
            <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
              ¿Qué hacemos por ti?
            </h2>
            <p className="text-black/70 text-[14px] leading-relaxed mb-12">
              Un servicio integral, enfocado en la excelencia, que cubre cada etapa del ciclo inmobiliario.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((s) => (
              <article
                key={s.title}
                className="relative border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition duration-300"
              >
                <s.icon className="absolute top-5 right-5 h-5 w-5 text-[#0A2E57]/70" />
                <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase font-medium mb-1">
                  {s.kicker}
                </div>
                <h3 className="text-[15px] font-medium text-black/90 tracking-wide">{s.title}</h3>
                <p className="mt-2 text-[13px] text-black/70 leading-relaxed">{s.description}</p>
                {s.items && (
                  <ul className="mt-3 space-y-1.5 text-[13px] text-black/80 leading-relaxed">
                    {s.items.map((it) => (
                      <li key={it} className="pl-3 relative">
                        <span className="absolute left-0 top-[9px] h-[5px] w-[5px] bg-[#0A2E57]" />
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

      {/* ================= PROCESO — LÍNEA DE TIEMPO ================= */}
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
                  <span className="mx-auto -mt-7 mb-5 block h-2 w-2 rounded-full bg-[#0A2E57] ring-2 ring-[#0A2E57]/25" />
                  <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
                    Paso {i + 1}
                  </div>
                  <h3 className="mt-1 text-[14px] text-black/90 font-medium">{p.title}</h3>
                  <p className="mt-2 text-[13px] text-black/70 leading-relaxed max-w-[260px] mx-auto">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* MÓVIL — sin puntos, misma línea vertical y tipografía */}
          <div className="sm:hidden relative pl-8">
            {/* línea vertical */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-[#0A2E57]/25" />
            <ol className="flex flex-col gap-8">
              {PROCESO.map((p, i) => (
                <li key={p.title} className="relative">
                  {/* sin pelotitas en mobile */}
                  <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase ml-1">
                    Paso {i + 1}
                  </div>
                  <h3 className="mt-1 text-[14px] text-black/90 font-medium">{p.title}</h3>
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

/* ================= DATOS ================= */
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
] as const;

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
