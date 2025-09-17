'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Mail, Phone, Instagram, Facebook, Linkedin, Menu, X } from 'lucide-react';

/** Ícono WhatsApp en trazo blanco */
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M128 24C70.7 24 24 70.7 24 128c0 18.6 4.8 36.7 14 52.8L24 232l52.5-13.9C92.5 227.6 109.9 232 128 232c57.3 0 104-46.7 104-104S185.3 24 128 24Zm0 192c-17.1 0-33.3-4.6-47.6-13.4l-3.4-2.1-31.6 8.4 8.5-31.7-2.2-3.5C43.7 161.5 40 145 40 128c0-48.5 39.5-88 88-88s88 39.5 88 88-39.5 88-88 88Zm50.8-64.2c-2.7-1.5-16.2-8.6-18.7-9.6-2.6-1-4.2-.6-6 .9-1.8 1.6-6.1 7.3-7.4 9.1-1.3 1.8-2.7 2-5 .7-2.3-1.2-9.7-3.6-18.4-11.1-6.8-5.7-11.4-12.8-12.7-15-1.3-2.1-.1-3.4 1.1-4.6 1.2-1.3 2.7-3.2 3.9-4.8 1.3-1.6 1.7-2.7 2.5-4.4.8-1.7.4-3.2-.1-4.4-.6-1.1-5.3-12.7-7.3-17.3-1.9-4.6-3.5-4-5.1-4.1-1.7-.1-3.7-.1-5.7-.1s-4.5.6-6.9 3c-2.4 2.4-9 8.6-9 21.2 0 12.7 9 25 10.2 26.7 1.2 1.7 18.3 28 44.4 39.2 26.1 11.2 26.1 7 30.7 6.5 4.6-.4 14.8-6 16.9-11.8 2.1-5.9 2.1-10.7 1.5-11.8-.7-1-2.3-1.7-5-3.2Z"
      />
    </svg>
  );
}

/** Separador vertical (como barra fina) */
const Sep = () => <span className="nav-sep" aria-hidden="true" />;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Cambia a azul corporativo al scrollear
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar menú al agrandar a desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const bg = scrolled || open ? 'bg-[#0A2E57]' : 'bg-transparent';

  return (
    <header className={`fixed top-0 inset-x-0 z-50 text-white transition-colors duration-300 ${bg}`}>
      {/* CONTENEDOR ALTURA NAV */}
      <div className="relative h-16 md:h-[84px]">
        {/* LOGO IZQUIERDA */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 sm:pl-6 lg:pl-8">
          <Link href="/" aria-label="Inicio" className="block">
            <Image src="/logo-white.svg" alt="Gesswein Properties" width={160} height={34} priority />
          </Link>
        </div>

        {/* MENÚ CENTRADO (desktop) */}
        <nav className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2">
          <ul
            className="flex h-full items-center"
            style={{ letterSpacing: '0.32em' }} /* tracking alto como el original */
          >
            <li><Link href="/" className="nav-item">INICIO</Link></li>
            <Sep />
            <li><Link href="/propiedades" className="nav-item">PROPIEDADES</Link></li>
            <Sep />
            <li><Link href="/servicios" className="nav-item">SERVICIOS</Link></li>
            <Sep />
            <li><Link href="/#equipo" className="nav-item">EQUIPO</Link></li>
            <Sep />
            <li><Link href="/contacto" className="nav-item">CONTACTO</Link></li>
          </ul>
        </nav>

        {/* REDES DERECHA + HAMBURGUESA (móvil) */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6 lg:pr-8">
          {/* Redes sólo desktop */}
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

          {/* Botón hamburguesa en móvil */}
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center"
            onClick={() => setOpen(v => !v)}
            aria-label="Abrir menú"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil (simple y funcional) */}
      {open && (
        <div className="md:hidden bg-[#0A2E57] text-white border-t border-white/10">
          <div className="px-4 sm:px-6 py-4 flex flex-col gap-4">
            <Link href="/" onClick={() => setOpen(false)} className="nav-item">INICIO</Link>
            <Link href="/propiedades" onClick={() => setOpen(false)} className="nav-item">PROPIEDADES</Link>
            <Link href="/servicios" onClick={() => setOpen(false)} className="nav-item">SERVICIOS</Link>
            <Link href="/#equipo" onClick={() => setOpen(false)} className="nav-item">EQUIPO</Link>
            <Link href="/contacto" onClick={() => setOpen(false)} className="nav-item">CONTACTO</Link>

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

