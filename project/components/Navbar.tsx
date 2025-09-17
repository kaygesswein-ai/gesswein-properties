'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Mail, Phone, Facebook, Instagram } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/' || pathname === '/inicio';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const barClasses =
    'fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300 ' +
    (scrolled ? 'bg-[#0A2E57]/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent');

  const linkClasses =
    'px-3 py-1 text-xs tracking-[0.28em] uppercase transition ' +
    (scrolled
      ? 'text-white/90 hover:text-white'
      : 'text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)] hover:text-white');

  const iconClasses =
    'h-4.5 w-4.5 transition ' +
    (scrolled ? 'text-white/85 hover:text-white' : 'text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)] hover:text-white');

  const Sep = () => (
    <span
      className={'hidden lg:inline-block h-4 w-px mx-2 ' + (scrolled ? 'bg-white/30' : 'bg-white/60')}
      aria-hidden
    />
  );

  return (
    <>
      <header className={barClasses}>
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center gap-6">
          {/* Logo (izquierda) */}
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-white.svg"
              alt="Gesswein Properties"
              className="h-7 w-auto"
              onError={(e) => {
                const img = e.currentTarget;
                img.src = '/brand/logo-white.svg';
              }}
            />
          </Link>

          {/* Menú alineado a la derecha */}
          <nav className="hidden md:flex flex-1 items-center justify-end">
            <Link href="/" className={linkClasses}>Inicio</Link>
            <Sep />
            <Link href="/propiedades" className={linkClasses}>Propiedades</Link>
            <Sep />
            <Link href="/servicios" className={linkClasses}>Servicios</Link>
            <Sep />
            <Link href="/equipo" className={linkClasses}>Equipo</Link>
            <Sep />
            <Link href="/contacto" className={linkClasses}>Contacto</Link>
          </nav>

          {/* Íconos redes (extremo derecho): WhatsApp primero, luego los mismos del footer */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://wa.me/56900000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:opacity-100"
            >
              <MessageCircle className={iconClasses} />
            </a>
            <a href="mailto:hola@gessweinproperties.cl" aria-label="Email">
              <Mail className={iconClasses} />
            </a>
            <a href="tel:+56900000000" aria-label="Teléfono">
              <Phone className={iconClasses} />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook className={iconClasses} />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className={iconClasses} />
            </a>
          </div>
        </div>
      </header>

      {/* Spacer solo si NO es la home (para que en home el hero llegue hasta arriba bajo el navbar transparente) */}
      {!isHome && <div className="h-16" />}
    </>
  );
}
