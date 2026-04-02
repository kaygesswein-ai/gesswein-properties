'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
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

function getHeroForPath(pathname: string): string | null {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  if (pathname === '/servicios') {
    return '/images/portadas/servicios.jpg';
  }

  if (pathname === '/equipo') {
    return isMobile
      ? 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Foto%20Portada%20Equipo(para%20Moviles)%20-%20Optimizada.JPG'
      : 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/equipo/Foto%20portada%20-%20Equipo%20-%20OPTIMIZADA.JPG';
  }

  if (pathname === '/contacto') {
    return isMobile
      ? 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/propiedades/Portada/Foto%20portada%20-%20Contacto%20(Opcion%201).jpeg'
      : '/images/portadas/contacto.jpg';
  }

  if (pathname === '/propiedades') {
    return '/images/portadas/propiedades.jpeg';
  }

  if (pathname === '/proyectos-exclusivos') {
    return 'https://oubddjjpwpjtsprulpjr.supabase.co/storage/v1/object/public/Proyectos%20Exclusivos/terufilm_japan-building-9682225_1920.jpg';
  }

  return null;
}

async function preloadImage(src: string, timeoutMs = 1200) {
  await new Promise<void>((resolve) => {
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };

    const img = new window.Image();
    img.decoding = 'async';
    img.fetchPriority = 'high';

    img.onload = async () => {
      try {
        await img.decode?.();
      } catch {}
      finish();
    };

    img.onerror = finish;
    img.src = src;

    if (img.complete) {
      finish();
      return;
    }

    window.setTimeout(finish, timeoutMs);
  });
}

async function afterTwoPaints() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

export default function AutoTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const { start, end, isActive } = useRouteTransition();

  const lastPathRef = useRef(pathname);
  const waitTokenRef = useRef(0);
  const prewarmedRef = useRef<Record<string, true>>({});

  useLayoutEffect(() => {
    if (!isActive || pathname === lastPathRef.current) {
      lastPathRef.current = pathname;
      return;
    }

    lastPathRef.current = pathname;
    const token = ++waitTokenRef.current;

    const finish = () => {
      if (waitTokenRef.current !== token) return;
      end();
    };

    const onReady = () => {
      if (waitTokenRef.current !== token) return;
      finish();
    };

    const safety = window.setTimeout(() => {
      if (waitTokenRef.current !== token) return;
      finish();
    }, 3000);

    window.addEventListener('gp:hero-ready', onReady, { once: true });

    return () => {
      window.clearTimeout(safety);
      window.removeEventListener('gp:hero-ready', onReady);
    };
  }, [pathname, isActive, end]);

  useEffect(() => {
    const prewarmAnchorHero = (a: HTMLAnchorElement | null) => {
      if (!a || !a.href || isExternalProtocol(a) || !isSameOrigin(a)) return;

      const url = new URL(a.href, location.href);
      const hero = getHeroForPath(url.pathname);
      if (!hero) return;
      if (prewarmedRef.current[hero]) return;

      prewarmedRef.current[hero] = true;
      preloadImage(hero, 1000).catch(() => {});
    };

    const onPointerEnter = (e: Event) => {
      const a = findAnchor(e.target as Element | null);
      prewarmAnchorHero(a);
    };

    const onFocusIn = (e: Event) => {
      const a = findAnchor(e.target as Element | null);
      prewarmAnchorHero(a);
    };

    const onTouchStart = (e: Event) => {
      const a = findAnchor(e.target as Element | null);
      prewarmAnchorHero(a);
    };

    const onClick = async (e: MouseEvent) => {
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

      start({ minDurationMs: 1000 });

      await afterTwoPaints();

      const hero = getHeroForPath(url.pathname);
      if (hero) {
        try {
          await preloadImage(hero, 1200);
        } catch {}
      }

      router.push(next);
    };

    window.addEventListener('pointerenter', onPointerEnter, true);
    window.addEventListener('focusin', onFocusIn, true);
    window.addEventListener('touchstart', onTouchStart, true);
    window.addEventListener('click', onClick, true);

    return () => {
      window.removeEventListener('pointerenter', onPointerEnter, true);
      window.removeEventListener('focusin', onFocusIn, true);
      window.removeEventListener('touchstart', onTouchStart, true);
      window.removeEventListener('click', onClick, true);
    };
  }, [router, start]);

  return null;
}
