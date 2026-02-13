'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Users, Award, Briefcase, Mail, Phone, Linkedin } from 'lucide-react';

/* =========================
   DATOS
   ========================= */

const HERO_IMG =
  'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Foto%20portada%20-%20Equipo%20-%20OPTIMIZADA.JPG';

const HISTORIA_IMG =
  'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop';

const PHOTOS = {
  carolina: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Foto%20Carolina%20-%20Optimizada.JPG',
  alberto: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Foto%20Tito%20-%20Optimizada.JPG',
  jan: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Foto%20Jan%20-%20Optimizada.jpeg',
  kay: 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Foto%20Kay%20-%20Optimizada.JPG',
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
    roleLine: 'Socia Fundadora · Arquitectura & Corretaje',
    bioShort:
      'Arquitecta con más de 15 años de experiencia en proyectos residenciales de alto estándar.',
    bioDetail: [
      'Dirige el desarrollo arquitectónico de Gesswein Properties, asegurando que cada propiedad combine belleza, funcionalidad y valorización a largo plazo.',
    ],
    education: 'Arquitectura, Pontificia Universidad Católica de Chile.',
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
    roleLine: 'Socio Fundador · Marketing & Comunicaciones',
    bioShort:
      'Periodista con más de 25 años en dirección, gestión y comunicación estratégica.',
    bioDetail: [
      'Lidera la estrategia comunicacional y marketing de la empresa con enfoque humano y excelencia técnica.',
    ],
    education: 'Periodismo, Pontificia Universidad Católica de Chile.',
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
    roleLine: 'Socio Fundador · Legal',
    bioShort:
      'Abogado especializado en derecho inmobiliario y regulaciones urbanas.',
    bioDetail: [
      'Supervisa aspectos legales: contratos sólidos, cumplimiento normativo y procesos transparentes.',
    ],
    education: 'Derecho, Universidad del Desarrollo.',
    specialties: 'Derecho inmobiliario · Contratos · Due Diligence Legal.',
    email: 'jangesswein@gmail.com',
    phone: '+56 9 9909 9502',
    linkedin: '#',
    photo: PHOTOS.jan,
  },
  {
    id: 'kay',
    name: 'Kay Gesswein',
    roleLine: 'Socio Fundador · Administración & Finanzas',
    bioShort:
      'Especialista en análisis financiero, valoración de activos y estructuración de modelos de inversión, con experiencia en asesoría financiera y evaluación de negocios a nivel nacional e internacional.

Integra rigurosidad técnica y visión comercial para analizar oportunidades inmobiliarias con foco en rentabilidad, riesgo y proyección de valor en el largo plazo.

Ha participado en procesos de due diligence, modelación financiera y valorización de activos en múltiples industrias, aportando una mirada estratégica aplicada al mercado inmobiliario.',
    bioDetail: [
      'Lidera estrategia digital y posicionamiento, integrando análisis financiero con comunicación visual.',
    ],
    education: 'Ingeniería Comercial, Universidad Adolfo Ibáñez.',
    specialties: 'Análisis y modelación financiera · Evaluación de inversiones inmobiliarias · Due diligence y valorización de activos · Estrategia comercial y posicionamiento.',
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

  // Estado y refs
  const [active, setActive] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const floaterRef = useRef<HTMLDivElement | null>(null);
  const activeIdxRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // === NUEVO: posiciones fijas para ida/vuelta idénticas ===
  const initialXRef = useRef<number[]>([]); // X inicial de cada card (relativo al grid)
  const firstXRef = useRef<number>(0); // X inicial de la primera columna

  // Animación
  const DURATION = 450;
  const EASING = 'cubic-bezier(.22,.61,.36,1)';

  // Dimensiones del panel (alineado a la derecha de la 1ª tarjeta)
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

  // === NUEVO: calcular layout fijo (X inicial de cada card y de la primera) ===
  useEffect(() => {
    function computeLayout() {
      const grid = gridRef.current;
      if (!grid) return;
      const gridRect = grid.getBoundingClientRect();
      const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-team-card]'));

      if (!cards.length) return;

      // X inicial de la primera columna (card 0)
      const firstRect = cards[0].getBoundingClientRect();
      firstXRef.current = Math.round(firstRect.left - gridRect.left);

      // X inicial de cada card (para que SIEMPRE vuelva al mismo punto)
      initialXRef.current = cards.map((el) => {
        const r = el.getBoundingClientRect();
        return Math.round(r.left - gridRect.left);
      });

      // Dimensiones del panel (pegado al borde derecho del card 0)
      const left = Math.round(firstRect.right - gridRect.left);
      const width = Math.max(0, Math.round(gridRect.width - (firstRect.right - gridRect.left)));
      const height = Math.round(firstRect.height);
      setPanelDims({ left, width, height });
    }

    // calcular al montar y cuando cambia 'active' (por si altura de card varía)
    computeLayout();

    // observar cambios de tamaño del grid
    const ro = new ResizeObserver(() => computeLayout());
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener('resize', computeLayout);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeLayout);
    };
  }, [active]);

  // Bloquear/permitir interacción del grid durante transición
  function setGridInteractivity(blocked: boolean) {
    const grid = gridRef.current;
    if (!grid) return;
    grid.style.pointerEvents = blocked ? 'none' : 'auto';
  }

  // ----- CERRAR (fade del panel → floater vuelve a transform:0 con MISMA velocidad) -----
  function closePanel() {
    if (isTransitioning) return;
    const i = activeIdxRef.current;
    const floater = floaterRef.current;
    setIsTransitioning(true);
    setGridInteractivity(true);

    // Mobile: acordeón
    if (window.matchMedia('(max-width: 767px)').matches) {
      setActive(null);
      activeIdxRef.current = null;
      setIsTransitioning(false);
      setGridInteractivity(false);
      return;
    }

    // 1) Desaparece el panel primero
    if (panelRef.current) {
      panelRef.current.style.transition = `opacity 220ms ease`;
      panelRef.current.style.opacity = '0';
      panelRef.current.style.pointerEvents = 'none';
    }

    const grid = gridRef.current;
    if (!grid || floater == null || i == null) {
      restoreAfterClose();
      return;
    }

    // 2) Volver EXACTAMENTE a la X inicial: transform: 0 (misma DURATION/EASING que la ida)
    floater.style.willChange = 'transform';
    requestAnimationFrame(() => {
      floater.style.transition = `transform ${DURATION}ms ${EASING}`;
      floater.style.transform = `translateX(0px)`;
    });

    window.setTimeout(() => {
      restoreAfterClose();
    }, DURATION + 12);
  }

  function restoreAfterClose() {
    try {
      const grid = gridRef.current;
      const firstCard = cardRefs.current[0];
      if (firstCard) firstCard.style.visibility = 'visible';
      if (activeIdxRef.current != null) {
        const origin = cardRefs.current[activeIdxRef.current];
        if (origin) origin.style.visibility = 'visible';
      }
      if (grid) {
        Array.from(grid.querySelectorAll<HTMLElement>('[data-team-card]')).forEach((el) => {
          el.style.opacity = '1';
        });
      }
      if (floaterRef.current) {
        floaterRef.current.remove();
        floaterRef.current = null;
      }
    } catch {}
    setActive(null);
    activeIdxRef.current = null;
    setIsTransitioning(false);
    setGridInteractivity(false);
    if (panelRef.current) {
      panelRef.current.style.opacity = '1';
      panelRef.current.style.pointerEvents = 'auto';
    }
  }

  // ----- ABRIR (clon desde X inicial → X de la primera columna con MISMA velocidad) -----
  function openMember(i: number) {
    if (isTransitioning) return;

    // Toggle: si toco el mismo, cierro
    if (active === i) {
      closePanel();
      return;
    }

    // Mobile: acordeón básico
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
    setGridInteractivity(true);

    // Construimos el clon en SU posición inicial fija
    const gridRect = grid.getBoundingClientRect();
    const srcRect = src.getBoundingClientRect();
    const w = Math.round(srcRect.width);
    const h = Math.round(srcRect.height);

    const clone = src.cloneNode(true) as HTMLDivElement;
    clone.style.position = 'absolute';
    clone.style.left = `${initialXRef.current[i]}px`;
    clone.style.top = `${Math.round(srcRect.top - gridRect.top)}px`;
    clone.style.width = `${w}px`;
    clone.style.height = `${h}px`;
    clone.style.zIndex = '50';
    clone.style.cursor = 'pointer';
    (clone.querySelector('[data-overlay]') as HTMLDivElement | null)?.style.setProperty('opacity', '0');
    clone.addEventListener('click', closePanel);

    grid.appendChild(clone);

    // Ocultamos origen y destino para evitar solapes
    src.style.visibility = 'hidden';
    dst.style.visibility = 'hidden';

    floaterRef.current = clone;
    activeIdxRef.current = i;

    // Atenuar los demás mientras viaja
    Array.from(grid.querySelectorAll<HTMLElement>('[data-team-card]')).forEach((el, idx) => {
      if (idx !== i && idx !== 0) {
        el.style.transition = 'opacity 200ms ease';
        el.style.opacity = '0.35';
      }
    });

    // Distancia EXACTA: desde initialX[i] hasta firstX (misma DURATION/EASING)
    const dx = firstXRef.current - initialXRef.current[i];
    clone.style.willChange = 'transform';
    requestAnimationFrame(() => {
      clone.style.transition = `transform ${DURATION}ms ${EASING}`;
      clone.style.transform = `translateX(${dx}px)`;
    });

    window.setTimeout(() => {
      setActive(i);
      setIsTransitioning(false);
      setGridInteractivity(false);
      // restaurar opacidades (el panel cubre cols 2–4)
      Array.from(grid.querySelectorAll<HTMLElement>('[data-team-card]')).forEach((el, idx) => {
        if (idx !== i && idx !== 0) el.style.opacity = '1';
      });
    }, DURATION + 12);
  }

  function onPanelClick() {
    closePanel();
  }

  function formatPhoneForTel(phone: string) {
    return phone.replace(/[^\d+]/g, '');
  }

  function safeLinkedinHref(url?: string) {
    if (!url) return undefined;
    if (url.trim() === '#' || url.trim() === '') return undefined;
    return url;
  }

  function splitRole(roleLine: string) {
    const parts = roleLine.split('·').map((s) => s.trim()).filter(Boolean);
    return {
      title: parts[0] || roleLine,
      area: parts.slice(1).join(' · '),
    };
  }

  function ContactIcons({ m }: { m: Member }) {
    const tel = m.phone ? formatPhoneForTel(m.phone) : undefined;
    const linkedinHref = safeLinkedinHref(m.linkedin);

    const iconBtn =
      'inline-flex items-center justify-center w-10 h-10 text-[#0A2E57] hover:text-[#0E2C4A] transition';

    return (
      <div className="flex items-center gap-5">
        {m.email && (
          <a
            className={iconBtn}
            href={`mailto:${m.email}`}
            aria-label={`Enviar correo a ${m.name}`}
            onClick={(e) => e.stopPropagation()}
            title="Correo"
          >
            <Mail className="h-6 w-6" />
          </a>
        )}

        {m.phone && tel && (
          <a
            className={iconBtn}
            href={`tel:${tel}`}
            aria-label={`Llamar a ${m.name}`}
            onClick={(e) => e.stopPropagation()}
            title="Teléfono"
          >
            <Phone className="h-6 w-6" />
          </a>
        )}

        {linkedinHref && (
          <a
            className={iconBtn}
            href={linkedinHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir LinkedIn de ${m.name}`}
            onClick={(e) => e.stopPropagation()}
            title="LinkedIn"
          >
            <Linkedin className="h-6 w-6" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative mt-10">
      {/* GRID */}
      <div ref={gridRef} className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
        {team.map((m, i) => {
          const r = splitRole(m.roleLine);
          return (
            <div
              key={m.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              data-team-card
              className="relative group cursor-pointer select-none transition-opacity"
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

              {/* Overlay (DESKTOP) — CARGO + ÁREA EN 2 LÍNEAS */}
              <div
                data-overlay
                className="hidden md:flex absolute inset-0 bg-[#0A2E57]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex-col justify-end p-6 pointer-events-none"
              >
                <h3 className="text-white text-lg font-semibold">{m.name}</h3>

                {/* === CAMBIO PUNTUAL: separar cargo y área === */}
                <div className="mt-1">
                  <div className="text-white/95 text-[13px] tracking-[.18em] uppercase font-semibold">
                    {r.title}
                  </div>
                  {r.area ? (
                    <div className="text-[#BFD1E5] text-[12px] tracking-[.14em] uppercase mt-1">
                      {r.area}
                    </div>
                  ) : null}
                </div>
                {/* === FIN CAMBIO PUNTUAL === */}

                <p className="text-white/85 text-xs mt-2 line-clamp-2">{m.bioShort}</p>
              </div>

              {/* Panel ACORDEÓN (MOBILE) */}
              <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${
                  active === i ? 'max-h-[800px] opacity-100 mt-3' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="w-full bg-[#EAEAEA] p-5 border border-black/10">
                  <h4 className="text-xl font-semibold text-[#0E2C4A]">{m.name}</h4>

                  {/* === CAMBIO PUNTUAL: separar cargo y área === */}
                  <div className="mt-1">
                    <div className="text-[#0A2E57] text-[13px] tracking-[.18em] uppercase font-semibold">
                      {r.title}
                    </div>
                    {r.area ? (
                      <div className="text-[#0E2C4A]/70 text-[12px] tracking-[.14em] uppercase mt-1">
                        {r.area}
                      </div>
                    ) : null}
                  </div>
                  {/* === FIN CAMBIO PUNTUAL === */}

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

                    {/* === CAMBIO PUNTUAL: solo íconos (sin texto, sin rectángulo) === */}
                    <div className="pt-2">
                      <ContactIcons m={m} />
                    </div>
                    {/* === FIN CAMBIO PUNTUAL === */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* PANEL LATERAL (DESKTOP) */}
        {active !== null && (() => {
          const r = splitRole(team[active].roleLine);
          return (
            <div
              ref={panelRef}
              className="hidden md:block absolute top-0 bg-[#EAEAEA] border border-black/10 shadow-[0_4px_10px_rgba(0,0,0,0.06)] overflow-hidden"
              style={{
                left: `${panelDims.left}px`,
                width: `${panelDims.width}px`,
                height: `${panelDims.height}px`,
                transition: `transform ${DURATION}ms ${EASING}, opacity 220ms ease`,
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

                {/* === CAMBIO PUNTUAL: separar cargo y área === */}
                <div className="mt-2">
                  <div className="text-[#0A2E57] tracking-[.18em] uppercase text-[13px] font-semibold">
                    {r.title}
                  </div>
                  {r.area ? (
                    <div className="text-[#0E2C4A]/70 tracking-[.16em] uppercase text-[12px] mt-1">
                      {r.area}
                    </div>
                  ) : null}
                </div>
                {/* === FIN CAMBIO PUNTUAL === */}

                <p className="mt-6 text-[15px] leading-relaxed">{team[active].bioDetail[0]}</p>

                <div className="mt-8 grid grid-cols-2 gap-8 text-[14px]">
                  <div>
                    <div className="uppercase text-[#0A2E57] tracking-[.18em] text-[12px]">Educación</div>
                    <div className="mt-1">{team[active].education}</div>
                  </div>
                  <div>
                    <div className="uppercase text-[#0A2E57] tracking-[.18em] text-[12px]">Especialidades</div>
                    <div className="mt-1">{team[active].specialties}</div>
                  </div>
                </div>

                <div className="mt-auto pt-6 text-[14px]">
                  {/* === CAMBIO PUNTUAL: solo íconos (sin texto, sin rectángulo) === */}
                  <ContactIcons m={team[active]} />
                  {/* === FIN CAMBIO PUNTUAL === */}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
