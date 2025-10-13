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

// Foto de Carolina (pon aquí la misma del inicio si ya la tienes en /public)
const LEADER_PHOTO = '/team/carolina-san-martin.png';

// Equipo
const TEAM = [
  {
    name: 'Carolina San Martín',
    role: 'Arquitecta Líder & Managing Partner',
    desc:
      'Arquitecta con más de 15 años de experiencia en proyectos residenciales de alto estándar. Especialista en normativas municipales y sustentabilidad.',
    exp: '15+ años',
    education:
      'Arquitecta, Pontificia Universidad Católica de Chile',
    specialties: [
      'Arquitectura Residencial',
      'Normativa Municipal',
      'Sustentabilidad',
      'Gestión de Proyectos',
    ],
    email: 'carolina@gessweinproperties.cl',
    phone: '+56 9 9331 8039',
    linkedin: 'https://www.linkedin.com/in/carolina-san-martin-fern%C3%A1ndez-83207044/',
    featured: true,
    photo: LEADER_PHOTO,
  },
  {
    name: 'Alberto Gesswein',
    role: 'Periodista · Productor Ejecutivo · Experto en Marketing & Comunicaciones',
    desc:
      'Experto en corretaje inmobiliario con amplio conocimiento del mercado de Santiago Oriente. Especializado en propiedades premium.',
    exp: '12+ años',
    education: 'Periodista, Pontificia Universidad Católica de Chile',
    specialties: ['Corretaje Inmobiliario', 'Valuación', 'Negociación', 'Marketing'],
    email: 'alberto@gesswein.tv',
    phone: '+56 9 9887 1751',
    linkedin: 'https://www.linkedin.com/in/alberto-gesswein-4a8246101/',
  },
  {
    name: 'Jan Gesswein',
    role: 'Abogado',
    desc:
      'Abogado especializado en derecho inmobiliario y regulaciones urbanas. Encargado de todos los aspectos legales de nuestras operaciones.',
    exp: '10+ años',
    education: 'Abogado, Universidad del Desarrollo',
    specialties: ['Derecho Inmobiliario', 'Contratos', 'Due Diligence Legal', 'Regulación Urbana'],
    email: 'jangesswein@gmail.com',
    phone: '+56 9 9909 9502',
    linkedin: '#',
  },
  {
    name: 'Kay Gesswein',
    role: 'Ingeniero Comercial · Magíster en Finanzas',
    desc:
      'Experto en marketing inmobiliario digital y fotografía de propiedades. Responsable de la presencia online y estrategias de marketing.',
    exp: '8+ años',
    education: 'Ingeniero Comercial, Universidad Adolfo Ibáñez. Magíster en Finanzas',
    specialties: ['Marketing Digital', 'Fotografía', 'Redes Sociales', 'Analytics'],
    email: 'kaygesswein@gmail.com',
    phone: '+56 9 9334 5413',
    linkedin: 'https://www.linkedin.com/in/kay-gesswein-san-martin/',
  },
];

// Alianzas / colaboradores
const ALLIES = [
  { name: 'Irene Puelma', area: 'Arquitectura', photo: '/allies/irene.jpg', blurb: 'Colaboración en proyectos residenciales de alto estándar.' },
  { name: 'Estudio DF', area: 'Diseño Interior', photo: '/allies/ally-2.jpg', blurb: 'Interiorismo y styling de espacios.' },
  { name: 'ProStudio', area: 'Render & 3D', photo: '/allies/ally-3.jpg', blurb: 'Visualización arquitectónica y renders fotorrealistas.' },
  { name: 'Legal Partners', area: 'Legal', photo: '/allies/ally-4.jpg', blurb: 'Apoyo contractual y regulatorio.' },
  { name: 'BrokerLab', area: 'Finanzas', photo: '/allies/ally-5.jpg', blurb: 'Hipotecas y estructuración de financiamiento.' },
  { name: 'Foto360', area: 'Producción Visual', photo: '/allies/ally-6.jpg', blurb: 'Foto, video y tour 360°.' },
  { name: 'GeoData', area: 'Estudios Urbanos', photo: '/allies/ally-7.jpg', blurb: 'ACM y data territorial.' },
  { name: 'Press PR', area: 'Comunicación', photo: '/allies/ally-8.jpg', blurb: 'Prensa y difusión estratégica.' },
];

// Cultura (4 pilares)
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
      'Adoptamos nuevas metodologías, herramientas digitales y diseño estratégico para mejorar cada experiencia.',
  },
  {
    icon: Palette,
    title: 'Criterio & Estilo',
    text:
      'Integramos visión arquitectónica, rigor financiero y sensibilidad estética en cada proyecto.',
  },
];

export default function EquipoPage() {
  const leader = TEAM.find((m) => m.featured) || TEAM[0];
  const others = TEAM.filter((m) => m !== leader);

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

      {/* ================= ¿POR QUÉ GP? + MISIÓN/VISIÓN ================= */}
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
                {/* Subtítulo institucional (mayúsculas, azul, tracking, sin negrita) */}
                <h3 className="text-[15px] uppercase tracking-[.25em] text-[#0A2E57] mb-2">
                  Misión
                </h3>
                <p className="text-[13px] text-black/70 leading-relaxed">
                  Brindar asesoría inmobiliaria integral, basada en confianza, precisión técnica
                  y diseño, conectando a nuestros clientes con oportunidades únicas de inversión
                  y hogar.
                </p>
              </article>

              <article className="border border-black/10 bg-white p-6 shadow-sm">
                {/* Subtítulo institucional (mayúsculas, azul, tracking, sin negrita) */}
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
        </div>
      </section>

      {/* ================= NUESTRA CULTURA (alineado a la izquierda) ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 mb-10">
            <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
              Nuestra cultura
            </h3>
            <p className="text-[14px] text-black/70 mt-3 max-w-3xl">
              Los valores que nos guían en cada decisión y en cada proyecto.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {CULTURE.map((c) => (
              <article key={c.title} className="border border-black/10 bg-white p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-slate-100 border border-black/10 mx-auto mb-4 flex items-center justify-center">
                  <c.icon className="size-6 text-[#0A2E57]" />
                </div>
                <h4 className="text-[13px] uppercase tracking-[.2em] text-black/90">{c.title}</h4>
                <p className="text-[13px] text-black/70 mt-2 leading-relaxed">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LÍDER: CAROLINA ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center border border-black/10 bg-white p-8 shadow-sm">
            <div className="space-y-5">
              <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
                Arquitecta Líder
              </div>
              <h2 className="text-[22px] text-black/90">{leader.name}</h2>
              <p className="text-[13px] text-[#0A2E57]">{leader.role}</p>

              <p className="text-[14px] text-black/70 leading-relaxed">
                {leader.desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="text-[13px] text-black/70">
                  <span className="inline-flex items-center gap-2 text-black/60">
                    <Briefcase className="size-4 text-black/40" />
                    <span>Experiencia:</span>
                  </span>
                  <div className="mt-1 text-black/90">{leader.exp}</div>
                </div>
                <div className="text-[13px] text-black/70">
                  <span className="inline-flex items-center gap-2 text-black/60">
                    <Award className="size-4 text-black/40" />
                    <span>Educación:</span>
                  </span>
                  <div className="mt-1 text-black/90">{leader.education}</div>
                </div>
              </div>

              <div className="pt-3">
                <div className="text-[12px] text-black/60 uppercase tracking-[.2em] mb-2">
                  Especialidades
                </div>
                <div className="flex flex-wrap gap-2">
                  {leader.specialties.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 text-[12px] bg-slate-100 border border-black/10"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-3">
                <a
                  href={`mailto:${leader.email}`}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-black/20 text-[13px]"
                >
                  <Mail className="size-4" />
                  {leader.email}
                </a>
                <a
                  href={`tel:${leader.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-black/20 text-[13px]"
                >
                  <Phone className="size-4" />
                  {leader.phone}
                </a>
                <a
                  href={leader.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 border border-black/20 text-[13px]"
                >
                  <Linkedin className="size-4" />
                  LinkedIn
                </a>
              </div>
            </div>

            <div className="relative">
              {leader.photo ? (
                <div className="w-64 h-64 mx-auto border border-black/10 shadow-sm overflow-hidden">
                  <Image
                    src={leader.photo}
                    alt={leader.name}
                    width={512}
                    height={512}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 mx-auto bg-slate-100 border border-black/10 flex items-center justify-center">
                  <Users className="size-16 text-slate-400" />
                </div>
              )}
              <blockquote className="mt-6 text-[14px] text-black/70 italic text-center max-w-md mx-auto">
                “La arquitectura no es solo construir espacios, es crear hogares donde las familias escriben sus historias”.
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RESTO DEL EQUIPO ================= */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 mb-10">
            <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
              El resto del equipo
            </h3>
            <p className="text-[14px] text-black/70 mt-3">
              Profesionales especializados que complementan nuestra propuesta de valor.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((m) => (
              <article
                key={m.name}
                className="border border-black/10 bg-white p-6 shadow-sm"
              >
                <div className="w-24 h-24 bg-slate-100 border border-black/10 flex items-center justify-center mb-4">
                  <Users className="size-8 text-slate-400" />
                </div>

                <h4 className="text-[15px] text-black/90">{m.name}</h4>
                <div className="text-[12px] text-[#0A2E57]">{m.role}</div>

                <p className="text-[13px] text-black/70 leading-relaxed mt-3">
                  {m.desc}
                </p>

                <div className="mt-4 text-[12px] text-black/60">
                  <div>
                    <span className="text-black/70">{m.exp}</span> • {m.education}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-[11px] text-black/60 uppercase tracking-[.2em] mb-1">
                    Especialidades
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {m.specialties.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-1 text-[12px] bg-slate-100 border border-black/10">
                        {s}
                      </span>
                    ))}
                    {m.specialties.length > 3 && (
                      <span className="px-2 py-1 text-[12px] border border-black/10">
                        +{m.specialties.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <a
                    href={`mailto:${m.email}`}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-black/20 text-[12px] flex-1 justify-center"
                  >
                    <Mail className="size-4" /> Email
                  </a>
                  <a
                    href={`tel:${m.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-black/20 text-[12px] flex-1 justify-center"
                  >
                    <Phone className="size-4" /> Llamar
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ALIANZAS & COLABORADORES — cards estilo Servicios ================= */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 mb-10">
            <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
              Alianzas & colaboradores
            </h3>
            <p className="text-[14px] text-black/70 mt-3 max-w-3xl">
              Profesionales y estudios con los que trabajamos para elevar el estándar de cada proyecto.
            </p>
          </div>

          {/* Grid idéntico en proporciones a las cards de Servicios */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
            {ALLIES.map((a) => (
              <article
                key={a.name}
                className="group relative overflow-hidden border border-slate-200 bg-white shadow-sm select-none transition transform hover:-translate-y-[4px] hover:shadow-md"
                style={{ transitionDuration: '600ms', transitionTimingFunction: 'ease-out' }}
              >
                {/* Imagen cuadrada y centrada */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src={a.photo}
                    alt={a.name}
                    width={1200}
                    height={900}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* Overlay que sube desde abajo (mismo patrón que Servicios). Sin modal. */}
                <div
                  className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-[1px] border-t border-black/10 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-transform duration-300 ease-out"
                >
                  <div className="p-5">
                    <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
                      {a.area}
                    </div>
                    <h4 className="mt-1 text-[15px] text-black/90 tracking-wide">{a.name}</h4>
                    <p className="mt-2 text-[13px] text-black/70 leading-relaxed">{a.blurb}</p>

                    {/* Botón visual igual a Servicios (no navega) */}
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded px-4 py-2 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
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
            Súmate para ayudarnos a <span className="italic">captar propiedades</span> y crecer la comunidad Gesswein Properties.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:contacto@gessweinproperties.cl?subject=Quiero%20trabajar%20con%20ustedes"
              className="inline-flex items-center justify-center rounded px-5 py-3 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
            >
              Enviar correo
            </a>
            <a
              href="https://wa.me/56912345678?text=Hola%2C%20quiero%20sumarme%20al%20equipo%20de%20Gesswein%20Properties"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded px-5 py-3 border border-black/25 text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57] hover:text-white transition"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
