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

  const startedAtRef = useRef<number>(0);
  const minDurRef = useRef<number>(1100); // duración total (≈ láseres)

  // barra (opcional)
  const progressRef = useRef<HTMLDivElement | null>(null);

  // bloquea scroll cuando overlay está activo
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('gp-lock', isActive);
    return () => root.classList.remove('gp-lock');
  }, [isActive]);

  const start = useCallback((opts?: { minDurationMs?: number }) => {
    minDurRef.current = Math.max(400, opts?.minDurationMs ?? 1100);
    startedAtRef.current = Date.now();

    // reinicia barra
    if (progressRef.current) {
      progressRef.current.style.width = '0%';
      requestAnimationFrame(() => {
        if (progressRef.current) progressRef.current.style.width = '65%';
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
      }, 260); // coincide con .gp-route-overlay.fadeout
    }, remain);
  }, []);

  // por si el navegador termina las animaciones antes de minDur, cerramos igual
  const onLasersEnded = () => end();

  return (
    <Ctx.Provider value={{ start, end, isActive }}>
      <div ref={progressRef} className="gp-progress" />

      <div
        className={`gp-route-overlay ${fadeout ? 'fadeout' : ''}`}
        hidden={!isActive}
        aria-hidden={!isActive}
        role="status"
        aria-live="polite"
      >
        <div className="gp-logo-wrap" aria-label="Transición de página Gesswein Properties">
          {/* Logo blanco estático */}
          <img
            src="/logo-white.svg"
            alt="Gesswein Properties"
            className="gp-logo"
            draggable={false}
          />

          {/* EXACTAMENTE DOS LÁSERES, una sola pasada */}
          <div className="gp-lasers" onAnimationEnd={onLasersEnded} aria-hidden="true">
            <span className="gp-laser l1" />
            <span className="gp-laser l2" />
          </div>
        </div>
      </div>

      {children}
    </Ctx.Provider>
  );
}
