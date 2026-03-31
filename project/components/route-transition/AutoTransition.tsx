'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useRouteTransition } from './TransitionProvider';

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

  const lastPathRef = useRef(pathname);
  const waitTokenRef = useRef(0);

  useEffect(() => {
    if (!isActive || pathname === lastPathRef.current) {
      lastPathRef.current = pathname;
      return;
    }

    lastPathRef.current = pathname;
    const token = ++waitTokenRef.current;

    const onReady = () => {
      if (waitTokenRef.current !== token) return;
      end();
    };

    const safety = window.setTimeout(() => {
      if (waitTokenRef.current !== token) return;
      end();
    }, 4500);

    window.addEventListener('gp:hero-ready', onReady, { once: true });

    return () => {
      window.clearTimeout(safety);
      window.removeEventListener('gp:hero-ready', onReady);
    };
  }, [pathname, isActive, end]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (isModifiedClick(e)) return;

      const a = findAnchor(e.target as Element | null);
      if (!a) return;

      if (!a.href || isExternalProtocol(a) || (a.target && a.target !== '_self')) return;
      if (!isSameOrigin(a)) return;
      if (a.dataset.transition === 'off') return;

      const url = new URL(a.href, location.href);
      const next = url.pathname + url.search + url.hash;
      const curr = location.pathname + location.search + location.hash;

      if (next === curr) return;

      e.preventDefault();

      start({ minDurationMs: 1100 });

      window.setTimeout(() => {
        router.push(next);
      }, 50);
    };

    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [router, start]);

  return null;
}
