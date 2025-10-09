'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { useRouteTransition } from './route-transition/TransitionProvider';

type Props = Omit<React.ComponentProps<typeof Link>, 'href'> & LinkProps & {
  withTransition?: boolean;
  minDurationMs?: number;
};

/**
 * Usa este Link SOLO en botones internos donde quieras transición.
 * En navbar, sigue usando <Link> normal para NO animar.
 */
export default function TransitionLink({
  href,
  withTransition = true,
  minDurationMs,
  onClick,
  ...rest
}: Props) {
  const router = useRouter();
  const { start, end } = useRouteTransition();

  return (
    <a
      href={typeof href === 'string' ? href : (href as any).pathname}
      onClick={(e) => {
        if (!withTransition) return;
        // navega con transición (solo clicks izquierdos sin modifier keys)
        if (
          e.button === 0 &&
          !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey &&
          !(rest.target && rest.target !== '_self')
        ) {
          e.preventDefault();
          start({ minDurationMs });
          // pequeña espera para mostrar overlay y luego push
          setTimeout(() => {
            router.push(typeof href === 'string' ? href : (href as any).href ?? (href as any).pathname);
            // marcamos fin una vez montó la nueva página (heurística)
            // da tiempo a que el server pinte la siguiente ruta
            setTimeout(() => end(), 350);
          }, 40);
        }
        onClick?.(e as any);
      }}
      {...rest}
    />
  );
}
