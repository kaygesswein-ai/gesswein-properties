'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Mail,
  Phone,
  Instagram,
  Facebook,
  Linkedin,
  Menu,
  X,
} from 'lucide-react'

/**
 * Navbar alineado con el mismo contenedor que el resto de la web (max-w-7xl + px-4 lg:px-8)
 * - Logo pequeño alineado con el borde izquierdo del contenido (igual a tarjetas / botón "Ver Propiedades")
 * - Ítems en una sola línea a la derecha, con separadores verticales finos
 * - Iconos de RRSS al final, pegados a la derecha
 * - En mobile: hamburguesa con panel
 * - Transparente arriba; al scrollear toma azul corporativo
 */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Paleta corporativa
  const blue = '#0A2E57'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-[var(--gp-blue)]/95 shadow-sm' : 'bg-transparent'
        }`}
        style={{ ['--gp-blue' as any]: blue }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="h-14 lg:h-[68px] flex items-center">
            {/* Logo alineado al mismo borde que el contenido */}
            <Link href="/" className="shrink-0">
              <Image
                src="/brand/logo-white.svg"
                alt="Gesswein Properties"
                width={148}
                height={28}
                priority
                className="h-6 w-auto lg:h-7"
              />
            </Link>

            {/* NAV + ICONOS alineados a la derecha */}
            <div className="ml-auto flex items-center">
              {/* Navegación en desktop */}
              <nav className="hidden md:flex items-center whitespace-nowrap text-white/95 tracking-[0.25em] text-[12px] lg:text-[13px]">
                <Link href="/" className="gp-navlink">
                  INICIO
                </Link>
                <span className="gp-sep" />
                <Link href="/propiedades" className="gp-navlink">
                  PROPIEDADES
                </Link>
                <span className="gp-sep" />
                <Link href="/servicios" className="gp-navlink">
                  SERVICIOS
                </Link>
                <span className="gp-sep" />
                <Link href="/equipo" className="gp-navlink">
                  EQUIPO
                </Link>
                <span className="gp-sep" />
                <Link href="/contacto" className="gp-navlink">
                  CONTACTO
                </Link>

                {/* Separador hacia iconos */}
                <span className="ml-4 pl-4 border-l border-white/30" />

                {/* Iconos RRSS */}
                <div className="flex items-center gap-4 pl-4">
                  {/* WhatsApp: link a tu número */}
                  <Link
                    href="https://wa.me/56900000000"
                    target="_blank"
                    aria-label="WhatsApp"
                    className="gp-icon"
                    title="WhatsApp"
                  >
                    {/* WhatsApp SVG puro (ligero y sin dependencias) */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-[18px] w-[18px]"
                    >
                      <path d="M20.52 3.48A11.84 11.84 0 0 0 12.01 0C5.38 0 .01 5.37.01 12a11.9 11.9 0 0 0 1.66 6l-1.72 6 6.18-1.62a12 12 0 0 0 5.87 1.53h.01C18.64 24 24 18.63 24 12c0-3.17-1.23-6.16-3.48-8.52ZM12 22.06h-.01a10.07 10.07 0 0 1-5.13-1.41l-.37-.22-3.67.96.98-3.58-.24-.37A10.06 10.06 0 0 1 1.94 12C1.94 6.64 6.64 1.94 12 1.94c2.7 0 5.23 1.05 7.14 2.96A10.06 10.06 0 0 1 22.06 12c0 5.36-4.7 10.06-10.06 10.06Zm5.6-7.52c-.31-.16-1.84-.91-2.12-1.02-.28-.1-.49-.16-.7.17-.2.31-.8 1.02-.98 1.23-.18.2-.36.22-.67.08-.31-.16-1.31-.48-2.5-1.53-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.14-.64.13-.13.31-.34.47-.52.16-.18.21-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.7-1.69-.98-2.32-.26-.62-.53-.53-.7-.53-.18 0-.39-.02-.6-.02-.2 0-.54.08-.83.39-.28.31-1.08 1.05-1.08 2.57 0 1.51 1.11 2.97 1.27 3.18.16.21 2.18 3.33 5.3 4.67.74.32 1.32.51 1.77.65.74.24 1.41.21 1.94.13.59-.09 1.84-.75 2.1-1.49.26-.74.26-1.37.18-1.49-.08-.12-.29-.2-.6-.36Z" />
                    </svg>
                  </Link>

                  <Link
                    href="mailto:hola@gessweinproperties.cl"
                    aria-label="Email"
                    className="gp-icon"
                    title="Email"
                  >
                    <Mail className="h-[18px] w-[18px]" />
                  </Link>
                  <Link href="tel:+56900000000" aria-label="Teléfono" className="gp-icon" title="Teléfono">
                    <Phone className="h-[18px] w-[18px]" />
                  </Link>
                  <Link
                    href="https://instagram.com/"
                    target="_blank"
                    aria-label="Instagram"
                    className="gp-icon"
                    title="Instagram"
                  >
                    <Instagram className="h-[18px] w-[18px]" />
                  </Link>
                  <Link
                    href="https://facebook.com/"
                    target="_blank"
                    aria-label="Facebook"
                    className="gp-icon"
                    title="Facebook"
                  >
                    <Facebook className="h-[18px] w-[18px]" />
                  </Link>
                  <Link
                    href="https://linkedin.com/"
                    target="_blank"
                    aria-label="LinkedIn"
                    className="gp-icon"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-[18px] w-[18px]" />
                  </Link>
                </div>
              </nav>

              {/* Botón hamburguesa en mobile */}
              <button
                className="md:hidden text-white ml-2 p-2"
                aria-label="Abrir menú"
                onClick={() => setOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Panel Mobile */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 bottom-0 z-[61] w-72 bg-[var(--gp-blue)] text-white transition-transform duration-300 md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ ['--gp-blue' as any]: blue }}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between h-14 px-4">
          <Image
            src="/brand/logo-white.svg"
            alt="Gesswein Properties"
            width={132}
            height={24}
            className="h-6 w-auto"
          />
          <button aria-label="Cerrar menú" onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="px-4 py-2 flex flex-col gap-1 tracking-[0.22em] text-[13px]">
          <Link href="/" onClick={() => setOpen(false)} className="gp-mobile">
            INICIO
          </Link>
          <Link href="/propiedades" onClick={() => setOpen(false)} className="gp-mobile">
            PROPIEDADES
          </Link>
          <Link href="/servicios" onClick={() => setOpen(false)} className="gp-mobile">
            SERVICIOS
          </Link>
          <Link href="/equipo" onClick={() => setOpen(false)} className="gp-mobile">
            EQUIPO
          </Link>
          <Link href="/contacto" onClick={() => setOpen(false)} className="gp-mobile">
            CONTACTO
          </Link>

          <div className="mt-3 h-px bg-white/20" />

          <div className="mt-3 grid grid-cols-5 gap-3">
            <Link href="https://wa.me/56900000000" target="_blank" aria-label="WhatsApp" className="gp-mobile-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M20.52 3.48A11.84 11.84 0 0 0 12.01 0C5.38 0 .01 5.37.01 12a11.9 11.9 0 0 0 1.66 6l-1.72 6 6.18-1.62a12 12 0 0 0 5.87 1.53h.01C18.64 24 24 18.63 24 12c0-3.17-1.23-6.16-3.48-8.52ZM12 22.06h-.01a10.07 10.07 0 0 1-5.13-1.41l-.37-.22-3.67.96.98-3.58-.24-.37A10.06 10.06 0 0 1 1.94 12C1.94 6.64 6.64 1.94 12 1.94c2.7 0 5.23 1.05 7.14 2.96A10.06 10.06 0 0 1 22.06 12c0 5.36-4.7 10.06-10.06 10.06Zm5.6-7.52c-.31-.16-1.84-.91-2.12-1.02-.28-.1-.49-.16-.7.17-.2.31-.8 1.02-.98 1.23-.18.2-.36.22-.67.08-.31-.16-1.31-.48-2.5-1.53-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.14-.64.13-.13.31-.34.47-.52.16-.18.21-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.7-1.69-.98-2.32-.26-.62-.53-.53-.7-.53-.18 0-.39-.02-.6-.02-.2 0-.54.08-.83.39-.28.31-1.08 1.05-1.08 2.57 0 1.51 1.11 2.97 1.27 3.18.16.21 2.18 3.33 5.3 4.67.74.32 1.32.51 1.77.65.74.24 1.41.21 1.94.13.59-.09 1.84-.75 2.1-1.49.26-.74.26-1.37.18-1.49-.08-.12-.29-.2-.6-.36Z" />
              </svg>
            </Link>
            <Link href="mailto:hola@gessweinproperties.cl" className="gp-mobile-icon" aria-label="Email">
              <Mail className="h-5 w-5" />
            </Link>
            <Link href="tel:+56900000000" className="gp-mobile-icon" aria-label="Teléfono">
              <Phone className="h-5 w-5" />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="gp-mobile-icon" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="https://facebook.com" target="_blank" className="gp-mobile-icon" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" className="gp-mobile-icon col-span-5" aria-label="LinkedIn">
              <div className="inline-flex"><Linkedin className="h-5 w-5" /></div>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Spacer para que el contenido no quede oculto si el header no es absolute en otras páginas */}
      <div className="h-14 lg:h-[68px]" />
    </>
  )
}
