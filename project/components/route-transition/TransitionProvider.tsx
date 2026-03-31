'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { flushSync } from 'react-dom';

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
  const minDurRef = useRef<number>(850);
  const closingRef = useRef(false);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('gp-lock', isActive);
    return () => root.classList.remove('gp-lock');
  }, [isActive]);

  const start = useCallback((opts?: { minDurationMs?: number }) => {
    minDurRef.current = Math.max(700, opts?.minDurationMs ?? 850);
    startedAtRef.current = Date.now();
    closingRef.current = false;

    if (progressRef.current) {
      progressRef.current.style.width = '0%';
    }

    flushSync(() => {
      setFadeout(false);
      setActive(true);
    });

    requestAnimationFrame(() => {
      if (progressRef.current) {
        progressRef.current.style.width = '78%';
      }
    });
  }, []);

  const end = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const elapsed = Date.now() - startedAtRef.current;
    const remain = Math.max(0, minDurRef.current - elapsed);

    window.setTimeout(() => {
      if (progressRef.current) progressRef.current.style.width = '100%';

      window.setTimeout(() => {
        setFadeout(true);

        window.setTimeout(() => {
          setActive(false);
          setFadeout(false);
          closingRef.current = false;
          if (progressRef.current) progressRef.current.style.width = '0%';
        }, 180);
      }, 80);
    }, remain);
  }, []);

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
          <img
            src="/logo-white.svg"
            alt="Gesswein Properties"
            className="gp-logo"
            draggable={false}
          />
        </div>
      </div>

      {children}
    </Ctx.Provider>
  );
}
