import type { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import {
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Linkedin,
  Facebook,
  Music,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto - Gesswein Properties',
  description:
    'Escríbenos y cuéntanos qué necesitas. Te responderemos a la brevedad.',
}

const PHONE_DISPLAY = '+56 9 9331 8039'
const PHONE_E164 = '56993318039'
const EMAIL = 'contacto@gessweinproperties.cl'

// Reemplaza los links de RRSS por los reales cuando los tengas
const SOCIALS = [
  { label: 'WhatsApp', href: `https://wa.me/${PHONE_E164}`, icon: MessageCircle },
  { label: 'Email', href: `mailto:${EMAIL}`, icon: Mail },
  { label: 'Teléfono', href: `tel:+${PHONE_E164}`, icon: Phone },
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'TikTok', href: '#', icon: Music }, // ícono “Music” como placeholder de TikTok
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
]

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO — estilo “Servicios”: imagen full-screen + overlay + título simple */}
      <section className="relative min-h-[75vh] lg:min-h-[88vh] overflow-hidden">
        {/* Imagen de fondo (placeholder). Cámbiala por tu foto cuando la subas */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=2400&q=80')",
          }}
        />
        {/* Overlay suave para legibilidad */}
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-10 h-full">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <div className="flex min-h-[75vh] lg:min-h-[88vh] items-end pb-12 lg:pb-16">
              <div className="max-w-2xl">
                <div className="text-white/85 text-sm tracking-[0.35em] uppercase">
                  CONTACTO
                </div>

                {/* OJO: me pediste que el único título sea “CONTACTO” */}
                <div className="mt-3 text-white text-5xl md:text-6xl font-semibold leading-[1.05]">
                  Contacto
                </div>

                <p className="mt-4 text-white/90 text-lg md:text-xl leading-relaxed">
                  Escríbenos y cuéntanos qué necesitas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO — estética más parecida a “Servicios” (tipografía + aire) */}
      <section className="mx-auto max-w-6xl px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Columna izquierda */}
          <div className="lg:col-span-5">
            <div className="text-[#0B2A4A] text-sm tracking-[0.35em] uppercase">
              INFORMACIÓN DE CONTACTO
            </div>

            <p className="mt-6 text-[15px] leading-7 text-slate-700">
              Puedes contactarnos por teléfono, email o redes sociales. Responderemos a la
              brevedad por la vía que indiques.
            </p>

            <div className="mt-10 space-y-4">
              <Card className="rounded-none border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 border border-slate-200 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-[#0B2A4A]" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-slate-900">
                        Teléfono
                      </div>
                      <a
                        className="mt-2 inline-block text-[#0B2A4A] font-medium hover:underline"
                        href={`tel:+${PHONE_E164}`}
                      >
                        {PHONE_DISPLAY}
                      </a>
                      <p className="mt-2 text-sm text-slate-600">
                        Atención por coordinación (respuestas en horario hábil).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 border border-slate-200 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-[#0B2A4A]" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-slate-900">Email</div>
                      <a
                        className="mt-2 inline-block text-[#0B2A4A] font-medium hover:underline"
                        href={`mailto:${EMAIL}`}
                      >
                        {EMAIL}
                      </a>
                      <p className="mt-2 text-sm text-slate-600">
                        Respuesta dentro de 24 horas hábiles.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-none border-slate-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 border border-slate-200 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-[#0B2A4A]" />
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-slate-900">WhatsApp</div>
                      <a
                        className="mt-2 inline-block text-[#0B2A4A] font-medium hover:underline"
                        href={`https://wa.me/${PHONE_E164}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Abrir conversación
                      </a>
                      <p className="mt-2 text-sm text-slate-600">
                        Escríbenos directo por WhatsApp.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="lg:col-span-7">
            <div className="text-[#0B2A4A] text-sm tracking-[0.35em] uppercase">
              REDES SOCIALES
            </div>

            <p className="mt-6 text-[15px] leading-7 text-slate-700">
              También puedes escribirnos por cualquiera de nuestras redes. Te responderemos lo
              antes posible.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SOCIALS.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('#') ? undefined : '_blank'}
                    rel={item.href.startsWith('#') ? undefined : 'noreferrer'}
                    className="group border border-slate-200 rounded-none p-5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 border border-slate-200 flex items-center justify-center group-hover:border-slate-300 transition-colors">
                        <Icon className="h-5 w-5 text-[#0B2A4A]" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-slate-900">
                          {item.label}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">
                          {item.href === '#'
                            ? 'Link pendiente'
                            : 'Abrir'}
                        </div>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>

            <div className="mt-10 border border-slate-200 p-6">
              <div className="text-[#0B2A4A] text-sm tracking-[0.35em] uppercase">
                Nota
              </div>
              <p className="mt-4 text-[15px] leading-7 text-slate-700">
                Si quieres, después dejamos los links de Instagram/TikTok/Facebook/LinkedIn
                con sus URLs reales y los textos “Link pendiente” desaparecen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
