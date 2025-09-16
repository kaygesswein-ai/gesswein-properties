'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Property = {
  id: string;
  titulo?: string;
  comuna?: string;
  operacion?: 'venta' | 'arriendo';
  tipo?: string;
  precio_uf?: number | null;
  precio_clp?: number | null;
  dormitorios?: number | null;
  banos?: number | null;
  superficie_util_m2?: number | null;
  imagenes?: string[];
  images?: string[];
  coverImage?: string;
  destacada?: boolean;
};

function fmtPrecio(pUf?: number | null, pClp?: number | null) {
  if (typeof pUf === 'number' && pUf > 0) return `UF ${new Intl.NumberFormat('es-CL').format(pUf)}`;
  if (typeof pClp === 'number' && pClp > 0) return `$ ${new Intl.NumberFormat('es-CL').format(pClp)}`;
  return 'Consultar';
}

export default function HomePage() {
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [i, setI] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Carga de propiedades destacadas para el carrusel y la grilla
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/propiedades?destacada=true&limit=6', { cache: 'no-store' });
        const jso

