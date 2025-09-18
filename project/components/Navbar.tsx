'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
} from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const wrapper =
    'fixed top-0 inset-x-0 z-50 transition-colors duration-300'
  const bg = scrolled
    ? 'bg-[#0A2E57]/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(255,255,255,.06)]'
    : 'bg-transparent'

  const linkBase =
    'text-white/90 hover:text-white transition-colors'

  return (
    <header className={`${wrapper} ${bg}`}>
      {/* El contenedor es el mismo ancho que usa la portada:
          así el logo queda alineado con el botón/ cuadro de propiedades */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 md:h-18 flex items-center">
          {/* LOGO (izquierda, alineado al contenedor) */}
          <Link href="/" aria-label="Gesswein Properties" className="shrink-0">
            <Image
              src="/logo-white.svg" // cambia a "/brand/logo-white.svg" si lo tienes ahí
              alt="Gesswein Properties"
              width={160}
              height={40}
              priority
              className="w-[135px] md:w-[150px] h-auto"
            />
          </Link>

          {/* Menú + redes (derecha) */}
          <div className="ml-auto flex items-center gap-4 md:gap-5">
            {/* MENÚ derecho, más pequeño y con separadores */}
            <nav className="hidden md:flex items-center text-white">
              <Link
                href="/"
                className={`uppercase tracking-[.35em] ${linkBase} text-[12px]`}
              >
                Inicio
              </Link>
              <span className="mx-3 text-white/60">|</span>
              <Link
                href="/propiedades"
                className={`uppercase tracking-[.35em] ${linkBase} text-[12px]`}
              >
                Propiedades
              </Link>
              <span className="mx-3 text-white/60">|</span>
              <Link
                href="/servicios"
                className={`uppercase tracking-[.35em] ${linkBase} text-[12px]`}
              >
                Servicios
              </Link>
              <span className="mx-3 text-white/60">|</span>
              <Link
                href="/equipo"
                className={`uppercase tracking-[.35em] ${linkBase} text-[12px]`}
              >
                Equipo
              </Link>
              <span className="mx-3 text-white/60">|</span>
              <Link
                href="/contacto"
                className={`uppercase tracking-[.35em] ${linkBase} text-[12px]`}
              >
                Contacto
              </Link>
            </nav>

            {/* REDES (pegadas al menú, gap compacto) */}
            <div className="flex items-center gap-3 md:gap-4 text-white">
              <Link
                href="https://wa.me/56900000000"
                aria-label="WhatsApp"
                className={linkBase}
              >
                <MessageCircle className="h-[18px] w-[18px]" />
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

