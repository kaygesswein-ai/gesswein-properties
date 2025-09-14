'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { name: 'Inicio', href: '/' },
  { name: 'Propiedades', href: '/propiedades' },
  { name: 'Servicios', href: '/servicios' },
  { name: 'Equipo', href: '/equipo' },
  { name: 'Contacto', href: '/contacto' },
]

// Solo ícono de WhatsApp (SVG inline)
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.51 0 .22 5.29.22 11.83c0 2.08.54 4.1 1.57 5.89L0 24l6.46-1.67a11.77 11.77 0 0 0 5.59 1.43h.01c6.54 0 11.83-5.29 11.83-11.83 0-3.16-1.23-6.13-3.37-8.35ZM12.06 21.4h-.01c-1.83 0-3.62-.49-5.18-1.41l-.37-.22-3.83.99 1.02-3.73-.24-.38A9.54 9.54 0 0 1 2.64 11.8c0-5.23 4.26-9.49 9.5-9.49 2.54 0 4.93.99 6.73 2.78a9.44 9.44 0 0 1 2.78 6.71c0 5.23-4.26 9.49-9.49 9.49Zm5.47-7.11c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.5-1.76-1.68-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.53.07-.82.38-.3.3-1.08 1.05-1.08 2.56 0 1.5 1.1 2.95 1.25 3.15.15.2 2.17 3.31 5.25 4.66.73.31 1.3.49 1.75.63.74.24 1.41.21 1.94.13.59-.09 1.77-.73 2.02-1.44.25-.71.25-1.31.17-1.44-.08-.13-.27-.2-.57-.35Z" />
    </svg>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#0A2E57] text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo blanco real (sin texto). Asegúrate de tener /project/public/logo-white.svg */}
          <Link href="/" aria-label="Gesswein Properties" className="flex items-center">
            <Image src="/logo-white.svg" alt="Gesswein Properties" width={36} height={36} priority />
          </Link>

          {/* Botón móvil */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 hover:bg-white/10 transition"
            onClick={() => setOpen(v => !v)}
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Navegación escritorio */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {NAV_ITEMS.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex items-center text-white/90 hover:text-white transition">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Solo ícono de WhatsApp, cuadrado, sin redondeo */}
            <Link
              href="https://wa.me/56900000000?text=Hola%20Gesswein%20Properties,%20quiero%20asesor%C3%ADa%20inmobiliaria."
              target="_blank"
              aria-label="WhatsApp"
              className="inline-flex items-center justify-center w-10 h-10 border border-white text-white hover:bg-white/10 transition"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0A2E57]">
          <div className="px-4 py-3 space-y-2">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block w-full px-3 py-2 text-white/90 hover:bg-white/10 hover:text-white transition"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="https://wa.me/56900000000?text=Hola%20Gesswein%20Properties,%20quiero%20asesor%C3%ADa%20inmobiliaria."
              target="_blank"
              onClick={() => setOpen(false)}
              aria-label="WhatsApp"
              className="mt-2 inline-flex items-center justify-center w-full border border-white text-white px-3 py-2 hover:bg-white/10 transition"
            >
              <WhatsAppIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
