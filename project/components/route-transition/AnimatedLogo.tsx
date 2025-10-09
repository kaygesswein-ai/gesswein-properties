'use client';

import React from 'react';

/**
 * Usa el archivo /public/logo-white.svg como MÁSCARA para los “láseres”.
 * - Capa 1: logo base (blanco) con un leve fade-in.
 * - Capa 2: máscara con 3 “sweeps” que pasan por ENCIMA de las líneas.
 * 
 * Si quieres usar otro SVG (por ejemplo “/logos-oficiales.svg”), solo cambia
 * la ruta en las clases gp-laser-mask / gp-laser-mask--img del CSS.
 */
export default function AnimatedLogo() {
  return (
    <div className="gp-logo-wrap">
      {/* Logo base (blanco) */}
      <img
        src="/logo-white.svg"
        alt="Gesswein Properties"
        className="gp-logo gp-logo--fadein"
        width={360}
        height={360}
      />

      {/* Láseres enmascarados por el contorno del logo */}
      <div className="gp-laser-mask">
        <div className="gp-laser-sweep gp-laser-sweep--1" />
        <div className="gp-laser-sweep gp-laser-sweep--2" />
        <div className="gp-laser-sweep gp-laser-sweep--3" />
      </div>
    </div>
  );
}
