import { apiFetch, setTokens, clearTokens } from './api';
import type { AuthResponse, User } from '@/types/auth';

interface ApiSuccess<T> {
  success: true;
  data: T;
}

export async function register(name: string, email: string, password: string) {
  const res = await apiFetch<ApiSuccess<AuthResponse>>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setTokens(res.data.accessToken, res.data.refreshToken);
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await apiFetch<ApiSuccess<AuthResponse>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setTokens(res.data.accessToken, res.data.refreshToken);
  return res.data;
}

export async function logout() {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    clearTokens();
  }
}

export async function fetchMe(): Promise<User> {
  const res = await apiFetch<ApiSuccess<{ user: User }>>('/auth/me');
  return res.data.user;
}
