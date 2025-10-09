'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useRouteTransition } from './TransitionProvider';

/* Helpers -------------------------------------------------- */
function findAnchor(el: Element | null): HTMLAnchorElement | null {
  let n: Element | null = el;
  while (n) {
    if (n instanceof HTMLAnchorElement) return n;
    n = n.parentElement;
  }
  return null;
}
function isModifiedClick(e: MouseEvent) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
}
function isSameOrigin(a: HTMLAnchorElement) {
  try {
    const url = new URL(a.href, location.href);
    return url.origin === location.origin;
  } catch {
    return false;
  }
}
function isExternalProtocol(a: HTMLAnchorElement) {
  const href = a.getAttribute('href') || '';
  return href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('blob:');
}

export default function AutoTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const { start, end, isActive } = useRouteTransition();
  const lastPath = useRef(pathname);

  /* Cierra cuando cambió la ruta (SPA) --------------------- */
  useEffect(() => {
    if (isActive && pathname !== lastPath.current) {
      // Da un pequeño margen para que el DOM nuevo pinte detrás del overlay
      const t = setTimeout(() => end(), 150);
      return () => clearTimeout(t);
    }
    lastPath.current = pathname;
  }, [pathname, isActive, end]);

  /* Intercepta clics en <a> internos (excepto navbar/headers) */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (isModifiedClick(e)) return;

      const a = findAnchor(e.target as Element | null);
      if (!a) return;

      // Externos, mailto/tel, target distinto de _self => no interceptar
      if (!a.href || isExternalProtocol(a) || (a.target && a.target !== '_self')) return;
      if (!isSameOrigin(a)) return;

      // Opt-out explícito o dentro de contenedores marcados
      if (a.dataset.transition === 'off') return;
      if (a.closest('[data-no-transition]') || a.closest('header') || a.closest('nav')) return;

      const url = new URL(a.href);
      const next = url.pathname + url.search + url.hash;
      const curr = location.pathname + location.search + location.hash;
      if (next === curr) return;

      e.preventDefault();

      // Arranca overlay (debe empatar con Provider: 900ms min)
      start({ minDurationMs: 900 });

      // Pequeña espera para mostrar overlay antes del cambio de ruta
      setTimeout(() => {
        router.push(next);
        // Fallback de seguridad por si Next no dispara el cambio
        setTimeout(() => end(), 1800);
      }, 40);
    };

    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [router, start, end]);

  return null;
}
