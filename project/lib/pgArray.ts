// src/lib/pgArray.ts
export function pgTextArray(input: unknown): string[] {
  if (Array.isArray(input)) return input as string[];
  if (typeof input !== 'string') return [];
  return input
    .replace(/^{|}$/g, '')        // quita las llaves { }
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}
