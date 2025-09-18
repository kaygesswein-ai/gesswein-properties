'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * Navbar “2 atrás”:
 * - Logo blanco a la izquierda (src: /logo-white.svg)
 * - Enlaces centrados con separador |
 * - Redes a la derecha (WhatsApp con telefonito, Email, Teléfono, IG, FB, IN)
 * - Transparente arriba; al scrollear: azul corporativo con blur
 * - Altura estable: no mueve el hero/slider
 */

const LINKS = [
  { href: '/', label: 'INICIO' },
  { href: '/propiedades', label: 'PROPIEDADES' },
  { href: '/servicios', label: 'SERVICIOS' },
  { href: '/equipo', label: 'EQUIPO' },
  { href: '/contacto', label: 'CONTACTO' },
];

// Iconos finos (línea 1.7) como los que tenías
const Ico = {
  WaPhone: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      {/* circunferencia/burbuja */}
      <path strokeWidth="1.7" d="M20.5 11.7A8.5 8.5 0 1 1 7.9 3.6L6.6 6.9l3.4-1.2" />
      {/* teléfono dentro */}
      <path strokeWidth="1.7" d="M14.7 13.5c-.8.8-3.4-.7-4.7-2s-2.8-3.9-2-4.7l1.1-1.1 1.2 2.2-1 1c.2.7 1.2 2 1.9 2.7s2 .17 2.6 0l1 1-1.1 1.1Z" />
    </svg>
  ),
  Mail: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <rect x="3.8" y="5.5" width="16.4" height="13" rx="1.8" strokeWidth="1.7" />
      <path strokeWidth="1.7" d="m4 7 8 6 8-6" />
    </svg>
  ),
  Phone: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <path strokeWidth="1.7" d="M6.5 3.5 9 6l-2 2c1 3 4 6 7 7l2-2 2.5 2.5c.4.4.5 1.1.2 1.6l-1 1.7c-.4.7-1.2 1.1-2 1-3-.2-6.9-2.2-9.9-5.2S1.3 7.6 1.1 4.6c0-.8.3-1.6 1-2l1.7-1c.5-.3 1.2-.2 1.6.2Z" />
    </svg>
  ),
  Ig: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.5" strokeWidth="1.7" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  Fb: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <path strokeWidth="1.7" d="M14 8h3V5h-3c-1.7 0-3 1.3-3 3v3H8v3h3v5h3v-5h3l1-3h-4V8Z" />
    </svg>
  ),
  In: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <rect x="3" y="9" width="4" height="11" strokeWidth="1.7" />
      <circle cx="5" cy="5.5" r="1.9" strokeWidth="1.7" />
      <path strokeWidth="1.7" d="M11 20v-7a3 3 0 0 1 6 0v7" />
    </svg>
  ),
};

export default function Navbar() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        solid ? 'bg-[#0C2D4A]/95 backdrop-blur' : 'bg-transparent',
      ].join(' ')}
    >
      {/* ancho similar al look que aprobaste */}
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO a la izquierda (alineado con “Ver Propiedades”) */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo-white.svg"
              alt="Gesswein Properties"
              width={168}
              height={28}
              className="h-[24px] w-auto"
              priority
            />
          </Link>

          {/* ENLACES centrados con separador | y tracking suave */}
          <nav className="hidden md:flex flex-1 items-center justify-center">
            <ul className="flex items-center text-white">
              {LINKS.map((item, i) => (
                <li key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    className="px-3 text-[14px] tracking-[.22em] hover:opacity-90"
                  >
                    {item.label}
                  </Link>
                  {i < LINKS.length - 1 && (
                    <span className="mx-2 text-white/60">|</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* REDES a la derecha (orden: WA, Mail, Tel, IG, FB, IN) */}
          <div className="hidden md:flex items-center gap-4 text-white">
            <Link aria-label="WhatsApp" href="https://wa.me/56900000000" target="_blank" className="hover:opacity-90">
              <Ico.WaPhone className="h-[18px] w-[18px]" />
            </Link>
            <Link aria-label="Email" href="mailto:hola@gessweinproperties.cl" className="hover:opacity-90">
              <Ico.Mail className="h-[18px] w-[18px]" />
            </Link>
            <Link aria-label="Teléfono" href="tel:+56900000000" className="hover:opacity-90">
              <Ico.Phone className="h-[18px] w-[18px]" />
            </Link>
            <Link aria-label="Instagram" href="https://instagram.com" target="_blank" className="hover:opacity-90">
              <Ico.Ig className="h-[18px] w-[18px]" />
            </Link>
            <Link aria-label="Facebook" href="https://facebook.com" target="_blank" className="hover:opacity-90">
              <Ico.Fb className="h-[18px] w-[18px]" />
            </Link>
            <Link aria-label="LinkedIn" href="https://linkedin.com" target="_blank" className="hover:opacity-90">
              <Ico.In className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

