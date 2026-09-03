const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

function getAccessToken(): string | null {
  return localStorage.getItem('ksl_access_token');
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('ksl_access_token', access);
  localStorage.setItem('ksl_refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('ksl_access_token');
  localStorage.removeItem('ksl_refresh_token');
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiClientError(
      res.status,
      body?.error?.code || 'UNKNOWN',
      body?.error?.message || res.statusText,
      body?.error?.details
    );
  }

  return body as T;
}
