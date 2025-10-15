'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Users,
  Award,
  Briefcase,
  Mail,
  Phone,
  Linkedin,
} from 'lucide-react';

/* =========================
   DATA
   ========================= */

// Portada
const HERO_IMG =
  'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/Gemini_Generated_Image_1c3kp91c3kp91c3k.png';

// Foto “Nuestra Historia”
const HISTORIA_IMG =
  'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop';

// Fotos equipo
const PHOTOS = {
  carolina: '/team/carolina-san-martin.png',
  alberto: '/team/alberto-gesswein.png',
  jan: '/team/jan-gesswein.png',
  kay: '/team/kay-gesswein.png',
};

type Member = {
  id: 'carolina' | 'alberto' | 'jan' | 'kay';
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
  align: 'left' | 'right';
};

const TEAM_PRINCIPAL: Member[] = [
  {
    id: 'carolina',
    name: 'Carolina San Martín',
    roleLine: 'Managing Partner · Arquitecta',
    bioShort:
      'Arquitecta con más de 15 años de experiencia en proyectos residenciales de alto estándar. Especialista en normativas municipales, sustentabilidad y gestión integral de diseño.',
    bioDetail: [
      'Dirige el desarrollo arquitectónico de Gesswein Properties, asegurando que cada propiedad combine belleza, funcionalidad y valorización a largo plazo.',
    ],
    education: 'Arquitecta, Pontificia Universidad Católica de Chile.',
    specialties: 'Arquitectura residencial · Sustentabilidad · Gestión de proyectos.',
    email: 'carolina@gessweinproperties.cl',
    phone: '+56 9 9331 8039',
    linkedin:
      'https://www.linkedin.com/in/carolina-san-martin-fern%C3%A1ndez-83207044/',
    photo: PHOTOS.carolina,
    align: 'left',
  },
  {
    id: 'alberto',
    name: 'Alberto Gesswein',
    roleLine: 'Managing Partner · Productor Ejecutivo',
    bioShort:
      'Periodista con más de 20 años en dirección y comunicación estratégica. Liderazgo, gestión y negociación.',
    bioDetail: [
      'Encabeza la visión institucional de Gesswein Properties con enfoque humano y excelencia técnica.',
    ],
    education: 'Periodista, Pontificia Universidad Católica de Chile.',
    specialties: 'Corretaje inmobiliario · Comunicación estratégica · Negociación.',
    email: 'alberto@gesswein.tv',
    phone: '+56 9 9887 1751',
    linkedin: 'https://www.linkedin.com/in/alberto-gesswein-4a8246101/',
    photo: PHOTOS.alberto,
    align: 'right',
  },
  {
    id: 'jan',
    name: 'Jan Gesswein',
    roleLine: 'Socio Legal · Abogado',
    bioShort:
      'Abogado especializado en derecho inmobiliario y regulaciones urbanas. Contratos sólidos y procesos transparentes.',
    bioDetail: [
      'Supervisa aspectos legales: procesos transparentes, contratos sólidos y cumplimiento normativo. Su mirada jurídica garantiza seguridad y confianza en cada transacción.',
    ],
    education: 'Abogado, Universidad del Desarrollo.',
    specialties: 'Derecho inmobiliario · Contratos · Due Diligence Legal.',
    email: 'jangesswein@gmail.com',
    phone: '+56 9 9909 9502',
    linkedin: '#',
    photo: PHOTOS.jan,
    align: 'left',
  },
  {
    id: 'kay',
    name: 'Kay Gesswein',
    roleLine: 'Socio de Finanzas y Marketing · Ingeniero Comercial',
    bioShort:
      'Ingeniero Comercial con Magíster en Finanzas. Experto en marketing digital y producción visual inmobiliaria.',
    bioDetail: [
      'Lidera la estrategia digital y el posicionamiento de Gesswein Properties, integrando análisis financiero con comunicación visual de alto impacto.',
    ],
    education: 'Ingeniero Comercial, Universidad Adolfo Ibáñez.',
    specialties: 'Finanzas · Marketing Digital · Fotografía inmobiliaria.',
    email: 'kaygesswein@gmail.com',
    phone: '+56 9 9334 5413',
    linkedin: 'https://www.linkedin.com/in/kay-gesswein-san-martin/',
    photo: PHOTOS.kay,
    align: 'right',
  },
];

// Alianzas (con blurb para overlay estilo “Servicios”)
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

// Cultura (3 pilares)
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
  // (Se mantiene cualquier estado/efecto que ya tenías arriba; no lo usamos en EQUIPO nuevo)
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
              Profesionales expertos unidos por la pasión de ayudarte a encontrar la propiedad
              perfecta.
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
                  Mientras existen múltiples servicios de excelencia dirigidos a empresas o
                  instituciones, las personas —que enfrentan decisiones patrimoniales y
                  emocionales de igual relevancia— rara vez cuentan con un acompañamiento a esa
                  altura. La mayoría de las corredoras opera de manera fragmentada, sin una visión
                  técnica ni una comprensión profunda del diseño, la normativa o el impacto
                  financiero detrás de cada propiedad.
                </p>
                <p>
                  Frente a esa realidad, surge Gesswein Properties, conformada por cuatro socios
                  provenientes de áreas complementarias —arquitectura, derecho inmobiliario,
                  finanzas y comunicación estratégica— con un propósito común: entregar a las
                  personas el mismo nivel de rigor, análisis y excelencia que tradicionalmente ha
                  estado reservado al mundo corporativo.
                </p>
                <p>
                  Nuestra labor es integrar todos los elementos que inciden en una decisión
                  inmobiliaria —estética, funcional, legal y económica— para ofrecer un proceso
                  seguro, transparente y estéticamente coherente. Porque una propiedad no es solo
                  un activo; es un espacio de vida, y cada decisión en torno a él merece la
                  precisión y el cuidado de un equipo verdaderamente profesional.
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
                diseño, conectando a nuestros clientes con oportunidades únicas de inversión y
                hogar.
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

      {/* 4) EQUIPO — GRIS (Ogilvy-like con “salto a la izquierda”) */}
      <section id="equipo" className="py-16 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
            Equipo
          </h2>
          <p className="mt-3 max-w-3xl text-[14px] text-black/70 leading-relaxed">
            En Gesswein Properties integramos arquitectura, derecho, finanzas y comunicación
            estratégica para que cada decisión inmobiliaria sea segura, rentable y estética.
          </p>

          <TeamLeftJump />
        </div>
      </section>

      {/* 5) ALIANZAS & COLABORADORES — BLANCO (CON OVERLAY HOVER) */}
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
                style={{ borderRadius: 0 }}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={a.photo}
                    alt={a.name}
                    width={1200}
                    height={900}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Overlay inferior (igual a Servicios, sin botón) */}
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

/* =========================
   SUBCOMPONENTE: EQUIPO (Ogilvy-like “salto a la izquierda”)
   ========================= */

function TeamLeftJump() {
  const [activeId, setActiveId] = useState<Member['id'] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const open = (id: Member['id']) =>
    setActiveId((curr) => (curr === id ? null : id));

  const active = TEAM_PRINCIPAL.find((m) => m.id === activeId) || null;

  // 1 línea del resumen para overlay
  const oneLiner = (s: string) => {
    const first = s.split('. ')[0] || s;
    return first.length > 110 ? first.slice(0, 110) + '…' : first;
  };

  return (
    <div className="relative mt-10">
      {/* GRID de retratos */}
      <div
        ref={containerRef}
        className={[
          'relative grid gap-6',
          // 4 columnas en desktop; en mobile 1
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        ].join(' ')}
      >
        {TEAM_PRINCIPAL.map((m) => {
          const isActive = activeId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => open(m.id)}
              aria-expanded={isActive}
              className={[
                'group relative cursor-pointer overflow-hidden aspect-[4/5] border border-black/10 bg-white',
                'focus:outline-none focus:ring-2 focus:ring-[#0A2E57]',
                // Cuando hay activa, mantiene su lugar; el panel cubrirá las otras (no interfiere)
              ].join(' ')}
              style={{ borderRadius: 0 }}
            >
              <Image
                src={m.photo || '/team/placeholder.jpg'}
                alt={m.name}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width:768px) 100vw, 25vw"
                priority={false}
              />
              {/* Overlay hover (solo desktop) */}
              <div className="hidden lg:block absolute inset-0 bg-[#0A2E57]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out" />
              <div className="hidden lg:flex absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out items-end p-5 text-white">
                <div>
                  <h3 className="text-[16px] font-medium">{m.name}</h3>
                  <p className="uppercase text-[12px] tracking-[.2em] text-[#BFD1E5]">
                    {m.roleLine}
                  </p>
                  <p className="mt-2 text-[13px] leading-snug">
                    {oneLiner(m.bioShort)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* PANEL de detalle (desktop: overlay a la derecha; mobile: debajo de la activa) */}
      {/* Desktop / Tablet >= md: panel absoluto que cubre columnas 2–4 */}
      <div
        className={[
          'hidden md:block',
          'pointer-events-none', // bloquea clicks por defecto
          active ? 'pointer-events-auto' : '',
        ].join(' ')}
      >
        <div
          onClick={() => setActiveId(null)}
          className={[
            'absolute top-0 right-0 h-full md:w-[62%]',
            active ? 'opacity-100' : 'opacity-0',
            'transition-opacity duration-200 ease-in-out',
          ].join(' ')}
        >
          {/* superficie del panel (clic para cerrar) */}
          <div
            className="h-full w-full bg-[#F7F8FA] shadow-xl border-l border-black/10"
            style={{ borderRadius: 0 }}
            // si quieres que solo el fondo cierre, descomenta:
            // onClick={() => setActiveId(null)}
          >
            {/* contenido; detener propagación para no cerrar si interactúas dentro */}
            <div
              className="h-full overflow-y-auto p-10"
              onClick={(e) => e.stopPropagation()}
            >
              {active ? (
                <>
                  <h3
                    className="text-[18px] text-[#0E2C4A] font-medium"
                    id="panel-title"
                  >
                    {active.name}
                  </h3>
                  <p className="uppercase text-[12px] tracking-[.2em] text-[#0A2E57] mt-1">
                    {active.roleLine}
                  </p>

                  <div className="mt-4 text-[14px] text-black/70 leading-relaxed">
                    <p className="mb-3">{active.bioShort}</p>
                    {active.bioDetail.map((p, i) => (
                      <p key={i} className="mb-3">
                        {p}
                      </p>
                    ))}
                  </div>

                  <div className="mt-5">
                    <div className="uppercase text-[12px] tracking-[.2em] text-[#0A2E57]">
                      Educación
                    </div>
                    <div className="text-[13px] text-black/80 mt-1">
                      {active.education}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="uppercase text-[12px] tracking-[.2em] text-[#0A2E57]">
                      Especialidades
                    </div>
                    <ul className="mt-1 text-[13px] text-black/80 list-disc pl-5">
                      {active.specialties.split('·').map((s, i) => (
                        <li key={i}>{s.trim()}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 flex flex-col gap-2 text-[13px]">
                    {active.email && (
                      <a
                        href={`mailto:${active.email}`}
                        className="underline underline-offset-2"
                        aria-label={`Enviar correo a ${active.name}`}
                      >
                        {active.email}
                      </a>
                    )}
                    {active.phone && (
                      <a
                        href={`tel:${active.phone.replace(/\s+/g, '')}`}
                        className="underline underline-offset-2"
                        aria-label={`Llamar a ${active.name}`}
                      >
                        {active.phone}
                      </a>
                    )}
                    {active.linkedin && (
                      <a
                        href={active.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                        aria-label={`Abrir LinkedIn de ${active.name}`}
                      >
                        {active.linkedin.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: panel debajo de la tarjeta activa (acordeón) */}
      <div className="md:hidden mt-4">
        {TEAM_PRINCIPAL.map((m) => {
          const isActive = activeId === m.id;
          return (
            <div key={m.id} className="mb-4">
              {/* encabezado “fantasma”: solo mostramos panel cuando coincide */}
              {isActive && (
                <div
                  className={[
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isActive ? 'max-h-[4000px] opacity-100' : 'max-h-0 opacity-0',
                    'bg-[#F7F8FA] border border-black/10 p-6',
                  ].join(' ')}
                  style={{ borderRadius: 0 }}
                >
                  <h3 className="text-[16px] text-[#0E2C4A] font-medium">
                    {m.name}
                  </h3>
                  <p className="uppercase text-[12px] tracking-[.2em] text-[#0A2E57]">
                    {m.roleLine}
                  </p>

                  <div className="mt-3 text-[14px] text-black/70 leading-relaxed">
                    <p className="mb-3">{m.bioShort}</p>
                    {m.bioDetail.map((p, i) => (
                      <p key={i} className="mb-3">
                        {p}
                      </p>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="uppercase text-[12px] tracking-[.2em] text-[#0A2E57]">
                      Educación
                    </div>
                    <div className="text-[13px] text-black/80 mt-1">
                      {m.education}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="uppercase text-[12px] tracking-[.2em] text-[#0A2E57]">
                      Especialidades
                    </div>
                    <ul className="mt-1 text-[13px] text-black/80 list-disc pl-5">
                      {m.specialties.split('·').map((s, i) => (
                        <li key={i}>{s.trim()}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 text-[13px]">
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        className="underline underline-offset-2"
                        aria-label={`Enviar correo a ${m.name}`}
                      >
                        {m.email}
                      </a>
                    )}
                    {m.phone && (
                      <a
                        href={`tel:${m.phone.replace(/\s+/g, '')}`}
                        className="underline underline-offset-2"
                        aria-label={`Llamar a ${m.name}`}
                      >
                        {m.phone}
                      </a>
                    )}
                    {m.linkedin && (
                      <a
                        href={m.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                        aria-label={`Abrir LinkedIn de ${m.name}`}
                      >
                        {m.linkedin.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
