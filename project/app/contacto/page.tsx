'use client';

import {
  MessageCircle,
  Mail,
  Phone,
  Instagram,
  Music2,
  Facebook,
  Linkedin,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import HeroImage from '@/components/HeroImage';

const HERO_IMG = 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/Contacto/yolk-coworking-krakow-AQdyCfXWxB4-unsplash.jpg';

const HERO_IMG_MOBILE =
  'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/Foto%20portada%20-%20Contacto%20(Opcion%201).jpeg';

const SOCIALS = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    sub: 'Abrir',
    href: 'https://wa.me/56993318039?text=Hola%2C%20quiero%20contactar%20a%20Gesswein%20Properties',
    Icon: MessageCircle,
  },
  {
    key: 'email',
    label: 'Email',
    sub: 'Abrir',
    href: 'mailto:contacto@gessweinproperties.com',
    Icon: Mail,
  },
  {
    key: 'phone',
    label: 'Teléfono',
    sub: 'Abrir',
    href: 'tel:+56993318039',
    Icon: Phone,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    sub: 'Link pendiente',
    href: '#',
    Icon: Instagram,
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    sub: 'Link pendiente',
    href: '#',
    Icon: Music2,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    sub: 'Link pendiente',
    href: '#',
    Icon: Facebook,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    sub: 'Link pendiente',
    href: '#',
    Icon: Linkedin,
  },
];

export default function ContactoPage() {
  const [heroReady, setHeroReady] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    setHeroReady(false);
  }, [isMobile]);

  const heroSrc = isMobile ? HERO_IMG_MOBILE : HERO_IMG;

  return (
    <main className="bg-white">
      <section className="relative min-h-[100svh] overflow-hidden bg-[#0A2E57]">
        <HeroImage
          src={heroSrc}
          alt="Contacto"
          objectPosition={isMobile ? '50% 50%' : '50% 40%'}
          showInitialBrandOverlay={false}
          persistAcrossRoutes={false}
          mediaMode={isMobile ? 'mobile' : 'desktop'}
          onCurrentReadyChange={setHeroReady}
        />

        {heroReady ? <div className="absolute inset-0 bg-black/35" /> : null}

        {heroReady ? (
          <div className="absolute bottom-6 left-0 right-0">
            <div className="max-w-7xl mx-auto px-6">
              <h1 className="text-white text-3xl md:text-4xl uppercase tracking-[0.25em]">
                CONTACTO
              </h1>
              <p className="text-white/85 mt-2 text-[14px] md:text-[15px] leading-relaxed">
                Escríbenos y cuéntanos qué necesitas.
              </p>
            </div>
          </div>
        ) : null}
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
            Redes Sociales
          </h2>
          <p className="mt-4 max-w-3xl text-[14px] text-black/70 leading-relaxed">
            Puedes escribirnos por cualquiera de nuestras redes. Te responderemos lo antes posible.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOCIALS.map(({ key, label, sub, href, Icon }) => (
              <a
                key={key}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 border border-black/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-[#0A2E57]" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-black/90">{label}</div>
                    <div className="text-[13px] text-black/60">{sub}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
