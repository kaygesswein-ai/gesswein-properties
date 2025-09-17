'use client';

import Link from 'next/link';
import { Mail, Phone, Facebook, Instagram } from 'lucide-react';

/** WhatsApp brand icon (SVG inline) */
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.52 3.48A11.78 11.78 0 0012.04 0 11.79 11.79 0 000 11.8a11.54 11.54 0 001.62 6l-1.07 3.92 4-1.05a11.8 11.8 0 005.69 1.45h.01A11.79 11.79 0 0024 11.8a11.67 11.67 0 00-3.48-8.32zM12.03 21.5a9.7 9.7 0 01-4.95-1.35l-.35-.2-2.37.62.63-2.31-.23-.38A9.73 9.73 0 1121.76 12a9.66 9.66 0 01-9.73 9.5zm5.45-7.27c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.5-1.76-1.68-2.06-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.2-.23-.55-.47-.48-.65-.49h-.56c-.2 0-.52.07-.8.37s-1.05 1.03-1.05 2.52 1.08 2.92 1.23 3.13c.15.2 2.13 3.24 5.17 4.54.72.31 1.28.5 1.72.64.72.23 1.37.2 1.88.12.57-.08 1.78-.73 2.04-1.44.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35z"/>
    </svg>
  );
}

export default function Footer() {
  const onLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src.includes('/logo-white.svg')) {
      img.src = '/brand/logo-white.svg';
    } else if (img.src.includes('/brand/logo-white.svg')) {
      img.src = '/brand/logo-white.png';
    }
  };

  return (
    <footer className="bg-[#0A2E57] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Logo centrado */}
        <div className="flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-white.svg"
            alt="Gesswein Properties"
            className="h-12 w-auto"
            onError={onLogoError}
          />

          {/* Íconos (WhatsApp primero) */}
          <div className="mt-6 flex items-center gap-6 text-white/80">
            <a href="https://wa.me/56900000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-white transition">
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a href="mailto:hola@gessweinproperties.cl" aria-label="Email" className="hover:text-white transition">
              <Mail className="h-5 w-5" />
            </a>
            <a href="tel:+56900000000" aria-label="Teléfono" className="hover:text-white transition">
              <Phone className="h-5 w-5" />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Separador */}
        <div className="my-8 border-t border-white/15" />

        {/* Menú inferior centrado (caps + tracking) */}
        <nav className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[12px] nav-caps">
          <Link href="/" className="text-white/80 hover:text-white transition">Inicio</Link>
          <Link href="/propiedades" className="text-white/80 hover:text-white transition">Propiedades</Link>
          <Link href="/servicios" className="text-white/80 hover:text-white transition">Servicios</Link>
          <Link href="/equipo" className="text-white/80 hover:text-white transition">Equipo</Link>
          <Link href="/contacto" className="text-white/80 hover:text-white transition">Contacto</Link>
        </nav>

        {/* Separador */}
        <div className="my-8 border-t border-white/15" />

        {/* Copyright */}
        <div className="flex flex-col items-center">
          <p className="text-sm text-white/70 text-center">
            © {new Date().getFullYear()} Gesswein Properties. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
