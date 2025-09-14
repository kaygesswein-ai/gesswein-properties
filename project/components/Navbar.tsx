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

const WHATSAPP_URL =
  'https://wa.me/56900000000?text=Hola%20Gesswein%20Properties,%20quiero%20asesor%C3%ADa%20inmobiliaria.'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#0A2E57] text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* SOLO logo blanco */}
          <Link href="/" aria-label="Gesswein Properties" className="flex items-center">
            <Image
              src="/logo-white.svg" // coloca aquí tu archivo en /public
              alt="Gesswein Properties"
              width={36}
              height={36}
              priority
            />
          </Link>

          {/* botón móvil */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* navegación escritorio */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center text-white/90 hover:text-white transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              className="inline-flex items-center rounded-xl bg-green-600 hover:bg-green-500 text-white px-4 py-2 font-medium transition"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      </div>

      {/* menú móvil */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0A2E57]">
          <div className="px-4 py-3 space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block w-full rounded-lg px-3 py-2 text-white/90 hover:bg-white/10 hover:text-white transition"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              onClick={() => setOpen(false)}
              className="mt-2 block w-full text-center rounded-lg bg-green-600 hover:bg-green-500 text-white px-3 py-2 font-medium transition"
            >
              WhatsApp
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
