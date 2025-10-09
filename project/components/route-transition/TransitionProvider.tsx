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
  /** Arranca la transición. Puedes forzar una duración mínima si quieres */
  start: (opts?: { minDurationMs?: number }) => void;
  /** Cierra la transición (respetando minDuration si aplica) */
  end: () => void;
  /** True cuando el overlay está visible */
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
  const minDurRef = useRef<number>(900); // default: 900ms (más notorio)
  const progressRef = useRef<HTMLDivElement | null>(null);

  // Bloquear scroll de la página bajo el overlay
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
      // Primer “salto” rápido para dar feedback
      setTimeout(() => {
        if (progressRef.current) progressRef.current.style.width = '70%';
      }, 120);
    }
  }, []);

  const end = useCallback(() => {
    const elapsed = Date.now() - startedAtRef.current;
    const remain = Math.max(0, minDurRef.current - elapsed);

    // Espera a cumplir la duración mínima antes de cerrar
    setTimeout(() => {
      if (progressRef.current) progressRef.current.style.width = '100%';

      setFadeout(true);
      // Tiempo de fade-out del overlay (debe calzar con .gp-route-overlay.fadeout)
      const FADE_MS = 300;
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

      {/* Overlay corporativo (opaco; tapa completamente la página mientras anima) */}
      <div
        className={`gp-route-overlay ${fadeout ? 'fadeout' : ''}`}
        hidden={!isActive}
        aria-hidden={!isActive}
        role="status"
        aria-live="polite"
      >
        <div className="gp-logo-wrap" aria-label="Transición de página Gesswein Properties">
          {/* Logo blanco centrado */}
          <img
            src="/logo-white.svg"          /* Asegúrate de tener este SVG en /public */
            alt="Gesswein Properties"
            className="gp-logo"
            draggable={false}
          />

          {/* Líneas horizontales que pasan “por encima” del logo */}
          <div className="gp-lines" aria-hidden="true">
            <span className="gp-line l1" />
            <span className="gp-line l2" />
            <span className="gp-line l3" />
          </div>

          {/* Rayos diagonales sutiles (encima) */}
          <div className="gp-beam" aria-hidden="true" />
        </div>
      </div>

      {children}
    </Ctx.Provider>
  );
}
