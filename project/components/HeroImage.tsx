'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

declare global {
  interface Window {
    __gpHeroBootDone?: boolean;
    __gpHeroCache?: Record<string, string | null>;
  }
}

type HeroImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  objectPosition?: string;
  showInitialBrandOverlay?: boolean;
  minInitialOverlayMs?: number;
  persistAcrossRoutes?: boolean;
  mediaMode?: 'all' | 'mobile' | 'desktop';
};

function isValidSrc(value?: string | null): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function getCacheKey(mediaMode: 'all' | 'mobile' | 'desktop') {
  return `hero:${mediaMode}`;
}

function readCachedHero(mediaMode: 'all' | 'mobile' | 'desktop'): string | null {
  if (typeof window === 'undefined') return null;
  const cache = window.__gpHeroCache || {};
  return cache[getCacheKey(mediaMode)] || null;
}

function writeCachedHero(mediaMode: 'all' | 'mobile' | 'desktop', value: string | null) {
  if (typeof window === 'undefined') return;
  if (!window.__gpHeroCache) window.__gpHeroCache = {};
  window.__gpHeroCache[getCacheKey(mediaMode)] = value;
}

export default function HeroImage({
  src,
  alt,
  className = '',
  objectPosition = '50% 50%',
  showInitialBrandOverlay = true,
  minInitialOverlayMs = 900,
  persistAcrossRoutes = true,
  mediaMode = 'all',
}: HeroImageProps) {
  const initialCachedSrc = useMemo(() => {
    if (!persistAcrossRoutes) return null;
    return readCachedHero(mediaMode);
  }, [persistAcrossRoutes, mediaMode]);

  const [displaySrc, setDisplaySrc] = useState<string | null>(initialCachedSrc);
  const [nextSrc, setNextSrc] = useState<string | null>(null);
  const [showNext, setShowNext] = useState(false);
  const [initialReady, setInitialReady] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !!window.__gpHeroBootDone || !!initialCachedSrc || !showInitialBrandOverlay;
  });

  const displaySrcRef = useRef<string | null>(initialCachedSrc);
  const mountedAtRef = useRef<number>(Date.now());
  const revealTimeoutRef = useRef<number | null>(null);
  const swapTimeoutRef = useRef<number | null>(null);
  const latestRequestedSrcRef = useRef<string | null>(null);

  useEffect(() => {
    displaySrcRef.current = displaySrc;
  }, [displaySrc]);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);
      if (swapTimeoutRef.current) window.clearTimeout(swapTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isValidSrc(src)) {
      return;
    }

    if (latestRequestedSrcRef.current === src) return;
    latestRequestedSrcRef.current = src;

    const img = new window.Image();
    img.decoding = 'async';
    img.src = src;

    const onLoaded = () => {
      const currentDisplay = displaySrcRef.current;
      const effectiveMinOverlayMs = Math.min(Math.max(0, minInitialOverlayMs), 420);

      // Primera carga real del sitio: mostrar overlay azul, pero corto.
      if (!currentDisplay && showInitialBrandOverlay && !window.__gpHeroBootDone) {
        const elapsed = Date.now() - mountedAtRef.current;
        const remain = Math.max(0, effectiveMinOverlayMs - elapsed);

        if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);

        revealTimeoutRef.current = window.setTimeout(() => {
          setDisplaySrc(src);
          displaySrcRef.current = src;
          setInitialReady(true);
          window.__gpHeroBootDone = true;
          writeCachedHero(mediaMode, src);
        }, remain);

        return;
      }

      // Si no había base visible, mostrar directo.
      if (!currentDisplay) {
        setDisplaySrc(src);
        displaySrcRef.current = src;
        setInitialReady(true);
        window.__gpHeroBootDone = true;
        writeCachedHero(mediaMode, src);
        return;
      }

      // Si ya es la misma imagen, no animar.
      if (currentDisplay === src) {
        setInitialReady(true);
        window.__gpHeroBootDone = true;
        writeCachedHero(mediaMode, src);
        return;
      }

      // Cambio entre páginas: mantener la anterior visible hasta que entre la nueva.
      setNextSrc(src);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShowNext(true);
        });
      });

      if (swapTimeoutRef.current) window.clearTimeout(swapTimeoutRef.current);

      swapTimeoutRef.current = window.setTimeout(() => {
        setDisplaySrc(src);
        displaySrcRef.current = src;
        setNextSrc(null);
        setShowNext(false);
        setInitialReady(true);
        window.__gpHeroBootDone = true;
        writeCachedHero(mediaMode, src);
      }, 280);
    };

    if (img.complete) {
      onLoaded();
    } else {
      img.onload = onLoaded;
    }

    return () => {
      img.onload = null;
    };
  }, [src, showInitialBrandOverlay, minInitialOverlayMs, mediaMode]);

  const showBrandOverlay = showInitialBrandOverlay && !initialReady;

  return (
    <>
      {displaySrc ? (
        <img
          src={displaySrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover ${className}`}
          style={{ objectPosition }}
          draggable={false}
        />
      ) : null}

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

      {showBrandOverlay ? (
        <div className="absolute inset-0 z-[30] bg-[#0A2E57] flex items-center justify-center">
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
