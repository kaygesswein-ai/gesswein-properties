'use client';

import { useEffect, useRef, useState } from 'react';

type HeroImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  objectPosition?: string;
  showInitialBrandOverlay?: boolean;
  minInitialOverlayMs?: number;
};

export default function HeroImage({
  src,
  alt,
  className = '',
  objectPosition = '50% 50%',
  showInitialBrandOverlay = true,
  minInitialOverlayMs = 900,
}: HeroImageProps) {
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const [nextSrc, setNextSrc] = useState<string | null>(null);
  const [showNext, setShowNext] = useState(false);
  const [initialReady, setInitialReady] = useState(false);

  const latestSrcRef = useRef<string | null>(null);
  const mountedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!src || !src.trim()) return;
    if (src === latestSrcRef.current) return;

    latestSrcRef.current = src;

    const img = new window.Image();
    img.decoding = 'async';
    img.src = src;

    img.onload = () => {
      // Primera carga: respetar una duración mínima del overlay de marca
      if (!displaySrc) {
        const elapsed = Date.now() - mountedAtRef.current;
        const remain = Math.max(0, minInitialOverlayMs - elapsed);

        window.setTimeout(() => {
          setDisplaySrc(src);
          setInitialReady(true);
        }, remain);

        return;
      }

      // Cambios posteriores: mantener imagen anterior hasta que la nueva esté lista
      setNextSrc(src);
      setShowNext(true);

      window.setTimeout(() => {
        setDisplaySrc(src);
        setNextSrc(null);
        setShowNext(false);
      }, 260);
    };
  }, [src, displaySrc, minInitialOverlayMs]);

  const showBrandOverlay = showInitialBrandOverlay && !initialReady;

  return (
    <>
      {/* Imagen actual */}
      {displaySrc ? (
        <img
          src={displaySrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover ${className}`}
          style={{ objectPosition }}
        />
      ) : null}

      {/* Imagen siguiente ya precargada, entra con fade */}
      {nextSrc ? (
        <img
          src={nextSrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            showNext ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{ objectPosition }}
        />
      ) : null}

      {/* Overlay inicial solo para primera carga */}
      {showBrandOverlay ? (
        <div className="absolute inset-0 z-[1] bg-[#0A2E57] flex items-center justify-center">
          <img
            src="/logo-white.svg"
            alt="Gesswein Properties"
            className="w-[220px] max-w-[62vw] h-auto opacity-95"
            draggable={false}
          />
        </div>
      ) : null}
    </>
  );
}
