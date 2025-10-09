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

export function useRouteTransition() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRouteTransition must be used within <RouteTransitionProvider>');
  return ctx;
}

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setActive] = useState(false);
  const [fadeout, setFadeout] = useState(false);
  const startedAt = useRef(0);
  const minDurRef = useRef(900); // ms
  const safetyTimer = useRef<number | null>(null);

  // Evita scroll de fondo
  useEffect(() => {
    const root = document.documentElement;
    if (isActive) root.classList.add('gp-lock');
    else root.classList.remove('gp-lock');
    return () => root.classList.remove('gp-lock');
  }, [isActive]);

  const start = useCallback((opts?: { minDurationMs?: number }) => {
    minDurRef.current = Math.max(300, opts?.minDurationMs ?? 900);
    startedAt.current = Date.now();
    setFadeout(false);
    setActive(true);
  }, []);

  const end = useCallback(() => {
    const elapsed = Date.now() - startedAt.current;
    const remain = Math.max(0, minDurRef.current - elapsed);
    window.setTimeout(() => {
      setFadeout(true);
      window.setTimeout(() => {
        setActive(false);
        setFadeout(false);
      }, 300); // coincide con .gp-route-overlay.fadeout
    }, remain);
  }, []);

  // Fallback por si el evento "ended" del video no dispara
  const armSafety = useCallback((durationMs: number) => {
    if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
    // 1.2x de la duración para margen
    safetyTimer.current = window.setTimeout(() => {
      end();
    }, Math.max(durationMs * 1.2, minDurRef.current + 300)) as unknown as number;
  }, [end]);

  return (
    <Ctx.Provider value={{ start, end, isActive }}>
      {/* Overlay con el video */}
      <div
        className={`gp-route-overlay ${fadeout ? 'fadeout' : ''}`}
        hidden={!isActive}
        aria-hidden={!isActive}
        role="status"
        aria-live="polite"
      >
        <div className="gp-logo-wrap" aria-label="Transición Gesswein Properties">
          {/* Video único que contiene TODO (fondo + logo + líneas) */}
          <video
            className="gp-video-lines"
            autoPlay
            muted
            playsInline
            // Si tienes WebM con alfa, déjalo primero para navegadores que lo soportan
            // Si sólo usas MP4 (Canva), deja solo la segunda fuente.
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              // programa fallback por si no llega 'ended'
              if (!isNaN(v.duration) && isFinite(v.duration)) {
                armSafety(v.duration * 1000);
              } else {
                armSafety(2000); // por las dudas
              }
            }}
            onEnded={() => end()}
          >
            {/* Fuente con transparencia (opcional, Opción B) */}
            <source src="/transition/gp-transition.webm" type="video/webm" />
            {/* Fallback MP4 (Opción A o respaldo) */}
            <source src="/transition/gp-transition.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {children}
    </Ctx.Provider>
  );
}
