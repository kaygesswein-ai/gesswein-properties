// app/api/propiedades/route.ts
import { NextResponse } from 'next/server';
import { supaRest } from '@/lib/supabase-rest';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const qs = new URLSearchParams();

    // base
    qs.set('select', '*');
    // orden más nuevo primero
    qs.set('order', 'created_at.desc');
    // paginación opcional
    const limit = searchParams.get('limit') || '60';
    qs.set('limit', limit);

    // filtros básicos que ya usa tu UI (si no vienen, no se aplican)
    const setEq = (key: string, param: string) => {
      const v = searchParams.get(param);
      if (v) qs.set(key, `eq.${v}`);
    };
    setEq('operacion', 'operacion');
    setEq('tipo', 'tipo');
    setEq('region', 'region');
    setEq('comuna', 'comuna');

    // rangos por UF (minUF/maxUF) usados por tu UI
    const minUF = searchParams.get('minUF');
    const maxUF = searchParams.get('maxUF');
    if (minUF) qs.set('precio_uf', `gte.${minUF}`);
    if (maxUF) qs.append('precio_uf', `lte.${maxUF}`);

    // nota: la vista ya oculta no publicados
    const res = await supaRest(`propiedades_api?${qs.toString()}`);
    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err || 'Error consultando propiedades' }, { status: 500 });
    }
    const data = await res.json();
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 });
  }
}
