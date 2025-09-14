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

// Cambia el número de WhatsApp si quieres
const WHATSAPP_URL =
  'https://wa.me/56900000000?text=Hola%20Gesswein%20Properties,%20quiero%20asesor%C3%ADa%20inmobiliaria.'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-[#0A2E57] text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra superior */}
        <div className="h-16 flex items-center justify-between">
          {/* Logo (solo símbolo blanco) */}
          <Link href="/" aria-label="Gesswein Properties" className="flex items-center">
            <Image
              src="/logo-white.svg" // o /logo-white.png si lo subiste en PNG
              alt="Gesswein Properties"
              width={36}
              height={36}
              priority
            />
          </Link>

          {/* Botón móvil */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Navegación escritorio */}
          <div className="hidden md:flex items-center gap-6">
            <ul className="flex items-center gap-6">

