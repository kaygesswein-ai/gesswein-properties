'use client';

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
      'Arquitecto Potificia Universidad Católica de Chile',
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
    education: 'Periodista Pontificia Universidad Católica de Chile',
    specialties: ['Corretaje Inmobiliario', 'Valuación', 'Negociación', 'Marketing'],
    email: 'alberto@gesswein.tv',
    phone: '+56 9 9887 1751',
    linkedin: 'https://www.linkedin.com/in/alberto-gesswein-4a8246101/',
  },
  {
    name: 'Jan Gesswein',
    role: 'Abogado',
    desc:
      'Abogado especializado en derecho inmobiliario y regulaciones urbanas. Encargad de todos los aspectos legales de nuestras operaciones.',
    exp: '10+ años',
    education: 'Abogada Universidad del Desarrollo',
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
    education: 'Ingeniero Coercial Universidad Adolfo Ibáñez, Magíster en Finanzas',
    specialties: ['Marketing Digital', 'Fotografía', 'Redes Sociales', 'Analytics'],
    email: 'kaygesswein@gmail.com',
    phone: '+56 9 9334 5413',
    linkedin: 'https://www.linkedin.com/in/kay-gesswein-san-martin/',
  },
];

// Alianzas / colaboradores (ejemplos – edita/añade)
const ALLIES = [
  { name: 'Irene Puelma', area: 'Arquitectura', photo: '/allies/irene.jpg', blurb: 'Colaboración en proyectos residenciales.' },
  { name: 'Estudio DF', area: 'Diseño Interior', photo: '/allies/ally-2.jpg', blurb: 'Interiorismo y styling.' },
  { name: 'ProStudio', area: 'Render & 3D', photo: '/allies/ally-3.jpg', blurb: 'Visualización arquitectónica.' },
  { name: 'Legal Partners', area: 'Legal', photo: '/allies/ally-4.jpg', blurb: 'Apoyo contractual y regulatorio.' },
  { name: 'BrokerLab', area: 'Finanzas', photo: '/allies/ally-5.jpg', blurb: 'Hipotecas y financiamiento.' },
  { name: 'Foto360', area: 'Producción Visual', photo: '/allies/ally-6.jpg', blurb: 'Foto, video y tour 360.' },
  { name: 'GeoData', area: 'Estudios Urbanos', photo: '/allies/ally-7.jpg', blurb: 'ACM y data territorial.' },
  { name: 'Press PR', area: 'Comunicación', photo: '/allies/ally-8.jpg', blurb: 'Prensa y difusión.' },
];

// Cultura
const CULTURE = [
  {
    icon: Award,
    title: 'Excelencia',
    text:
      'Buscamos la perfección en cada detalle, desde el primer contacto hasta la entrega de llaves.',
  },
  {
    icon: Users,
    title: 'Transparencia',
    text:
      'Comunicación clara y honesta en todos nuestros procesos y relaciones comerciales.',
  },
  {
    icon: Briefcase,
    title: 'Innovación',
    text:
      'Adoptamos las mejores tecnologías y metodologías para ofrecer un servicio superior.',
  },
];

export default function EquipoPage() {
  const leader = TEAM.find((m) => m.featured) || TEAM[0];
  const others = TEAM.filter((m) => m !== leader);

  return (
    <main className="bg-white">

      {/* ================= HERO (idéntico estilo Servicios) ================= */}
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
                className="border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition"
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

      {/* ================= NUESTRA CULTURA ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
              Nuestra cultura
            </h3>
            <p className="text-[14px] text-black/70 mt-3">
              Los valores que nos definen y guían cada decisión en nuestro trabajo.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {CULTURE.map((c) => (
              <article key={c.title} className="border border-black/10 bg-white p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-slate-100 border border-black/10 mx-auto mb-4 flex items-center justify-center">
                  <c.icon className="size-6 text-[#0A2E57]" />
                </div>
                <h4 className="text-[15px] text-black/90">{c.title}</h4>
                <p className="text-[13px] text-black/70 mt-2 leading-relaxed">{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ALIANZAS & COLABORADORES ================= */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 mb-10">
            <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
              Alianzas & colaboradores
            </h3>
            <p className="text-[14px] text-black/70 mt-3">
              Profesionales y estudios con los que trabajamos para elevar el estándar de cada proyecto.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ALLIES.map((a) => (
              <article key={a.name} className="border border-black/10 bg-white p-5 shadow-sm hover:shadow-md transition">
                <div className="w-full aspect-square bg-slate-100 border border-black/10 mb-4 overflow-hidden">
                  {/* Reemplaza las rutas /allies/* por tus fotos reales */}
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

      {/* ================= CTA FINAL (sobrio) ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
            ¿Quieres trabajar con nosotros?
          </h3>
          <p className="text-[14px] text-black/70 mt-3">
            Súmate para ayudarnos a **captar propiedades** y crecer la comunidad Gesswein Properties.
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
