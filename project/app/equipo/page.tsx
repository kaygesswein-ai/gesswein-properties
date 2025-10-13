'use client';

import { useState } from 'react';
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
   DATA
   ========================= */

// Portada
const HERO_IMG =
  'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/Gemini_Generated_Image_1c3kp91c3kp91c3k.png';

// Fotos
const PHOTOS = {
  carolina: '/team/carolina-san-martin.png',
  alberto: '/team/alberto-gesswein.png',
  jan: '/team/jan-gesswein.png',
  kay: '/team/kay-gesswein.png',
};

// Equipo principal
const TEAM = [
  {
    id: 'carolina',
    name: 'Carolina San Martín',
    role: 'Managing Partner · Arquitecta',
    bio: [
      'Arquitecta con más de 15 años de experiencia liderando proyectos residenciales de alto estándar.',
      'Especialista en normativas municipales, sustentabilidad y gestión integral de diseño.',
      'Dirige el desarrollo arquitectónico de Gesswein Properties, asegurando que cada propiedad combine belleza, funcionalidad y valorización a largo plazo.',
    ],
    education: 'Arquitecta, Pontificia Universidad Católica de Chile.',
    specialties: 'Arquitectura residencial · Sustentabilidad · Gestión de proyectos.',
    email: 'carolina@gessweinproperties.cl',
    phone: '+56 9 9331 8039',
    linkedin: 'https://www.linkedin.com/in/carolina-san-martin-fern%C3%A1ndez-83207044/',
    photo: PHOTOS.carolina,
    align: 'left',
  },
  {
    id: 'alberto',
    name: 'Alberto Gesswein',
    role: 'Managing Partner · Productor Ejecutivo',
    bio: [
      'Periodista con más de 20 años de trayectoria en dirección y comunicación estratégica.',
      'Encabeza la visión institucional de Gesswein Properties, integrando excelencia técnica y enfoque humano en cada negocio.',
      'Su experiencia en liderazgo, gestión y negociación otorga solidez y coherencia a la firma.',
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
    role: 'Socio Legal · Abogado',
    bio: [
      'Abogado especializado en derecho inmobiliario y regulaciones urbanas.',
      'Supervisa aspectos legales: procesos transparentes, contratos sólidos y cumplimiento normativo.',
      'Su mirada jurídica garantiza seguridad y confianza en cada transacción.',
    ],
    education: 'Abogado, Universidad del Desarrollo.',
    specialties: 'Derecho inmobiliario · Contratos · Due Diligence Legal.',
    email: 'jangesswein@gmail.com',
    phone: '+56 9 9809 9502',
    linkedin: '#',
    photo: PHOTOS.jan,
    align: 'left',
  },
  {
    id: 'kay',
    name: 'Kay Gesswein',
    role: 'Socio de Finanzas y Marketing · Ingeniero Comercial',
    bio: [
      'Ingeniero Comercial con Magíster en Finanzas; experto en marketing digital y producción visual inmobiliaria.',
      'Lidera la estrategia digital y el posicionamiento de Gesswein Properties, integrando análisis financiero con comunicación visual de alto impacto.',
    ],
    education: 'Ingeniero Comercial, Universidad Adolfo Ibáñez.',
    specialties: 'Finanzas · Marketing Digital · Fotografía inmobiliaria.',
    email: 'kaygesswein@gmail.com',
    phone: '+56 9 9344 5413',
    linkedin: 'https://www.linkedin.com/in/kay-gesswein-san-martin/',
    photo: PHOTOS.kay,
    align: 'right',
  },
];

// Cultura
const CULTURE = [
  { icon: Award, title: 'Excelencia', text: 'Buscamos la perfección en cada detalle, desde la asesoría inicial hasta la entrega final.' },
  { icon: Users, title: 'Transparencia', text: 'Comunicación directa, procesos claros y decisiones fundadas en información verificable.' },
  { icon: Briefcase, title: 'Innovación', text: 'Metodologías y herramientas digitales para mejorar cada experiencia.' },
  { icon: Palette, title: 'Criterio & Estilo', text: 'Visión arquitectónica, rigor financiero y sensibilidad estética en cada proyecto.' },
];

// Alianzas
const ALLIES = [
  {
    name: 'Irene Puelma Propiedades',
    area: 'Co-Brokerage Alliance',
    blurb: 'Una red de colaboración estratégica que amplía el alcance de Gesswein Properties, conectándonos con corredoras de excelencia para ofrecer un portafolio más amplio y curado.',
    photo: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Irene%20Puelma.png',
  },
  { name: 'Estudio DF', area: 'Diseño Interior', blurb: 'Interiorismo y styling de espacios.', photo: '/allies/ally-2.jpg' },
  { name: 'ProStudio', area: 'Render & 3D', blurb: 'Visualización arquitectónica y renders fotorrealistas.', photo: '/allies/ally-3.jpg' },
  { name: 'Legal Partners', area: 'Legal', blurb: 'Apoyo contractual y regulatorio.', photo: '/allies/ally-4.jpg' },
  { name: 'BrokerLab', area: 'Finanzas', blurb: 'Hipotecas y estructuración de financiamiento.', photo: '/allies/ally-5.jpg' },
];

/* ====================================================== */

export default function EquipoPage() {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen(open === id ? null : id);

  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative min-h-[100svh]">
        <img src={HERO_IMG} alt="Portada Equipo" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 35%' }} />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-white text-3xl md:text-4xl uppercase tracking-[0.25em]">NUESTRO EQUIPO</h1>
            <p className="text-white/85 mt-2 text-[14px] md:text-[15px] leading-relaxed">Profesionales expertos unidos por la pasión de ayudarte a encontrar la propiedad perfecta.</p>
          </div>
        </div>
      </section>

      {/* POR QUÉ GP */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">¿Por qué Gesswein Properties?</h2>
          <p className="text-black/80 text-[14px] leading-relaxed max-w-3xl">
            En Gesswein Properties nos definimos por un enfoque boutique, que combina excelencia técnica, comunicación cercana y una estética moderna aplicada a cada proyecto inmobiliario.
            Nuestro compromiso es ofrecer un servicio profesional, transparente y con alto estándar de ejecución.
          </p>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <article className="border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-[15px] uppercase tracking-[.25em] text-[#0A2E57] mb-2">Misión</h3>
              <p className="text-[13px] text-black/70 leading-relaxed">
                Brindar asesoría inmobiliaria integral, basada en confianza, precisión técnica y diseño, conectando a nuestros clientes con oportunidades únicas de inversión y hogar.
              </p>
            </article>
            <article className="border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-[15px] uppercase tracking-[.25em] text-[#0A2E57] mb-2">Visión</h3>
              <p className="text-[13px] text-black/70 leading-relaxed">
                Ser la firma inmobiliaria de referencia en Chile por su excelencia estética, profesionalismo y compromiso con la calidad de vida de quienes confían en nosotros.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* NUESTRA CULTURA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">NUESTRA CULTURA</h3>
            <p className="text-[14px] text-black/70 mt-3">Los valores que nos guían en cada decisión y en cada proyecto.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {CULTURE.map((c) => (
              <article key={c.title} className="border border-black/10 bg-white p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-slate-100 border border-black/10 mx-auto mb-4 flex items-center justify-center">
                  <c.icon className="h-6 w-6 text-[#0A2E57]" />
                </div>
                <h4 className="text-[13px] uppercase tracking-[.18em] text-black/90">{c.title}</h4>
                <p className="text-[13px] text-black/70 mt-2 leading-relaxed">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPO — NUEVO BLOQUE */}
      <section id="equipo" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium text-left">EQUIPO</h3>
          <p className="mt-3 max-w-3xl text-left text-[14px] text-black/70 leading-relaxed">
            En Gesswein Properties combinamos criterio arquitectónico, respaldo legal y mirada financiera para que cada decisión inmobiliaria sea segura, rentable y estética.
            Cada integrante aporta una mirada complementaria: arquitectura, derecho, finanzas y comunicación se integran para elevar cada proyecto a su máxima expresión.
          </p>

          <div className="mt-12 flex flex-col gap-10">
            {TEAM.map((m, idx) => (
              <article key={m.id} className="grid items-stretch gap-8 md:grid-cols-2">
                {/* Imagen */}
                <div className={`rounded-2xl overflow-hidden border border-black/10 ${m.align === 'right' ? 'md:order-2' : ''}`}>
                  <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                </div>

                {/* Contenido */}
                <div>
                  <header className="mb-3 text-left">
                    <h3 className="text-[20px] font-medium text-black/90">{m.name}</h3>
                    <p className="uppercase text-[13px] tracking-[.2em] text-[#0A2E57]">{m.role}</p>
                  </header>

                  <button
                    className="mt-4 inline-flex items-center gap-2 text-[13px] tracking-[.15em] text-black/80 uppercase"
                    aria-expanded={open === m.id}
                    onClick={() => toggle(m.id)}
                  >
                    {open === m.id ? 'Cerrar' : 'Ver perfil'}
                  </button>

                  <div
                    hidden={open !== m.id}
                    className="mt-4 rounded-xl border border-black/10 bg-white p-5 transition-all duration-300 ease-out"
                  >
                    {m.bio.map((b, i) => (
                      <p key={i} className="mb-2 text-[13px] text-black/70 leading-relaxed">{b}</p>
                    ))}
                    <div className="grid gap-4 sm:grid-cols-2 mt-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[.2em] text-[#0A2E57] mb-1">Educación</p>
                        <p className="text-[13px]">{m.education}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[.2em] text-[#0A2E57] mb-1">Especialidades</p>
                        <p className="text-[13px]">{m.specialties}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <a href={`mailto:${m.email}`} className="btn-outline-sm"><Mail className="h-4 w-4" /> Email</a>
                      <a href={`tel:${m.phone.replace(/\s+/g, '')}`} className="btn-outline-sm"><Phone className="h-4 w-4" /> Teléfono</a>
                      <a href={m.linkedin} target="_blank" rel="noopener" className="btn-outline-sm"><Linkedin className="h-4 w-4" /> LinkedIn</a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ALIANZAS */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-4">ALIANZAS & COLABORADORES</h3>
          <p className="text-[14px] text-black/70 mb-10">Profesionales y estudios con los que trabajamos para elevar el estándar de cada proyecto.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
            {ALLIES.map((a) => (
              <article
                key={a.name}
                className="group relative overflow-hidden border border-slate-200 bg-white shadow-sm select-none transition transform hover:-translate-y-[4px] hover:shadow-md"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={a.photo} alt={a.name} width={1200} height={900} className="absolute inset-0 w-full h-full object-cover" />
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

      {/* CTA FINAL */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">¿Quieres trabajar con nosotros?</h3>
          <p className="text-[14px] text-black/70 mt-3">Súmate para ayudarnos a captar propiedades y crecer junto a la comunidad Gesswein Properties.</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:contacto@gessweinproperties.cl"
              className="inline-flex items-center justify-center px-5 py-3 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
            >
              Enviar correo
            </a>
            <a
              href="https://wa.me/56912345678"
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

/* BOTÓN REUTILIZABLE */
function btnOutlineSm() {
  return 'inline-flex items-center gap-2 px-3 py-2 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition rounded';
}
