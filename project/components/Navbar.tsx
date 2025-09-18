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

  // barra fija y transición de color
  const wrapper = 'fixed top-0 inset-x-0 z-50 transition-colors duration-300'
  const bg = scrolled
    ? 'bg-[#0A2E57]/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(255,255,255,.06)]'
    : 'bg-transparent'

  // estilo de links
  const linkBase = 'text-white/90 hover:text-white transition-colors'

  return (
    <header className={`${wrapper} ${bg}`}>
      {/* MISMO contenedor que usa la portada para alinear el logo con los cuadros/botón */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 md:h-18 flex items-center">
          {/* LOGO (ruta confirmada: /public/logo-white.svg) */}
          <Link href="/" aria-label="Gesswein Properties" className="shrink-0">
            <Image
              src="/logo-white.svg"
              alt="Gesswein Properties"
              width={150}
              height={36}
              priority
              className="w-[130px] md:w-[145px] h-auto"
            />
          </Link>

          {/* Menú + redes a la derecha */}
          <div className="ml-auto flex items-center gap-3 md:gap-4">
            {/* MENÚ (compacto, con separadores y tracking menor) */}
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

            {/* REDES — pegadas al menú con gap corto */}
            <div className="flex items-center gap-3 text-white">
              <Link href="https://wa.me/56900000000" aria-label="WhatsApp" className={linkBase}>
                <MessageCircle className="h-[18px] w-[18px]" />
              </Link>
              <Link href="mailto:hola@gessweinproperties.cl" aria-label="Email" className={linkBase}>
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
