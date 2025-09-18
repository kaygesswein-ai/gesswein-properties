'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Mail, Phone, Instagram, Facebook, Linkedin } from 'lucide-react'

/** Ícono WhatsApp con burbuja y teléfono adentro */
function WhatsAppPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Burbuja de chat */}
      <path d="M20 11.5a8.5 8.5 0 1 1-3.2-6.63A8.5 8.5 0 0 1 20 11.5Z" />
      <path d="M7.2 18.6 4 20l1.4-3.2" />
      {/* Teléfono dentro de la burbuja */}
      <path d="M10.6 7.8c.2-.2.5-.3.8-.2l1.8.6c.4.1.6.6.5 1l-.2.8c-.1.3-.3.5-.5.7l-.4.4c.6.9 1.4 1.6 2.3 2.3l.4-.4c.2-.2.4-.4.7-.5l.8-.2c.4-.1.8.1 1 .5l.6 1.8c.1.3 0 .6-.2.8-.7.7-1.7 1.2-2.7 1.1-1.3-.1-2.6-.7-4.2-2.3-1.6-1.6-2.2-2.9-2.3-4.2-.1-1 .4-2 1.1-2.7Z" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const wrapper = 'fixed top-0 inset-x-0 z-50 transition-colors duration-300'
  const bg = scrolled
    ? 'bg-[#0A2E57]/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(255,255,255,.06)]'
    : 'bg-transparent'

  const linkBase =
    'text-white/90 hover:text-white transition-colors select-none'

  return (
    <header className={`${wrapper} ${bg}`}>
      {/* OJO: pl-* iguala el gutter del hero/card para alinear el logo con “Ver Propiedades” */}
      <div className="mx-auto max-w-7xl pr-4 sm:pr-6 lg:pr-8 pl-6 md:pl-10 lg:pl-12 xl:pl-16">
        <div className="h-16 md:h-18 flex items-center">
          {/* LOGO más pequeño (≈ 3/4 del anterior) */}
          <Link href="/" aria-label="Gesswein Properties" className="shrink-0">
            <Image
              src="/logo-white.svg"
              alt="Gesswein Properties"
              width={120}   // antes ~150
              height={30}
              priority
              className="w-[105px] md:w-[120px] h-auto"
            />
          </Link>

          {/* Menú + redes a la derecha */}
          <div className="ml-auto flex items-center gap-3 md:gap-4">
            {/* MENÚ compacto, con separadores y tracking fino */}
            <nav className="hidden md:flex items-center text-white">
              <Link
                href="/"
                className={`uppercase ${linkBase} text-[11px] tracking-[.30em]`}
              >
                Inicio
              </Link>
              <span className="mx-2 text-white/60">|</span>
              <Link
                href="/propiedades"
                className={`uppercase ${linkBase} text-[11px] tracking-[.30em]`}
              >
                Propiedades
              </Link>
              <span className="mx-2 text-white/60">|</span>
              <Link
                href="/servicios"
                className={`uppercase ${linkBase} text-[11px] tracking-[.30em]`}
              >
                Servicios
              </Link>
              <span className="mx-2 text-white/60">|</span>
              <Link
                href="/equipo"
                className={`uppercase ${linkBase} text-[11px] tracking-[.30em]`}
              >
                Equipo
              </Link>
              <span className="mx-2 text-white/60">|</span>
              <Link
                href="/contacto"
                className={`uppercase ${linkBase} text-[11px] tracking-[.30em]`}
              >
                Contacto
              </Link>
            </nav>

            {/* Redes — pegadas al menú */}
            <div className="flex items-center gap-3 text-white">
              {/* WhatsApp con teléfono dentro */}
              <Link
                href="https://wa.me/56900000000"
                aria-label="WhatsApp"
                className={linkBase}
              >
                <WhatsAppPhone className="h-[18px] w-[18px]" />
              </Link>

              <Link
                href="mailto:hola@gessweinproperties.cl"
                aria-label="Email"
                className={linkBase}
              >
                <Mail className="h-[18px] w-[18px]" />
              </Link>

              <Link href="tel:+56900000000" aria-label="Teléfono" className={linkBase}>
                <Phone className="h-[18px] w-[18px]" />
              </Link>

              <Link href="https://instagram.com" aria-label="Instagram" className={linkBase}>
                <Instagram className="h-[18px] w-[18px]" />
              </Link>

              <Link href="https://facebook.com" aria-label="Facebook" className={linkBase}>
                <Facebook className="h-[18px] w-[18px]" />
              </Link>

              <Link href="https://linkedin.com" aria-label="LinkedIn" className={linkBase}>
                <Linkedin className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}


