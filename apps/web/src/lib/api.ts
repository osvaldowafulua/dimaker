const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export async function apiGet<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}
