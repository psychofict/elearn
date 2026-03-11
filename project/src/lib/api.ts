const API_BASE = '/api';

let authToken: string | null = localStorage.getItem('elearn-token');

export function setToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('elearn-token', token);
  } else {
    localStorage.removeItem('elearn-token');
  }
}

export function getToken(): string | null {
  return authToken;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    setToken(null);
    throw new Error('Session expired. Please log in again.');
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data as T;
}

// Auth
export const auth = {
  register: (body: { email: string; password: string; displayName: string; level?: string }) =>
    request<{ token: string; user: any }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: any }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  me: () => request<{ user: any }>('/auth/me'),
};

// Progress
export const progress = {
  getAll: () =>
    request<{ completedLessons: string[]; recentActivity: any[]; totalCompleted: number }>('/progress'),

  complete: (lessonId: string, body: { subjectId: string; subjectName: string; lessonTitle: string }) =>
    request<any>(`/progress/${lessonId}/complete`, { method: 'POST', body: JSON.stringify(body) }),

  uncomplete: (lessonId: string) =>
    request<any>(`/progress/${lessonId}/complete`, { method: 'DELETE' }),

  reset: () =>
    request<any>('/progress/reset', { method: 'DELETE' }),
};

// Settings
export const settings = {
  get: () => request<{ settings: any }>('/settings'),

  update: (body: Record<string, any>) =>
    request<{ settings: any }>('/settings', { method: 'PUT', body: JSON.stringify(body) }),
};

// Analytics
export const analytics = {
  get: () => request<any>('/analytics'),
};
