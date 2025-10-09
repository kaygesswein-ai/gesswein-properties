'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useRouteTransition } from './TransitionProvider';

function findAnchor(el: Element | null): HTMLAnchorElement | null {
  let node: Element | null = el;
  while (node) {
    if (node instanceof HTMLAnchorElement) return node;
    node = node.parentElement;
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

export default function AutoTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const { start, end, isActive } = useRouteTransition();
  const lastPath = useRef(pathname);

  useEffect(() => {
    // si la ruta cambió y hay overlay activo, cerramos suave
    if (isActive && pathname !== lastPath.current) {
      // pequeño delay para evitar “flash” si la página es instantánea
      const t = setTimeout(() => end(), 120);
      return () => clearTimeout(t);
    }
    lastPath.current = pathname;
  }, [pathname, isActive, end]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (isModifiedClick(e)) return;

      const target = e.target as Element | null;
      const a = findAnchor(target);
      if (!a) return;
      if (!a.href) return;

      // excluir mailto/tel, targets externos o _blank
      if (a.target && a.target !== '_self') return;
      if (!isSameOrigin(a)) return;

      // exclusiones: contenedores marcados como "no transición" o el propio link
      const excludeContainer = a.closest('[data-no-transition]') || a.closest('header') || a.closest('nav');
      if (excludeContainer) return;
      if (a.dataset.transition === 'off') return;

      // opt-in explícito por si quieres forzar (no es obligatorio)
      // if (a.dataset.transition !== 'on') { ... }  // ← si quisieras opt-in estricto

      // evita reiniciar si navega al mismo href
      const url = new URL(a.href);
      const nextPath = url.pathname + url.search + url.hash;
      const currentPath = location.pathname + location.search + location.hash;
      if (nextPath === currentPath) return;

      // Disparamos overlay y navegamos
      e.preventDefault();
      start({ minDurationMs: 320 });
      // damos un respiro para ver el overlay y luego empujamos
      setTimeout(() => {
        router.push(url.pathname + url.search + url.hash);
        // fallback: si por alguna razón no cambia pathname, cerramos igual
        setTimeout(() => end(), 1200);
      }, 40);
    };

    window.addEventListener('click', onClick, true); // captura para ganarle al default
    return () => window.removeEventListener('click', onClick, true);
  }, [router, start, end]);

  return null;
}
