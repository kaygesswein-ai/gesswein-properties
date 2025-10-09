'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import AnimatedLogo from '@/components/route-transition/AnimatedLogo';

interface TransitionCtx {
  start: (opts?: { minDurationMs?: number }) => void;
  end: () => void;
  isActive: boolean;
}

const Ctx = createContext<TransitionCtx | null>(null);

export function useRouteTransition() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRouteTransition must be used within <RouteTransitionProvider>');
  return ctx;
}

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setActive] = useState(false);
  const [fadeout, setFadeout] = useState(false);

  const startedAtRef = useRef<number>(0);
  const minDurRef = useRef<number>(900); // duración mínima por defecto
  const progressRef = useRef<HTMLDivElement | null>(null);

  // Bloquea el scroll del documento bajo el overlay
  useEffect(() => {
    const root = document.documentElement;
    if (isActive) root.classList.add('gp-lock');
    else root.classList.remove('gp-lock');
    return () => root.classList.remove('gp-lock');
  }, [isActive]);

  const start = useCallback((opts?: { minDurationMs?: number }) => {
    minDurRef.current = Math.max(300, opts?.minDurationMs ?? 900);
    startedAtRef.current = Date.now();

    setFadeout(false);
    setActive(true);

    // barra de progreso opcional
    if (progressRef.current) {
      progressRef.current.style.width = '20%';
      setTimeout(() => {
        if (progressRef.current) progressRef.current.style.width = '70%';
      }, 120);
    }
  }, []);

  const end = useCallback(() => {
    const elapsed = Date.now() - startedAtRef.current;
    const remain = Math.max(0, minDurRef.current - elapsed);

    setTimeout(() => {
      if (progressRef.current) progressRef.current.style.width = '100%';

      setFadeout(true);
      const FADE_MS = 300; // debe calzar con .gp-route-overlay.fadeout
      setTimeout(() => {
        setActive(false);
        setFadeout(false);
        if (progressRef.current) progressRef.current.style.width = '0%';
      }, FADE_MS);
    }, remain);
  }, []);

  return (
    <Ctx.Provider value={{ start, end, isActive }}>
      {/* Barra superior (opcional) */}
      <div ref={progressRef} className="gp-progress" />

      {/* Overlay corporativo */}
      <div
        className={`gp-route-overlay ${fadeout ? 'fadeout' : ''}`}
        hidden={!isActive}
        aria-hidden={!isActive}
        role="status"
        aria-live="polite"
      >
        {/* Logo + láseres enmascarados */}
        <AnimatedLogo />
      </div>

      {children}
    </Ctx.Provider>
  );
}
