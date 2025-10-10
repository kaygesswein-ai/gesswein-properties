import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Home,
  Key,
  Scale,
  Brush,
  Megaphone,
  FileText,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Servicios | Gesswein Properties',
  description:
    'Asesoría inmobiliaria integral: compra-venta, arriendo, valoración, marketing y gestión de propiedades premium.',
}

export default function ServiciosPage() {
  return (
    <div className="bg-white text-black">
      {/* HERO — igual que Propiedades */}
      <section className="relative min-h-screen flex items-end justify-center isolate">
        <Image
          src="https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/IMG_5437%20(1).jpeg"
          alt="Portada Servicios Gesswein Properties"
          fill
          priority
          className="object-cover brightness-[0.55]"
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 text-center mb-20 px-6">
          <h1 className="text-white text-[18px] sm:text-[20px] md:text-[22px] tracking-[.28em] uppercase font-medium leading-[1.5]">
            SERVICIOS INMOBILIARIOS DE ALTO ESTÁNDAR
          </h1>
          <p className="mt-3 text-white/85 text-[13px] sm:text-[14px] leading-relaxed max-w-xl mx-auto">
            Combinamos datos, diseño y marketing premium para vender o arrendar tu propiedad
            con la mejor experiencia y resultados.
          </p>
        </div>
      </section>

      {/* ================== POR QUÉ GESSWEIN ================== */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-6 md:px-10 lg:px-12 xl:px-16 text-center">
          <h2 className="text-[#0A2E57] text-[18px] tracking-[.28em] uppercase font-medium mb-6">
            ¿Por qué Gesswein Properties?
          </h2>

          <p className="text-black/80 text-[14px] leading-relaxed max-w-3xl mx-auto">
            En Gesswein Properties nos definimos por un enfoque boutique, que combina excelencia técnica,
            comunicación cercana y una estética moderna aplicada a cada proyecto inmobiliario. Nuestro
            compromiso es ofrecer un servicio profesional, transparente y con alto estándar de ejecución.
          </p>

          <div className="mt-12 grid sm:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="text-[#0A2E57] uppercase text-[13px] tracking-[.25em] font-medium mb-2">
                Misión
              </h3>
              <p className="text-black/80 text-[14px] leading-relaxed">
                Brindar asesoría inmobiliaria integral, basada en confianza, precisión técnica y diseño,
                conectando a nuestros clientes con oportunidades únicas de inversión y hogar.
              </p>
            </div>
            <div>
              <h3 className="text-[#0A2E57] uppercase text-[13px] tracking-[.25em] font-medium mb-2">
                Visión
              </h3>
              <p className="text-black/80 text-[14px] leading-relaxed">
                Ser la firma inmobiliaria de referencia en Chile por su excelencia estética, profesionalismo
                y compromiso con la calidad de vida de quienes confían en nosotros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================== QUÉ HACEMOS POR TI ================== */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16">
          <header className="max-w-3xl mb-12">
            <h2 className="text-[#0A2E57] text-[18px] tracking-[.28em] uppercase font-medium">
              ¿Qué hacemos por ti?
            </h2>
            <p className="mt-2 text-black/70 text-[14px] leading-relaxed">
              Un servicio integral, enfocado en la excelencia, que cubre cada etapa del ciclo inmobiliario.
            </p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((s) => (
              <article
                key={s.title}
                className="relative border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition duration-300"
              >
                <s.icon className="absolute top-5 right-5 size-5 text-[#0A2E57]/70" />
                <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase font-medium mb-1">
                  {s.kicker}
                </div>
                <h3 className="text-[15px] font-medium text-black/90 tracking-wide">{s.title}</h3>
                <p className="mt-2 text-[13px] text-black/70 leading-relaxed">{s.description}</p>
                {s.items && (
                  <ul className="mt-3 space-y-1.5 text-[13px] text-black/80 leading-relaxed">
                    {s.items.map((it) => (
                      <li key={it} className="pl-3 relative">
                        <span className="absolute left-0 top-2 size-[5px] bg-[#0A2E57]" />
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

      {/* ================== PROCESO — línea de tiempo ================== */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-12 xl:px-16 text-center">
          <h2 className="text-[#0A2E57] text-[18px] tracking-[.28em] uppercase font-medium mb-12">
            Un proceso claro y transparente
          </h2>

          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="absolute top-4 left-[5%] right-[5%] h-[1px] bg-[#0A2E57]/30 hidden sm:block"></div>

            {PROCESO.map((p, i) => (
              <div key={p.title} className="relative flex-1 text-left sm:text-center px-4">
                <div className="flex items-center gap-3 sm:flex-col">
                  <div className="w-[9px] h-[9px] bg-[#0A2E57] rounded-full sm:mb-2"></div>
                  <div>
                    <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase font-medium mb-1">
                      Paso {i + 1}
                    </div>
                    <h3 className="text-[14px] font-medium text-black/90">{p.title}</h3>
                    <p className="mt-1 text-[13px] text-black/70 leading-relaxed max-w-[220px] sm:max-w-none">
                      {p.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
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
]

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
]
