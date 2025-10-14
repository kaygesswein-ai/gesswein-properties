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
  Palette,
} from 'lucide-react';

/* =========================
   DATA (edítalo libremente)
   ========================= */

// Portada
const HERO_IMG =
  'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/Gemini_Generated_Image_1c3kp91c3kp91c3k.png';

// Foto “Nuestra Historia” (derecha). Reemplaza por tu asset real si quieres.
const HISTORIA_IMG =
  'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop';

// Fotos equipo (reemplaza por rutas reales al tenerlas)
const PHOTOS = {
  carolina: '/team/carolina-san-martin.png',
  alberto: '/team/alberto-gesswein.png',
  jan: '/team/jan-gesswein.png',
  kay: '/team/kay-gesswein.png',
};

// Equipo (zig-zag)
type Member = {
  id: string;
  name: string;
  roleLine: string;      // bajo el nombre (formato corporativo)
  bioShort: string;      // resumen visible
  bioDetail: string[];   // descripción adicional en el panel
  education: string;
  specialties: string;
  email?: string;        // no se muestra por ahora
  phone?: string;
  linkedin?: string;
  photo?: string;
  align: 'left' | 'right'; // foto a la izquierda/derecha en desktop
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

// Alianzas / colaboradores (cards estilo “Servicios”)
const ALLIES = [
  {
    name: 'Irene Puelma Propiedades',
    area: 'Co-Brokerage Alliance',
    photo:
      'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Irene%20Puelma.png',
    blurb:
      'Red estratégica que amplía el alcance de Gesswein Properties con corredoras de excelencia y un portafolio curado.',
  },
  { name: 'Estudio DF', area: 'Diseño Interior', photo: '/allies/ally-2.jpg', blurb: 'Interiorismo y styling de espacios.' },
  { name: 'ProStudio', area: 'Render & 3D', photo: '/allies/ally-3.jpg', blurb: 'Visualización arquitectónica y renders fotorrealistas.' },
  { name: 'Legal Partners', area: 'Legal', photo: '/allies/ally-4.jpg', blurb: 'Apoyo contractual y regulatorio.' },
  { name: 'BrokerLab', area: 'Finanzas', photo: '/allies/ally-5.jpg', blurb: 'Hipotecas y estructuración de financiamiento.' },
  { name: 'Foto360', area: 'Producción Visual', photo: '/allies/ally-6.jpg', blurb: 'Foto, video y tour 360°.' },
];

/* =========================
   CULTURA (3 pilares)
   ========================= */
const CULTURE = [
  { icon: Award,     title: 'Excelencia',    text: 'Buscamos la perfección en cada detalle, desde la asesoría inicial hasta la entrega final.' },
  { icon: Users,     title: 'Transparencia', text: 'Comunicación directa, procesos claros y decisiones fundadas en información verificable.' },
  { icon: Briefcase, title: 'Innovación',    text: 'Metodologías y herramientas digitales para mejorar cada experiencia.' },
];

export default function EquipoPage() {
  // Estado de panel abierto (una a la vez)
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((curr) => (curr === id ? null : id));

  // Scroll-reveal para las cards del equipo (fade-in + slide-up)
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean[]>(Array(TEAM_PRINCIPAL.length).fill(false));

  useEffect(() => {
    const nodes = containerRef.current?.querySelectorAll('[data-team-card]') ?? [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.index);
            setVisible((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <main className="bg-white">

      {/* ================= HERO ================= */}
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
              Profesionales expertos unidos por la pasión de ayudarte a encontrar la propiedad perfecta.
            </p>
          </div>
        </div>
      </section>

      {/* ================= NUEVA SECCIÓN: NUESTRA HISTORIA ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 items-stretch">
            {/* Texto izquierda en desktop; en mobile va debajo de la foto */}
            <div className="md:order-1 order-2">
              <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
                Nuestra Historia
              </h2>
              <div className="text-[14px] text-black/70 leading-relaxed space-y-4">
                <p>
                  Gesswein Properties nace a partir de la trayectoria independiente de Carolina San Martín, arquitecta con más de quince años de experiencia en el desarrollo de proyectos residenciales de alto estándar.
                </p>
                <p>
                  Desde 2017, su ejercicio profesional ha estado orientado a crear viviendas que conjugan precisión técnica, diseño y habitabilidad. Esa experiencia permitió identificar una constante en el mercado inmobiliario: la ausencia de una asesoría integral y profesional que acompañe a las personas en decisiones tan trascendentes como la compra o venta de su hogar.
                </p>
                <p>
                  Mientras existen múltiples servicios de excelencia dirigidos a empresas o instituciones, las personas —que enfrentan decisiones patrimoniales y emocionales de igual relevancia— rara vez cuentan con un acompañamiento a esa altura. La mayoría de las corredoras opera de manera fragmentada, sin una visión técnica ni una comprensión profunda del diseño, la normativa o el impacto financiero detrás de cada propiedad.
                </p>
                <p>
                  Frente a esa realidad, surge Gesswein Properties, conformada por cuatro socios provenientes de áreas complementarias —arquitectura, derecho inmobiliario, finanzas y comunicación estratégica— con un propósito común: entregar a las personas el mismo nivel de rigor, análisis y excelencia que tradicionalmente ha estado reservado al mundo corporativo.
                </p>
                <p>
                  Nuestra labor es integrar todos los elementos que inciden en una decisión inmobiliaria —estética, funcional, legal y económica— para ofrecer un proceso seguro, transparente y estéticamente coherente. Porque una propiedad no es solo un activo; es un espacio de vida, y cada decisión en torno a él merece la precisión y el cuidado de un equipo verdaderamente profesional.
                </p>
              </div>
            </div>

            {/* Foto derecha en desktop; en mobile va arriba
                h-[260px] en mobile; en desktop ocupa el ALTO del texto gracias a items-stretch + h-full */}
            <div className="md:order-2 order-1">
              <div
                className="w-full h-[260px] md:h-full overflow-hidden border border-black/10"
                style={{ borderRadius: 0 }}
              >
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

      {/* ================= PROPUESTA DE VALOR (ex “¿Por qué Gesswein Properties?”) ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
            Propuesta de Valor
          </h2>
          <p className="text-black/80 text-[14px] leading-relaxed max-w-3xl">
            En Gesswein Properties nos definimos por un enfoque boutique, que combina excelencia
            técnica, comunicación cercana y una estética moderna aplicada a cada proyecto
            inmobiliario. Nuestro compromiso es ofrecer un servicio profesional, transparente
            y con alto estándar de ejecución.
          </p>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <article className="border border-black/10 bg-white p-6 shadow-sm" style={{ borderRadius: 0 }}>
              <h3 className="text-[15px] uppercase tracking-[.25em] text-[#0A2E57] mb-2">
                Misión
              </h3>
              <p className="text-[13px] text-black/70 leading-relaxed">
                Brindar asesoría inmobiliaria integral, basada en confianza, precisión técnica
                y diseño, conectando a nuestros clientes con oportunidades únicas de inversión
                y hogar.
              </p>
            </article>

            <article className="border border-black/10 bg-white p-6 shadow-sm" style={{ borderRadius: 0 }}>
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

      {/* ================= NUESTRA CULTURA (alineado a la izquierda, 3 pilares) ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
              NUESTRA CULTURA
            </h3>
            <p className="text-[14px] text-black/70 mt-3">
              Los valores que nos guían en cada decisión y en cada proyecto.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {CULTURE.map((c) => (
              <article key={c.title} className="border border-black/10 bg-white p-6 text-center shadow-sm" style={{ borderRadius: 0 }}>
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

      {/* ================= EQUIPO — CARDS BIPARTITAS ================= */}
      <section id="equipo" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium text-left">
            EQUIPO
          </h2>
          <p className="mt-3 max-w-3xl text-left text-[14px] text-black/70 leading-relaxed">
            En Gesswein Properties combinamos criterio arquitectónico, respaldo legal y mirada financiera para que cada decisión
            inmobiliaria sea segura, rentable y estética. Cada integrante aporta una mirada complementaria: arquitectura, derecho,
            finanzas y comunicación se integran para elevar cada proyecto a su máxima expresión.
          </p>

          <div ref={containerRef} className="mt-12 flex flex-col gap-10">
            {TEAM_PRINCIPAL.map((m, idx) => {
              const cardVisible = visible[idx];
              return (
                <article
                  key={m.id}
                  data-team-card
                  data-index={idx}
                  className={[
                    'border border-black/10 bg-white shadow-sm p-5',
                    'transition duration-300 ease-out',
                    'opacity-0 translate-y-3',
                    cardVisible ? 'opacity-100 translate-y-0' : '',
                  ].join(' ')}
                  style={{ borderRadius: 0 }}
                >
                  <div className="grid gap-8 md:grid-cols-2 items-stretch">
                    {/* FOTO: mobile arriba (order-1), desktop zig-zag con md:order-* */}
                    <div
                      className={[
                        'overflow-hidden',
                        m.align === 'right' ? 'md:order-2' : 'md:order-1',
                      ].join(' ')}
                    >
                      {m.photo ? (
                        <Image
                          src={m.photo}
                          alt={m.name}
                          width={1200}
                          height={900}
                          className="w-full h-full object-cover"
                          style={{ borderRadius: 0 }}
                        />
                      ) : (
                        <div className="w-full aspect-[4/3] bg-slate-100 border border-black/10 flex items-center justify-center">
                          <Users className="h-12 w-12 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* TEXTO: mobile abajo (order-2), desktop alterna */}
                    <div
                      className={[
                        'flex flex-col self-stretch',
                        m.align === 'right' ? 'md:order-1' : 'md:order-2',
                      ].join(' ')}
                    >
                      <header className="pb-4 mb-4 border-b border-black/10">
                        <h3 className="text-[20px] font-medium text-black/90">{m.name}</h3>
                        <p className="uppercase text-[13px] tracking-[.2em] text-[#0A2E57]">{m.roleLine}</p>
                      </header>

                      {/* Resumen corto visible */}
                      <p className="text-[14px] text-black/70 leading-relaxed">
                        {m.bioShort}
                      </p>

                      {/* Botón Ver perfil (estilo Servicios) */}
                      <button
                        className="mt-4 self-start text-[12px] uppercase tracking-[.25em] border border-black/25 px-4 py-2 hover:bg-[#0A2E57] hover:text-white transition"
                        aria-expanded={openId === m.id}
                        aria-controls={`bio-${m.id}`}
                        onClick={() => toggle(m.id)}
                      >
                        {openId === m.id ? 'Cerrar' : 'Ver perfil'}
                      </button>

                      {/* Panel extendido (una sola columna, anclado) */}
                      <div
                        id={`bio-${m.id}`}
                        aria-labelledby={m.id}
                        className={[
                          'overflow-hidden transition-all duration-300 ease-out',
                          openId === m.id ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0',
                          'border border-black/10 bg-white p-4',
                        ].join(' ')}
                        style={{ borderRadius: 0 }}
                      >
                        {/* Descripción adicional */}
                        {m.bioDetail.map((p, i) => (
                          <p key={i} className="mb-3 text-[13px] text-black/70 leading-relaxed">
                            {p}
                          </p>
                        ))}

                        {/* EDUCACIÓN */}
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-[#0A2E57]" />
                            <span className="uppercase text-[12px] tracking-[.2em] text-[#0A2E57]">
                              Educación
                            </span>
                          </div>
                          <p className="mt-1 text-[13px] text-black/80">{m.education}</p>
                        </div>

                        {/* ESPECIALIDADES */}
                        <div className="mt-4">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-[#0A2E57]" />
                            <span className="uppercase text-[12px] tracking-[.2em] text-[#0A2E57]">
                              Especialidades
                            </span>
                          </div>
                          <p className="mt-1 text-[13px] text-black/80">{m.specialties}</p>
                        </div>

                        {/* CONTACTO (solo valores: teléfono + LinkedIn) */}
                        <div className="mt-4 space-y-1">
                          {m.phone && (
                            <a
                              href={`tel:${m.phone.replace(/\s+/g, '')}`}
                              aria-label={`Llamar a ${m.name}`}
                              className="block text-[13px] text-[#0A2E57] underline underline-offset-2"
                            >
                              {m.phone}
                            </a>
                          )}
                          {m.linkedin && (
                            <a
                              href={m.linkedin}
                              target="_blank"
                              rel="noopener"
                              aria-label={`Abrir LinkedIn de ${m.name}`}
                              className="block text-[13px] text-[#0A2E57] underline underline-offset-2"
                            >
                              {m.linkedin.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= ALIANZAS & COLABORADORES (formato Services) ================= */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-4">
            ALIANZAS & COLABORADORES
          </h3>
          <p className="text-[14px] text-black/70 mb-10">
            Profesionales y estudios con los que trabajamos para elevar el estándar de cada proyecto.
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
                  {/* Overlay inferior como en Servicios (sin botón) */}
                  <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-[1px] border-t border-black/10 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-transform duration-300 ease-out p-5">
                    <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">{a.area}</div>
                    <h4 className="mt-1 text-[15px] text-black/90">{a.name}</h4>
                    <p className="mt-2 text-[13px] text-black/70 leading-relaxed">{a.blurb}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
            ¿Quieres trabajar con nosotros?
          </h3>
          <p className="text-[14px] text-black/70 mt-3">
            Súmate para ayudarnos a captar propiedades y crecer junto a la comunidad Gesswein Properties.
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
