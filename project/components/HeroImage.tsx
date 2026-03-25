'use client';

import { useEffect, useRef, useState } from 'react';

type HeroMediaMode = 'all' | 'mobile' | 'desktop';

type HeroCacheEntry = {
  src: string;
  objectPosition: string;
  mediaMode: HeroMediaMode;
};

declare global {
  interface Window {
    __gpLastHero?: HeroCacheEntry | null;
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
  persistAcrossRoutes?: boolean;
  mediaMode?: HeroMediaMode;
};

function isValidSrc(value?: string | null): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isViewportMatch(mediaMode: HeroMediaMode) {
  if (typeof window === 'undefined') return false;
  if (mediaMode === 'all') return true;
  if (mediaMode === 'mobile') return window.matchMedia('(max-width: 767px)').matches;
  return window.matchMedia('(min-width: 768px)').matches;
}

function canReuseCachedHero(
  currentMode: HeroMediaMode,
  cached?: HeroCacheEntry | null
): cached is HeroCacheEntry {
  if (!cached?.src) return false;
  if (currentMode === 'all') return true;
  if (cached.mediaMode === 'all') return true;
  return cached.mediaMode === currentMode;
}

function readLastHero(mediaMode: HeroMediaMode, persistAcrossRoutes: boolean) {
  if (typeof window === 'undefined' || !persistAcrossRoutes) return null;
  const cached = window.__gpLastHero || null;
  return canReuseCachedHero(mediaMode, cached) ? cached : null;
}

function writeLastHero(entry: HeroCacheEntry, persistAcrossRoutes: boolean) {
  if (typeof window === 'undefined' || !persistAcrossRoutes) return;
  if (!isViewportMatch(entry.mediaMode)) return;
  window.__gpLastHero = entry;
}

export default function HeroImage({
  src,
  alt,
  className = '',
  objectPosition = '50% 50%',
  showInitialBrandOverlay = true,
  minInitialOverlayMs = 900,
  persistAcrossRoutes = false,
  mediaMode = 'all',
}: HeroImageProps) {
  const initialCached = readLastHero(mediaMode, persistAcrossRoutes);

  const [displaySrc, setDisplaySrc] = useState<string | null>(initialCached?.src || null);
  const [displayObjectPosition, setDisplayObjectPosition] = useState<string>(
    initialCached?.objectPosition || objectPosition
  );
  const [nextSrc, setNextSrc] = useState<string | null>(null);
  const [nextObjectPosition, setNextObjectPosition] = useState<string>(objectPosition);
  const [showNext, setShowNext] = useState(false);
  const [initialReady, setInitialReady] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !!window.__gpHeroBootDone || !!initialCached?.src;
  });

  const displaySrcRef = useRef<string | null>(initialCached?.src || null);
  const displayObjectPositionRef = useRef<string>(initialCached?.objectPosition || objectPosition);
  const latestRequestedSrcRef = useRef<string | null>(null);
  const mountedAtRef = useRef<number>(Date.now());
  const revealTimeoutRef = useRef<number | null>(null);
  const swapTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    displaySrcRef.current = displaySrc;
  }, [displaySrc]);

  useEffect(() => {
    displayObjectPositionRef.current = displayObjectPosition;
  }, [displayObjectPosition]);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);
      if (swapTimeoutRef.current) window.clearTimeout(swapTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isValidSrc(src)) return;
    if (latestRequestedSrcRef.current === src) return;

    latestRequestedSrcRef.current = src;

    const img = new window.Image();
    img.decoding = 'async';
    img.src = src;

    const onLoaded = () => {
      const currentDisplaySrc = displaySrcRef.current;
      const currentDisplayObjectPosition = displayObjectPositionRef.current;

      if (!currentDisplaySrc) {
        const elapsed = Date.now() - mountedAtRef.current;
        const remain = Math.max(0, minInitialOverlayMs - elapsed);

        if (revealTimeoutRef.current) window.clearTimeout(revealTimeoutRef.current);

        revealTimeoutRef.current = window.setTimeout(() => {
          setDisplaySrc(src);
          setDisplayObjectPosition(objectPosition);
          displaySrcRef.current = src;
          displayObjectPositionRef.current = objectPosition;

          writeLastHero(
            {
              src,
              objectPosition,
              mediaMode,
            },
            persistAcrossRoutes
          );

          if (typeof window !== 'undefined') {
            window.__gpHeroBootDone = true;
          }

          setInitialReady(true);
        }, remain);

        return;
      }

      if (currentDisplaySrc === src && currentDisplayObjectPosition === objectPosition) {
        writeLastHero(
          {
            src,
            objectPosition,
            mediaMode,
          },
          persistAcrossRoutes
        );

        if (typeof window !== 'undefined') {
          window.__gpHeroBootDone = true;
        }

        setInitialReady(true);
        return;
      }

      setNextSrc(src);
      setNextObjectPosition(objectPosition);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShowNext(true);
        });
      });

      if (swapTimeoutRef.current) window.clearTimeout(swapTimeoutRef.current);

      swapTimeoutRef.current = window.setTimeout(() => {
        setDisplaySrc(src);
        setDisplayObjectPosition(objectPosition);
        displaySrcRef.current = src;
        displayObjectPositionRef.current = objectPosition;

        setNextSrc(null);
        setShowNext(false);

        writeLastHero(
          {
            src,
            objectPosition,
            mediaMode,
          },
          persistAcrossRoutes
        );

        if (typeof window !== 'undefined') {
          window.__gpHeroBootDone = true;
        }

        setInitialReady(true);
      }, 320);
    };

    if (img.complete) {
      onLoaded();
    } else {
      img.onload = onLoaded;
    }

    return () => {
      img.onload = null;
    };
  }, [src, objectPosition, minInitialOverlayMs, persistAcrossRoutes, mediaMode]);

  const showBrandOverlay = showInitialBrandOverlay && !initialReady;

  return (
    <>
      {displaySrc ? (
        <img
          src={displaySrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover ${className}`}
          style={{ objectPosition: displayObjectPosition }}
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
          style={{ objectPosition: nextObjectPosition }}
          draggable={false}
        />
      ) : null}

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
