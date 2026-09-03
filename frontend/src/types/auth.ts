export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'analyst' | 'admin' | 'superadmin';
  xp: number;
  level: number;
  preferences?: {
    audioEnabled: boolean;
    reducedMotion: boolean;
    theme: 'dark' | 'system';
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
