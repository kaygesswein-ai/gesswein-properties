'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MessageCircle, Phone, Mail, Instagram, Facebook, Linkedin } from 'lucide-react'

export default function Footer() {
  const nav = [
    { href: '/', label: 'Inicio' },
    { href: '/propiedades', label: 'Propiedades' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/equipo', label: 'Equipo' },
    { href: '/contacto', label: 'Contacto' },
  ]

  // Orden idéntico al navbar
  const social = [
    {
      key: 'wa',
      href: 'https://wa.me/56900000000',
      label: 'WhatsApp',
      render: () => (
        <span className="relative inline-flex h-8 w-8 items-center justify-center">
          {/* Burbuja */}
          <MessageCircle className="h-[26px] w-[26px]" />
          {/* Teléfono centrado */}
          <Phone className="absolute left-1/2 top-1/2 h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2" />
        </span>
      ),
    },
    { key: 'mail', href: 'mailto:hola@gessweinproperties.cl', label: 'Email', render: () => <Mail className="h-6 w-6" /> },
    { key: 'phone', href: 'tel:+56900000000', label: 'Teléfono', render: () => <Phone className="h-6 w-6" /> },
    { key: 'ig', href: 'https://instagram.com', label: 'Instagram', render: () => <Instagram className="h-6 w-6" /> },
    { key: 'fb', href: 'https://facebook.com', label: 'Facebook', render: () => <Facebook className="h-6 w-6" /> },
    { key: 'in', href: 'https://linkedin.com', label: 'LinkedIn', render: () => <Linkedin className="h-6 w-6" /> },
  ]

  return (
    <footer className="bg-[#0A2E57] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/logo-white.svg"
            alt="Gesswein Properties"
            width={180}
            height={42}
            priority
          />
        </div>

        {/* Social (mismo orden que navbar) */}
        <div className="mt-6 flex justify-center gap-6">
          {social.map(s => (
            <Link
              key={s.key}
              href={s.href}
              aria-label={s.label}
              target={s.key === 'mail' || s.key === 'phone' ? undefined : '_blank'}
              className="text-white/90 hover:text-white transition"
            >
              {s.render()}
            </Link>
          ))}
        </div>

        {/* Separador */}
        <div className="mt-8 h-px bg-white/15" />

        {/* Links */}
        <nav className="mt-8">
          <ul className="flex flex-wrap justify-center gap-x-10 gap-y-3 tracking-[0.3em] text-sm">
            {nav.map(i => (
              <li key={i.href}>
                <Link href={i.href} className="text-white/90 hover:text-white transition">
                  {i.label.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Separador */}
        <div className="mt-8 h-px bg-white/15" />

        {/* Copyright */}
        <p className="mt-8 text-center text-white/70">
          © {new Date().getFullYear()} Gesswein Properties. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}

