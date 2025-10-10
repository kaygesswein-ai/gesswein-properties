// project/app/servicios/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Servicios',
  description:
    'Asesoría inmobiliaria integral: venta, arriendo, tasación, preparación de propiedad, marketing premium, negociación y cierre.',
}

export default function ServiciosPage() {
  return (
    <div className="bg-white text-black">
      {/* HERO — misma altura que Propiedades */}
      <section className="relative isolate">
        {/* Fondo (puedes reemplazar la imagen por una propia en /public) */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-servicios.jpg" // opcional: sube un jpg en /public; si no existe, se verá un fondo azul sólido
            alt=""
            fill
            priority
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-[#0A2E57] mix-blend-multiply" />
        </div>

        {/* Altura alineada a la portada de Propiedades */}
        <div className="min-h-[420px] sm:min-h-[460px] lg:min-h-[520px] flex items-center">
          <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16 w-full">
            <div className="max-w-3xl">
              <h1 className="text-white text-3xl sm:text-4xl lg:text-[44px] leading-tight font-semibold">
                Servicios inmobiliarios de alto estándar
              </h1>
              <p className="mt-4 text-white/85 text-base lg:text-lg max-w-2xl">
                Combinamos datos, diseño y marketing premium para vender o arrendar tu propiedad
                con la mejor experiencia y resultados.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#0A2E57] hover:opacity-90 transition"
                >
                  Conversemos
                </Link>
                <Link
                  href="/propiedades"
                  className="inline-flex items-center rounded-xl border border-white/70 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
                >
                  Ver propiedades
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID DE SERVICIOS PRINCIPALES */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16">
          <header className="max-w-3xl">
            <h2 className="text-2xl sm:text-[28px] font-semibold text-[#0A2E57]">
              ¿Qué hacemos por ti?
            </h2>
            <p className="mt-3 text-black/70">
              Un servicio integral, enfocado en la excelencia, que cubre cada etapa del ciclo
              inmobiliario.
            </p>
          </header>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICIOS.map((s) => (
              <article
                key={s.title}
                className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,.08)] transition"
              >
                <div className="text-[#0A2E57] text-base font-semibold tracking-[.25em] uppercase">
                  {s.kicker}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-black">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/70">{s.description}</p>

                {/* Lista con formato fino (•) */}
                {s.items && (
                  <ul className="mt-4 space-y-2 text-sm text-black/80">
                    {s.items.map((it) => (
                      <li key={it} className="pl-4 relative">
                        <span className="absolute left-0 top-2 size-[6px] rounded-full bg-[#0A2E57]" />
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

      {/* PROCESO / CÓMO TRABAJAMOS */}
      <section className="py-14 sm:py-16 lg:py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16">
          <header className="max-w-3xl">
            <h2 className="text-2xl sm:text-[28px] font-semibold text-[#0A2E57]">
              Un proceso claro y transparente
            </h2>
            <p className="mt-3 text-black/70">
              Metodología probada para lograr un resultado superior.
            </p>
          </header>

          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESO.map((p, i) => (
              <li
                key={p.title}
                className="relative rounded-2xl border border-black/10 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.06)]"
              >
                <div className="text-[#0A2E57] text-[12px] tracking-[.30em] uppercase">
                  Paso {i + 1}
                </div>
                <h3 className="mt-1 text-base font-semibold text-black">{p.title}</h3>
                <p className="mt-2 text-sm text-black/70">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* DESTACADOS / DIFERENCIADORES */}
      <section className="py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16">
          <header className="max-w-3xl">
            <h2 className="text-2xl sm:text-[28px] font-semibold text-[#0A2E57]">
              ¿Por qué Gesswein Properties?
            </h2>
            <p className="mt-3 text-black/70">
              Enfoque boutique, trato cercano y marketing de alto impacto.
            </p>
          </header>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {DESTACADOS.map((d) => (
              <article
                key={d.title}
                className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,.06)]"
              >
                <h3 className="text-lg font-semibold text-black">{d.title}</h3>
                <p className="mt-2 text-sm text-black/70">{d.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-14 sm:py-16 lg:py-20 bg-[#0A2E57]">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16">
          <div className="rounded-2xl bg-white/5 border border-white/15 p-7 md:p-8 lg:p-10">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-white text-2xl font-semibold">
                  Hablemos de tu propiedad
                </h2>
                <p className="mt-2 text-white/80 text-sm">
                  Te asesoramos en precio, preparación y estrategia comercial.
                </p>
              </div>
              <div className="md:justify-self-end flex gap-3">
                <Link
                  href="/contacto"
                  className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#0A2E57] hover:opacity-90 transition"
                >
                  Contáctanos
                </Link>
                <Link
                  href="/equipo"
                  className="inline-flex items-center rounded-xl border border-white/70 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
                >
                  Conoce al equipo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ===== Datos (puedes editar libremente) ===== */

const SERVICIOS = [
  {
    kicker: 'Venta',
    title: 'Comercialización integral',
    description:
      'Diagnóstico de precio, preparación, plan de marketing y acompañamiento total hasta la escritura.',
    items: [
      'Análisis comparativo de mercado (ACM)',
      'Plan de difusión digital y segmentación',
      'Reportes de interés y visitas',
      'Negociación y cierre',
    ],
  },
  {
    kicker: 'Arriendo',
    title: 'Colocación y administración',
    description:
      'Encontramos a tu arrendatario ideal y, si lo deseas, administramos el contrato mes a mes.',
    items: ['Filtrado y scoring de candidatos', 'Contrato y estado de entrega', 'Gestión mensual opcional'],
  },
  {
    kicker: 'Valoración',
    title: 'Tasación orientativa',
    description:
      'Estimación de valor para definir estrategia comercial con fundamentos objetivos.',
    items: ['Inspección técnica', 'ACM + tendencias por zona'],
  },
  {
    kicker: 'Preparación',
    title: 'Home staging & producción visual',
    description:
      'Pequeños cambios, gran impacto. Fotos profesionales, video y tour 360.',
    items: ['Check de reparaciones', 'Home staging liviano', 'Producción audiovisual'],
  },
  {
    kicker: 'Marketing',
    title: 'Campañas premium',
    description:
      'Contenido atractivo y pauta inteligente para maximizar alcance y calidad de leads.',
    items: ['Fichas optimizadas', 'CRM + seguimiento', 'Pauta digital multicanal'],
  },
  {
    kicker: 'Asesoría',
    title: 'Legal y financiera',
    description:
      'Acompañamiento en promesas, financiamiento y documentos hasta el final del proceso.',
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
