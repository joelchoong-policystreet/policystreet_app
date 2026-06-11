import { Injectable } from '@angular/core';

import {
  AUTH_SESSION_REMEMBER_MS,
  type AuthSession,
} from '../domain/auth-session.model';
import type { AuthSessionStorage } from '../domain/auth-session.storage';

const PERSISTENT_KEY = 'policystreet.auth.session.v1';
const TAB_KEY = 'policystreet.auth.session.tab.v1';

@Injectable()
export class LocalAuthSessionStorage implements AuthSessionStorage {
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  getSession(): AuthSession | null {
    const persistent = this.readJson(PERSISTENT_KEY);
    if (persistent) {
      if (this.isExpired(persistent)) {
        this.clearPersistent();
        return null;
      }
      return persistent;
    }

    return this.readJson(TAB_KEY);
  }

  establishSession(mobile: string, rememberMe: boolean): AuthSession {
    const session: AuthSession = {
      token: this.createToken(),
      mobile: mobile.trim(),
      rememberMe,
      ...(rememberMe ? { expiresAt: Date.now() + AUTH_SESSION_REMEMBER_MS } : {}),
    };

    if (rememberMe) {
      this.writeJson(PERSISTENT_KEY, session);
      this.clearTab();
    } else {
      this.writeJson(TAB_KEY, session);
    }

    return session;
  }

  clearSession(): void {
    this.clearPersistent();
    this.clearTab();
  }

  private isExpired(session: AuthSession): boolean {
    if (!session.expiresAt) {
      return false;
    }
    return Date.now() >= session.expiresAt;
  }

  private createToken(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `ps-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  }

  private readJson(key: string): AuthSession | null {
    if (typeof localStorage === 'undefined' && typeof sessionStorage === 'undefined') {
      return null;
    }

    const raw =
      key === TAB_KEY
        ? sessionStorage?.getItem(key) ?? null
        : localStorage?.getItem(key) ?? null;

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed?.token || !parsed.mobile) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  private writeJson(key: string, session: AuthSession): void {
    const payload = JSON.stringify(session);
    if (key === TAB_KEY) {
      sessionStorage?.setItem(key, payload);
      return;
    }
    localStorage?.setItem(key, payload);
  }

  private clearPersistent(): void {
    localStorage?.removeItem(PERSISTENT_KEY);
  }

  private clearTab(): void {
    sessionStorage?.removeItem(TAB_KEY);
  }
}
