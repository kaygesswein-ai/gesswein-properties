'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function useUf() {
  const { data } = useSWR<{ uf: number | null }>('/api/uf', fetcher, {
    refreshInterval: 12 * 60 * 60 * 1000, // 12h
    revalidateOnFocus: false,
  });
  return data?.uf ?? null;
}
