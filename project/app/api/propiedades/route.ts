// project/app/api/propiedades/route.ts
import { NextResponse } from 'next/server';
import { featuredItems } from '../../../lib/featured';

export const dynamic = 'force-dynamic';

type Prop = {
  id: string;
  titulo: string;
  comuna: string;
  region: string;
  operacion: 'venta' | 'arriendo';
  tipo:
    | 'Casa'
    | 'Departamento'
    | 'Oficina'
    | 'Local comercial'
    | 'Terreno'
    | 'Bodega';
  precio_uf: number;
  precio_clp?: number | null;
  dormitorios: number | null;
  banos: number | null;
  superficie_util_m2: number | null;
  estacionamientos?: number | null;
  coverImage: string;
  destacada?: boolean;
};

const UF_PROMO = 37000; // para calcular CLP de ejemplo

// Catálogo de imágenes por tipo (todas válidas y coherentes)
const IMGS = {
  Departamento: [
    'https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8f?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499914485622-a88fac536970?q=80&w=1600&auto=format&fit=crop',
  ],
  Casa: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop',
  ],
  Oficina: [
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516501135721-40c50d719a9a?q=80&w=1600&auto=format&fit=crop',
  ],
  'Local comercial': [
    'https://images.unsplash.com/photo-1515165562835-c3b8c1ea0f53?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515168833906-d2a3b82b302c?q=80&w=1600&auto=format&fit=crop',
  ],
  Terreno: [
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495748191008-71e3a4c9d48d?q=80&w=1600&auto=format&fit=crop',
  ],
  Bodega: [
    'https://images.unsplash.com/photo-1586521995568-39ef21b1a470?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586521995589-61f8e4b6213b?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1600&auto=format&fit=crop',
  ],
};

const COMUNAS = [
  'Vitacura',
  'Providencia',
  'Lo Barnechea',
  'Las Condes',
  'Ñuñoa',
  'Santiago',
  'La Reina',
  'Huechuraba',
  'Colina',
  'Maipú',
] as const;

const pick = <T,>(arr: T[], i: number) => arr[i % arr.length];

function genProps(): Prop[] {
  const arr: Prop[] = [];

  // 1) Las 3 destacadas vienen desde lib/featured para asegurar misma foto/datos
  featuredItems.forEach((f) =>
    arr.push({
      ...f,
      region: 'Metropolitana de Santiago',
    })
  );

  // 2) +27 propiedades no destacadas
  let idx = 0;
  const tiposPool: Prop['tipo'][] = [
    'Departamento',
    'Casa',
    'Oficina',
    'Local comercial',
    'Terreno',
    'Bodega',
  ];

  while (arr.length < 30) {
    const tipo = pick(tiposPool, idx) as Prop['tipo'];
    const comuna = pick([...COMUNAS], idx);
    const operacion: Prop['operacion'] = idx % 3 === 0 ? 'arriendo' : 'venta';

    // título más descriptivo
    const tituloBase =
      tipo === 'Departamento'
        ? `Departamento luminoso en ${comuna}`
        : tipo === 'Casa'
        ? `Casa en ${comuna}`
        : tipo === 'Oficina'
        ? `Oficina en ${comuna}`
        : tipo === 'Local comercial'
        ? `Local comercial en ${comuna}`
        : tipo === 'Terreno'
        ? `Terreno en ${comuna}`
        : `Bodega en ${comuna}`;

    // dimensiones y atributos
    const m2 =
      tipo === 'Terreno'
        ? 550 + (idx % 9) * 60
        : tipo === 'Bodega'
        ? 140
        : 60 + (idx % 3) * 20;

    const dormitorios =
      tipo === 'Departamento' || tipo === 'Casa'
        ? 1 + (idx % 4)
        : tipo === 'Oficina' || tipo === 'Local comercial'
        ? 0
        : null;

    const banos =
      tipo === 'Terreno' || tipo === 'Bodega' ? null : tipo === 'Casa' || tipo === 'Departamento'
      ? 1 + (idx % 2)
      : 1;

    const estacionamientos =
      tipo === 'Departamento' ||
      tipo === 'Casa' ||
      tipo === 'Oficina' ||
      tipo === 'Local comercial'
        ? (idx % 3) // 0..2
        : null;

    const uf = 3500 + (idx % 12) * 160;

    arr.push({
      id: `prop-${idx}`,
      titulo: `${tituloBase} #${idx + 1}`,
      comuna,
      region: 'Metropolitana de Santiago',
      operacion,
      tipo,
      precio_uf: uf,
      precio_clp: Math.round(uf * UF_PROMO),
      dormitorios,
      banos,
      superficie_util_m2: m2,
      estacionamientos,
      coverImage: pick(IMGS[tipo], idx),
      destacada: false,
    });

    idx++;
  }

  return arr;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (s: string) => url.searchParams.get(s) || '';
  const list = genProps();

  // -------- filtros --------
  let out = list.slice();

  const destacada = q('destacada');
  if (destacada) out = out.filter((p) => String(!!p.destacada) === destacada);

  const operacion = q('operacion').toLowerCase();
  if (operacion) out = out.filter((p) => p.operacion.toLowerCase() === operacion);

  const tipo = q('tipo').toLowerCase();
  if (tipo) out = out.filter((p) => p.tipo.toLowerCase() === tipo);

  const region = q('region').toLowerCase();
  if (region) out = out.filter((p) => p.region.toLowerCase().includes(region));

  const comuna = q('comuna').toLowerCase();
  if (comuna) out = out.filter((p) => p.comuna.toLowerCase().includes(comuna));

  const barrio = q('barrio'); // placeholder (sin barrios en este mock)
  if (barrio) out = [];

  const minUF = parseInt(q('minUF') || '0', 10);
  const maxUF = parseInt(q('maxUF') || '0', 10);
  if (minUF) out = out.filter((p) => p.precio_uf >= minUF);
  if (maxUF) out = out.filter((p) => p.precio_uf <= maxUF);

  const qtext = q('q').trim().toLowerCase();
  if (qtext) out = out.filter((p) => p.titulo.toLowerCase().includes(qtext));

  return NextResponse.json({ data: out }, { status: 200 });
}
