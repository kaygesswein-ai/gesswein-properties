'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const NAV = [
  { href: '/', label: 'INICIO' },
  { href: '/propiedades', label: 'PROPIEDADES' },
  { href: '/servicios', label: 'SERVICIOS' },
  { href: '/equipo', label: 'EQUIPO' },
  { href: '/contacto', label: 'CONTACTO' },
];

// SVGs livianos (sin librerías)
const IconWhatsapp = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path strokeWidth="1.7" d="M20.5 11.7A8.5 8.5 0 1 1 7.9 3.6L6.6 6.9l3.4-1.2" />
    <path strokeWidth="1.7" d="M8.5 9.5c.3 1.7 2.5 3.9 4.2 4.2M8.5 9.5l1.9-.9M12.7 13.7l.9-1.9" />
    <path strokeWidth="1.7" d="M14.5 11.5c0 .2-.4.9-.6 1.1-.2.2-.7.1-1 .1s-1.1-.3-1.8-.9-1.5-1.6-1.8-2.2c-.3-.6-.4-1-.4-1.2s0-.4.2-.6c.2-.2.6-.8.8-1 .2-.2.4-.2.6-.2h.4c.1 0 .3.1.4.3l.6 1.2" />
  </svg>
);
const IconMail = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path strokeWidth="1.7" d="M4 6h16v12H4z" />
    <path strokeWidth="1.7" d="m4 7 8 6 8-6" />
  </svg>
);
const IconPhone = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path strokeWidth="1.7" d="M5 5c1 4 5 8 9 9l3-3 3 3-2 3c-1 1-3 2-5 1C7 16 4 11 3 8c-1-2 0-4 1-5l3-2 3 3-3 3Z" />
  </svg>
);
const IconInstagram = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="3.5" strokeWidth="1.7" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);
const IconFacebook = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <path strokeWidth="1.7" d="M14 8h3V5h-3c-1.7 0-3 1.3-3 3v3H8v3h3v5h3v-5h3l1-3h-4V8Z" />
  </svg>
);
const IconLinkedIn = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
    <rect x="3" y="8" width="4" height="12" strokeWidth="1.7" />
    <circle cx="5" cy="5" r="2" strokeWidth="1.7" />
    <path strokeWidth="1.7" d="M11 20v-7a3 3 0 0 1 6 0v7" />
  </svg>
);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-colors',
        scrolled ? 'bg-[#0c2d4a]/95 backdrop-blur' : 'bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-3 md:h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo-white.svg"
              alt="Gesswein Properties"
              width={148}
              height={28}
              className="h-[22px] w-auto md:h-[26px]"
              priority
            />
          </Link>

          {/* Desktop: menú + redes */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6 tracking-[.25em] text-white">
              {NAV.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="text-sm hover:opacity-90">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="ml-6 flex items-center gap-4 text-white/90">
              <Link aria-label="WhatsApp" href="https://wa.me/56900000000" target="_blank" className="hover:text-white">
                <IconWhatsapp className="h-5 w-5" />
              </Link>
              <Link aria-label="Email" href="mailto:hola@gessweinproperties.cl" className="hover:text-white">
                <IconMail className="h-5 w-5" />
              </Link>
              <Link aria-label="Teléfono" href="tel:+56900000000" className="hover:text-white">
                <IconPhone className="h-5 w-5" />
              </Link>
              <Link aria-label="Instagram" href="https://instagram.com/" target="_blank" className="hover:text-white">
                <IconInstagram className="h-5 w-5" />
              </Link>
              <Link aria-label="Facebook" href="https://facebook.com/" target="_blank" className="hover:text-white">
                <IconFacebook className="h-5 w-5" />
              </Link>
              <Link aria-label="LinkedIn" href="https://linkedin.com/" target="_blank" className="hover:text-white">
                <IconLinkedIn className="h-5 w-5" />
              </Link>
            </div>
          </nav>

          {/* Móvil: redes a la izquierda y hamburguesa al extremo derecho */}
          <div className="flex grow items-center justify-end gap-4 md:hidden">
            <div className="flex items-center gap-4 text-white/90">
              <Link aria-label="WhatsApp" href="https://wa.me/56900000000" target="_blank">
                <IconWhatsapp className="h-[18px] w-[18px]" />
              </Link>
              <Link aria-label="Email" href="mailto:hola@gessweinproperties.cl">
                <IconMail className="h-[18px] w-[18px]" />
              </Link>
              <Link aria-label="Teléfono" href="tel:+56900000000">
                <IconPhone className="h-[18px] w-[18px]" />
              </Link>
              <Link aria-label="Instagram" href="https://instagram.com/" target="_blank">
                <IconInstagram className="h-[18px] w-[18px]" />
              </Link>
              <Link aria-label="Facebook" href="https://facebook.com/" target="_blank">
                <IconFacebook className="h-[18px] w-[18px]" />
              </Link>
              <Link aria-label="LinkedIn" href="https://linkedin.com/" target="_blank">
                <IconLinkedIn className="h-[18px] w-[18px]" />
              </Link>
            </div>

            {/* Botón hamburguesa (extremo derecho) */}
            <button
              aria-label="Abrir menú"
              onClick={() => setOpen((v) => !v)}
              className="ml-2 grid h-10 w-10 place-content-center rounded-md/80 text-white/90 ring-1 ring-white/15 hover:bg-white/10"
            >
              {/* ícono hamburguesa puro SVG */}
              <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeWidth="1.7" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Drawer móvil */}
      {open && (
        <div className="md:hidden">
          <div className="mx-auto max-w-7xl px-4 pb-4 pt-2 sm:px-6">
            <ul className="rounded-xl bg-[#0c2d4a]/95 p-3 backdrop-blur ring-1 ring-white/10">
              {NAV.map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-3 text-sm tracking-[.25em] text-white hover:bg-white/10 rounded-lg"
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

