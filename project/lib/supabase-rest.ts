// project/lib/supabase-rest.ts
export function supaRest(path: string, init?: RequestInit) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!base || !anon) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  const url = `${base.replace(/\/+$/, '')}/rest/v1/${path.replace(/^\/+/, '')}`;
  const headers = {
    apikey: anon,
    Authorization: `Bearer ${anon}`,
    ...(init?.headers as Record<string, string> | undefined),
  };

  return fetch(url, { ...init, headers });
}
