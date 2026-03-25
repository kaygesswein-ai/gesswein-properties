'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    __gpLastHeroSrc?: string | null;
    __gpHeroBootDone?: boolean;
  }
}

type HeroImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  objectPosition?: string;
  showInitialBrandOverlay?: boolean;
  minInitialOverlayMs?: number;
};

function isValidSrc(value?: string | null) {
  return !!value && !!value.trim();
}

function readLastHeroSrc(): string | null {
  if (typeof window === 'undefined') return null;
  return window.__gpLastHeroSrc || null;
}

function writeLastHeroSrc(value: string | null) {
  if (typeof window === 'undefined') return;
  window.__gpLastHeroSrc = value;
}

export default function HeroImage({
  src,
  alt,
  className = '',
  objectPosition = '50% 50%',
  showInitialBrandOverlay = true,
  minInitialOverlayMs = 900,
}: HeroImageProps) {
  const initialCachedSrc = readLastHeroSrc();

  const [displaySrc, setDisplaySrc] = useState<string | null>(initialCachedSrc);
  const [nextSrc, setNextSrc] = useState<string | null>(null);
  const [showNext, setShowNext] = useState(false);
  const [initialReady, setInitialReady] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !!window.__gpHeroBootDone || !!initialCachedSrc;
  });

  const latestRequestedSrcRef = useRef<string | null>(null);
  const displaySrcRef = useRef<string | null>(initialCachedSrc);
  const mountedAtRef = useRef<number>(Date.now());
  const revealTimeoutRef = useRef<number | null>(null);
  const swapTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    displaySrcRef.current = displaySrc;
  }, [displaySrc]);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) {
        window.clearTimeout(revealTimeoutRef.current);
      }
      if (swapTimeoutRef.current) {
        window.clearTimeout(swapTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isValidSrc(src)) return;
    if (latestRequestedSrcRef.current === src) return;

    latestRequestedSrcRef.current = src;

    const img = new window.Image();
    img.decoding = 'async';
    img.src = src!;

    const handleLoaded = () => {
      const currentDisplay = displaySrcRef.current;

      // Caso 1: no hay imagen visible todavía (primera carga real del sitio)
      if (!currentDisplay) {
        const elapsed = Date.now() - mountedAtRef.current;
        const remain = Math.max(0, minInitialOverlayMs - elapsed);

        if (revealTimeoutRef.current) {
          window.clearTimeout(revealTimeoutRef.current);
        }

        revealTimeoutRef.current = window.setTimeout(() => {
          setDisplaySrc(src!);
          displaySrcRef.current = src!;
          writeLastHeroSrc(src!);
          if (typeof window !== 'undefined') {
            window.__gpHeroBootDone = true;
          }
          setInitialReady(true);
        }, remain);

        return;
      }

      // Caso 2: ya hay una hero visible (por ejemplo, la de la página anterior)
      // => mantenerla hasta que la nueva entre con fade
      if (currentDisplay === src) {
        writeLastHeroSrc(src!);
        if (typeof window !== 'undefined') {
          window.__gpHeroBootDone = true;
        }
        setInitialReady(true);
        return;
      }

      setNextSrc(src!);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShowNext(true);
        });
      });

      if (swapTimeoutRef.current) {
        window.clearTimeout(swapTimeoutRef.current);
      }

      swapTimeoutRef.current = window.setTimeout(() => {
        setDisplaySrc(src!);
        displaySrcRef.current = src!;
        setNextSrc(null);
        setShowNext(false);
        writeLastHeroSrc(src!);
        if (typeof window !== 'undefined') {
          window.__gpHeroBootDone = true;
        }
        setInitialReady(true);
      }, 320);
    };

    if (img.complete) {
      handleLoaded();
    } else {
      img.onload = handleLoaded;
    }

    return () => {
      img.onload = null;
    };
  }, [src, minInitialOverlayMs]);

  const showBrandOverlay = showInitialBrandOverlay && !initialReady;

  return (
    <>
      {/* Imagen base visible: puede ser la hero actual o la última hero cargada en la navegación anterior */}
      {displaySrc ? (
        <img
          src={displaySrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover ${className}`}
          style={{ objectPosition }}
          draggable={false}
        />
      ) : null}

      {/* Nueva imagen precargada: entra con fade por encima */}
      {nextSrc ? (
        <img
          src={nextSrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            showNext ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{ objectPosition }}
          draggable={false}
        />
      ) : null}

      {/* Overlay inicial solo para el primer boot real, no en cada navegación */}
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
