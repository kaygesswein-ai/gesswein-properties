'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Bed, ShowerHead, Ruler, Gift, Users2 } from 'lucide-react';
import useUf from '../hooks/useUf';

/* -------------------- Tipos -------------------- */
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

/* -------------------- Utilidades -------------------- */
function fmtUF(n: number) {
  return `UF ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`;
}
function fmtCLP(n: number) {
  return `$ ${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(n)}`;
}
function fmtPrecioFallback(pUf?: number | null, pClp?: number | null) {
  if (typeof pUf === 'number' && pUf > 0) return fmtUF(pUf);
  if (typeof pClp === 'number' && pClp > 0) return fmtCLP(pClp);
  return 'Consultar';
}
function capFirst(s?: string | null) {
  if (!s) return '';
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/* -------------------- Datos Chile (para formulario de referidos) -------------------- */
const REGIONES = [
  'I. Arica y Parinacota',
  'II. Tarapacá',
  'III. Antofagasta',
  'IV. Atacama',
  'V. Coquimbo',
  'VI. Valparaíso',
  'VII. O\'Higgins',
  'VIII. Maule',
  'IX. Ñuble',
  'X. Biobío',
  'XI. La Araucanía',
  'XII. Los Ríos',
  'XIII. Los Lagos',
  'XIV. Aysén',
  'XV. Magallanes',
  'XVI. Metropolitana de Santiago',
] as const;
type Region = typeof REGIONES[number];

/* -------------------- Servicios -------------------- */
const SERVICIOS = [
  'Comprar',
  'Vender',
  'Arrendar',
  'Gestionar un arriendo',
  'Consultoría específica',
];

/* -------------------- Tipos de propiedad -------------------- */
const TIPOS_PROPIEDAD = [
  'Casa',
  'Departamento',
  'Bodega',
  'Oficina',
  'Local comercial',
  'Terreno',
];

/* -------------------- Componente -------------------- */
export default function HomePage() {
  const [destacadas, setDestacadas] = useState<Property[]>([]);
  const [i, setI] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // swipe
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  // Carga destacadas
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/propiedades?destacada=true&limit=6', { cache: 'no-store' });
        const json = await res.json();
        if (!mounted) return;
        const data: Property[] = Array.isArray(json?.data) ? json.data : [];
        const fixed = data.map((p) => {
          if ((p.precio_uf ?? 0) <= 0 && (p.precio_clp ?? 0) <= 0) {
            return { ...p, precio_uf: 2300 };
          }
          return p;
        });
        setDestacadas(fixed);
      } catch {
        if (mounted) setDestacadas([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const active = destacadas[i];

  const lineaSecundaria = [
    active?.comuna === 'lo barnechea'
      ? 'Lo Barnechea'
      : capFirst(active?.comuna),
    capFirst(active?.tipo),
    capFirst(active?.operacion),
  ].filter(Boolean).join(' · ');

  const ufHoy = useUf();

  /* ========= FORMULARIO REFERIDOS ========= */
  const [regionInput, setRegionInput] = useState('');
  const [comunaInput, setComunaInput] = useState('');

  return (
    <main>
      {/* ========= REFERIDOS ========= */}
      <section id="referidos">
        <h3>Preferencias del referido</h3>

        <div>
          <label>¿Qué servicio necesita?</label>
          <select>
            {SERVICIOS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Tipo de propiedad</label>
          <select>
            {TIPOS_PROPIEDAD.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Región</label>
          <select
            value={regionInput}
            onChange={(e) => { setRegionInput(e.target.value); setComunaInput(''); }}
          >
            <option value="">Seleccionar región</option>
            {REGIONES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </section>
    </main>
  );
}










