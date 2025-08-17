// Auto-detect API base at runtime so you don't have to edit compose
const explicit = process.env.NEXT_PUBLIC_API_BASE;

const runtime = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:8080`
  : 'http://backend:8080'; // during SSR/build inside Docker

const base = explicit && !explicit.includes('localhost') ? explicit : runtime;

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}
export default api;
