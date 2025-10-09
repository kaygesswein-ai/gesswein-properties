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
  const minDurRef = useRef<number>(1800); // 1.8s exacto
  const progressRef = useRef<HTMLDivElement | null>(null);

  // video
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoKey, setVideoKey] = useState(0); // para reiniciar el video cada transición

  // Bloquear scroll bajo overlay
  useEffect(() => {
    const root = document.documentElement;
    if (isActive) root.classList.add('gp-lock');
    else root.classList.remove('gp-lock');
    return () => root.classList.remove('gp-lock');
  }, [isActive]);

  const start = useCallback((opts?: { minDurationMs?: number }) => {
    minDurRef.current = Math.max(300, opts?.minDurationMs ?? 1800);
    startedAtRef.current = Date.now();

    // reinicia video y barra
    setVideoKey((k) => k + 1);
    if (progressRef.current) progressRef.current.style.width = '0%';

    setFadeout(false);
    setActive(true);

    // feedback en la barra
    if (progressRef.current) {
      progressRef.current.style.width = '25%';
      setTimeout(() => {
        if (progressRef.current) progressRef.current.style.width = '70%';
      }, 150);
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
      }, 300);
    }, remain);
  }, []);

  // Sincroniza el cierre con el fin del video (si dura ≈1.8s cerrará exacto)
  const handleEnded = () => end();
  const handleCanPlay = () => {
    // reproduce de inmediato (iOS requiere muted+playsInline)
    videoRef.current?.play().catch(() => {/* ignore */});
  };

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
        <div className="gp-logo-wrap" aria-label="Transición de página Gesswein Properties">
          {/* Logo base (sin techos) */}
          <img
            src="/brand/logo-base.svg"
            alt="Gesswein Properties"
            className="gp-logo gp-logo--fadein"
            draggable={false}
          />

          {/* VIDEO DE LÍNEAS ENCIMA DEL LOGO  */}
          <video
            key={videoKey}
            ref={videoRef}
            className="gp-video-lines"
            src="/transition/gp-transition.mp4"  // ← RUTA DEFINITIVA
            muted
            playsInline
            preload="auto"
            autoPlay
            disablePictureInPicture
            onCanPlay={handleCanPlay}
            onEnded={handleEnded}
          />

          {/* (opcional) rayos diagonales suaves */}
          {/* <div className="gp-beam" aria-hidden="true" /> */}
        </div>
      </div>

      {children}
    </Ctx.Provider>
  );
}

