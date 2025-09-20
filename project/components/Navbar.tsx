'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  Mail,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
  MessageCircle,
  Menu,
  X,
} from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Si el usuario agranda la ventana a desktop, cierra el menú móvil
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const wrapper = 'fixed top-0 inset-x-0 z-50 transition-colors duration-300'
  const bg = scrolled
    ? 'bg-[#0A2E57]/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(255,255,255,.06)]'
    : 'bg-transparent'

  const linkBase = 'text-white/90 hover:text-white transition-colors select-none'

  return (
    <>
      <header className={`${wrapper} ${bg}`}>
        {/* pl-* alinea el logo con el “Ver Propiedades” del hero */}
        <div className="mx-auto max-w-7xl pr-4 sm:pr-6 lg:pr-8 pl-6 md:pl-10 lg:pl-12 xl:pl-16">
          <div className="h-16 md:h-18 flex items-center">
            {/* LOGO (usa /public/logo-white.svg) */}
            <Link href="/" aria-label="Gesswein Properties" className="shrink-0">
              <Image
                src="/logo-white.svg"
                alt="Gesswein Properties"
                width={120}
                height={30}
                priority
                className="w-[105px] md:w-[120px] h-auto"
              />
            </Link>

            {/* Menú + redes a la derecha */}
            <div className="ml-auto flex items-center gap-3 md:gap-4">
              {/* MENÚ Desktop (con separadores) */}
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

              {/* Redes (mismo orden y tamaños) */}
              <div className="flex items-center gap-3 text-white">
                {/* WhatsApp sin relleno: burbuja + teléfono centrado */}
                <Link
                  href="https://wa.me/56900000000"
                  aria-label="WhatsApp"
                  className="relative inline-flex h-6 w-6 items-center justify-center md:h-7 md:w-7"
                >
                  {/* Burbuja */}
                  <MessageCircle className="absolute inset-0 h-full w-full stroke-current stroke-[1.6] [vector-effect:non-scaling-stroke]" />
                  {/* Teléfono (centrado óptico) */}
                  <Phone className="absolute h-[12px] w-[12px] md:h-[14px] md:w-[14px] stroke-current stroke-[1.8] [vector-effect:non-scaling-stroke] -translate-y-[0.5px] translate-x-[0.3px] rotate-[18deg]" />
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

              {/* Botón hamburguesa – SOLO móvil */}
              <button
                type="button"
                aria-label="Abrir menú"
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((v) => !v)}
                className="md:hidden ml-1 text-white/90 hover:text-white p-2 -mr-1"
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Panel móvil (overlay gris translúcido + texto negro) */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed inset-x-0 top-16 z-40
                    bg-white/80 backdrop-blur-sm border-t border-black/10
                    transition-all duration-200
                    ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <nav className="flex flex-col py-3">
          <Link
            href="/"
            className="px-5 py-3 uppercase tracking-[.30em] text-[12px] text-black hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/propiedades"
            className="px-5 py-3 uppercase tracking-[.30em] text-[12px] text-black hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            Propiedades
          </Link>
          <Link
            href="/servicios"
            className="px-5 py-3 uppercase tracking-[.30em] text-[12px] text-black hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            Servicios
          </Link>
          <Link
            href="/equipo"
            className="px-5 py-3 uppercase tracking-[.30em] text-[12px] text-black hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            Equipo
          </Link>
          <Link
            href="/contacto"
            className="px-5 py-3 uppercase tracking-[.30em] text-[12px] text-black hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            Contacto
          </Link>
        </nav>
      </div>
    </>
  )
}

