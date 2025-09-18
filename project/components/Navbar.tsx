'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Mail, Phone, Instagram, Facebook, Linkedin } from 'lucide-react'

const NAV = [
  { href: '/', label: 'INICIO' },
  { href: '/propiedades', label: 'PROPIEDADES' },
  { href: '/servicios', label: 'SERVICIOS' },
  { href: '/equipo', label: 'EQUIPO' },
  { href: '/contacto', label: 'CONTACTO' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-[#0A2E57]/95 backdrop-blur' : 'bg-transparent'
      }`}
    >
      {/* Contenedor ancho: mantiene el logo alineado con la caja de "Propiedades destacadas" */}
      <div className="mx-auto w-full px-6 sm:px-10 lg:px-16">

        <div className="flex h-16 items-center">
          {/* LOGO — (no tocado)  */}
          <Link href="/" aria-label="Gesswein Properties" className="shrink-0">
            <Image
              src="/logo-white.svg"
              alt="Gesswein Properties"
              width={150}           // 3/4 aprox. del alto anterior
              height={36}
              priority
              className="block select-none"
            />
          </Link>

          {/* MENÚ + SOCIALES alineados a la DERECHA (no tocado) */}
          <nav className="ml-auto flex items-center gap-6">
            {/* Menú principal con separadores verticales */}
            <ul className="hidden md:flex items-center gap-4 tracking-[0.35em] text-[13px] text-white/90">
              {NAV.map((item, idx) => (
                <li key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                  {idx < NAV.length - 1 && (
                    <span className="mx-4 h-4 w-px bg-white/50 inline-block" />
                  )}
                </li>
              ))}
            </ul>

            {/* Iconos sociales (mismo orden que ya tienes) */}
            <div className="flex items-center gap-5 text-white/90">
              {/* === ÚNICO CAMBIO: WhatsApp con teléfono CENTRADO === */}
              <Link
                href="https://wa.me/56900000000"
                aria-label="WhatsApp"
                target="_blank"
                className="relative inline-flex h-6 w-6 items-center justify-center hover:text-white transition"
              >
                {/* Burbuja */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-[22px] w-[22px] stroke-current"
                  fill="none"
                  strokeWidth={2}
                >
                  <path d="M20.52 3.48A11 11 0 0 1 3.48 20.52L2 22l1.48-1.48A11 11 0 1 1 20.52 3.48Z" />
                </svg>
                {/* Teléfono PERFECTAMENTE CENTRADO dentro de la burbuja */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="absolute left-1/2 top-1/2 h-[12px] w-[12px] -translate-x-1/2 -translate-y-1/2 stroke-current"
                  fill="none"
                  strokeWidth={2}
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.9.3 1.77.57 2.6a2 2 0 0 1-.45 2.11L9.91 10.1a16 16 0 0 0 4 4l.67-.67a2 2 0 0 1 2.11-.45c.83.27 1.7.45 2.6.57A2 2 0 0 1 22 16.92Z" />
                </svg>
              </Link>

              {/* Email */}
              <Link
                href="mailto:hola@gessweinproperties.cl"
                aria-label="Email"
                className="hover:text-white transition"
              >
                <Mail className="h-5 w-5" />
              </Link>

              {/* Teléfono */}
              <Link
                href="tel:+56900000000"
                aria-label="Teléfono"
                className="hover:text-white transition"
              >
                <Phone className="h-5 w-5" />
              </Link>

              {/* Instagram */}
              <Link
                href="https://instagram.com"
                aria-label="Instagram"
                target="_blank"
                className="hover:text-white transition"
              >
                <Instagram className="h-5 w-5" />
              </Link>

              {/* Facebook */}
              <Link
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                className="hover:text-white transition"
              >
                <Facebook className="h-5 w-5" />
              </Link>

              {/* LinkedIn */}
              <Link
                href="https://linkedin.com"
                aria-label="LinkedIn"
                target="_blank"
                className="hover:text-white transition"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

