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

// Fotos equipo (sprites de rostro)
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
  photo?: string; // usado como sprite del rostro
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
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((curr) => (curr === id ? null : id));

  // Reveal en scroll (cards del equipo) — (no se usa en el nuevo mosaico, se conserva por compat)
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean[]>(
    Array(TEAM_PRINCIPAL.length).fill(false)
  );

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

      {/* 4) EQUIPO — GRIS (Mosaico de diamantes: representativo → retrato con sprite) */}
      <section id="equipo" className="py-16 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto px-6 team-mosaic">
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
            Equipo
          </h2>
          <p className="mt-3 max-w-3xl text-[14px] text-black/70 leading-relaxed">
            En Gesswein Properties integramos arquitectura, derecho, finanzas y comunicación
            estratégica para ofrecer una asesoría integral y humana.
          </p>

          <TeamDiamondMosaic />
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

/* ============ SUBCOMPONENTE — EQUIPO (Mosaico de diamantes) ============ */

function TeamDiamondMosaic() {
  // Estado
  const [active, setActive] = useState<null | Member['id']>(null);
  const [phase, setPhase] = useState<'idle' | 'leaving' | 'compose'>('idle'); // 3 fases
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Imagen representativa por socio (estado inicial, NO caras)
  const REP_IMAGES: Record<Member['id'], string> = {
    carolina: "/icons/arquitectura-rep.webp", // planos/arquitectura
    alberto: "/icons/comunicacion-rep.webp",  // cámara/llaves/foto
    jan: "/icons/legal-rep.webp",             // contrato/bolígrafo
    kay: "/icons/finanzas-rep.webp",          // calculadora/tabla
  };

  // Sprite (rostro) por socio (puedes cambiar a AVIF/WebP definitivos)
  const SPRITES: Record<Member['id'], string> = {
    carolina: PHOTOS.carolina,
    alberto: PHOTOS.alberto,
    jan: PHOTOS.jan,
    kay: PHOTOS.kay,
  };

  // Geometría base
  const TILE = 120; // --tile (coincide con CSS)
  const GAP = 12;
  const STEP = (TILE + GAP) / 1.4;

  // 1) Estado inicial: 4 diamantes representativos en cruz/rombo
  // posiciones relativas (left/top) dentro del contenedor .mosaic
  const repPos = [
    { id: 'carolina' as const, left: 0, top: 0 },                                // rep-1 (arriba/izq)
    { id: 'alberto' as const, left: TILE * 1.3, top: TILE * 0.6 },              // rep-2 (centro)
    { id: 'jan' as const, left: TILE * 2.6, top: 0 },                            // rep-3 (arriba/der)
    { id: 'kay' as const, left: TILE * 1.3, top: TILE * 1.8 },                   // rep-4 (abajo centro)
  ];

  // 2) COMPOSE: 9 rombos (grilla 1-2-3-2-1) → map de coords + background-position 3x3 (0,50,100 / 0,25,50,75,100)
  type PosCompose = { left: number; top: number; posX: number; posY: number };

  const composeMap9: PosCompose[] = (() => {
    const rows = [1, 2, 3, 2, 1];
    const res: PosCompose[] = [];
    let idx = 0;
    const baseX = TILE * 1.3; // centra aprox en el contenedor
    const baseY = 0;

    rows.forEach((count, r) => {
      const rowWidth = (count - 1) * STEP * 0.94;
      for (let c = 0; c < count; c++) {
        const posY = [0, 25, 50, 75, 100][r];
        let posX = 50;
        if (count === 3) posX = [0, 50, 100][c];
        if (count === 2) posX = [25, 75][c];
        if (count === 1) posX = 50;

        res[idx++] = {
          left: baseX - rowWidth / 2 + c * STEP * 0.94,
          top: baseY + r * STEP * 0.94 + STEP * 0.12,
          posX,
          posY,
        };
      }
    });
    return res; // length 9
  })();

  // Manejo de apertura/cierre (3 fases)
  const openFor = (id: Member['id']) => {
    if (active === id) {
      // cerrar
      setPhase('leaving');
      setTimeout(() => {
        setActive(null);
        setPhase('idle');
      }, prefersReduced ? 0 : 350);
      return;
    }
    // abrir
    setPhase('leaving'); // salida de representativos
    setTimeout(() => {
      setActive(id);
      setPhase('compose'); // mostrar retrato recomponiéndose
    }, prefersReduced ? 0 : 220);
  };

  // Accesibilidad: cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && active) {
        openFor(active); // reutiliza para cerrar
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  // Render
  const activeMember = active ? TEAM_PRINCIPAL.find((m) => m.id === active)! : null;

  return (
    <div className="team-mosaic-root">
      <div
        className={[
          'mosaic',
          phase === 'leaving' ? 'is-transitioning' : '',
          active ? 'is-composed' : '',
        ].join(' ')}
        data-active={active ?? ''}
        aria-live="polite"
      >
        {/* 4 DIAMANTES REPRESENTATIVOS (estado inicial) */}
        {repPos.map((p, i) => (
          <button
            key={p.id}
            className={`rep-diamond rep-${i + 1} diamond`}
            style={{
              left: p.left,
              top: p.top,
              backgroundImage: `url('${REP_IMAGES[p.id] ?? '/icons/placeholder-rep.webp'}')`,
            }}
            aria-controls="profile-panel"
            aria-expanded={active === p.id}
            aria-label={`Ver perfil de ${p.id}`}
            onClick={() => openFor(p.id)}
          />
        ))}

        {/* Capa de composición (rombos del retrato) */}
        <div
          className="compose-layer"
          aria-hidden={!active}
          style={
            active
              ? ({ ['--sprite' as any]: `url('${SPRITES[active]}')` } as React.CSSProperties)
              : undefined
          }
        >
          {/* Si hay activo, creamos 9 tiles con posiciones + background-position */}
          {active &&
            composeMap9.map((t, i) => {
              const delay = prefersReduced ? 0 : i * 60; // entrada escalonada
              return (
                <div
                  key={i}
                  className="tile diamond"
                  style={{
                    left: t.left,
                    top: t.top,
                    opacity: phase === 'compose' ? 1 : 0,
                    transitionDelay: `${phase === 'compose' ? delay : 0}ms`,
                    // sprite 3x3
                    backgroundImage: `var(--sprite)`,
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${t.posX}% ${t.posY}%`,
                    borderColor: '#fff', // líneas blancas finas entre piezas
                    borderWidth: '1px',
                  }}
                />
              );
            })}
        </div>

        {/* Botón Cerrar en forma de diamante (solo en modo retrato) */}
        <button
          className="close-diamond diamond"
          hidden={!active}
          aria-label="Cerrar perfil"
          onClick={() => active && openFor(active)}
        >
          <span>✕ CERRAR</span>
        </button>
      </div>

      {/* Panel de perfil (debajo del mosaico) */}
      <div
        id="profile-panel"
        className="profile-panel"
        hidden={!activeMember}
        role="region"
        aria-labelledby={activeMember?.id}
      >
        {activeMember && (
          <ProfileCard m={activeMember} onClose={() => openFor(activeMember.id)} />
        )}
      </div>

      {/* Estilos AÍSLADOS a este bloque */}
      <style jsx>{`
        .team-mosaic-root {
          --tile: 120px;
          --gap: 12px;
          --line: 1px;
        }
        @media (max-width: 900px) {
          .team-mosaic-root { --tile: 100px; }
        }
        @media (max-width: 600px) {
          .team-mosaic-root { --tile: 86px; }
        }

        .mosaic {
          position: relative;
          width: 100%;
          max-width: 560px;
          min-height: 420px;
          margin: 40px auto 0;
        }

        /* Forma base del rombo (diamante real) */
        .diamond {
          width: var(--tile);
          height: var(--tile);
          transform: rotate(45deg);
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          overflow: hidden;
          border: 1px solid #e8e8e8;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          transition:
            transform 600ms cubic-bezier(.22,.61,.36,1),
            opacity   300ms ease,
            filter    300ms ease,
            background-position 600ms ease,
            background-size 600ms ease;
          will-change: transform, opacity, background-position, background-size;
        }

        /* Estado inicial: 4 representativos */
        .rep-diamond {
          position: absolute;
          cursor: pointer;
        }
        @media (hover: hover) {
          .rep-diamond:hover { filter: brightness(1.06); }
        }

        /* Capa de composición */
        .compose-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .compose-layer .tile {
          position: absolute;
          pointer-events: none;
          border: var(--line) solid #fff;
          opacity: 0;
        }

        /* Fase de transición (salida de representativos) */
        .mosaic.is-transitioning .rep-diamond {
          opacity: 0.15;
          transition: opacity 200ms ease;
        }

        /* Modo compuesto (retrato) */
        .mosaic.is-composed .rep-diamond {
          display: none; /* escondemos los 4 reps mientras está compuesto */
        }

        /* Botón Cerrar (diamante amarillo) */
        .close-diamond {
          position: absolute;
          left: -12px;
          top: -12px;
          width: calc(var(--tile) * 0.9);
          height: calc(var(--tile) * 0.9);
          background: #F0C200;
          color: #0A2E57;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .close-diamond span {
          transform: rotate(-45deg);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .mosaic:not(.is-composed) .close-diamond {
          display: none;
        }

        /* Panel de perfil */
        .profile-panel[hidden] { display: none; }
        .profile-panel {
          margin: 28px auto 0;
          max-width: 980px;
          padding: 24px;
          border: 1px solid #e6e6e6;
          background: #fff;
          transition: opacity .3s ease, max-height .4s ease;
        }
      `}</style>
    </div>
  );
}

/* ================= COMPONENTE PERFIL ================= */

function ProfileCard({ m, onClose }: { m: Member; onClose: () => void }) {
  return (
    <div className="border border-black/10 bg-white p-6" style={{ borderRadius: 0 }}>
      <header className="pb-4 mb-4 border-b border-black/10">
        <h3 id={m.id} className="text-[20px] font-medium text-black/90">{m.name}</h3>
        <p className="uppercase text-[13px] tracking-[.2em] text-[#0A2E57]">{m.roleLine}</p>
      </header>

      <div className="text-[14px] text-black/70 leading-relaxed">
        <p className="mb-3">{m.bioShort}</p>
        {m.bioDetail.map((p, i) => (
          <p key={i} className="mb-3">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-3">
        <div className="uppercase text-[12px] tracking-[.2em] text-[#0A2E57]">Educación</div>
        <div className="text-[13px] text-black/80 mt-1">{m.education}</div>
      </div>

      <div className="mt-4">
        <div className="uppercase text-[12px] tracking-[.2em] text-[#0A2E57]">Especialidades</div>
        <div className="text-[13px] text-black/80 mt-1">{m.specialties}</div>
      </div>

      <div className="mt-4 flex flex-col gap-1 text-[13px]">
        {m.email && (
          <a
            href={`mailto:${m.email}`}
            aria-label={`Enviar correo a ${m.name}`}
            className="inline-flex items-center gap-2 text-black/80 hover:underline"
          >
            <Mail className="h-4 w-4 text-black/50" />
            {m.email}
          </a>
        )}
        {m.phone && (
          <a
            href={`tel:${m.phone.replace(/\s+/g, '')}`}
            aria-label={`Llamar a ${m.name}`}
            className="inline-flex items-center gap-2 text-black/80 hover:underline"
          >
            <Phone className="h-4 w-4 text-black/50" />
            {m.phone}
          </a>
        )}
        {m.linkedin && (
          <a
            href={m.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir LinkedIn de ${m.name}`}
            className="inline-flex items-center gap-2 text-black/80 hover:underline"
          >
            <Linkedin className="h-4 w-4 text-black/50" />
            {m.linkedin.replace(/^https?:\/\//, '')}
          </a>
        )}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onClose}
          className="text-[12px] uppercase tracking-[.25em] border border-black/25 px-4 py-2 hover:bg-[#0A2E57] hover:text-white transition"
        >
          Cerrar perfil
        </button>
      </div>
    </div>
  );
}
