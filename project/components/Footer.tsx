'use client';

import Link from 'next/link';
import { Mail, Phone, Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  // helper para hacer fallback si el logo no está en la raíz de /public
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
            src="/logo-white.svg"         // <--- tu archivo existente
            alt="Gesswein Properties"
            className="h-12 w-auto"
            onError={onLogoError}
          />

          {/* Íconos de contacto/redes */}
          <div className="mt-6 flex items-center gap-6 text-white/80">
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
            <a href="https://wa.me/56900000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-white transition">
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Separador */}
        <div className="my-8 border-t border-white/15" />

        {/* Menú inferior centrado */}
        <nav className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[12px] tracking-[0.25em] uppercase">
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
