'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Mail, Phone, Instagram, Facebook, Linkedin, Menu, X } from 'lucide-react';

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M128.005 25.6c-56.548 0-102.403 45.855-102.403 102.404 0 18.053 4.842 35.695 14.023 51.19L24.7 231.3l53.108-14.474c14.578 7.971 31.088 12.178 48.197 12.178h.001c56.548 0 102.403-45.855 102.403-102.403 0-27.355-10.65-53.084-30.001-72.435C181.09 36.249 155.36 25.6 128.005 25.6Zm0 190.79c-15.973 0-31.511-4.251-45.08-12.298l-3.227-1.911-31.552 8.606 8.436-32.361-2.1-3.317c-8.63-13.634-13.194-29.45-13.194-45.104 0-47.89 38.899-86.79 86.79-86.79 23.188 0 44.958 9.023 61.332 25.397 16.374 16.374 25.397 38.144 25.397 61.331 0 47.89-38.9 86.79-86.802 86.79Zm49.97-64.862c-2.737-1.489-16.229-8.597-18.741-9.576-2.514-.98-4.35-1.489-6.187 1.49-1.838 2.977-7.116 9.574-8.729 11.512-1.613 1.937-3.224 2.176-5.96.686-2.735-1.49-11.559-4.262-22.03-13.59-8.14-7.257-13.64-16.23-15.255-18.98-1.615-2.75-.172-4.232 1.317-5.72 1.35-1.346 3.024-3.513 4.536-5.27 1.511-1.761 2.017-2.977 3.027-4.965 1.011-1.989.568-3.723-.144-5.213-.713-1.486-6.187-14.894-8.468-20.427-2.277-5.53-4.614-4.783-6.187-4.873-1.572-.098-3.36-.12-5.147-.12-1.79 0-4.7.675-7.156 3.365-2.456 2.69-9.374 9.156-9.374 22.33 0 13.172 9.6 25.907 10.95 27.696 1.35 1.787 18.894 28.83 45.796 40.44 26.902 11.61 26.902 7.74 31.75 7.24 4.85-.497 15.653-6.363 17.87-12.503 2.216-6.14 2.216-11.403 1.55-12.503-.667-1.102-2.438-1.79-5.176-3.28Z"
      />
    </svg>
  );
}

/** Separador vertical fino (idéntico al anterior) */
const Sep = () => <span className="sigSep mx-6" aria-hidden="true" />;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const bgClass = scrolled || open ? 'bg-[#0A2E57] text-white' : 'bg-transparent text-white';

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3 columnas para forzar: logo izq / menú CENTRADO / redes dcha */}
        <div className="h-16 md:h-[84px] grid grid-cols-[auto_1fr_auto] items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="Inicio" className="block">
              <Image
                src="/logo-white.svg"
                alt="Gesswein Properties"
                width={160}
                height={34}
                priority
              />
            </Link>
          </div>

          {/* Menú desktop EXACTAMENTE centrado */}
          <nav className="hidden md:flex items-center justify-center">
            <ul className="sigMenu flex items-center">
              <li><Link href="/" className="sigItem">INICIO</Link></li>
              <Sep />
              <li><Link href="/propiedades" className="sigItem">PROPIEDADES</Link></li>
              <Sep />
              <li><Link href="/servicios" className="sigItem">SERVICIOS</Link></li>
              <Sep />
              <li><Link href="/#equipo" className="sigItem">EQUIPO</Link></li>
              <Sep />
              <li><Link href="/contacto" className="sigItem">CONTACTO</Link></li>
            </ul>
          </nav>

          {/* Redes (desktop) + Hamburguesa (móvil) */}
          <div className="flex items-center justify-end gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link href="https://wa.me/56900000000" aria-label="WhatsApp" className="hover:opacity-90">
                <WhatsAppIcon className="h-[22px] w-[22px]" />
              </Link>
              <Link href="mailto:hola@gessweinproperties.cl" aria-label="Email" className="hover:opacity-90">
                <Mail className="h-[22px] w-[22px]" />
              </Link>
              <Link href="tel:+56900000000" aria-label="Teléfono" className="hover:opacity-90">
                <Phone className="h-[22px] w-[22px]" />
              </Link>
              <Link href="https://instagram.com" aria-label="Instagram" className="hover:opacity-90">
                <Instagram className="h-[22px] w-[22px]" />
              </Link>
              <Link href="https://facebook.com" aria-label="Facebook" className="hover:opacity-90">
                <Facebook className="h-[22px] w-[22px]" />
              </Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn" className="hover:opacity-90">
                <Linkedin className="h-[22px] w-[22px]" />
              </Link>
            </div>

            {/* Móvil */}
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center"
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil (dropdown) */}
      {open && (
        <div className="md:hidden bg-[#0A2E57] text-white border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
            <Link href="/" onClick={() => setOpen(false)} className="sigItem">INICIO</Link>
            <Link href="/propiedades" onClick={() => setOpen(false)} className="sigItem">PROPIEDADES</Link>
            <Link href="/servicios" onClick={() => setOpen(false)} className="sigItem">SERVICIOS</Link>
            <Link href="/#equipo" onClick={() => setOpen(false)} className="sigItem">EQUIPO</Link>
            <Link href="/contacto" onClick={() => setOpen(false)} className="sigItem">CONTACTO</Link>

            <div className="mt-2 flex items-center gap-6">
              <Link href="https://wa.me/56900000000" aria-label="WhatsApp"><WhatsAppIcon className="h-6 w-6" /></Link>
              <Link href="mailto:hola@gessweinproperties.cl" aria-label="Email"><Mail className="h-6 w-6" /></Link>
              <Link href="tel:+56900000000" aria-label="Teléfono"><Phone className="h-6 w-6" /></Link>
              <Link href="https://instagram.com" aria-label="Instagram"><Instagram className="h-6 w-6" /></Link>
              <Link href="https://facebook.com" aria-label="Facebook"><Facebook className="h-6 w-6" /></Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn"><Linkedin className="h-6 w-6" /></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

