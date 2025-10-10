'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';

interface TransitionCtx {
  start: (opts?: { minDurationMs?: number }) => void;
  end: () => void;
  isActive: boolean;
}

const Ctx = createContext<TransitionCtx | null>(null);
export const useRouteTransition = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRouteTransition must be used within <RouteTransitionProvider>');
  return ctx;
};

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setActive] = useState(false);
  const [fadeout, setFadeout] = useState(false);

  // Duraciones: entrada suave (700–900ms), beams ~900–1100ms, salida 300ms
  const startedAtRef = useRef<number>(0);
  const minDurRef = useRef<number>(1200);

  const progressRef = useRef<HTMLDivElement | null>(null);

  // Bloquear scroll bajo overlay
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('gp-lock', isActive);
    return () => root.classList.remove('gp-lock');
  }, [isActive]);

  const start = useCallback((opts?: { minDurationMs?: number }) => {
    minDurRef.current = Math.max(600, opts?.minDurationMs ?? 1200);
    startedAtRef.current = Date.now();

    if (progressRef.current) {
      progressRef.current.style.width = '0%';
      requestAnimationFrame(() => {
        if (progressRef.current) progressRef.current.style.width = '25%';
        setTimeout(() => {
          if (progressRef.current) progressRef.current.style.width = '70%';
        }, 120);
      });
    }

    setFadeout(false);
    setActive(true);
  }, []);

  const end = useCallback(() => {
    const elapsed = Date.now() - startedAtRef.current;
    const remain = Math.max(0, minDurRef.current - elapsed);

    setTimeout(() => {
      if (progressRef.current) progressRef.current.style.width = '100%';
      setFadeout(true);
      setTimeout(() => {
        setActive(false);
        setFadeout(false);
        if (progressRef.current) progressRef.current.style.width = '0%';
      }, 300);
    }, remain);
  }, []);

  // Guard-rail por si la navegación termina MUY rápido
  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => end(), 1800);
    return () => clearTimeout(t);
  }, [isActive, end]);

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
        <div className="gp-logo-wrap" aria-label="Transición Gesswein Properties">
          {/* Logo blanco estático (sólo fade-in) */}
          <img
            src="/logo-white.svg"
            alt="Gesswein Properties"
            className="gp-logo gp-logo--fadein"
            draggable={false}
          />

          {/* Beams sutiles – inferiores (por debajo de las letras) */}
          <div className="gp-beams gp-beams--lower" aria-hidden="true" />

          {/* Beams sutiles – superiores (sobre la línea de los techos) */}
          <div className="gp-beams gp-beams--upper" aria-hidden="true" />
        </div>
      </div>

      {children}
    </Ctx.Provider>
  );
}
