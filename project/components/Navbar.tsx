'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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
    (scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent');

  const linkClasses =
    'px-3 py-1 text-xs tracking-[0.28em] uppercase transition ' +
    (scrolled ? 'text-white/90 hover:text-white' : 'text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.35)] hover:text-white');

  // separador vertical fino entre items
  const Sep = () => <span className="hidden lg:inline-block h-4 w-px bg-white/30 mx-2" aria-hidden />;

  return (
    <>
      <header className={barClasses}>
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo (espacio reservado); usa tu /public/logo-white.svg */}
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-white.svg"
              alt="Gesswein Properties"
              className="h-7 w-auto"
              onError={(e) => {
                const img = e.currentTarget;
                img.src = '/brand/logo-white.svg'; // fallback si lo moviste a /public/brand
              }}
            />
          </Link>

          {/* Menú centrado estilo Signature */}
          <nav className="hidden md:flex items-center justify-center">
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

          {/* Lado derecho vacío (reservado por si quieres teléfono o CTA) */}
          <div className="w-8 md:w-10" />
        </div>
      </header>

      {/* Spacer solo en rutas que NO son home, para que el contenido no quede bajo el nav fijo */}
      {!isHome && <div className="h-16" />}
    </>
  );
}
