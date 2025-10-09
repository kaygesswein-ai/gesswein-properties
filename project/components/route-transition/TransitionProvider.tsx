'use client';

import React, {
  createContext, useContext, useState, useRef, useCallback, useEffect,
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
  const startedAtRef = useRef(0);
  const minDurRef = useRef(900);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // bloquea el scroll cuando la capa está activa
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

    // arranca barra y video
    if (progressRef.current) {
      progressRef.current.style.width = '20%';
      setTimeout(() => {
        if (progressRef.current) progressRef.current.style.width = '70%';
      }, 120);
    }
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        // en móviles iOS es obligatorio muted+playsInline
        videoRef.current.play().catch(() => {});
      } catch {}
    }
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
      }, 300); // coincide con .gp-route-overlay.fadeout
    }, remain);
  }, []);

  // Cuando el video termina, cerramos (respetando minDuration por si carga muy rápido)
  const handleEnded = useCallback(() => {
    end();
  }, [end]);

  return (
    <Ctx.Provider value={{ start, end, isActive }}>
      {/* barra superior (opcional) */}
      <div ref={progressRef} className="gp-progress" />

      {/* overlay corporativo (tapa por completo la página) */}
      <div
        className={`gp-route-overlay ${fadeout ? 'fadeout' : ''}`}
        hidden={!isActive}
        aria-hidden={!isActive}
        role="status"
        aria-live="polite"
      >
        <div className="gp-logo-wrap" aria-label="Transición de página Gesswein Properties">
          {/* Capa 1: logo base sin techos */}
          <img
            src="/logo-core.svg"
            alt="Gesswein Properties"
            className="gp-logo"
            draggable={false}
          />

          {/* Capa 2: video de líneas/techos encima */}
          <video
            ref={videoRef}
            className="gp-video-lines"
            muted
            playsInline
            preload="auto"
            // si exportas un webm con transparencia, se usará primero:
            onEnded={handleEnded}
          >
            <source src="/gp-lines.webm" type="video/webm" />
            <source src="/gp-lines.mp4"  type="video/mp4" />
          </video>
        </div>
      </div>

      {children}
    </Ctx.Provider>
  );
}
