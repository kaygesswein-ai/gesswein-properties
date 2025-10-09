'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useRouteTransition } from './TransitionProvider';

function findAnchor(el: Element | null): HTMLAnchorElement | null {
  let n: Element | null = el;
  while (n) { if (n instanceof HTMLAnchorElement) return n; n = n.parentElement; }
  return null;
}
function isModified(e: MouseEvent) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
}
function sameOrigin(a: HTMLAnchorElement) {
  try { return new URL(a.href, location.href).origin === location.origin; } catch { return false; }
}

export default function AutoTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const { start, end, isActive } = useRouteTransition();
  const last = useRef(pathname);

  useEffect(() => {
    if (isActive && pathname !== last.current) {
      const t = setTimeout(() => end(), 150);
      return () => clearTimeout(t);
    }
    last.current = pathname;
  }, [pathname, isActive, end]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (isModified(e)) return;
      const a = findAnchor(e.target as Element | null);
      if (!a || !a.href || (a.target && a.target !== '_self') || !sameOrigin(a)) return;

      // Excluye contenedores marcados (navbar, etc.)
      if (a.closest('[data-no-transition]') || a.closest('header') || a.closest('nav')) return;
      if (a.dataset.transition === 'off') return;

      const url = new URL(a.href);
      const next = url.pathname + url.search + url.hash;
      const curr = location.pathname + location.search + location.hash;
      if (next === curr) return;

      e.preventDefault();
      start({ minDurationMs: 900 }); // ← sincronizado con Provider
      setTimeout(() => {
        router.push(next);
        setTimeout(() => end(), 1200); // safety fallback
      }, 40);
    };

    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [router, start, end]);

  return null;
}
