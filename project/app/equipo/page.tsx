
'use client';

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

// Fotos (reemplaza por rutas reales al tenerlas)
const PHOTOS = {
  carolina: '/team/carolina-san-martin.png',
  alberto: '/team/alberto-gesswein.png',
  jan: '/team/jan-gesswein.png',
  kay: '/team/kay-gesswein.png',
};

// Bloque: Equipo principal (zig-zag)
type Member = {
  name: string;
  roleLine: string; // título bajo el nombre
  bio: string[];    // párrafos
  education: string;
  specialties: string[];
  email?: string;
  phone?: string;
  linkedin?: string;
  photo?: string;
  align: 'left' | 'right'; // foto a la izquierda o derecha
};

const TEAM_PRINCIPAL: Member[] = [
  {
    name: 'Carolina San Martín',
    roleLine: 'Managing Partner · Arquitecta',
    bio: [
      'Arquitecta con más de 40 años de experiencia liderando proyectos de alto estándar.',
      'Especialista en normativas municipales, sustentabilidad y gestión integral de diseño.',
      'Dirige el desarrollo arquitectónico de Gesswein Properties, asegurando que cada propiedad combine belleza, funcionalidad y valorización a largo plazo.',
    ],
    education: 'Arquitecta, Pontificia Universidad Católica de Chile.',
    specialties: ['Arquitectura residencial', 'Normativas municipales', 'Gestión de proyectos'],
    email: 'carolina@gessweinproperties.cl',
    phone: '+56 9 9331 8039',
    linkedin:
      'https://www.linkedin.com/in/carolina-san-martin-fern%C3%A1ndez-83207044/',
    photo: PHOTOS.carolina,
    align: 'left',
  },
  {
    name: 'Alberto Gesswein',
    roleLine: 'Partner · Productor Ejecutivo · Periodista',
    bio: [
      'Periodista con más de 40 años de trayectoria en producción ejecutiva, dirección de proyectos y comunicación estratégica.',
      'Encabeza la visión institucional de Gesswein Properties, integrando excelencia técnica y un enfoque humano en cada negocio.',
      'Su experiencia en liderazgo y negociación otorga solidez y coherencia a la firma.',
    ],
    education: 'Periodista, Pontificia Universidad Católica de Chile.',
    specialties: ['Gestión de proyectos', 'Comunicación estratégica', 'Negociación'],
    email: 'alberto@gesswein.tv',
    phone: '+56 9 9887 1751',
    linkedin: 'https://www.linkedin.com/in/alberto-gesswein-4a8246101/',
    photo: PHOTOS.alberto,
    align: 'right',
  },
  {
    name: 'Jan Gesswein',
    roleLine: 'Partner · Abogado',
    bio: [
      'Abogado especializado en derecho inmobiliario y regulaciones urbanas.',
      'Supervisa todos los aspectos legales de las operaciones, asegurando procesos transparentes, contratos sólidos y cumplimiento normativo.',
      'Su mirada jurídica garantiza la seguridad y la confianza en cada transacción.',
    ],
    education: 'Abogado, Universidad del Desarrollo.',
    specialties: ['Derecho inmobiliario', 'Contratos', 'Due Diligence Legal'],
    email: 'jangesswein@gmail.com',
    phone: '+56 9 9909 9502',
    linkedin: '#',
    photo: PHOTOS.jan,
    align: 'left',
  },
  {
    name: 'Kay Gesswein',
    roleLine: 'Partner · Ingeniero Comercial',
    bio: [
      'Ingeniero Comercial con Magíster en Finanzas.',
      'Experto en marketing digital y producción visual inmobiliaria.',
      'Lidera la estrategia digital y el posicionamiento de Gesswein Properties, integrando análisis financiero con comunicación visual de alto impacto.',
    ],
    education: 'Ingeniero Comercial, Universidad Adolfo Ibáñez.',
    specialties: ['Finanzas', 'Marketing Digital', 'Fotografía Inmobiliaria'],
    email: 'kaygesswein@gmail.com',
    phone: '+56 9 9334 5413',
    linkedin: 'https://www.linkedin.com/in/kay-gesswein-san-martin/',
    photo: PHOTOS.kay,
    align: 'right',
  },
];

// Alianzas / colaboradores (puedes editar/añadir)
const ALLIES = [
  { name: 'Irene Puelma Propiedades', area: 'Co-Brokerage Alliance', photo: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Irene%20Puelma.png', blurb: 'Una red de colaboración estratégica que amplía el alcance de Gesswein Properties, conectándonos con otras corredoras de excelencia para ofrecer a nuestros clientes un portafolio más amplio y curado, y así encontrar el match perfecto entre personas y propiedades.' },
  { name: 'Estudio DF', area: 'Diseño Interior', photo: '/allies/ally-2.jpg', blurb: 'Interiorismo y styling de espacios.' },
  { name: 'ProStudio', area: 'Render & 3D', photo: '/allies/ally-3.jpg', blurb: 'Visualización arquitectónica y renders fotorrealistas.' },
  { name: 'Legal Partners', area: 'Legal', photo: '/allies/ally-4.jpg', blurb: 'Apoyo contractual y regulatorio.' },
  { name: 'BrokerLab', area: 'Finanzas', photo: '/allies/ally-5.jpg', blurb: 'Hipotecas y estructuración de financiamiento.' },
  { name: 'Foto360', area: 'Producción Visual', photo: '/allies/ally-6.jpg', blurb: 'Foto, video y tour 360°.' },
  { name: 'GeoData', area: 'Estudios Urbanos', photo: '/allies/ally-7.jpg', blurb: 'ACM y data territorial.' },
  { name: 'Press PR', area: 'Comunicación', photo: '/allies/ally-8.jpg', blurb: 'Prensa y difusión estratégica.' },
];

// Cultura (4 pilares, minimal)
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
    text:
      'Metodologías y herramientas digitales para mejorar cada experiencia.',
  },
  {
    icon: Palette,
    title: 'Criterio & Estilo',
    text:
      'Visión arquitectónica, rigor financiero y sensibilidad estética en cada proyecto.',
  },
];

export default function EquipoPage() {
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pl-2 sm:pl-4">
              <div className="max-w-3xl">
                <h1 className="text-white text-3xl md:text-4xl uppercase tracking-[0.25em]">
                  NUESTRO EQUIPO
                </h1>
                <p className="text-white/85 mt-2 text-[14px] md:text-[15px] leading-relaxed">
                  Profesionales expertos unidos por la pasión de ayudarte a encontrar la propiedad perfecta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BLOQUE 1: ¿POR QUÉ GP? + MISIÓN/VISIÓN ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 max-w-4xl">
            <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
              ¿Por qué Gesswein Properties?
            </h2>
            <p className="text-black/80 text-[14px] leading-relaxed max-w-3xl">
              En Gesswein Properties nos definimos por un enfoque boutique, que combina excelencia
              técnica, comunicación cercana y una estética moderna aplicada a cada proyecto
              inmobiliario. Nuestro compromiso es ofrecer un servicio profesional, transparente
              y con alto estándar de ejecución.
            </p>

            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <article className="border border-black/10 bg-white p-6 shadow-sm">
                {/* subtítulo institucional (mismo tamaño, color corporativo y espaciado) */}
                <h3 className="text-[15px] tracking-wide uppercase text-[#0A2E57] mb-2">
                  Misión
                </h3>
                <p className="text-[13px] text-black/70 leading-relaxed">
                  Brindar asesoría inmobiliaria integral, basada en confianza, precisión técnica
                  y diseño, conectando a nuestros clientes con oportunidades únicas de inversión
                  y hogar.
                </p>
              </article>

              <article className="border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-[15px] tracking-wide uppercase text-[#0A2E57] mb-2">
                  Visión
                </h3>
                <p className="text-[13px] text-black/70 leading-relaxed">
                  Ser la firma inmobiliaria de referencia en Chile por su excelencia estética,
                  profesionalismo y compromiso con la calidad de vida de quienes confían en nosotros.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BLOQUE 2: NUESTRA CULTURA ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
              NUESTRA CULTURA
            </h3>
            <p className="text-[14px] text-black/70 mt-3">
              Los valores que nos guían en cada decisión y en cada proyecto.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {CULTURE.map((c) => (
              <article key={c.title} className="border border-black/10 bg-white p-6 text-center shadow-sm">
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

      {/* ================= BLOQUE 3: EQUIPO (ZIG-ZAG) ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
              EQUIPO
            </h3>
            <p className="text-[14px] text-black/70 mt-3 max-w-3xl mx-auto">
              En Gesswein Properties combinamos criterio arquitectónico, respaldo legal y mirada financiera
              para que cada decisión inmobiliaria sea segura, rentable y estética.
            </p>
          </div>

          <div className="space-y-12">
            {TEAM_PRINCIPAL.map((m) => (
              <TeamRow key={m.name} m={m} />
            ))}
          </div>

          <p className="text-[14px] text-black/70 mt-12 leading-relaxed text-center max-w-4xl mx-auto">
            En Gesswein Properties, cada integrante aporta una mirada complementaria: arquitectura, derecho,
            finanzas y comunicación se integran para elevar cada proyecto a su máxima expresión.
          </p>
        </div>
      </section>

      {/* ================= BLOQUE 4: ALIANZAS & COLABORADORES ================= */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 mb-10">
            <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
              ALIANZAS & COLABORADORES
            </h3>
            <p className="text-[14px] text-black/70 mt-3">
              Profesionales y estudios con los que trabajamos para elevar el estándar de cada proyecto.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ALLIES.map((a) => (
              <article
                key={a.name}
                className="border border-black/10 bg-white p-5 shadow-sm transition will-change-transform"
              >
                <div className="w-full aspect-square bg-slate-100 border border-black/10 mb-4 overflow-hidden">
                  <Image
                    src={a.photo}
                    alt={a.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-[15px] text-black/90">{a.name}</h4>
                <div className="text-[12px] text-[#0A2E57]">{a.area}</div>
                <p className="text-[13px] text-black/70 mt-2 leading-relaxed">{a.blurb}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
            ¿Quieres trabajar con nosotros?
          </h3>
          <p className="text-[14px] text-black/70 mt-3">
            Súmate para ayudarnos a captar propiedades y crecer junto a la comunidad Gesswein Properties.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:contacto@gessweinproperties.cl?subject=Quiero%20trabajar%20con%20ustedes"
              className="inline-flex items-center justify-center px-5 py-3 border border-black/20"
            >
              Enviar correo
            </a>
            <a
              href="https://wa.me/56912345678?text=Hola%2C%20quiero%20sumarme%20al%20equipo%20de%20Gesswein%20Properties"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-5 py-3 border border-black/20"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ================= COMPONENTES ================= */

function TeamRow({ m }: { m: Member }) {
  const photoBlock = (
    <div className="w-full">
      <div className="w-full aspect-[4/3] border border-black/10 bg-slate-100 overflow-hidden">
        {m.photo ? (
          <Image
            src={m.photo}
            alt={m.name}
            width={1200}
            height={900}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users className="h-12 w-12 text-slate-400" />
          </div>
        )}
      </div>
    </div>
  );

  const textBlock = (
    <div className="w-full">
      <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">{m.roleLine}</div>
      <h4 className="mt-1 text-[20px] text-black/90">{m.name}</h4>

      <div className="mt-3 space-y-2">
        {m.bio.map((p, idx) => (
          <p key={idx} className="text-[14px] text-black/70 leading-relaxed">{p}</p>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <div className="text-[13px] text-black/70">
          <span className="inline-flex items-center gap-2 text-black/60">
            <Award className="h-4 w-4 text-black/40" />
            <span>Educación:</span>
          </span>
          <div className="mt-1 text-black/90">{m.education}</div>
        </div>
        <div className="text-[13px] text-black/70">
          <span className="inline-flex items-center gap-2 text-black/60">
            <Briefcase className="h-4 w-4 text-black/40" />
            <span>Especialidades:</span>
          </span>
          <div className="mt-1 text-black/90">
            {m.specialties.join(' · ')}
          </div>
        </div>
      </div>

      {(m.email || m.phone || m.linkedin) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {m.email && (
            <a href={`mailto:${m.email}`} className="inline-flex items-center gap-2 px-3 py-2 border border-black/20 text-[13px]">
              <Mail className="h-4 w-4" /> {m.email}
            </a>
          )}
          {m.phone && (
            <a href={`tel:${m.phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-2 px-3 py-2 border border-black/20 text-[13px]">
              <Phone className="h-4 w-4" /> {m.phone}
            </a>
          )}
          {m.linkedin && (
            <a href={m.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 border border-black/20 text-[13px]">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start border border-black/10 bg-white p-8 shadow-sm">
      {m.align === 'left' ? (
        <>
          {photoBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {photoBlock}
        </>
      )}
    </div>
  );
}
