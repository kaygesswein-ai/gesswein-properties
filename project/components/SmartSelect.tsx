'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

type Option = string;
type Props = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  // si quieres que el dropdown siempre muestre todas sin filtrar:
  openShowsAll?: boolean; // default: true
  disabled?: boolean;
  className?: string;
};

export default function SmartSelect({
  placeholder,
  value,
  onChange,
  options,
  openShowsAll = true,
  disabled,
  className = '',
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // cierra al clickear fuera
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, []);

  // cuando abres con chevrón, muestra todo (ignora lo tipeado)
  const list = useMemo(() => {
    const base = open && openShowsAll ? '' : query.trim();
    if (!base) return options;
    const q = base.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query, open, openShowsAll]);

  // sincroniza query con value cuando escribes manual
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const choose = (opt: string) => {
    onChange(opt);
    setQuery(opt);
    setOpen(false);
    // re-enfocar para UX
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <input
        ref={inputRef}
        disabled={disabled}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={`w-full border border-slate-300 bg-gray-50 px-3 py-2 text-slate-700 placeholder-slate-400
                    rounded-none outline-none disabled:bg-gray-100 disabled:text-slate-400`}
        autoComplete="off"
      />
      {/* chevrón */}
      <button
        type="button"
        tabIndex={-1}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((v) => !v)}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 text-slate-600 hover:text-slate-900"
        aria-label="Abrir lista"
      >
        ▾
      </button>

      {/* dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto border border-slate-300 bg-white shadow-sm"
          role="listbox"
        >
          {list.length === 0 && (
            <div className="px-3 py-2 text-sm text-slate-500">Sin resultados</div>
          )}
          {list.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(opt)}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-slate-100 ${
                opt === value ? 'bg-slate-50 font-medium' : ''
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
