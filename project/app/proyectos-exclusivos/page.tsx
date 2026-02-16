// project/app/proyectos-exclusivos/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Tag,
  Percent,
  RefreshCcw,
  Building2,
  X,
} from 'lucide-react';

/** =========================
 *  Tipos
 *  ========================= */
type ProjectSeal = 'flipping' | 'bajo_mercado' | 'novacion' | 'densificacion';

type Proyecto = {
  id: string;
  titulo: string;
  operacion: string | null;
  tipo: string | null;
  region: string | null;
  comuna: string | null;
  barrio: string | null;
  precio_uf: number | null;
  sello_tipo: ProjectSeal | null;
  tasa_novacion: number | null;
  publicado: boolean | null;
  created_at?: string | null;
};

/** =========================
 *  Meta Sellos (UI)
 *  ========================= */
const sealMeta: Record<
  ProjectSeal,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    short: string;
    description: string;
    examples?: string[];
    showRate?: boolean;
  }
> = {
  bajo_mercado: {
    label: 'Bajo mercado',
    icon: Tag,
    short: 'Precio bajo comparables relevantes o condición excepcional.',
    description:
      'Un activo “bajo mercado” se ofrece por debajo de su valor de mercado observado en comparables cercanos (ventas/arriendos similares) o por una condición específica que abre una oportunidad. No reemplaza el análisis: exige revisar motivo, timing, liquidez y riesgos.',
    examples: [
      'Venta rápida por necesidad de liquidez.',
      'Precio atractivo por trabajo de regularización pendiente.',
      'Oportunidad off-market con ventana corta.',
    ],
  },
  novacion: {
    label: 'Innovación (tasa)',
    icon: Percent,
    short: 'Tasa visible en el sello: oportunidad asociada a condiciones financieras específicas.',
    description:
      'La “innovación (tasa)” señala que el negocio incorpora una condición financiera destacable (por ejemplo, una tasa heredada o condiciones de crédito asociadas a una modificación/novación del financiamiento existente). Es un sello para detectar oportunidades donde la estructura financiera mueve el resultado.',
    examples: [
      'Tasa heredada en una operación específica (p.ej. tasa preferente por estructura previa).',
      'Condiciones bancarias especiales sujetas a requisitos concretos.',
      'Estructuras con fijación/ajuste de tasa que cambian el flujo total.',
    ],
    showRate: true,
  },
  flipping: {
    label: 'Flipping',
    icon: RefreshCcw,
    short: 'Potencial de revalorización por mejora, regularización o reposicionamiento.',
    description:
      'Flipping es una estrategia de compra con foco en crear valor (mejoras, regularizaciones o reposicionamiento) para vender posteriormente. Este sello indica que el activo tiene variables “accionables” que podrían mejorar precio, velocidad de venta o perfil de comprador.',
    examples: [
      'Remodelación focalizada (cocina/baños) para subir ticket.',
      'Regularización DOM / recepción / subdivisión documental.',
      'Reposicionamiento comercial (staging + pricing + timing).',
    ],
  },
  densificacion: {
    label: 'Densificación',
    icon: Building2,
    short: 'Potencial normativo/constructivo para mayor intensidad, desarrollo o cabida.',
    description:
      'Densificación indica potencial de aumentar intensidad de uso o capacidad del suelo/activo (según normativa y factibilidad). No es “hacer más metros” a ciegas: implica cabida, restricciones, costos, permisos, tiempos y mercado objetivo.',
    examples: [
      'Subdivisiones (cuando la normativa y el predio lo permiten).',
      'Condominios / conjuntos con reorganización del suelo.',
      'Ampliaciones o nuevas unidades dentro de la cabida permitida.',
    ],
  },
};

function formatUF(value: number | null | undefined) {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString('es-CL', { maximumFractionDigits: 0 }) + ' UF';
}

function toQuery(params: Record<string, string | undefined | null>) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && v.trim() !== '') sp.set(k, v.trim());
  });
  return sp.toString();
}

/** =========================
 *  Página
 *  ========================= */
export default function ProyectosExclusivosPage() {
  // filtros
  const [modo, setModo] = useState<'rapida' | 'avanzada'>('rapida');

  const [operacion, setOperacion] = useState<string>('');
  const [tipo, setTipo] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [comuna, setComuna] = useState<string>('');
  const [barrio, setBarrio] = useState<string>('');
  const [moneda, setMoneda] = useState<'UF' | 'CLP'>('UF');
  const [min, setMin] = useState<string>('');
  const [max, setMax] = useState<string>('');

  // data
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Proyecto[]>([]);
  const [error, setError] = useState<string>('');

  const query = useMemo(() => {
    return toQuery({
      publicado: 'true',
      operacion,
      tipo,
      region,
      comuna,
      barrio,
      moneda,
      min,
      max,
    });
  }, [operacion, tipo, region, comuna, barrio, moneda, min, max]);

  async function fetchProjects() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/proyectos?${query}`, { cache: 'no-store' });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Error cargando proyectos');
      }
      const data = (await res.json()) as { projects?: Proyecto[]; data?: Proyecto[] };
      const list = (data.projects ?? data.data ?? []) as Proyecto[];
      setItems(list);
    } catch (e: any) {
      setError(e?.message || 'Error inesperado');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function clearFilters() {
    setOperacion('');
    setTipo('');
    setRegion('');
    setComuna('');
    setBarrio('');
    setMoneda('UF');
    setMin('');
    setMax('');
  }

  return (
    <main className="bg-white">
      {/* ================= HERO (igual a Servicios / Propiedades) ================= */}
      <section className="relative min-h-[100svh]">
        <img
          src="https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/Foto%20portada%20-%20Oportunidades%20Exclusivas%20-%20OPTIMIZADA.jpg"
          alt="Portada Proyectos Exclusivos"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 55%' }}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pl-2 sm:pl-4">
              <div className="max-w-3xl">
                <h1 className="text-white text-3xl md:text-4xl uppercase tracking-[0.25em]">
                  PROYECTOS EXCLUSIVOS
                </h1>
                <p className="text-white/85 mt-2">
                  Activos fuera del circuito tradicional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTRO (mismo estilo de títulos) ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4 max-w-4xl">
            <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium mb-6">
              Activos fuera del circuito tradicional
            </h2>

            <div className="space-y-4 text-black/70 text-[14px] leading-relaxed">
              <p>
                No todas las oportunidades inmobiliarias llegan al mercado abierto. Algunas requieren criterio técnico,
                red estratégica y capacidad de estructuración.
              </p>
              <p>
                En esta sección presentamos activos singulares y proyectos especiales que, por su modelo de negocio,
                oportunidad financiera o particularidad normativa, se gestionan bajo un esquema diferenciado y, en muchos casos,
                con absoluta confidencialidad.
              </p>
              <p>
                Aquí encontrarás alternativas que no compiten en el mercado masivo: operaciones estructuradas, oportunidades
                de <em>flipping</em> con fundamento técnico, activos bajo valor de mercado y activos con potencial de densificación o desarrollo.
              </p>
              <p>
                Cada oportunidad es previamente analizada desde su viabilidad normativa, potencial constructivo, escenario de valorización
                y riesgos asociados.
              </p>
              <p>
                El acceso a esta sección es limitado y su disponibilidad cambia constantemente según oportunidades reales detectadas y gestionadas
                por nuestro equipo.
              </p>
            </div>

            <div className="mt-10 h-px w-full bg-black/10" />
          </div>
        </div>
      </section>

      {/* ================= BÚSQUEDA (mismo look) ================= */}
      <section className="pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pl-2 sm:pl-4">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div className="max-w-3xl">
                <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
                  Búsqueda
                </h2>
                <p className="text-black/70 text-[14px] leading-relaxed mt-3">
                  Filtra por operación, ubicación y rango de precio. En búsqueda avanzada puedes afinar el resultado con mayor precisión.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModo('rapida')}
                  className={[
                    'px-4 py-2 border text-[12px] uppercase tracking-[.25em] transition',
                    modo === 'rapida'
                      ? 'border-[#0A2E57] text-[#0A2E57] bg-[#0A2E57]/5'
                      : 'border-black/15 text-black/60 hover:text-black hover:border-black/30',
                  ].join(' ')}
                >
                  Búsqueda rápida
                </button>

                <button
                  type="button"
                  onClick={() => setModo('avanzada')}
                  className={[
                    'px-4 py-2 border text-[12px] uppercase tracking-[.25em] transition inline-flex items-center gap-2',
                    modo === 'avanzada'
                      ? 'border-[#0A2E57] text-[#0A2E57] bg-[#0A2E57]/5'
                      : 'border-black/15 text-black/60 hover:text-black hover:border-black/30',
                  ].join(' ')}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Avanzada
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="mt-8 border border-black/10 bg-white">
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <Select
                    label="Operación"
                    value={operacion}
                    onChange={setOperacion}
                    options={[
                      { value: '', label: 'Todas' },
                      { value: 'venta', label: 'Venta' },
                      { value: 'arriendo', label: 'Arriendo' },
                    ]}
                  />
                  <Input label="Tipo de propiedad" value={tipo} onChange={setTipo} placeholder="Ej: Departamento" />
                  <Input label="Región" value={region} onChange={setRegion} placeholder="Ej: Metropolitana de Santiago" />
                  <Input label="Comuna" value={comuna} onChange={setComuna} placeholder="Ej: Las Condes" />
                  <Input label="Barrio" value={barrio} onChange={setBarrio} placeholder="Ej: El Golf" />
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-3">
                  <Select
                    label="Moneda"
                    value={moneda}
                    onChange={(v) => setMoneda((v as 'UF' | 'CLP') || 'UF')}
                    options={[
                      { value: 'UF', label: 'UF' },
                      { value: 'CLP', label: 'CLP' },
                    ]}
                  />
                  <Input label="Min" value={min} onChange={setMin} placeholder={moneda === 'UF' ? 'Ej: 8000' : 'Ej: 250000000'} />
                  <Input label="Max" value={max} onChange={setMax} placeholder={moneda === 'UF' ? 'Ej: 15000' : 'Ej: 600000000'} />

                  <div className="md:col-span-2 flex items-end gap-3">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-black/20 text-[12px] uppercase tracking-[.25em] hover:bg-black/5 transition"
                    >
                      <X className="h-4 w-4" />
                      Limpiar
                    </button>

                    <button
                      type="button"
                      onClick={fetchProjects}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#0A2E57] bg-[#0A2E57] text-white text-[12px] uppercase tracking-[.25em] hover:bg-[#0A2E57]/90 transition"
                    >
                      <Search className="h-4 w-4" />
                      Buscar
                    </button>
                  </div>
                </div>

                {modo === 'avanzada' ? (
                  <div className="mt-4 text-[13px] text-black/60 leading-relaxed border-t border-black/10 pt-4">
                    Búsqueda avanzada activa: agrega detalles con precisión (por ejemplo, “Departamento”, “El Golf”, “Vitacura”),
                    y combina con rango de precio para acotar resultados.
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* ================= GLOSARIO DE SELLOS (mismo look) ================= */}
          <div className="pl-2 sm:pl-4 mt-14">
            <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
              Glosario de sellos
            </h2>
            <p className="text-black/70 text-[14px] leading-relaxed mt-3 max-w-4xl">
              Cada proyecto puede incluir un sello de lectura rápida. Estos sellos no reemplazan el análisis: lo sintetizan.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <SealCard seal="bajo_mercado" />
              <SealCard seal="novacion" />
              <SealCard seal="flipping" />
              <SealCard seal="densificacion" />
            </div>

            <div className="mt-12 h-px w-full bg-black/10" />
          </div>

          {/* ================= PROYECTOS DISPONIBLES ================= */}
          <div className="pl-2 sm:pl-4 mt-14">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <h2 className="text-[#0A2E57] text-[17px] tracking-[.28em] uppercase font-medium">
                  Proyectos disponibles
                </h2>
                <p className="text-black/70 text-[14px] leading-relaxed mt-3">
                  Resultados según tu filtro actual.
                </p>
              </div>
            </div>

            {/* list */}
            <div className="mt-8">
              {loading ? (
                <div className="text-black/60 text-[14px]">Cargando proyectos…</div>
              ) : error ? (
                <div className="text-red-600 text-[14px]">{error}</div>
              ) : items.length === 0 ? (
                <div className="text-black/60 text-[14px]">No se encontraron proyectos.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
                  {items.map((p) => (
                    <ProjectCard key={p.id} p={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/** =========================
 *  UI Components
 *  ========================= */
function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase mb-2">
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 border border-black/15 text-[13px] outline-none focus:border-[#0A2E57]/60"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase mb-2">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 border border-black/15 text-[13px] bg-white outline-none focus:border-[#0A2E57]/60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SealCard({ seal }: { seal: ProjectSeal }) {
  const meta = sealMeta[seal];
  const Icon = meta.icon;

  return (
    <div className="border border-black/10 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="mt-[2px] h-9 w-9 border border-black/10 bg-white flex items-center justify-center">
          <Icon className="h-5 w-5 text-[#0A2E57]" />
        </div>
        <div className="min-w-0">
          <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
            {meta.label}
          </div>
          <div className="mt-1 text-[13px] text-black/70 leading-relaxed">
            {meta.short}
          </div>
          <div className="mt-3 text-[13px] text-black/70 leading-relaxed">
            {meta.description}
          </div>
          {meta.examples?.length ? (
            <ul className="mt-3 space-y-1.5 text-[13px] text-black/70 leading-relaxed">
              {meta.examples.map((ex) => (
                <li key={ex} className="pl-3 relative">
                  <span className="absolute left-0 top-[9px] h-[5px] w-[5px] bg-[#0A2E57]" />
                  {ex}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ p }: { p: Proyecto }) {
  const seal = p.sello_tipo || null;
  const meta = seal ? sealMeta[seal] : null;

  return (
    <Link
      href={`/proyectos-exclusivos/${p.id}`}
      className="group block border border-black/10 bg-white shadow-sm hover:shadow-md transition"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Placeholder visual (si luego quieres imagen por proyecto, lo conectamos) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center opacity-95 group-hover:scale-[1.02] transition-transform duration-300" />

        {/* Sello / badge estético (arriba-derecha, circular) */}
        <SealBadge tipo={seal} tasa={p.tasa_novacion} />
      </div>

      <div className="p-5">
        <div className="text-[#0A2E57] text-[11px] tracking-[.25em] uppercase">
          {p.operacion ? p.operacion.toUpperCase() : '—'}
        </div>

        <h3 className="mt-1 text-[15px] text-black/90 leading-snug">
          {p.titulo}
        </h3>

        <div className="mt-3 text-[13px] text-black/70 leading-relaxed">
          <div>
            {[
              p.tipo,
              p.barrio,
              p.comuna,
              p.region,
            ]
              .filter(Boolean)
              .join(' · ') || '—'}
          </div>
          <div className="mt-2 text-black/85">
            {formatUF(p.precio_uf)}
          </div>

          {meta ? (
            <div className="mt-3 inline-flex items-center gap-2 text-black/70">
              <meta.icon className="h-4 w-4 text-[#0A2E57]" />
              <span className="text-[12.5px]">{meta.label}</span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

/** Badge sin comparar con '' (corrige el error TS del build) */
function SealBadge({ tipo, tasa }: { tipo: ProjectSeal | null; tasa?: number | null }) {
  if (!tipo) return null;
  const meta = sealMeta[tipo];
  if (!meta) return null;

  const showRate = tipo === 'novacion' && typeof tasa === 'number';

  return (
    <div className="absolute top-3 right-3">
      <div
        className={[
          'rounded-full border border-white/70 bg-white/90 backdrop-blur-sm shadow-sm',
          'px-3 py-2 min-w-[92px] text-center',
        ].join(' ')}
      >
        <div className="text-[#0A2E57] text-[10px] tracking-[.22em] uppercase leading-none">
          {meta.label}
        </div>

        {showRate ? (
          <div className="mt-1 text-[#0A2E57] font-medium text-[14px] leading-none">
            {tasa!.toFixed(1)}%
          </div>
        ) : (
          <div className="mt-1 text-black/70 text-[12px] leading-none">
            Sello
          </div>
        )}
      </div>
    </div>
  );
}
