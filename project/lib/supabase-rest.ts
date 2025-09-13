// lib/supabase-rest.ts
const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const service = process.env.SUPABASE_SERVICE_ROLE!;

type RestInit = RequestInit & { useServiceRole?: boolean };

export async function supaRest(path: string, init: RestInit = {}) {
  const headers: Record<string, string> = {
    apikey: anon,
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  const token = init.useServiceRole ? service : anon;
  headers.Authorization = `Bearer ${token}`;

  const url = `${baseUrl}/rest/v1/${path}`;
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase REST ${res.status}: ${text}`);
  }
  return res;
}