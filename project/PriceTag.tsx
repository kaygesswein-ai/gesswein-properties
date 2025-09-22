'use client';
import React from 'react';

const nfUF  = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });
const nfCLP = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

type Props = {
  priceUF?: number | null;
  priceCLP?: number | null;
  ufValue?: number | null;  // UF del día (si viene, convierte)
  className?: string;
};

export default function PriceTag({ priceUF, priceCLP, ufValue, className }: Props) {
  let uf = priceUF ?? null;
  let clp = priceCLP ?? null;

  if (uf == null && clp != null && ufValue) uf = clp / ufValue;
  if (clp == null && uf != null && ufValue) clp = uf * ufValue;

  return (
    <div className={className}>
      <div className="font-semibold" style={{ color: '#0A2E57' }}>
        {uf != null && uf > 0 ? `UF ${nfUF.format(uf)}` : 'Consultar'}
      </div>
      <div className="text-xs text-slate-500">
        {clp != null && clp > 0 ? `$ ${nfCLP.format(clp)}` : ''}
      </div>
    </div>
  );
}
