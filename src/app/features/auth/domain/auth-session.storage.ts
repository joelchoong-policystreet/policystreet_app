import type { AuthSession } from './auth-session.model';

export interface AuthSessionStorage {
  isAuthenticated(): boolean;
  getSession(): AuthSession | null;
  establishSession(mobile: string, rememberMe: boolean): AuthSession;
  clearSession(): void;
}
