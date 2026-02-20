import type { Metadata } from 'next'
import {
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Music2,
  Facebook,
  Linkedin,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto - Gesswein Properties',
  description: 'Escríbenos y cuéntanos qué necesitas. Te responderemos a la brevedad.',
}

const HERO_IMG =
  'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/Foto%20portada%20-%20Contacto%20-%20OPTIMIZADA.jpg'
// Puedes cambiarlo por tu imagen real después.

const SOCIALS = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    sub: 'Abrir',
    href: 'https://wa.me/56993318039?text=Hola%2C%20quiero%20contactar%20a%20Gesswein%20Properties',
    Icon: MessageCircle,
  },
  {
    key: 'email',
    label: 'Email',
    sub: 'Abrir',
    href: 'mailto:contacto@gessweinproperties.cl',
    Icon: Mail,
  },
  {
    key: 'phone',
    label: 'Teléfono',
    sub: 'Abrir',
    href: 'tel:+56993318039',
    Icon: Phone,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    sub: 'Link pendiente',
    href: '#',
    Icon: Instagram,
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    sub: 'Link pendiente',
    href: '#',
    Icon: Music2,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    sub: 'Link pendiente',
    href: '#',
    Icon: Facebook,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    sub: 'Link pendiente',
    href: '#',
    Icon: Linkedin,
  },
]

export default function ContactoPage() {
  return (
    <main className="bg-white">
      {/* HERO (idéntico estilo Equipo/Servicios) */}
      <section className="relative min-h-[100svh]">
        <img
          src={HERO_IMG}
          alt="Contacto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 40%' }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-white text-3xl md:text-4xl uppercase tracking-[0.25em]">
              CONTACTO
            </h1>
            <p className="text-white/85 mt-2 text-[14px] md:text-[15px] leading-relaxed">
              Escríbenos y cuéntanos qué necesitas.
            </p>
          </div>
        </div>
      </section>

      {/* REDES SOCIALES (solo esto, estética tipo “Servicios”) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
            Redes Sociales
          </h2>
          <p className="mt-4 max-w-3xl text-[14px] text-black/70 leading-relaxed">
            Puedes escribirnos por cualquiera de nuestras redes. Te responderemos lo antes posible.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOCIALS.map(({ key, label, sub, href, Icon }) => (
              <a
                key={key}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 border border-black/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-[#0A2E57]" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-black/90">{label}</div>
                    <div className="text-[13px] text-black/60">{sub}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
