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

  // Video (reiniciado en cada transición)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoKey, setVideoKey] = useState(0);

  // Bloquear scroll bajo overlay mientras está activo
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('gp-lock', isActive);
    return () => root.classList.remove('gp-lock');
  }, [isActive]);

  const start = useCallback((opts?: { minDurationMs?: number }) => {
    minDurRef.current = Math.max(300, opts?.minDurationMs ?? 1800);
    startedAtRef.current = Date.now();

    // Reinicia video y barra
    setVideoKey((k) => k + 1);
    if (progressRef.current) progressRef.current.style.width = '0%';

    setFadeout(false);
    setActive(true);

    // Feedback quick de la barra
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
      }, 300); // fade-out
    }, remain);
  }, []);

  // Sincroniza el cierre con el fin del video (ideal si dura ~1.8s)
  const handleEnded = () => end();

  // iOS/autoplay safety
  const handleCanPlay = () => {
    videoRef.current?.play().catch(() => {/* ignore autoplay errors */});
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
          {/* Logo base (si no tienes /brand/logo-base.svg, usa /logo-white.svg) */}
          <img
            src="/brand/logo-base.svg"
            alt="Gesswein Properties"
            className="gp-logo gp-logo--fadein"
            draggable={false}
          />

          {/* Video de líneas/techos ENCIMA del logo (una sola reproducción) */}
          <video
            key={videoKey}
            ref={videoRef}
            className="gp-video-lines"
            muted
            playsInline
            preload="auto"
            autoPlay
            disablePictureInPicture
            onCanPlay={handleCanPlay}
            onEnded={handleEnded}
          >
            {/* WebM primero (calidad/peso), MP4 como fallback */}
            <source src="/transition/gp-transition.webm" type="video/webm" />
            <source src="/transition/gp-transition.mp4"  type="video/mp4"  />
          </video>
        </div>
      </div>

      {children}
    </Ctx.Provider>
  );
}
