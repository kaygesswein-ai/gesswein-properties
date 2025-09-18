'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * Navbar:
 * - Logo pequeño, alineado al mismo borde izquierdo del contenido (max-w-7xl px).
 * - Ítems en una sola línea a la derecha, con separadores finos.
 * - Iconos de RRSS pegados al final.
 * - En móvil: menú hamburguesa deslizante.
 * - Transparente al tope; al scrollear, azul corporativo.
 *
 * Asegúrate de tener el archivo /public/brand/logo-white.svg
 */

const BLUE = '#0A2E57'

// Íconos SVG inline (sin dependencias)
const IconWhats = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.52 3.48A11.84 11.84 0 0 0 12.01 0C5.38 0 .01 5.37.01 12a11.9 11.9 0 0 0 1.66 6l-1.72 6 6.18-1.62a12 12 0 0 0 5.87 1.53h.01C18.64 24 24 18.63 24 12c0-3.17-1.23-6.16-3.48-8.52ZM12 22.06h-.01a10.07 10.07 0 0 1-5.13-1.41l-.37-.22-3.67.96.98-3.58-.24-.37A10.06 10.06 0 0 1 1.94 12C1.94 6.64 6.64 1.94 12 1.94c2.7 0 5.23 1.05 7.14 2.96A10.06 10.06 0 0 1 22.06 12c0 5.36-4.7 10.06-10.06 10.06Zm5.6-7.52c-.31-.16-1.84-.91-2.12-1.02-.28-.1-.49-.16-.7.17-.2.31-.8 1.02-.98 1.23-.18.2-.36.22-.67.08-.31-.16-1.31-.48-2.5-1.53-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.14-.64.13-.13.31-.34.47-.52.16-.18.21-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.7-1.69-.98-2.32-.26-.62-.53-.53-.7-.53-.18 0-.39-.02-.6-.02-.2 0-.54.08-.83.39-.28.31-1.08 1.05-1.08 2.57 0 1.51 1.11 2.97 1.27 3.18.16.21 2.18 3.33 5.3 4.67.74.32 1.32.51 1.77.65.74.24 1.41.21 1.94.13.59-.09 1.84-.75 2.1-1.49.26-.74.26-1.37.18-1.49-.08-.12-.29-.2-.6-.36Z"/>
  </svg>
)
const IconMail = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/>
  </svg>
)
const IconPhone = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.25c1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V21a1 1 0 0 1-1 1C10.07 22 2 13.93 2 3a1 1 0 0 1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z"/>
  </svg>
)
const IconInstagram = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2A2.8 2.8 0 1 0 12 15.8 2.8 2.8 0 0 0 12 9.2ZM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/>
  </svg>
)
const IconFacebook = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.3V12h2.3V9.8c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .18 2 .18v2.2h-1.1c-1.1 0-1.4.68-1.4 1.4V12h2.4l-.38 2.9h-2v7A10 10 0 0 0 22 12Z"/>
  </svg>
)
const IconLinkedIn = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V23h-4V8Zm7.5 0h3.8v2.05h.05c.53-1 1.84-2.05 3.8-2.05C20.6 8 23 10.07 23 14.27V23h-4v-7.5c0-1.78-.03-4.07-2.48-4.07-2.48 0-2.86 1.93-2.86 3.95V23h-4V8Z"/>
  </svg>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? 'shadow-sm' : ''
        }`}
        style={{ backgroundColor: scrolled ? `${BLUE}F2` : 'transparent' }} // ~95% opacity
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="h-14 lg:h-[66px] flex items-center">
            {/* LOGO (pequeño y alineado al borde izquierdo del contenido) */}
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

            {/* Navegación + iconos a la derecha */}
            <div className="ml-auto flex items-center text-white">
              {/* Desktop nav */}
              <nav className="hidden md:flex items-center text-[12px] lg:text-[13px] tracking-[0.25em]">
                <Link href="/" className="hover:opacity-80">INICIO</Link>
                <span className="mx-4 h-4 w-px bg-white/35" />
                <Link href="/propiedades" className="hover:opacity-80">PROPIEDADES</Link>
                <span className="mx-4 h-4 w-px bg-white/35" />
                <Link href="/servicios" className="hover:opacity-80">SERVICIOS</Link>
                <span className="mx-4 h-4 w-px bg-white/35" />
                <Link href="/equipo" className="hover:opacity-80">EQUIPO</Link>
                <span className="mx-4 h-4 w-px bg-white/35" />
                <Link href="/contacto" className="hover:opacity-80">CONTACTO</Link>

                {/* Separador antes de los iconos */}
                <span className="ml-4 pl-4 border-l border-white/30" />

                {/* RRSS al extremo derecho */}
                <div className="flex items-center gap-4 pl-4">
                  <Link
                    href="https://wa.me/56900000000"
                    aria-label="WhatsApp"
                    target="_blank"
                    className="hover:opacity-80"
                    title="WhatsApp"
                  >
                    <IconWhats className="h-[18px] w-[18px]" />
                  </Link>
                  <Link href="mailto:hola@gessweinproperties.cl" aria-label="Email" className="hover:opacity-80" title="Email">
                    <IconMail className="h-[18px] w-[18px]" />
                  </Link>
                  <Link href="tel:+56900000000" aria-label="Teléfono" className="hover:opacity-80" title="Teléfono">
                    <IconPhone className="h-[18px] w-[18px]" />
                  </Link>
                  <Link href="https://instagram.com" target="_blank" aria-label="Instagram" className="hover:opacity-80" title="Instagram">
                    <IconInstagram className="h-[18px] w-[18px]" />
                  </Link>
                  <Link href="https://facebook.com" target="_blank" aria-label="Facebook" className="hover:opacity-80" title="Facebook">
                    <IconFacebook className="h-[18px] w-[18px]" />
                  </Link>
                  <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn" className="hover:opacity-80" title="LinkedIn">
                    <IconLinkedIn className="h-[18px] w-[18px]" />
                  </Link>
                </div>
              </nav>

              {/* Botón hamburguesa (mobile) */}
              <button
                className="md:hidden ml-2 p-2 text-white"
                aria-label="Abrir menú"
                onClick={() => setOpen(true)}
              >
                {/* ícono hamburguesa */}
                <span className="block w-6 h-[2px] bg-white mb-[5px]" />
                <span className="block w-6 h-[2px] bg-white mb-[5px]" />
                <span className="block w-6 h-[2px] bg-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Panel mobile */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-[61] w-72 text-white transition-transform duration-300 md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: BLUE }}
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
            <span className="block w-6 h-[2px] bg-white rotate-45 translate-y-[6px]" />
            <span className="block w-6 h-[2px] bg-white -rotate-45 -translate-y-[6px]" />
          </button>
        </div>

        <nav className="px-4 py-2 flex flex-col text-[13px] tracking-[0.22em]">
          <Link href="/" onClick={() => setOpen(false)} className="py-3 border-b border-white/10">INICIO</Link>
          <Link href="/propiedades" onClick={() => setOpen(false)} className="py-3 border-b border-white/10">PROPIEDADES</Link>
          <Link href="/servicios" onClick={() => setOpen(false)} className="py-3 border-b border-white/10">SERVICIOS</Link>
          <Link href="/equipo" onClick={() => setOpen(false)} className="py-3 border-b border-white/10">EQUIPO</Link>
          <Link href="/contacto" onClick={() => setOpen(false)} className="py-3 border-b border-white/10">CONTACTO</Link>

          <div className="mt-4 grid grid-cols-5 gap-3">
            <Link href="https://wa.me/56900000000" target="_blank" aria-label="WhatsApp" className="flex items-center justify-center h-10 border border-white/25 rounded-md">
              <IconWhats className="h-5 w-5" />
            </Link>
            <Link href="mailto:hola@gessweinproperties.cl" aria-label="Email" className="flex items-center justify-center h-10 border border-white/25 rounded-md">
              <IconMail className="h-5 w-5" />
            </Link>
            <Link href="tel:+56900000000" aria-label="Teléfono" className="flex items-center justify-center h-10 border border-white/25 rounded-md">
              <IconPhone className="h-5 w-5" />
            </Link>
            <Link href="https://instagram.com" target="_blank" aria-label="Instagram" className="flex items-center justify-center h-10 border border-white/25 rounded-md">
              <IconInstagram className="h-5 w-5" />
            </Link>
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook" className="flex items-center justify-center h-10 border border-white/25 rounded-md">
              <IconFacebook className="h-5 w-5" />
            </Link>
            <Link href="https://linkedin.com" target="_blank" aria-label="LinkedIn" className="col-span-5 flex items-center justify-center h-10 border border-white/25 rounded-md">
              <IconLinkedIn className="h-5 w-5" />
            </Link>
          </div>
        </nav>
      </aside>
    </>
  )
}

