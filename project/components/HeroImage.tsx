'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
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

function isValidSrc(value?: string | null): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export default function HeroImage({
  src,
  alt,
  className = '',
  objectPosition = '50% 50%',
  showInitialBrandOverlay = true,
  minInitialOverlayMs = 900,
}: HeroImageProps) {
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const mountedAtRef = useRef<number>(Date.now());
  const revealTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) {
        window.clearTimeout(revealTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isValidSrc(src)) {
      setDisplaySrc(null);
      setLoaded(false);
      return;
    }

    let cancelled = false;

    const img = new window.Image();
    img.decoding = 'async';
    img.src = src;

    const reveal = () => {
      if (cancelled) return;

      const firstBoot = !window.__gpHeroBootDone && showInitialBrandOverlay;
      if (firstBoot) {
        const elapsed = Date.now() - mountedAtRef.current;
        const remain = Math.max(0, minInitialOverlayMs - elapsed);

        if (revealTimeoutRef.current) {
          window.clearTimeout(revealTimeoutRef.current);
        }

        revealTimeoutRef.current = window.setTimeout(() => {
          if (cancelled) return;
          setDisplaySrc(src);
          setLoaded(true);
          window.__gpHeroBootDone = true;
        }, remain);
      } else {
        setDisplaySrc(src);
        setLoaded(true);
        window.__gpHeroBootDone = true;
      }
    };

    if (img.complete) {
      reveal();
    } else {
      img.onload = reveal;
    }

    return () => {
      cancelled = true;
      img.onload = null;
    };
  }, [src, minInitialOverlayMs, showInitialBrandOverlay]);

  const showBrandOverlay =
    showInitialBrandOverlay &&
    !loaded &&
    typeof window !== 'undefined' &&
    !window.__gpHeroBootDone;

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
