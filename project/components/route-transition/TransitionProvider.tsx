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

const TARGET_DURATION_MS = 1800; // ⬅️ 1.8s exactos

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setActive] = useState(false);
  const [fadeout, setFadeout] = useState(false);
  const startedAtRef = useRef<number>(0);
  const minDurRef = useRef<number>(TARGET_DURATION_MS);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoKey, setVideoKey] = useState(0); // forzar remontaje del <video>

  // Bloquea/desbloquea scroll del documento bajo el overlay
  useEffect(() => {
    const root = document.documentElement;
    if (isActive) root.classList.add('gp-lock');
    else root.classList.remove('gp-lock');
    return () => root.classList.remove('gp-lock');
  }, [isActive]);

  const tryPlay = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.currentTime = 0;
      // Ajuste de velocidad a 1.8s exactos si el video ya reporta duración
      if (v.duration && Number.isFinite(v.duration)) {
        v.playbackRate = v.duration / (TARGET_DURATION_MS / 1000);
      }
      await v.play();
    } catch {
      // Reintento suave en el próximo frame (iOS/WebKit suele necesitar tiempo)
      requestAnimationFrame(() => {
        v.play().catch(() => {});
      });
    }
  }, []);

  const start = useCallback((opts?: { minDurationMs?: number }) => {
    minDurRef.current = Math.max(TARGET_DURATION_MS, opts?.minDurationMs ?? TARGET_DURATION_MS);
    startedAtRef.current = Date.now();
    setFadeout(false);
    setActive(true);

    // Barra de progreso opcional
    if (progressRef.current) {
      progressRef.current.style.width = '25%';
      setTimeout(() => progressRef.current && (progressRef.current.style.width = '70%'), 120);
    }

    // Fuerza a “remontar” el <video> y luego play
    setVideoKey((k) => k + 1);
    setTimeout(tryPlay, 30);
  }, [tryPlay]);

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
      }, 300); // coincide con el fadeout del overlay
    }, remain);
  }, []);

  // Cierra también cuando el video termina (respetando minDuration)
  const handleEnded = useCallback(() => {
    end();
  }, [end]);

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // Ajuste fino a 1.8s exactos
    if (v.duration && Number.isFinite(v.duration)) {
      v.playbackRate = v.duration / (TARGET_DURATION_MS / 1000);
    }
    tryPlay();
  }, [tryPlay]);

  const handleCanPlay = useCallback(() => {
    tryPlay();
  }, [tryPlay]);

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
          {/* Logo debajo (opcional) */}
          <img
            src="/logo-white.svg"
            alt="Gesswein Properties"
            className="gp-logo"
            draggable={false}
          />

          {/* Video líneas (encima del logo). Coloca el archivo en /public/brand/transition.mp4 */}
          <video
            key={videoKey}
            ref={videoRef}
            className="gp-video-lines"
            src="/brand/transition.mp4"
            muted
            playsInline
            preload="auto"
            autoPlay
            disablePictureInPicture
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onEnded={handleEnded}
          />
        </div>
      </div>

      {children}
    </Ctx.Provider>
  );
}
