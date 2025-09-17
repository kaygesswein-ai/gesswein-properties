'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Mail, Phone, Facebook, Instagram } from 'lucide-react';

/** WhatsApp brand icon (SVG inline) */
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.52 3.48A11.78 11.78 0 0012.04 0 11.79 11.79 0 000 11.8a11.54 11.54 0 001.62 6l-1.07 3.92 4-1.05a11.8 11.8 0 005.69 1.45h.01A11.79 11.79 0 0024 11.8a11.67 11.67 0 00-3.48-8.32zM12.03 21.5a9.7 9.7 0 01-4.95-1.35l-.35-.2-2.37.62.63-2.31-.23-.38A9.73 9.73 0 1121.76 12a9.66 9.66 0 01-9.73 9.5zm5.45-7.27c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.5-1.76-1.68-2.06-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.2-.23-.55-.47-.48-.65-.49h-.56c-.2 0-.52.07-.8.37s-1.05 1.03-1.05 2.52 1.08 2.92 1.23 3.13c.15.2 2.13 3.24 5.17 4.54.72.31 1.28.5 1.72.64.72.23 1.37.2 1.88.12.57-.08 1.78-.73 2.04-1.44.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35z"/>
    </svg>
  );
}

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
    'h-5 w-5 transition ' +
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
          {/* Logo alineado con los recuadros (mismo margen ml-6 md:ml-10) */}
          <Link href="/" className="flex items-center ml-6 md:ml-10">
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

          {/* Íconos redes (extremo derecho): WhatsApp real primero */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://wa.me/56900000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className={iconClasses} />
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

      {/* Spacer solo si NO es la home */}
      {!isHome && <div className="h-16" />}
    </>
  );
}
