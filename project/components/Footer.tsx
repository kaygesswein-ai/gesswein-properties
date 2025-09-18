'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Instagram, Facebook, Linkedin } from 'lucide-react';

/** Burbuja de WhatsApp con teléfono centrado */
function WhatsappPhoneIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* burbuja */}
      <path
        d="M20 11a8 8 0 0 1-11.6 7L4 19l1-4.4A8 8 0 1 1 20 11Z"
        fill="currentColor"
        opacity="0.08"
      />
      <path d="M20 11a8 8 0 0 1-11.6 7L4 19l1-4.4A8 8 1 1 1 20 11Z" />
      {/* teléfono centrado */}
      <g transform="translate(7.1 7.1)">
        <path
          d="M7.35 7.1c-.8.8-2.65.35-4.35-1.35S.9 1.9 1.7 1.1c.25-.25.75-.25 1 0l1 .95c.2.2.25.5.1.75l-.5.95c.1.6.55 1.35 1.25 2.05.7.7 1.45 1.15 2.05 1.25l.95-.5c.25-.15.55-.1.75.1l.95 1c.25.25.25.75 0 1Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0A2E57] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Altura contenida: aprox. 1/4 de la pantalla en desktop */}
        <div className="flex flex-col items-center gap-6 py-8 md:py-10 sm:min-h-[22vh] md:min-h-[24vh]">
          {/* LOGO */}
          <Image
            src="/brand/logo-white.svg"
            alt="Gesswein Properties"
            width={200}
            height={42}
            priority={false}
            className="h-8 md:h-9 w-auto"
          />

          {/* REDES — mismo orden que navbar */}
          <div className="flex items-center gap-5 sm:gap-6">
            <Link
              href="https://wa.me/56900000000"
              aria-label="WhatsApp"
              className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappPhoneIcon className="w-6 h-6 md:w-7 md:h-7" />
            </Link>

            <Link
              href="mailto:hola@gessweinproperties.cl"
              aria-label="Email"
              className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
            >
              <Mail className="w-6 h-6 md:w-7 md:h-7" />
            </Link>

            <Link
              href="tel:+56900000000"
              aria-label="Teléfono"
              className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
            >
              <Phone className="w-6 h-6 md:w-7 md:h-7" />
            </Link>

            <Link
              href="https://instagram.com/"
              aria-label="Instagram"
              className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-6 h-6 md:w-7 md:h-7" />
            </Link>

            <Link
              href="https://facebook.com/"
              aria-label="Facebook"
              className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="w-6 h-6 md:w-7 md:h-7" />
            </Link>

            <Link
              href="https://www.linkedin.com/"
              aria-label="LinkedIn"
              className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-6 h-6 md:w-7 md:h-7" />
            </Link>
          </div>

          {/* NAV DEL FOOTER (más compacto) */}
          <nav className="w-full border-t border-white/15 pt-6">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[12px] md:text-sm tracking-[0.18em]">
              <li>
                <Link href="/" className="hover:opacity-90">
                  INICIO
                </Link>
              </li>
              <li>
                <Link href="/propiedades" className="hover:opacity-90">
                  PROPIEDADES
                </Link>
              </li>
              <li>
                <Link href="/#servicios" className="hover:opacity-90">
                  SERVICIOS
                </Link>
              </li>
              <li>
                <Link href="/#equipo" className="hover:opacity-90">
                  EQUIPO
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="hover:opacity-90">
                  CONTACTO
                </Link>
              </li>
            </ul>
          </nav>

          {/* COPYRIGHT (más pequeño) */}
          <p className="text-[11px] md:text-xs text-white/80 pt-2 pb-3 text-center">
            © 2025 Gesswein Properties. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

