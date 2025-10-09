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
  const startedAtRef = useRef<number>(0);
  const minDurRef = useRef<number>(1200);                 // ⬅️ subimos a ~1.2s para calzar con el video
  const progressRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoKey, setVideoKey] = useState(0);            // fuerza restart del <video>

  // Bloquear scroll mientras corre overlay
  useEffect(() => {
    const root = document.documentElement;
    if (isActive) root.classList.add('gp-lock');
    else root.classList.remove('gp-lock');
    return () => root.classList.remove('gp-lock');
  }, [isActive]);

  const playVideo = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.currentTime = 0;
      await v.play();                                     // intenta autoplay
    } catch {
      // fallback silencioso si el navegador bloquea algo
    }
  }, []);

  const start = useCallback((opts?: { minDurationMs?: number }) => {
    minDurRef.current = Math.max(800, opts?.minDurationMs ?? 1300); // ⬅️ 1.3s por defecto
    startedAtRef.current = Date.now();

    // reinicia barra
    if (progressRef.current) {
      progressRef.current.style.width = '20%';
      setTimeout(() => progressRef.current && (progressRef.current.style.width = '65%'), 120);
    }

    setFadeout(false);
    setActive(true);

    // reinicia el <video> forzando nueva clave y luego play
    setVideoKey(k => k + 1);
    // pequeño delay para que el DOM monte el <video> antes de play()
    setTimeout(playVideo, 30);
  }, [playVideo]);

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
      }, 300); // coincide con .fadeout
    }, remain);
  }, []);

  return (
    <Ctx.Provider value={{ start, end, isActive }}>
      {/* barra superior (opcional) */}
      <div ref={progressRef} className="gp-progress" />

      {/* overlay corporativo */}
      <div
        className={`gp-route-overlay ${fadeout ? 'fadeout' : ''}`}
        hidden={!isActive}
        aria-hidden={!isActive}
        role="status"
        aria-live="polite"
      >
        <div className="gp-logo-wrap" aria-label="Transición de página Gesswein Properties">
          {/* Logo base (opcional, debajo del video) */}
          <img
            src="/logo-white.svg"
            alt="Gesswein Properties"
            className="gp-logo"
            draggable={false}
          />

          {/* Video de líneas – asegúrate de que exista: /public/brand/transition.mp4 */}
          <video
            key={videoKey}
            ref={videoRef}
            className="gp-video-lines"
            src="/brand/transition.mp4"
            muted
            playsInline
            preload="auto"
            autoPlay
            // si quieres que siga brillando mientras el overlay está activo:
            // loop
          />
        </div>
      </div>

      {children}
    </Ctx.Provider>
  );
}
