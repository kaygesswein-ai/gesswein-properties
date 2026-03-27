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
  onCurrentReadyChange?: (ready: boolean) => void;
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
  onCurrentReadyChange,
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
  const revealTimeoutRef = useRef<number | null>(null);
  const swapTimeoutRef = useRef<number | null>(null);
  const mountedAtRef = useRef<number>(Date.now());
  const requestIdRef = useRef(0);

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
      onCurrentReadyChange?.(false);
      return;
    }

    onCurrentReadyChange?.(false);

    const requestId = ++requestIdRef.current;
    const currentDisplay = displaySrcRef.current;

    if (currentDisplay === src && !nextSrc) {
      setInitialReady(true);
      onCurrentReadyChange?.(true);
      if (persistAcrossRoutes) writeCachedHero(mediaMode, src);
      if (typeof window !== 'undefined') window.__gpHeroBootDone = true;
      return;
    }

    const img = new window.Image();
    img.decoding = 'async';
    img.src = src;

    const onLoaded = () => {
      if (requestId !== requestIdRef.current) return;

      const visibleNow = displaySrcRef.current;
      const effectiveMinOverlayMs = Math.min(Math.max(0, minInitialOverlayMs), 380);

      if (!visibleNow && showInitialBrandOverlay && !window.__gpHeroBootDone) {
        const elapsed = Date.now() - mountedAtRef.current;
        const remain = Math.max(0, effectiveMinOverlayMs - elapsed);

        if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);

        revealTimeoutRef.current = window.setTimeout(() => {
          if (requestId !== requestIdRef.current) return;

          setDisplaySrc(src);
          displaySrcRef.current = src;
          setInitialReady(true);
          onCurrentReadyChange?.(true);

          window.__gpHeroBootDone = true;
          if (persistAcrossRoutes) writeCachedHero(mediaMode, src);
        }, remain);

        return;
      }

      if (!visibleNow) {
        setDisplaySrc(src);
        displaySrcRef.current = src;
        setInitialReady(true);
        onCurrentReadyChange?.(true);

        if (typeof window !== 'undefined') window.__gpHeroBootDone = true;
        if (persistAcrossRoutes) writeCachedHero(mediaMode, src);
        return;
      }

      setNextSrc(src);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (requestId !== requestIdRef.current) return;
          setShowNext(true);
        });
      });

      if (swapTimeoutRef.current) window.clearTimeout(swapTimeoutRef.current);

      swapTimeoutRef.current = window.setTimeout(() => {
        if (requestId !== requestIdRef.current) return;

        setDisplaySrc(src);
        displaySrcRef.current = src;
        setNextSrc(null);
        setShowNext(false);
        setInitialReady(true);
        onCurrentReadyChange?.(true);

        if (typeof window !== 'undefined') window.__gpHeroBootDone = true;
        if (persistAcrossRoutes) writeCachedHero(mediaMode, src);
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
  }, [
    src,
    showInitialBrandOverlay,
    minInitialOverlayMs,
    persistAcrossRoutes,
    mediaMode,
    onCurrentReadyChange,
    nextSrc,
  ]);

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
