// project/app/api/propiedades/route.ts
import { NextResponse } from 'next/server';
import { featuredItems } from '../../../lib/featured';

export const dynamic = 'force-dynamic';

/** Tipo local que usa la API (operacion en MAYÚSCULAS) */
type Prop = {
  id: string;
  titulo: string;
  comuna: string;
  region: string;
  operacion: 'Venta' | 'Arriendo';
  tipo: 'Casa' | 'Departamento' | 'Oficina' | 'Bodega' | 'Local comercial' | 'Terreno';
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios: number;
  banos: number;
  superficie_util_m2: number;
  superficie_terreno_m2?: number | null;
  estacionamientos?: number | null;
  coverImage: string;
  destacada?: boolean;
};

function makeId(prefix: string, n: number) {
  return `${prefix}-${String(n).padStart(2, '0')}`;
}

/** Genera 30 publicaciones no destacadas */
function buildExtras(): Prop[] {
  const tipos: Prop['tipo'][] = [
    'Casa',
    'Departamento',
    'Oficina',
    'Bodega',
    'Local comercial',
    'Terreno',
  ];
  const comunas = [
    'Las Condes',
    'Providencia',
    'Vitacura',
    'Lo Barnechea',
    'Ñuñoa',
    'Santiago',
    'La Reina',
    'Huechuraba',
    'Maipú',
    'Puente Alto',
    'Colina',
    'Lampa',
  ];

  // Catálogo de fotos coherentes
  const imgs = [
    // depto/casa
    'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8b?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop',
    // oficina
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop',
    // local comercial
    'https://images.unsplash.com/photo-1529429612777-085003f2322f?q=80&w=1600&auto=format&fit=crop',
    // bodega/industrial
    'https://images.unsplash.com/photo-1565200002231-9f1f39b6d6b8?q=80&w=1600&auto=format&fit=crop',
    // terreno/exterior
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
  ];

  const arr: Prop[] = [];
  for (let i = 1; i <= 30; i++) {
    const tipo = tipos[i % tipos.length];
    const comuna = comunas[i % comunas.length];
    const operacion: Prop['operacion'] = i % 5 === 0 ? 'Arriendo' : 'Venta';

    const dormitorios =
      tipo === 'Oficina' || tipo === 'Bodega' || tipo === 'Local comercial' || tipo === 'Terreno'
        ? 0
        : 1 + (i % 4);
    const banos = tipo === 'Terreno' ? 0 : 1 + (i % 3);
    const m2 = 45 + ((i * 7) % 160);

    const precioUF =
      tipo === 'Terreno'
        ? 3500 + ((i * 70) % 6000)
        : tipo === 'Oficina'
        ? 2500 + ((i * 40) % 3500)
        : 4500 + ((i * 120) % 22000);

    arr.push({
      id: makeId('pub', i),
      titulo:
        tipo === 'Casa'
          ? `Casa en ${comuna} #${i}`
          : tipo === 'Departamento'
          ? `Departamento en ${comuna} #${i}`
          : tipo === 'Terreno'
          ? `Terreno en ${comuna} #${i}`
          : `${tipo} en ${comuna} #${i}`,
      comuna,
      region: 'Metropolitana de Santiago',
      operacion,
      tipo,
      precio_uf: precioUF,
      precio_clp: null,
      dormitorios,
      banos,
      superficie_util_m2: m2,
      superficie_terreno_m2: tipo === 'Terreno' ? m2 * (10 + (i % 20)) : null,
      coverImage: imgs[i % imgs.length],
      destacada: false,
    });
  }
  return arr;
}

function toOperacionTitleCase(v: unknown): 'Venta' | 'Arriendo' {
  const s = String(v || '').toLowerCase();
  return s === 'arriendo' ? 'Arriendo' : 'Venta';
}

export async function GET() {
  const arr: Prop[] = [];

  // 1) Inyectamos las 3 destacadas normalizando a MAYÚSCULAS
  featuredItems.forEach((f) => {
    arr.push({
      id: f.id,
      titulo: f.titulo,
      comuna: f.comuna,
      region: (f as any).region || 'Metropolitana de Santiago',
      operacion: toOperacionTitleCase((f as any).operacion),
      tipo: f.tipo as Prop['tipo'],
      precio_uf: f.precio_uf ?? null,
      precio_clp: f.precio_clp ?? null,
      dormitorios: (f as any).dormitorios ?? 0,
      banos: (f as any).banos ?? 0,
      superficie_util_m2: (f as any).superficie_util_m2 ?? 0,
      superficie_terreno_m2: (f as any).superficie_terreno_m2 ?? null,
      estacionamientos: (f as any).estacionamientos ?? null,
      coverImage: f.coverImage,
      destacada: true,
    });
  });

  // 2) Agregamos 30 publicaciones (no destacadas)
  arr.push(...buildExtras());

  return NextResponse.json({ ok: true, items: arr });
}
