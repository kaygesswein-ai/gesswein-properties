// project/app/api/propiedades/route.ts
import { NextResponse } from 'next/server';
import { supaRest } from '@/lib/supabase-rest';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const qs = new URLSearchParams();

    // Campos a seleccionar
    qs.set('select', [
      'id',
      'slug',
      'operacion',
      'tipo',
      'comuna',
      'region',
      'titulo',
      'descripcion',
      'precio_uf',
      'precio_clp',
      'superficie_util_m2',
      'superficie_terreno_m2',
      'dormitorios',
      'banos',
      'estacionamientos',
      'imagenes',
      'created_at',
    ].join(','));

    // Filtros básicos
    const operacion = searchParams.get('operacion')?.toLowerCase();
    const tipo = searchParams.get('tipo');
    const region = searchParams.get('region');
    const comuna = searchParams.get('comuna');
    const barrio = searchParams.get('barrio'); // por si más adelante lo agregas en la tabla

    if (operacion) qs.set('operacion', `eq.${operacion}`);
    if (tipo)      qs.set('tipo',      `ilike.*${tipo}*`);
    if (region)    qs.set('region',    `ilike.*${region}*`);
    if (comuna)    qs.set('comuna',    `ilike.*${comuna}*`);
    if (barrio)    qs.set('barrio',    `ilike.*${barrio}*`); // solo si esa columna existe

    // Rango de precios en UF / CLP
    const minUF  = searchParams.get('minUF');
    const maxUF  = searchParams.get('maxUF');
    const minCLP = searchParams.get('minCLP');
    const maxCLP = searchParams.get('maxCLP');

    if (minUF)  qs.set('precio_uf',  `gte.${minUF}`);
    if (maxUF)  qs.set('precio_uf',  `${qs.get('precio_uf') ? qs.get('precio_uf') + ',' : ''}lte.${maxUF}`);
    if (minCLP) qs.set('precio_clp', `gte.${minCLP}`);
    if (maxCLP) qs.set('precio_clp', `${qs.get('precio_clp') ? qs.get('precio_clp') + ',' : ''}lte.${maxCLP}`);

    // Otros mínimos
    const minDorm       = searchParams.get('minDorm');
    const minBanos      = searchParams.get('minBanos');
    const minM2Const    = searchParams.get('minM2Const');
    const minM2Terreno  = searchParams.get('minM2Terreno');
    const minEstac      = searchParams.get('minEstac');

    if (minDorm)      qs.set('dormitorios',          `gte.${minDorm}`);
    if (minBanos)     qs.set('banos',                `gte.${minBanos}`);
    if (minM2Const)   qs.set('superficie_util_m2',   `gte.${minM2Const}`);
    if (minM2Terreno) qs.set('superficie_terreno_m2',`gte.${minM2Terreno}`);
    if (minEstac)     qs.set('estacionamientos',     `gte.${minEstac}`);

    // Búsqueda de texto libre (título/descripcion)
    const q = searchParams.get('q');
    if (q) {
      qs.set('or', `(titulo.ilike.*${q}*,descripcion.ilike.*${q}*)`);
    }

    // Orden y límite
    qs.set('order', 'created_at.desc');
    const limit = parseInt(searchParams.get('limit') || '60', 10);
    qs.set('limit', String(Number.isFinite(limit) ? limit : 60));

    const res = await supaRest(`propiedades?${qs.toString()}`, { cache: 'no-store' });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json({ error: body || 'Supabase error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 });
  }
}
