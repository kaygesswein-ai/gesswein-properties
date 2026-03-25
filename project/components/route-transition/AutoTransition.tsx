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

function getPathnameFromHref(href: string) {
  try {
    const url = new URL(href, location.href);
    return url.pathname;
  } catch {
    return '';
  }
}

export default function AutoTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const { start, end, isActive } = useRouteTransition();
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (isActive && pathname !== lastPath.current) {
      const t = window.setTimeout(() => end(), 130);
      return () => window.clearTimeout(t);
    }
    lastPath.current = pathname;
  }, [pathname, isActive, end]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (isModifiedClick(e)) return;

      const a = findAnchor(e.target as Element | null);
      if (!a) return;

      if (!a.href || isExternalProtocol(a) || (a.target && a.target !== '_self')) return;
      if (!isSameOrigin(a)) return;

      if (a.dataset.transition === 'off') return;
      if (a.closest('[data-no-transition]')) return;

      const url = new URL(a.href, location.href);
      const next = url.pathname + url.search + url.hash;
      const curr = location.pathname + location.search + location.hash;
      if (next === curr) return;

      const nextPathname = getPathnameFromHref(a.href);
      const goingToHome = nextPathname === '/';

      e.preventDefault();

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('gp-nav-target', nextPathname || '');
        window.sessionStorage.setItem('gp-force-home-transition', goingToHome ? '1' : '0');
      }

      start({
        minDurationMs: goingToHome ? 980 : 520,
        variant: 'brand',
      });

      window.setTimeout(() => {
        router.push(next);

        window.setTimeout(() => {
          end();
        }, goingToHome ? 2200 : 1400);
      }, 40);
    };

    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [router, start, end]);

  return null;
}
