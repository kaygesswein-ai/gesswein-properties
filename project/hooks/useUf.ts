'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hook para obtener la UF del día desde /api/uf sin depender de SWR.
 * - Lee /api/uf al montar.
 * - Reintenta cada 12 horas (igual que el TTL recomendado).
 * - Tolera errores (no rompe la UI).
 */
export default function useUf() {
  const [uf, setUf] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUF = async () => {
      try {
        const r = await fetch('/api/uf', { cache: 'no-store' });
        const j = await r.json().catch(() => ({} as any));
        const value = typeof j?.uf === 'number' ? j.uf : null;
        if (!cancelled) setUf(value);
      } catch {
        // deja el último valor; evita romper la UI
      }
    };

    fetchUF();
    // refresco cada 12h
    timerRef.current = setInterval(fetchUF, 12 * 60 * 60 * 1000);

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return uf;
}
