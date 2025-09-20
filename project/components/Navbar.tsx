'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
const [open, setOpen] = useState(false)
import { Mail, Phone, Instagram, Facebook, Linkedin } from 'lucide-react'

/** Ícono WhatsApp con teléfono BLANCO centrado (burbuja con borde) */
function WhatsAppPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Burbuja con borde */}
      <path d="M20.5 11.7a8.5 8.5 0 1 1-3.1-6.6 8.5 8.5 0 0 1 3.1 6.6Z" />
      <path d="M7.3 18.7 4.1 20l1.2-3.2" />

      {/* Teléfono BLANCO, centrado y sólido */}
      <path
        d="M10.2 8.2c.3-.3.7-.4 1.1-.3l1.9.6c.5.2.8.7.6 1.2l-.2.9c-.1.3-.3.6-.6.8l-.4.4c.7 1 1.5 1.8 2.5 2.5l.4-.4c.2-.2.5-.4.8-.5l.9-.2c.5-.1 1 .2 1.2.6l.6 1.9c.1.4 0 .8-.3 1.1-1 .9-2.1 1.3-3.4 1.2-1.5-.1-3.2-.9-5-2.7s-2.6-3.5-2.7-5c-.1-1.3.3-2.4 1.2-3.4Z"
        fill="currentColor" /* <- blanco porque el texto es blanco */
        stroke="none"
      />
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
    {/* Panel móvil */}
{open && (
  <div className="md:hidden fixed top-16 inset-x-0 z-40 bg-[#0A2E57] border-t border-white/10">
    <nav className="flex flex-col py-3">
      <Link href="/" className="px-5 py-3 text-white/90 uppercase tracking-[.30em] text-[12px]" onClick={() => setOpen(false)}>Inicio</Link>
      <Link href="/propiedades" className="px-5 py-3 text-white/90 uppercase tracking-[.30em] text-[12px]" onClick={() => setOpen(false)}>Propiedades</Link>
      <Link href="/servicios" className="px-5 py-3 text-white/90 uppercase tracking-[.30em] text-[12px]" onClick={() => setOpen(false)}>Servicios</Link>
      <Link href="/equipo" className="px-5 py-3 text-white/90 uppercase tracking-[.30em] text-[12px]" onClick={() => setOpen(false)}>Equipo</Link>
      <Link href="/contacto" className="px-5 py-3 text-white/90 uppercase tracking-[.30em] text-[12px]" onClick={() => setOpen(false)}>Contacto</Link>
    </nav>
  </div>
)}

  )
}
import { Menu, X } from 'lucide-react'
{/* Botón hamburguesa – visible SOLO en móvil */}
<button
  type="button"
  aria-label="Abrir menú"
  onClick={() => setOpen(v => !v)}
  className="md:hidden ml-1 text-white/90 hover:text-white p-2 -mr-1"
>
  {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
</button>


