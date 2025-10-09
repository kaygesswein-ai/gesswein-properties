'use client';

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

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
  const tsRef = useRef<number>(0);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // bloquea scroll del body mientras corre overlay
  useEffect(() => {
    if (isActive) document.documentElement.classList.add('gp-lock');
    else document.documentElement.classList.remove('gp-lock');
    return () => document.documentElement.classList.remove('gp-lock');
  }, [isActive]);

  const start = useCallback((opts?: { minDurationMs?: number }) => {
    const minDur = opts?.minDurationMs ?? 900; // ← más notorio
    tsRef.current = Date.now();
    setFadeout(false);
    setActive(true);
    if (progressRef.current) {
      progressRef.current.style.width = '25%';
      setTimeout(() => progressRef.current && (progressRef.current.style.width = '70%'), 120);
    }
    // el “minDur” se respeta en end()
    setTimeout(() => {}, minDur);
  }, []);

  const end = useCallback(() => {
    const elapsed = Date.now() - tsRef.current;
    const minDur = 900;
    const remain = Math.max(0, minDur - elapsed);
    setTimeout(() => {
      if (progressRef.current) progressRef.current.style.width = '100%';
      setFadeout(true);
      setTimeout(() => {
        setActive(false);
        setFadeout(false);
        if (progressRef.current) progressRef.current.style.width = '0%';
      }, 300); // fade out
    }, remain);
  }, []);

  return (
    <Ctx.Provider value={{ start, end, isActive }}>
      {/* barra superior (opcional) */}
      <div ref={progressRef} className="gp-progress" />
      {/* overlay */}
      <div className={`gp-route-overlay ${fadeout ? 'fadeout' : ''}`} hidden={!isActive} aria-hidden={!isActive}>
        <div className="gp-logo-wrap">
          {/* Logo blanco centrado */}
          <img
            src="/logo-white.svg"             /* ← asegúrate de tener este SVG en /public */
            alt="Gesswein Properties"
            className="gp-logo"
          />
          {/* Beams ENCIMA del logo */}
          <div className="gp-beam" />
          <div className="gp-beam gp-beam-3" />
        </div>
      </div>
      {children}
    </Ctx.Provider>
  );
}
