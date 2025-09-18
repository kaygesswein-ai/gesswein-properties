'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/', label: 'INICIO' },
  { href: '/propiedades', label: 'PROPIEDADES' },
  { href: '/servicios', label: 'SERVICIOS' },
  { href: '/equipo', label: 'EQUIPO' },
  { href: '/contacto', label: 'CONTACTO' },
];

// Iconitos simples en línea, del mismo grosor que usabas
const Ico = {
  Wa: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <path strokeWidth="1.7" d="M20.5 11.7A8.5 8.5 0 1 1 7.9 3.6L6.6 6.9l3.4-1.2" />
      <path strokeWidth="1.7" d="M8.5 9.5c.3 1.7 2.5 3.9 4.2 4.2M8.5 9.5l1.9-.9M12.7 13.7l.9-1.9" />
      <path strokeWidth="1.7" d="M14.5 11.5c0 .2-.4.9-.6 1.1-.2.2-.7.1-1 .1s-1.1-.3-1.8-.9-1.5-1.6-1.8-2.2c-.3-.6-.4-1-.4-1.2s0-.4.2-.6c.2-.2.6-.8.8-1 .2-.2.4-.2.6-.2h.4c.1 0 .3.1.4.3l.6 1.2" />
    </svg>
  ),
  Mail: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <path strokeWidth="1.7" d="M4 6h16v12H4z" />
      <path strokeWidth="1.7" d="m4 7 8 6 8-6" />
    </svg>
  ),
  Phone: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      <path strokeWidth="1.7" d="M5 5c1 4 5 8 9 9l3-3 3 3-2 3c-1 1-3 2-5 1C7 16 4 11 3 8c-1-2 0-4 1-5l3-2 3 3-3 3Z" />
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
      <rect x="3" y="8" width="4" height="12" strokeWidth="1.7" />
      <circle cx="5" cy="5" r="2" strokeWidth="1.7" />
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
        'fixed inset-x-0 top-0 z-50 transition-colors',
        solid ? 'bg-[#0c2d4a]/95 backdrop-blur' : 'bg-transparent',
      ].join(' ')}
    >
      {/* Contenedor ancho similar al que ya usas */}
      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6">
        {/* Alto calibrado para no empujar el hero */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo (mismo tamaño percibido que te gusta) */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo-white.svg"
              alt="Gesswein Properties"
              width={150}
              height={28}
              className="h-[22px] w-auto md:h-[24px]"
              priority
            />
          </Link>

          {/* Menú centrado, tracking y separadores finos */}
          <nav className="pointer-events-auto hidden md:flex flex-1 items-center justify-center">
            <ul className="flex items-center text-white">
              {LINKS.map((item, idx) => (
                <li key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    className="px-3 text-[14px] tracking-[.25em] hover:opacity-90"
                  >
                    {item.label}
                  </Link>
                  {idx < LINKS.length - 1 && (
                    <span className="mx-2 text-white/50">|</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Redes a la derecha, mismo orden que el footer */}
          <div className="ml-3 hidden items-center gap-4 text-white md:flex">
            <Link aria-label="WhatsApp" href="https://wa.me/56900000000" target="_blank" className="hover:text-white">
              <Ico.Wa className="h-[18px] w-[18px]" />
            </Link>
            <Link aria-label="Email" href="mailto:hola@gessweinproperties.cl" className="hover:text-white">
              <Ico.Mail className="h-[18px] w-[18px]" />
            </Link>
            <Link aria-label="Teléfono" href="tel:+56900000000" className="hover:text-white">
              <Ico.Phone className="h-[18px] w-[18px]" />
            </Link>
            <Link aria-label="Instagram" href="https://instagram.com/" target="_blank" className="hover:text-white">
              <Ico.Ig className="h-[18px] w-[18px]" />
            </Link>
            <Link aria-label="Facebook" href="https://facebook.com/" target="_blank" className="hover:text-white">
              <Ico.Fb className="h-[18px] w-[18px]" />
            </Link>
            <Link aria-label="LinkedIn" href="https://linkedin.com/" target="_blank" className="hover:text-white">
              <Ico.In className="h-[18px] w-[18px]" />
            </Link>
          </div>

          {/* En móvil NO tocamos nada aún: dejamos limpio (sin menú) para no romper nada. 
             Si tenías íconos en mobile, los añade tu header/hero previo.
          */}
        </div>
      </div>
    </header>
  );
}
