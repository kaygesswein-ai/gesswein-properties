// project/components/ui/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Instagram, Facebook, Linkedin, MessageCircle } from "lucide-react";

const NAV = [
  { href: "/", label: "INICIO" },
  { href: "/propiedades", label: "PROPIEDADES" },
  { href: "/servicios", label: "SERVICIOS" },
  { href: "/equipo", label: "EQUIPO" },
  { href: "/contacto", label: "CONTACTO" },
];

// Íconos en el mismo orden del navbar: WhatsApp, Mail, Teléfono, Instagram, Facebook, LinkedIn
function SocialIcons() {
  return (
    <div className="mt-2 flex items-center justify-center gap-6 md:gap-8 text-white">
      {/* WhatsApp con teléfono dentro */}
      <Link
        aria-label="WhatsApp"
        href="#"
        className="relative inline-flex h-6 w-6 items-center justify-center md:h-7 md:w-7"
      >
        <MessageCircle className="absolute h-full w-full stroke-[1.6]" />
        <Phone className="absolute h-3.5 w-3.5 md:h-4 md:w-4 stroke-[1.8]" />
      </Link>

      <Link aria-label="Email" href="#" className="inline-flex h-6 w-6 items-center justify-center md:h-7 md:w-7">
        <Mail className="h-full w-full stroke-[1.6]" />
      </Link>

      <Link aria-label="Teléfono" href="#" className="inline-flex h-6 w-6 items-center justify-center md:h-7 md:w-7">
        <Phone className="h-full w-full stroke-[1.6]" />
      </Link>

      <Link aria-label="Instagram" href="#" className="inline-flex h-6 w-6 items-center justify-center md:h-7 md:w-7">
        <Instagram className="h-full w-full stroke-[1.6]" />
      </Link>

      <Link aria-label="Facebook" href="#" className="inline-flex h-6 w-6 items-center justify-center md:h-7 md:w-7">
        <Facebook className="h-full w-full stroke-[1.6]" />
      </Link>

      <Link aria-label="LinkedIn" href="#" className="inline-flex h-6 w-6 items-center justify-center md:h-7 md:w-7">
        <Linkedin className="h-full w-full stroke-[1.6]" />
      </Link>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0E2C4A] text-white">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-col items-center pt-8 md:pt-10">
          {/* LOGO — usa el archivo de project/public/logo-white.svg */}
          <Image
            src="/logo-white.svg"
            alt="Gesswein Properties"
            width={260}
            height={54}
            priority
            className="h-10 w-auto md:h-12"
          />

          {/* NAV ARRIBA DE LA LÍNEA */}
          <nav className="mt-4 md:mt-5">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12.5px] tracking-[0.18em] md:text-[13.5px]">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/90 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* SEPARADOR */}
          <div className="mx-auto my-6 h-px w-full max-w-5xl bg-white/15 md:my-7" />

          {/* REDES SOCIALES DEBAJO DE LA LÍNEA */}
          <SocialIcons />
        </div>

        {/* COPYRIGHT */}
        <p className="mt-6 pb-7 text-center text-xs text-white/70 md:text-[13px]">
          © 2025 Gesswein Properties. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
