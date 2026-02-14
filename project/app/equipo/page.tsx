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
  carolina:
    'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Foto%20Carolina%20-%20Optimizada.jpeg',
  alberto:
    'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Foto%20Tito%20-%20Optimizada.JPG',
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
      'Arquitecta y consultora inmobiliaria con más de 15 años de experiencia en desarrollo y gestión de proyectos residenciales y comerciales, integrando visión arquitectónica, normativa urbana y estrategia de inversión para identificar oportunidades con alto potencial de valorización. Su enfoque entiende cada propiedad como un activo estratégico. Durante 25 años fue socia del Estudio de Arquitectura San Martín y Pascal Arquitectos, donde se desempeñó como Directora de Proyectos, liderando desarrollos residenciales y comerciales en alianza con inmobiliarias consolidadas. Su trayectoria abarca viviendas unifamiliares, condominios, loteos, subdivisiones y fusiones prediales, edificios residenciales y de oficinas, proyectos comerciales, reconversiones y estrategias de flipping. Con más de 160.000 m² comercializados, ventas superiores a UF 650.000 y más de 60 operaciones cerradas, respalda una gestión enfocada en resultados, criterio financiero y atención personalizada. Fundadora de Arquitectura Propiedades, posteriormente evolucionada a Gesswein Properties, firma familiar especializada en asesoría e intermediación inmobiliaria de alto valor.',
    bioDetail: [
      'Arquitecta y consultora inmobiliaria con más de 15 años de experiencia en desarrollo y gestión de proyectos residenciales y comerciales, integrando visión arquitectónica, normativa urbana y estrategia de inversión para identificar oportunidades con alto potencial de valorización. Su enfoque entiende cada propiedad como un activo estratégico. Durante 25 años fue socia del Estudio de Arquitectura San Martín y Pascal Arquitectos, donde se desempeñó como Directora de Proyectos, liderando desarrollos residenciales y comerciales en alianza con inmobiliarias consolidadas. Su trayectoria abarca viviendas unifamiliares, condominios, loteos, subdivisiones y fusiones prediales, edificios residenciales y de oficinas, proyectos comerciales, reconversiones y estrategias de flipping. Con más de 160.000 m² comercializados, ventas superiores a UF 650.000 y más de 60 operaciones cerradas, respalda una gestión enfocada en resultados, criterio financiero y atención personalizada. Fundadora de Arquitectura Propiedades, posteriormente evolucionada a Gesswein Properties, firma familiar especializada en asesoría e intermediación inmobiliaria de alto valor.',
    ],
    education: 'Arquitectura, Pontificia Universidad Católica de Chile.',
    specialties:
      'Comercialización de activos residenciales y comerciales de alto estándar • Estructuración y cierre de operaciones • Gestión personalizada de compraventa • Análisis normativo y planificación urbana • Desarrollo residencial y comercial • Gestión de procesos de subdivisión, fusión predial • Evaluación de potencial de plusvalía • Identificación de oportunidades de valorización • Arquitectura aplicada a la inversión • Reconversión y reposicionamiento de proyectos • Estrategias de flipping inmobiliario • Acompañamiento personalizado a inversionistas',
    email: 'carolina@gessweinproperties.cl',
    phone: '+56 9 9331 8039',
    linkedin:
      'https://www.linkedin.com/in/carolina-san-martin-fern%C3%A1ndez-83207044/',
    photo: PHOTOS.carolina,
  },
  {
    id: 'alberto',
    name: 'Alberto Gesswein',
    roleLine: 'Socio Fundador · Estrategia, Marca & Desarrollo de Negocios',
    bioShort:
      'Ejecutivo y empresario con más de 30 años de experiencia liderando proyectos de alto impacto en medios y gestión corporativa, especializado en posicionamiento estratégico, construcción de marca y desarrollo de activos. Fue Director del Área de Ficción de Canal 13 y ejecutivo en Televisión Nacional de Chile, gestionando producciones de gran escala y alto estándar. Como productor independiente, ha desarrollado exitosos proyectos cinematográficos y televisivos recientes, incluyendo Me Rompiste el Corazón. Ha liderado estrategias de comunicación institucional en eventos de relevancia internacional como los Juegos Panamericanos Santiago 2023. En Gesswein Properties aporta visión estratégica, estructuración comercial y marketing inmobiliario orientado a la valorización, diferenciación y proyección de activos en el segmento premium.',
    bioDetail: [
      'Ejecutivo y empresario con más de 30 años de experiencia liderando proyectos de alto impacto en medios y gestión corporativa, especializado en posicionamiento estratégico, construcción de marca y desarrollo de activos. Fue Director del Área de Ficción de Canal 13 y ejecutivo en Televisión Nacional de Chile, gestionando producciones de gran escala y alto estándar. Como productor independiente, ha desarrollado exitosos proyectos cinematográficos y televisivos recientes, incluyendo Me Rompiste el Corazón. Ha liderado estrategias de comunicación institucional en eventos de relevancia internacional como los Juegos Panamericanos Santiago 2023. En Gesswein Properties aporta visión estratégica, estructuración comercial y marketing inmobiliario orientado a la valorización, diferenciación y proyección de activos en el segmento premium.',
    ],
    education:
      'Periodista, Licenciado en Información Social, Pontificia Universidad Católica de Chile.',
    specialties:
      'Estrategia de posicionamiento · Desarrollo y valorización de activos · Marketing inmobiliario premium · Comunicación corporativa · Gestión de proyectos de alto impacto',
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
      'Abogado especializado en derecho inmobiliario, tributario y comercial, con experiencia en procesos de due diligence y en la identificación estratégica de riesgos legales. Integra análisis jurídico riguroso y visión de negocio para estructurar y acompañar operaciones inmobiliarias, elaborando la documentación necesaria para resguardar cada etapa del proceso de corretaje, desde la negociación inicial hasta el cierre definitivo.',
    bioDetail: [
      'Abogado especializado en derecho inmobiliario, tributario y comercial, con experiencia en procesos de due diligence y en la identificación estratégica de riesgos legales. Integra análisis jurídico riguroso y visión de negocio para estructurar y acompañar operaciones inmobiliarias, elaborando la documentación necesaria para resguardar cada etapa del proceso de corretaje, desde la negociación inicial hasta el cierre definitivo.',
    ],
    education: 'Derecho, Universidad del Desarrollo.',
    specialties:
      'Análisis y estructuración legal inmobiliaria • Due diligence • Planificación tributaria • Contratos • Compliance',
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
      'Especialista en análisis financiero, valoración de activos y estructuración de modelos de inversión, con experiencia en asesoría financiera, due diligence y modelación en múltiples industrias a nivel nacional e internacional. Integra rigurosidad técnica y visión comercial para analizar oportunidades inmobiliarias con foco en rentabilidad, riesgo y proyección de valor en el largo plazo.',
    bioDetail: [
      'Especialista en análisis financiero, valoración de activos y estructuración de modelos de inversión, con experiencia en asesoría financiera, due diligence y modelación en múltiples industrias a nivel nacional e internacional. Integra rigurosidad técnica y visión comercial para analizar oportunidades inmobiliarias con foco en rentabilidad, riesgo y proyección de valor en el largo plazo.',
    ],
    education: 'Ingeniería Comercial, Magíster en Finanzas, Universidad Adolfo Ibáñez.',
    specialties: 'Análisis y valoración de activos · Due diligence · Estructuración de modelos de inversión',
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
    title: 'Decisiones informadas, no intuición.',
    text: 'El mercado suele operar con “comparables” rápidos y presión por publicar. Nosotros trabajamos con análisis: revisamos variables normativas, riesgos de regularización, compatibilidad con objetivos del cliente y coherencia financiera.',
  },
  {
    icon: Users,
    title: 'El valor real se construye, no se adivina.',
    text: 'Una propiedad puede estar subvalorada por mala lectura técnica o sobrevalorada por expectativas irreales. Nuestro rol es identificar el punto exacto entre potencial y realidad: qué es viable, cuánto cuesta, qué aporta al precio final y en qué plazos.',
  },
  {
    icon: Briefcase,
    title: 'Estrategia antes de exposición.',
    text: 'No creemos en la venta como trámite. Creemos en la venta como proceso de posicionamiento: segmentación del comprador correcto, relato basado en atributos verificables, propuesta de valor, presentación, orden documental y negociación con fundamentos.',
  },
  {
    icon: Award,
    title: 'Menos riesgo, más control.',
    text: 'Los problemas fuertes en una compraventa rara vez aparecen por precio; aparecen por normativa, títulos, ampliaciones, deslindes, servidumbres, recepción final, afectaciones y expectativas mal calibradas. En Gesswein Properties la venta se gestiona con prevención, no con reacción.',
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
              <div className="text-[14px] text-black/70 leading-relaxed space-y-4 text-justify">
                <p>
                  Gesswein Properties nace a partir de la trayectoria independiente de Carolina San
                  Martín, arquitecta con más de quince años de experiencia en el desarrollo de
                  proyectos residenciales de alto estándar.
                </p>
                <p>
                  Desde 2017, su ejercicio profesional ha estado orientado a crear viviendas que
                  conjugan precisión técnica, diseño y habitabilidad. Esa experiencia permitió
                  identificar una constante en el mercado inmobiliario: la ausencia de una asesoría
                  integral y profesional que acompañe a las personas en decisiones tan trascendentes
                  como la compra o venta de su hogar.
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
          {/* === CAMBIO PUNTUAL: contenido + estética del segmento Misión/Visión === */}
          <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
            Propuesta de Valor
          </h2>

          <div className="max-w-4xl">
            <p className="text-black/80 text-[14px] leading-relaxed text-justify">
              Gesswein Properties integra arquitectura, normativa y estrategia comercial para
              gestionar propiedades como verdaderos activos inmobiliarios. A diferencia del corretaje
              tradicional, no nos limitamos a intermediar: analizamos el potencial técnico,
              constructivo y normativo de cada propiedad antes de salir al mercado, anticipamos
              riesgos y diseñamos una estrategia que maximiza su valor real.
            </p>

            <p className="mt-4 text-black/80 text-[14px] leading-relaxed text-justify">
              Nuestro enfoque permite tomar decisiones inmobiliarias con claridad, respaldo
              profesional y control del proceso, reduciendo incertidumbre y elevando el estándar de
              la operación.
            </p>

            <div className="mt-8 border-l-2 border-[#0A2E57]/60 pl-5">
              <p className="text-[#0E2C4A] text-[14px] leading-relaxed">
                No vendemos propiedades como están.
                <br />
                <span className="text-[#0A2E57] font-medium">Las posicionamos como pueden llegar a ser.</span>
              </p>
            </div>

            {/* === NUEVO: POR QUÉ GP === */}
            <div className="mt-12">
              <h3 className="text-[15px] uppercase tracking-[.25em] text-[#0A2E57] mb-4">
                Por qué Gesswein Properties
              </h3>

              <p className="text-black/80 text-[14px] leading-relaxed text-justify">
                Porque el corretaje tradicional intermedia. Nosotros gestionamos activos.
              </p>

              <p className="mt-4 text-black/80 text-[14px] leading-relaxed text-justify">
                En Chile, la mayoría de las corredoras opera con un enfoque transaccional: captación,
                fotos, publicación, coordinación de visitas y negociación. Ese modelo funciona cuando
                la propiedad es simple y el mercado está “fácil”. Pero en propiedades premium —y
                especialmente en activos con complejidad normativa, potencial de transformación o alto
                valor patrimonial— ese enfoque deja valor en la mesa y eleva el riesgo.
              </p>

              <p className="mt-4 text-black/80 text-[14px] leading-relaxed text-justify">
                Gesswein Properties trabaja distinto. Integramos arquitectura aplicada al real estate,
                lo que nos permite analizar, proyectar y ejecutar estrategias de venta o compra con un
                estándar superior.
              </p>

              <div className="mt-8">
                <div className="text-[13px] tracking-[.18em] uppercase text-[#0A2E57] font-semibold">
                  Nosotros vs. corredora tradicional
                </div>

                <div className="mt-5 space-y-8">
                  <div>
                    <div className="text-[#0E2C4A] text-[14px] font-semibold">
                      1) Análisis técnico previo (antes de publicar)
                    </div>
                    <p className="mt-2 text-black/80 text-[14px] leading-relaxed text-justify">
                      Corredora tradicional: toma la propiedad, estima un precio por comparables y la
                      publica. <br />
                      Gesswein Properties: inicia con diagnóstico:
                    </p>
                    <ul className="mt-3 list-disc pl-6 text-black/80 text-[14px] leading-relaxed space-y-1">
                      <li>Lectura normativa y restricciones (qué se puede / qué no se puede hacer)</li>
                      <li>
                        Evaluación de potencial: ampliaciones, remodelación, proyecto nuevo, subdivisión
                        o fusión
                      </li>
                      <li>
                        Identificación de riesgos: constructivos, regulatorios, comerciales y documentales
                      </li>
                      <li>
                        Coherencia financiera: costo/beneficio de intervenir o vender “tal cual”
                      </li>
                    </ul>
                    <p className="mt-3 text-black/80 text-[14px] leading-relaxed text-justify">
                      Resultado: el cliente entiende el activo como inversión patrimonial, no como
                      improvisación de mercado.
                    </p>
                  </div>

                  <div>
                    <div className="text-[#0E2C4A] text-[14px] font-semibold">
                      2) Estrategia comercial basada en valor verificable
                    </div>
                    <p className="mt-2 text-black/80 text-[14px] leading-relaxed text-justify">
                      Corredora tradicional: publica “bonita” y negocia sobre percepciones. <br />
                      Gesswein Properties: posiciona la propiedad con argumentos sólidos:
                    </p>
                    <ul className="mt-3 list-disc pl-6 text-black/80 text-[14px] leading-relaxed space-y-1">
                      <li>Atributos técnicos y comparables bien construidos</li>
                      <li>Segmentación del comprador correcto (no visitas indiscriminadas)</li>
                      <li>Storytelling premium sustentado (no promesas genéricas)</li>
                      <li>Timing y plan de salida a mercado (cuándo conviene, cuándo perjudica)</li>
                    </ul>

                    <div className="mt-4 border-l-2 border-[#0A2E57]/60 pl-5">
                      <p className="text-black/80 text-[14px] leading-relaxed text-justify">
                        <span className="text-[#0A2E57] font-medium">Ejemplo práctico:</span> Una casa en
                        sector prime puede venderse mal si se comunica como “casa antigua” cuando su
                        valor real está en su terreno, cabida o posibilidad de remodelación de alto
                        estándar. Nosotros definimos qué historia es verdadera y rentable: casa para
                        actualizar, terreno para proyecto, o activo mixto con plan de valorización.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="text-[#0E2C4A] text-[14px] font-semibold">
                      3) Valorización real: vender mejor, no solo vender
                    </div>
                    <p className="mt-2 text-black/80 text-[14px] leading-relaxed text-justify">
                      Corredora tradicional: propone ajustes de precio cuando “no hay interés”. <br />
                      Gesswein Properties: propone acciones de valorización cuando hacen sentido:
                    </p>
                    <ul className="mt-3 list-disc pl-6 text-black/80 text-[14px] leading-relaxed space-y-1">
                      <li>Home Staging y preparación técnica de presentación</li>
                      <li>
                        Ajustes concretos de layout, iluminación, paisajismo o materialidad (si aporta
                        retorno)
                      </li>
                      <li>
                        Proyección arquitectónica simple para mostrar “posible futuro” (cuando agrega
                        valor)
                      </li>
                      <li>Corrección de puntos friccionantes: orden documental, claridad normativa, etc.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="text-[#0E2C4A] text-[14px] font-semibold">
                      4) Barrido de mercado completo (incluso fuera de cartera)
                    </div>
                    <p className="mt-2 text-black/80 text-[14px] leading-relaxed text-justify">
                      Corredora tradicional: ofrece lo que tiene publicado. <br />
                      Gesswein Properties: busca lo que el cliente realmente necesita:
                    </p>
                    <ul className="mt-3 list-disc pl-6 text-black/80 text-[14px] leading-relaxed space-y-1">
                      <li>Barridos de mercado por zona, tipología, potencial y restricciones</li>
                      <li>Oportunidades fuera de portales o con baja visibilidad</li>
                      <li>
                        Identificación de terrenos escasos o activos que requieren gestión para liberarse
                      </li>
                    </ul>
                    <p className="mt-3 text-black/80 text-[14px] leading-relaxed text-justify">
                      Esto es clave en clientes exigentes: la operación no se define por “lo que apareció”,
                      sino por lo que calza con el objetivo.
                    </p>
                  </div>

                  <div>
                    <div className="text-[#0E2C4A] text-[14px] font-semibold">
                      5) Acompañamiento integral y gestión de fricciones
                    </div>
                    <p className="mt-2 text-black/80 text-[14px] leading-relaxed text-justify">
                      Corredora tradicional: coordina y deriva (abogado, banco, tasador). <br />
                      Gesswein Properties: acompaña y gestiona:
                    </p>
                    <ul className="mt-3 list-disc pl-6 text-black/80 text-[14px] leading-relaxed space-y-1">
                      <li>Revisión y estudios de títulos (enfoque preventivo)</li>
                      <li>Coordinación de tasaciones profesionales con criterios correctos</li>
                      <li>Asesoría de financiamiento y estructura de compra/venta</li>
                      <li>Gestión de riesgos y obstáculos antes de firmar</li>
                    </ul>

                    <div className="mt-5">
                      <div className="text-[#0A2E57] tracking-[.18em] uppercase text-[12px] font-semibold">
                        Qué obtiene el cliente
                      </div>
                      <ul className="mt-3 list-disc pl-6 text-black/80 text-[14px] leading-relaxed space-y-1">
                        <li>Mayor claridad y control del proceso</li>
                        <li>Menos sorpresas normativas, técnicas o documentales</li>
                        <li>Mejor estrategia de valorización y salida a mercado</li>
                        <li>Negociación con fundamentos, no con presión</li>
                        <li>Un socio técnico-comercial, no solo un intermediario</li>
                      </ul>

                      <p className="mt-4 text-black/80 text-[14px] leading-relaxed text-justify">
                        Gesswein Properties es real estate con estándar profesional. <br />
                        Para clientes que no compran ni venden “a ciegas”.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* === FIN NUEVO: POR QUÉ GP === */}
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <article className="group border border-black/10 bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-6">
                <h3 className="text-[15px] uppercase tracking-[.25em] text-[#0A2E57]">Misión</h3>
                <div className="h-[2px] w-16 bg-[#0A2E57]/70 mt-2" />
              </div>
              <p className="mt-4 text-[13px] text-black/70 leading-relaxed text-justify">
                Gestionar propiedades como activos inmobiliarios, integrando arquitectura, análisis
                normativo y estrategia comercial para maximizar su valor real, reducir riesgos y
                acompañar a nuestros clientes con un estándar profesional superior en cada etapa del
                proceso.
              </p>
            </article>

            <article className="group border border-black/10 bg-white p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-6">
                <h3 className="text-[15px] uppercase tracking-[.25em] text-[#0A2E57]">Visión</h3>
                <div className="h-[2px] w-16 bg-[#0A2E57]/70 mt-2" />
              </div>
              <p className="mt-4 text-[13px] text-black/70 leading-relaxed text-justify">
                Ser la firma boutique de real estate referente en el segmento premium, reconocida
                por elevar el estándar del mercado inmobiliario chileno mediante un enfoque técnico,
                estratégico y orientado a decisiones patrimoniales informadas.
              </p>
            </article>
          </div>
          {/* === FIN CAMBIO PUNTUAL === */}
        </div>
      </section>

      {/* 3) NUESTRA CULTURA — BLANCO */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-12">
            Nuestra Cultura
          </h3>

          <div className="max-w-4xl">
            <div className="text-[#0E2C4A] text-[14px] leading-relaxed space-y-4 text-justify">
              <p className="text-[#0A2E57] font-semibold">
                Arquitectura aplicada al Real Estate
              </p>
              <p>
                En real estate, la diferencia no está en “publicar bien”. <br />
                La diferencia está en entender el activo.
              </p>
              <p>
                Creemos que una propiedad no es una foto, ni un metraje, ni un precio sugerido. Una
                propiedad es un conjunto de variables: normativa, emplazamiento, condición
                constructiva, posibilidad de ampliación, cabida, restricciones, costos, mercado
                objetivo, financiamiento y timing. Y es la gestión inteligente de esas variables lo
                que define si una operación termina en un buen resultado o en una venta a la baja,
                lenta o llena de fricciones.
              </p>
              <p>
                Gesswein Properties existe para elevar el estándar del corretaje. No somos una
                corredora tradicional: somos una firma boutique que integra arquitectura, desarrollo
                inmobiliario, normativa y estrategia comercial para que comprar, vender o transformar
                un activo sea un proceso claro, controlado y profesional.
              </p>
              <p className="text-[#0A2E57] font-semibold">Lo que defendemos</p>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {CULTURE.map((c) => (
              <article
                key={c.title}
                className="border border-black/10 bg-white p-7 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 border border-black/10 flex items-center justify-center shrink-0">
                    <c.icon className="h-6 w-6 text-[#0A2E57]" />
                  </div>
                  <div>
                    <h4 className="text-[13px] tracking-[.18em] uppercase text-black/90">
                      {c.title}
                    </h4>
                    <p className="text-[13px] text-black/70 mt-2 leading-relaxed text-justify">
                      {c.text}
                    </p>
                  </div>
                </div>
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

      {/* === CAMBIO PUNTUAL: eliminado el segmento "¿Quieres trabajar con nosotros?" === */}
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

  const initialXRef = useRef<number[]>([]);
  const firstXRef = useRef<number>(0);

  const DURATION = 450;
  const EASING = 'cubic-bezier(.22,.61,.36,1)';

  const [panelDims, setPanelDims] = useState<{ left: number; width: number; height: number }>({
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    function computeLayout() {
      const grid = gridRef.current;
      if (!grid) return;
      const gridRect = grid.getBoundingClientRect();
      const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-team-card]'));
      if (!cards.length) return;

      const firstRect = cards[0].getBoundingClientRect();
      firstXRef.current = Math.round(firstRect.left - gridRect.left);

      initialXRef.current = cards.map((el) => {
        const r = el.getBoundingClientRect();
        return Math.round(r.left - gridRect.left);
      });

      const left = Math.round(firstRect.right - gridRect.left);
      const width = Math.max(0, Math.round(gridRect.width - (firstRect.right - gridRect.left)));
      const height = Math.round(firstRect.height);
      setPanelDims({ left, width, height });
    }

    computeLayout();

    const ro = new ResizeObserver(() => computeLayout());
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener('resize', computeLayout);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeLayout);
    };
  }, [active]);

  function setGridInteractivity(blocked: boolean) {
    const grid = gridRef.current;
    if (!grid) return;
    grid.style.pointerEvents = blocked ? 'none' : 'auto';
  }

  function closePanel() {
    if (isTransitioning) return;
    const i = activeIdxRef.current;
    const floater = floaterRef.current;
    setIsTransitioning(true);
    setGridInteractivity(true);

    if (window.matchMedia('(max-width: 767px)').matches) {
      setActive(null);
      activeIdxRef.current = null;
      setIsTransitioning(false);
      setGridInteractivity(false);
      return;
    }

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

  function openMember(i: number) {
    if (isTransitioning) return;

    if (active === i) {
      closePanel();
      return;
    }

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
    (clone.querySelector('[data-overlay]') as HTMLDivElement | null)?.style.setProperty(
      'opacity',
      '0'
    );
    clone.addEventListener('click', closePanel);

    grid.appendChild(clone);

    src.style.visibility = 'hidden';
    dst.style.visibility = 'hidden';

    floaterRef.current = clone;
    activeIdxRef.current = i;

    Array.from(grid.querySelectorAll<HTMLElement>('[data-team-card]')).forEach((el, idx) => {
      if (idx !== i && idx !== 0) {
        el.style.transition = 'opacity 200ms ease';
        el.style.opacity = '0.35';
      }
    });

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
    const parts = roleLine
      .split('·')
      .map((s) => s.trim())
      .filter(Boolean);
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
      <div ref={gridRef} className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
        {team.map((m, i) => {
          const r = splitRole(m.roleLine);
          return (
            <div
              key={m.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-team-card
              className="relative group cursor-pointer select-none transition-opacity"
              onClick={() => openMember(i)}
              aria-expanded={active === i}
            >
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

              <div
                data-overlay
                className="hidden md:flex absolute inset-0 bg-[#0A2E57]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex-col justify-end p-6 pointer-events-none"
              >
                <h3 className="text-white text-lg font-semibold">{m.name}</h3>

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

                <p className="text-white/85 text-xs mt-2 line-clamp-2">{m.bioShort}</p>
              </div>

              <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${
                  active === i ? 'max-h-[800px] opacity-100 mt-3' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="w-full bg-[#EAEAEA] p-5 border border-black/10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-semibold text-[#0E2C4A]">{m.name}</h4>

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
                    </div>

                    <div className="shrink-0 pt-1">
                      <ContactIcons m={m} />
                    </div>
                  </div>

                  <p className="mt-4 text-[14px] text-[#0E2C4A] text-justify">{m.bioDetail[0]}</p>

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
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {active !== null &&
          (() => {
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
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="text-3xl font-semibold">{team[active].name}</h3>

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
                    </div>

                    <div className="shrink-0 pt-1">
                      <ContactIcons m={team[active]} />
                    </div>
                  </div>

                  <div className="mt-6 flex-1 min-h-0 overflow-y-auto pr-4">
                    <p className="text-[15px] leading-relaxed text-justify">{team[active].bioDetail[0]}</p>

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
                  </div>
                </div>
              </div>
            );
          })()}
      </div>
    </div>
  );
}
