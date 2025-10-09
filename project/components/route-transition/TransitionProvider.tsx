'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

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

  const start = useCallback((opts?: { minDurationMs?: number }) => {
    const minDur = opts?.minDurationMs ?? 320;
    tsRef.current = Date.now();
    setFadeout(false);
    setActive(true);
    // barra de progreso simple
    if (progressRef.current) {
      progressRef.current.style.width = '20%';
      setTimeout(() => progressRef.current && (progressRef.current.style.width = '65%'), 100);
    }
    // garantía de duración mínima
    setTimeout(() => {}, minDur);
  }, []);

  const end = useCallback(() => {
    const elapsed = Date.now() - tsRef.current;
    const minDur = 320;
    const remain = Math.max(0, minDur - elapsed);
    setTimeout(() => {
      if (progressRef.current) progressRef.current.style.width = '100%';
      setFadeout(true);
      setTimeout(() => {
        setActive(false);
        setFadeout(false);
        if (progressRef.current) progressRef.current.style.width = '0%';
      }, 220);
    }, remain);
  }, []);

  return (
    <Ctx.Provider value={{ start, end, isActive }}>
      {/* progress bar */}
      <div ref={progressRef} className="gp-progress" />
      {/* overlay */}
      <div className={`gp-route-overlay ${fadeout ? 'fadeout' : ''}`} hidden={!isActive} aria-hidden={!isActive}>
        <div className="gp-logo-wrap">
          {/* Beams detrás */}
          <div className="gp-beam" />
          <div className="gp-beam gp-beam-3" />
          {/* Logo — usa /public/logo-gesswein.svg si existe; si no, texto como fallback */}
          <img
            src="/logo-gesswein.svg"
            alt="Gesswein Properties"
            className="w-full h-auto drop-shadow-lg"
            onError={(e) => {
              const el = e.currentTarget;
              el.outerHTML = `<div style="font-weight:700;font-size:28px;color:white;letter-spacing:.06em;text-align:center">GESSWEIN<br/>PROPERTIES</div>`;
            }}
          />
        </div>
      </div>
      {children}
    </Ctx.Provider>
  );
}
