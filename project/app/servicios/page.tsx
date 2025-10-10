import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Home,
  Key,
  Scale,
  Brush,
  Megaphone,
  FileText,
  Building2,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Servicios | Gesswein Properties',
  description:
    'Asesoría inmobiliaria integral: venta, arriendo, tasación, marketing y gestión de propiedades premium.',
}

export default function ServiciosPage() {
  return (
    <div className="bg-white text-black">
      {/* HERO — ocupa todo el viewport */}
      <section className="relative min-h-screen flex items-center justify-center isolate">
        <Image
          src="https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/IMG_5437%20(1).jpeg"
          alt="Portada Servicios Gesswein Properties"
          fill
          priority
          className="object-cover brightness-[0.55]"
        />

        <div className="relative z-10 text-center px-6 md:px-10 lg:px-12 xl:px-16">
          <h1 className="text-white text-[22px] sm:text-[26px] md:text-[28px] tracking-[.25em] uppercase font-medium leading-[1.3]">
            SERVICIOS INMOBILIARIOS DE ALTO ESTÁNDAR
          </h1>
          <p className="mt-4 text-white/85 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Combinamos datos, diseño y marketing premium para vender o arrendar tu
            propiedad con la mejor experiencia y resultados.
          </p>

          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link
              href="/contacto"
              className="rounded-none bg-white text-[#0A2E57] px-6 py-2 text-[13px] font-semibold tracking-[.18em] uppercase transition hover:opacity-85"
            >
              Conversemos
            </Link>
            <Link
              href="/propiedades"
              className="rounded-none border border-white/90 text-white px-6 py-2 text-[13px] font-semibold tracking-[.18em] uppercase transition hover:bg-white/10"
            >
              Ver propiedades
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICIOS PRINCIPALES */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16">
          <header className="max-w-3xl mb-10">
            <h2 className="text-[#0A2E57] text-[22px] tracking-[.28em] uppercase font-medium">
              ¿Qué hacemos por ti?
            </h2>
            <p className="mt-2 text-black/70 text-sm leading-relaxed">
              Un servicio integral, enfocado en la excelencia, que cubre cada etapa
              del ciclo inmobiliario.
            </p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((s) => (
              <article
                key={s.title}
                className="relative border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition duration-300"
              >
                <s.icon className="absolute top-5 right-5 size-5 text-[#0A2E57]/70" />
                <div className="text-[#0A2E57] text-[12px] tracking-[.25em] uppercase font-semibold mb-1">
                  {s.kicker}
                </div>
                <h3 className="text-[16px] font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-black/70 leading-relaxed">
                  {s.description}
                </p>
                {s.items && (
                  <ul className="mt-3 space-y-1.5 text-sm text-black/80">
                    {s.items.map((it) => (
                      <li key={it} className="pl-3 relative">
                        <span className="absolute left-0 top-2 size-[5px] bg-[#0A2E57]"></span>
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

      {/* PROCESO */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16">
          <header className="max-w-3xl mb-10">
            <h2 className="text-[#0A2E57] text-[22px] tracking-[.28em] uppercase font-medium">
              Un proceso claro y transparente
            </h2>
            <p className="mt-2 text-black/70 text-sm leading-relaxed">
              Metodología probada para lograr un resultado superior.
            </p>
          </header>

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESO.map((p, i) => (
              <li
                key={p.title}
                className="border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="text-[#0A2E57] text-[12px] tracking-[.25em] uppercase font-semibold mb-1">
                  Paso {i + 1}
                </div>
                <h3 className="text-[15px] font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-black/70 leading-relaxed">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* DIFERENCIADORES */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16">
          <header className="max-w-3xl mb-10">
            <h2 className="text-[#0A2E57] text-[22px] tracking-[.28em] uppercase font-medium">
              ¿Por qué Gesswein Properties?
            </h2>
            <p className="mt-2 text-black/70 text-sm leading-relaxed">
              Enfoque boutique, trato cercano y marketing de alto impacto.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {DESTACADOS.map((d) => (
              <article
                key={d.title}
                className="border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition duration-300"
              >
                <h3 className="text-[16px] font-semibold">{d.title}</h3>
                <p className="mt-2 text-sm text-black/70 leading-relaxed">{d.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const SERVICIOS = [
  {
    kicker: 'Venta',
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
    kicker: 'Valoración',
    title: 'Tasación orientativa',
    description:
      'Estimación de valor para definir estrategia comercial con fundamentos objetivos.',
    icon: Scale,
    items: ['Inspección técnica', 'ACM + tendencias por zona'],
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
    kicker: 'Asesoría',
    title: 'Legal y financiera',
    description:
      'Acompañamiento en promesas, financiamiento y documentos hasta el final del proceso.',
    icon: FileText,
    items: ['Revisión documental', 'Coordinación con bancos y notarías'],
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

const DESTACADOS = [
  {
    title: 'Marketing que vende',
    text: 'Fotografía, video y pauta con segmentación inteligente. Reportes claros del desempeño.',
  },
  {
    title: 'Atención boutique',
    text: 'Trato cercano, comunicación transparente y foco en el detalle.',
  },
]
