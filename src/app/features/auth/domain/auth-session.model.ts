/** Persisted auth session after successful OTP verification. */
export interface AuthSession {
  /** Opaque client reference; replace with server-issued token when API is wired. */
  token: string;
  mobile: string;
  rememberMe: boolean;
  /** Unix ms; omitted for tab-scoped sessions (sessionStorage). */
  expiresAt?: number;
}

export const AUTH_SESSION_REMEMBER_DAYS = 30;

export const AUTH_SESSION_REMEMBER_MS = AUTH_SESSION_REMEMBER_DAYS * 24 * 60 * 60 * 1000;
