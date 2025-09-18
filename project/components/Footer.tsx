'use client';

import Link from 'next/link';
import { Mail, Phone, Instagram, Facebook, Linkedin } from 'lucide-react';

/** WhatsApp con teléfono centrado (mismo que en navbar, pero a escala menor) */
function WhatsappPhoneIcon({ className }: { className?: string }) {
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
      {/* teléfono (centrado) */}
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Alto compacto y proporcionado al navbar */}
        <div className="flex flex-col items-center gap-5 py-6 md:py-7 min-h-[18vh]">
          {/* LOGO con fallback de ruta */}
          <img
            src="/brand/logo-white.svg"
            width={180}
            height={36}
            alt="Gesswein Properties"
            className="h-7 md:h-[30px] w-auto"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (!img.dataset.fallback) {
                img.dataset.fallback = '1';
                img.src = '/logo-white.svg'; // fallback si cambia la carpeta
              }
            }}
          />

          {/* Redes en el mismo orden del navbar: WA, email, phone, IG, FB, IN */}
          <div className="flex items-center gap-4 md:gap-5">
            <Link
              href="https://wa.me/56900000000"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
            >
              <WhatsappPhoneIcon className="w-5 h-5 md:w-[22px] md:h-[22px]" />
            </Link>

            <Link
              href="mailto:hola@gessweinproperties.cl"
              aria-label="Email"
              className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
            >
              <Mail className="w-5 h-5 md:w-[22px] md:h-[22px]" />
            </Link>

            <Link
              href="tel:+56900000000"
              aria-label="Teléfono"
              className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
            >
              <Phone className="w-5 h-5 md:w-[22px] md:h-[22px]" />
            </Link>

            <Link
              href="https://instagram.com/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
            >
              <Instagram className="w-5 h-5 md:w-[22px] md:h-[22px]" />
            </Link>

            <Link
              href="https://facebook.com/"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
            >
              <Facebook className="w-5 h-5 md:w-[22px] md:h-[22px]" />
            </Link>

            <Link
              href="https://www.linkedin.com/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 rounded"
            >
              <Linkedin className="w-5 h-5 md:w-[22px] md:h-[22px]" />
            </Link>
          </div>

          {/* Separador sutil y menú en proporción al navbar */}
          <div className="w-full border-t border-white/15 pt-5">
            <ul className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-[11px] md:text-[12px] tracking-[0.18em]">
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
          </div>

          {/* Copyright pequeño */}
          <p className="text-[10px] md:text-[11px] text-white/80 -mt-1 pb-3 text-center">
            © 2025 Gesswein Properties. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

