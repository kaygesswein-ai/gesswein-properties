'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Users, Award, Briefcase } from 'lucide-react';

/* =========================
   DATOS
   ========================= */

const HERO_IMG =
  'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/Gemini_Generated_Image_1c3kp91c3kp91c3k.png';

const HISTORIA_IMG =
  'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop';

const PHOTOS = {
  carolina: '/team/carolina-san-martin.png',
  alberto: '/team/alberto-gesswein.png',
  jan: '/team/jan-gesswein.png',
  kay: '/team/kay-gesswein.png',
};

type Member = {
  id: string;
  name: string;
  roleLine: string;
  bioShort: string;
  bioDetail: string[];
  education: string;
  specialties: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  photo?: string;
};

const TEAM_PRINCIPAL: Member[] = [
  {
    id: 'carolina',
    name: 'Carolina San Martín',
    roleLine: 'Managing Partner · Arquitecta',
    bioShort:
      'Arquitecta con más de 15 años de experiencia en proyectos residenciales de alto estándar.',
    bioDetail: [
      'Dirige el desarrollo arquitectónico de Gesswein Properties, asegurando que cada propiedad combine belleza, funcionalidad y valorización a largo plazo.',
    ],
    education: 'Arquitecta, Pontificia Universidad Católica de Chile.',
    specialties:
      'Arquitectura residencial · Sustentabilidad · Gestión de proyectos.',
    email: 'carolina@gessweinproperties.cl',
    phone: '+56 9 9331 8039',
    linkedin:
      'https://www.linkedin.com/in/carolina-san-martin-fern%C3%A1ndez-83207044/',
    photo: PHOTOS.carolina,
  },
  {
    id: 'alberto',
    name: 'Alberto Gesswein',
    roleLine: 'Managing Partner · Productor Ejecutivo',
    bioShort:
      'Periodista con más de 20 años en dirección y comunicación estratégica.',
    bioDetail: [
      'Encabeza la visión institucional de Gesswein Properties con enfoque humano y excelencia técnica.',
    ],
    education: 'Periodista, Pontificia Universidad Católica de Chile.',
    specialties:
      'Corretaje inmobiliario · Comunicación estratégica · Negociación.',
    email: 'alberto@gesswein.tv',
    phone: '+56 9 9887 1751',
    linkedin: 'https://www.linkedin.com/in/alberto-gesswein-4a8246101/',
    photo: PHOTOS.alberto,
  },
  {
    id: 'jan',
    name: 'Jan Gesswein',
    roleLine: 'Socio Legal · Abogado',
    bioShort:
      'Abogado especializado en derecho inmobiliario y regulaciones urbanas.',
    bioDetail: [
      'Supervisa aspectos legales: contratos sólidos, cumplimiento normativo y procesos transparentes.',
    ],
    education: 'Abogado, Universidad del Desarrollo.',
    specialties: 'Derecho inmobiliario · Contratos · Due Diligence Legal.',
    email: 'jangesswein@gmail.com',
    phone: '+56 9 9909 9502',
    linkedin: '#',
    photo: PHOTOS.jan,
  },
  {
    id: 'kay',
    name: 'Kay Gesswein',
    roleLine: 'Socio Finanzas y Marketing · Ingeniero Comercial',
    bioShort:
      'Ingeniero Comercial con Magíster en Finanzas. Experto en marketing y producción visual inmobiliaria.',
    bioDetail: [
      'Lidera estrategia digital y posicionamiento, integrando análisis financiero con comunicación visual.',
    ],
    education: 'Ingeniero Comercial, Universidad Adolfo Ibáñez.',
    specialties: 'Finanzas · Marketing Digital · Fotografía inmobiliaria.',
    email: 'kaygesswein@gmail.com',
    phone: '+56 9 9334 5413',
    linkedin: 'https://www.linkedin.com/in/kay-gesswein-san-martin/',
    photo: PHOTOS.kay,
  },
];

const ALLIES = [
  {
    name: 'Irene Puelma Propiedades',
    area: 'Co-Brokerage Alliance',
    photo:
      'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Irene%20Puelma.png',
    blurb:
      'Red estratégica que amplía el alcance de Gesswein Properties con corredoras de excelencia y un portafolio curado.',
  },
];

const CULTURE = [
  {
    icon: Award,
    title: 'Excelencia',
    text:
      'Buscamos la perfección en cada detalle, desde la asesoría inicial hasta la entrega final.',
  },
  {
    icon: Users,
    title: 'Transparencia',
    text:
      'Comunicación directa, procesos claros y decisiones fundadas en información verificable.',
  },
  {
    icon: Briefcase,
    title: 'Innovación',
    text: 'Metodologías y herramientas digitales para mejorar cada experiencia.',
  },
];

/* =========================
   PAGE
   ========================= */

export default function EquipoPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative min-h-[100svh]">
        <img
          src={HERO_IMG}
          alt="Portada Equipo"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 35%' }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-white text-3xl md:text-4xl uppercase tracking-[0.25em]">
              NUESTRO EQUIPO
            </h1>
            <p className="text-white/85 mt-2 text-[14px] md:text-[15px] leading-relaxed">
              Profesionales expertos unidos por la pasión de ayudarte a encontrar
              la propiedad perfecta.
            </p>
          </div>
        </div>
      </section>

      {/* 1) NUESTRA HISTORIA — BLANCO */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 items-stretch">
            {/* Texto */}
            <div className="md:order-1 order-2">
              <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
                Nuestra Historia
              </h2>
              <div className="text-[14px] text-black/70 leading-relaxed space-y-4">
                <p>
                  Gesswein Properties nace a partir de la trayectoria independiente de Carolina San
                  Martín, arquitecta con más de quince años de experiencia en el desarrollo de
                  proyectos residenciales de alto estándar.
                </p>
                <p>
                  Desde 2017, su ejercicio profesional ha estado orientado a crear viviendas que
                  conjugan precisión técnica, diseño y habitabilidad. Esa experiencia permitió
                  identificar una constante en el mercado inmobiliario: la ausencia de una asesoría
                  integral y profesional que acompañe a las personas en decisiones tan
                  trascendentes como la compra o venta de su hogar.
                </p>
                <p>
                  Frente a esa realidad, surge Gesswein Properties, conformada por cuatro socios
                  provenientes de áreas complementarias —arquitectura, derecho inmobiliario,
                  finanzas y comunicación estratégica— con un propósito común: entregar a las
                  personas el mismo nivel de rigor, análisis y excelencia que tradicionalmente ha
                  estado reservado al mundo corporativo.
                </p>
              </div>
            </div>

            {/* Imagen */}
            <div className="md:order-2 order-1">
              <div className="w-full h-[260px] md:h-full overflow-hidden border border-black/10">
                <img
                  src={HISTORIA_IMG}
                  alt="Gesswein Properties — Nuestra Historia"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2) PROPUESTA DE VALOR — GRIS */}
      <section className="py-20 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
            Propuesta de Valor
          </h2>
          <p className="text-black/80 text-[14px] leading-relaxed max-w-3xl">
            En Gesswein Properties nos definimos por un enfoque boutique, que combina excelencia
            técnica, comunicación cercana y una estética moderna aplicada a cada proyecto
            inmobiliario. Nuestro compromiso es ofrecer un servicio profesional, transparente y con
            alto estándar de ejecución.
          </p>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <article className="border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-[15px] uppercase tracking-[.25em] text-[#0A2E57] mb-2">
                Misión
              </h3>
              <p className="text-[13px] text-black/70 leading-relaxed">
                Brindar asesoría inmobiliaria integral, basada en confianza, precisión técnica y
                diseño.
              </p>
            </article>

            <article className="border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-[15px] uppercase tracking-[.25em] text-[#0A2E57] mb-2">
                Visión
              </h3>
              <p className="text-[13px] text-black/70 leading-relaxed">
                Ser la firma inmobiliaria de referencia en Chile por su excelencia estética,
                profesionalismo y compromiso con la calidad de vida de quienes confían en nosotros.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 3) NUESTRA CULTURA — BLANCO */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-12">
            Nuestra Cultura
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {CULTURE.map((c) => (
              <article
                key={c.title}
                className="border border-black/10 bg-white p-6 text-center shadow-sm"
              >
                <div className="w-12 h-12 bg-slate-100 border border-black/10 mx-auto mb-4 flex items-center justify-center">
                  <c.icon className="h-6 w-6 text-[#0A2E57]" />
                </div>
                <h4 className="text-[13px] tracking-[.18em] uppercase text-black/90">
                  {c.title}
                </h4>
                <p className="text-[13px] text-black/70 mt-2 leading-relaxed">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4) EQUIPO — OGILVY */}
      <section id="equipo" className="py-20 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
            Equipo
          </h2>
          <p className="mt-3 max-w-3xl text-[#0E2C4A] text-[14px] leading-relaxed">
            En Gesswein Properties integramos arquitectura, derecho, finanzas y comunicación
            estratégica para que cada decisión inmobiliaria sea segura, rentable y estética.
          </p>

          <TeamOgilvy />
        </div>
      </section>

      {/* 5) ALIANZAS — BLANCO */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-4">
            Alianzas & Colaboradores
          </h3>
          <p className="text-[14px] text-black/70 mb-10">
            Profesionales y estudios con los que trabajamos para elevar el estándar de cada
            proyecto.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
            {ALLIES.map((a) => (
              <article
                key={a.name}
                className="group relative overflow-hidden border border-slate-200 bg-white shadow-sm select-none transition transform hover:-translate-y-[4px] hover:shadow-md"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={a.photo}
                    alt={a.name}
                    width={1200}
                    height={900}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-[1px] border-t border-black/10 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-transform duration-300 ease-out p-5">
                    <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
                      {a.area}
                    </div>
                    <h4 className="mt-1 text-[15px] text-black/90">{a.name}</h4>
                    {'blurb' in a && a.blurb ? (
                      <p className="mt-2 text-[13px] text-black/70 leading-relaxed">{a.blurb}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6) CTA FINAL — GRIS */}
      <section className="py-16 bg-[#f8f9fb]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
            ¿Quieres trabajar con nosotros?
          </h3>
          <p className="text-[14px] text-black/70 mt-3">
            Súmate para ayudarnos a captar propiedades y crecer junto a la comunidad Gesswein
            Properties.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:contacto@gessweinproperties.cl?subject=Quiero%20trabajar%20con%20ustedes"
              className="inline-flex items-center justify-center px-5 py-3 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
            >
              Enviar correo
            </a>
            <a
              href="https://wa.me/56912345678?text=Hola%2C%20quiero%20sumarme%20al%20equipo%20de%20Gesswein%20Properties"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-5 py-3 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===========================================================
   EQUIPO — ESTILO OGILVY (FLIP DESKTOP + ACORDEÓN MOBILE)
   =========================================================== */

function TeamOgilvy() {
  const team = TEAM_PRINCIPAL;
  const [active, setActive] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const floaterRef = useRef<HTMLDivElement | null>(null);
  const activeIdxRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [panelDims, setPanelDims] = useState<{ left: number; width: number; height: number }>({
    left: 0,
    width: 0,
    height: 0,
  });

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Recalcular dimensiones del panel cuando abre o cambia tamaño
  useEffect(() => {
    function computePanel() {
      if (!gridRef.current) return;
      const grid = gridRef.current;
      const cards = grid.querySelectorAll<HTMLElement>('[data-team-card]');
      if (!cards.length) return;
      const gap = 24; // gap-6
      const first = cards[0].getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      const left = first.width + gap;
      const width = gridRect.width - left;
      const height = first.height;
      setPanelDims({ left, width, height });
    }
    computePanel();
    window.addEventListener('resize', computePanel);
    return () => window.removeEventListener('resize', computePanel);
  }, [active]);

  // Cierre con animación inversa (desktop)
  function closePanel() {
    const i = activeIdxRef.current;
    const floater = floaterRef.current;
    setIsTransitioning(true);

    // MOBILE: acordeón
    if (window.matchMedia('(max-width: 767px)').matches) {
      setActive(null);
      activeIdxRef.current = null;
      setIsTransitioning(false);
      return;
    }

    const srcCard = (i != null) ? cardRefs.current[i] : null;
    const dstCard = cardRefs.current[0];
    const grid = gridRef.current;

    // Fade-out del panel mientras vuelve la foto
    if (panelRef.current) {
      panelRef.current.style.transition = 'opacity 320ms ease';
      panelRef.current.style.opacity = '0';
    }

    if (!floater || !srcCard || !grid) {
      // fallback
      if (dstCard) dstCard.style.visibility = 'visible';
      setActive(null);
      activeIdxRef.current = null;
      floaterRef.current = null;
      setIsTransitioning(false);
      return;
    }

    const gridRect = grid.getBoundingClientRect();
    const floaterRect = floater.getBoundingClientRect();
    const srcRect = srcCard.getBoundingClientRect();

    const currentX = floaterRect.left - gridRect.left;
    const targetX = srcRect.left - gridRect.left;
    const dx = targetX - currentX;

    floater.style.transition = 'transform 420ms cubic-bezier(.22,.61,.36,1)';
    floater.style.transform = `translate(${dx}px, 0)`;

    setTimeout(() => {
      try {
        srcCard.style.visibility = 'visible';
        if (dstCard) dstCard.style.visibility = 'visible';
      } catch {}
      floater.remove();
      floaterRef.current = null;
      setActive(null);
      activeIdxRef.current = null;
      setIsTransitioning(false);
      if (panelRef.current) {
        panelRef.current.style.opacity = '1';
      }
    }, 430);
  }

  // Abrir (FLIP desktop / acordeón mobile)
  function openMember(i: number) {
    if (active === i) {
      closePanel();
      return;
    }

    // MOBILE: acordeón sencillo
    if (window.matchMedia('(max-width: 767px)').matches) {
      setActive(i);
      activeIdxRef.current = i;
      return;
    }

    const grid = gridRef.current;
    const src = cardRefs.current[i];
    const dst = cardRefs.current[0];
    if (!grid || !src || !dst) {
      setActive(i);
      activeIdxRef.current = i;
      return;
    }

    setIsTransitioning(true);

    // Clon flotante con mismo tamaño/posición que la tarjeta origen
    const gridRect = grid.getBoundingClientRect();
    const srcRect = src.getBoundingClientRect();
    const dstRect = dst.getBoundingClientRect();

    const clone = src.cloneNode(true) as HTMLDivElement;
    clone.style.position = 'absolute';
    clone.style.left = `${srcRect.left - gridRect.left}px`;
    clone.style.top = `${srcRect.top - gridRect.top}px`;
    clone.style.width = `${srcRect.width}px`;
    clone.style.height = `${srcRect.height}px`;
    clone.style.zIndex = '50';
    clone.style.cursor = 'pointer';
    (clone.querySelector('[data-overlay]') as HTMLDivElement | null)?.style.setProperty(
      'opacity',
      '0'
    );
    clone.addEventListener('click', closePanel);

    // Insertar clon y ocultar tarjetas que podrían verse debajo (origen y destino)
    grid.appendChild(clone);
    src.style.visibility = 'hidden';
    dst.style.visibility = 'hidden';
    floaterRef.current = clone;
    activeIdxRef.current = i;

    // Atenuar el resto durante la transición (menos “pasar por encima”)
    Array.from(grid.querySelectorAll<HTMLElement>('[data-team-card]')).forEach((el, idx) => {
      if (idx !== i && idx !== 0) {
        el.style.transition = 'opacity 220ms ease';
        el.style.opacity = '0.35';
      }
    });

    // Animar clon hacia la primera columna
    const dx = dstRect.left - srcRect.left;
    requestAnimationFrame(() => {
      clone.style.transition = 'transform 450ms cubic-bezier(.22,.61,.36,1)';
      clone.style.transform = `translate(${dx}px, 0)`;
    });

    // Al finalizar, fijar activo
    setTimeout(() => {
      setActive(i);
      setIsTransitioning(false);
      // Restaurar opacidad del resto (panel cubrirá columnas 2–4)
      Array.from(grid.querySelectorAll<HTMLElement>('[data-team-card]')).forEach((el, idx) => {
        if (idx !== i && idx !== 0) {
          el.style.opacity = '1';
        }
      });
    }, 460);
  }

  function onPanelClick() {
    closePanel();
  }

  return (
    <div ref={containerRef} className="relative mt-10">
      {/* GRID de 4 col (desktop) / 1 col (mobile) */}
      <div
        ref={gridRef}
        className="relative grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {TEAM_PRINCIPAL.map((m, i) => (
          <div
            key={m.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            data-team-card
            className={`relative group cursor-pointer select-none transition-opacity ${
              isTransitioning && activeIdxRef.current !== i ? 'md:opacity-90' : ''
            }`}
            onClick={() => openMember(i)}
            aria-expanded={active === i}
          >
            {/* Foto */}
            <div className="border border-black/10">
              <Image
                src={m.photo || ''}
                alt={m.name}
                width={1200}
                height={1500}
                className="w-full h-full object-cover aspect-[4/5]"
                priority={i < 2}
              />
            </div>

            {/* Overlay hover (desktop) */}
            <div
              data-overlay
              className="hidden md:flex absolute inset-0 bg-[#0A2E57]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex-col justify-end p-6 pointer-events-none"
            >
              <h3 className="text-white text-lg font-semibold">{m.name}</h3>
              {/* ROL SIN NEGRITA */}
              <p className="text-[#BFD1E5] text-sm tracking-[.12em]">
                {m.roleLine}
              </p>
              <p className="text-white/85 text-xs mt-1 line-clamp-2">{m.bioShort}</p>
            </div>

            {/* Panel ACORDEÓN en mobile */}
            <div
              className={`md:hidden overflow-hidden transition-all duration-300 ${
                active === i ? 'max-h-[800px] opacity-100 mt-3' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="w-full bg-[#EAEAEA] p-5 border border-black/10">
                <h4 className="text-xl font-semibold text-[#0E2C4A]">{m.name}</h4>
                {/* ROL SIN NEGRITA */}
                <p className="text-[#0A2E57] text-sm tracking-[.14em] uppercase mt-1">
                  {m.roleLine}
                </p>
                <p className="mt-4 text-[14px] text-[#0E2C4A]">{m.bioDetail[0]}</p>

                <div className="mt-5 grid gap-3 text-[13px] text-[#0E2C4A]">
                  <div>
                    <div className="uppercase text-[#0A2E57] tracking-[.18em] text-[12px]">
                      Educación
                    </div>
                    <div>{m.education}</div>
                  </div>
                  <div>
                    <div className="uppercase text-[#0A2E57] tracking-[.18em] text-[12px]">
                      Especialidades
                    </div>
                    <div>{m.specialties}</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {m.email && (
                      <a
                        className="underline"
                        href={`mailto:${m.email}`}
                        aria-label={`Enviar correo a ${m.name}`}
                      >
                        {m.email}
                      </a>
                    )}
                    {m.phone && (
                      <a
                        className="underline"
                        href={`tel:${m.phone.replace(/\s+/g, '')}`}
                        aria-label={`Llamar a ${m.name}`}
                      >
                        {m.phone}
                      </a>
                    )}
                    {m.linkedin && (
                      <a
                        className="underline"
                        href={m.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Abrir LinkedIn de ${m.name}`}
                      >
                        {m.linkedin.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* PANEL LATERAL (DESKTOP) — sólo texto */}
        {active !== null && (
          <div
            ref={panelRef}
            className="hidden md:block absolute top-0 bg-[#EAEAEA] border border-black/10 shadow-[0_4px_10px_rgba(0,0,0,0.06)] overflow-hidden"
            style={{
              left: `${panelDims.left}px`,
              width: `${panelDims.width}px`,
              height: `${panelDims.height}px`,
              transition: 'transform 450ms cubic-bezier(.22,.61,.36,1), opacity 300ms ease',
              transform: 'translateX(0)',
              opacity: 1,
              zIndex: 40,
            }}
            onClick={onPanelClick}
            role="dialog"
            aria-modal="true"
          >
            <div className="h-full w-full p-10 text-[#0E2C4A] flex flex-col">
              <h3 className="text-3xl font-semibold">{team[active].name}</h3>
              {/* ROL SIN NEGRITA */}
              <p className="text-[#0A2E57] mt-2 tracking-[.18em] uppercase">
                {team[active].roleLine}
              </p>

              <p className="mt-6 text-[15px] leading-relaxed">
                {team[active].bioDetail[0]}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-8 text-[14px]">
                <div>
                  <div className="uppercase text-[#0A2E57] tracking-[.18em] text-[12px]">
                    Educación
                  </div>
                  <div className="mt-1">{team[active].education}</div>
                </div>
                <div>
                  <div className="uppercase text-[#0A2E57] tracking-[.18em] text-[12px]">
                    Especialidades
                  </div>
                  <div className="mt-1">{team[active].specialties}</div>
                </div>
              </div>

              <div className="mt-auto pt-6 text-[14px]">
                <div className="flex flex-col gap-1">
                  {team[active].email && (
                    <a
                      className="underline"
                      href={`mailto:${team[active].email}`}
                      aria-label={`Enviar correo a ${team[active].name}`}
                    >
                      {team[active].email}
                    </a>
                  )}
                  {team[active].phone && (
                    <a
                      className="underline"
                      href={`tel:${team[active].phone.replace(/\s+/g, '')}`}
                      aria-label={`Llamar a ${team[active].name}`}
                    >
                      {team[active].phone}
                    </a>
                  )}
                  {team[active].linkedin && (
                    <a
                      className="underline"
                      href={team[active].linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Abrir LinkedIn de ${team[active].name}`}
                    >
                      {team[active].linkedin.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
