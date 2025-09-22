import { NextResponse } from 'next/server';

let cached: { value: number; at: number } | null = null;
const TTL_MS = 12 * 60 * 60 * 1000; // 12h

export async function GET() {
  try {
    if (cached && Date.now() - cached.at < TTL_MS) {
      return NextResponse.json({ uf: cached.value });
    }

    // Consulta servidor-a-servidor (evita CORS en el cliente)
    const r = await fetch('https://mindicador.cl/api/uf', {
      // revalidate extra por si Next decide cachear
      next: { revalidate: 43200 }, // 12h
    });
    if (!r.ok) throw new Error('UF fetch failed');

    const data = await r.json();
    // El endpoint retorna {serie:[{fecha,valor},...]} – tomamos el más reciente
    const latest = Array.isArray(data?.serie) ? data.serie[0]?.valor : null;
    if (typeof latest !== 'number') throw new Error('UF missing');

    cached = { value: latest, at: Date.now() };
    return NextResponse.json({ uf: latest });
  } catch (e) {
    // fallback (no rompemos la UI)
    const fallback = cached?.value ?? null;
    return NextResponse.json({ uf: fallback }, { status: fallback ? 200 : 500 });
  }
}

