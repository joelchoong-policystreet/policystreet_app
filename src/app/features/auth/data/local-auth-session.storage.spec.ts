import { AUTH_SESSION_REMEMBER_MS } from '../domain/auth-session.model';
import { LocalAuthSessionStorage } from '../data/local-auth-session.storage';

describe('LocalAuthSessionStorage', () => {
  let storage: LocalAuthSessionStorage;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    storage = new LocalAuthSessionStorage();
  });

  it('returns false when no session exists', () => {
    expect(storage.isAuthenticated()).toBeFalse();
    expect(storage.getSession()).toBeNull();
  });

  it('establishes a tab-scoped session when rememberMe is false', () => {
    const session = storage.establishSession('0123456789', false);

    expect(session.rememberMe).toBeFalse();
    expect(session.mobile).toBe('0123456789');
    expect(session.token.length).toBeGreaterThan(0);
    expect(localStorage.getItem('policystreet.auth.session.v1')).toBeNull();
    expect(storage.isAuthenticated()).toBeTrue();
  });

  it('establishes a persistent session with 30-day expiry when rememberMe is true', () => {
    const before = Date.now();
    const session = storage.establishSession('0123456789', true);
    const after = Date.now();

    expect(session.rememberMe).toBeTrue();
    expect(session.expiresAt).toBeDefined();
    expect(session.expiresAt! - before).toBeGreaterThanOrEqual(AUTH_SESSION_REMEMBER_MS - 5);
    expect(session.expiresAt! - after).toBeLessThanOrEqual(AUTH_SESSION_REMEMBER_MS + 5);
    expect(localStorage.getItem('policystreet.auth.session.v1')).toContain(session.token);
    expect(storage.isAuthenticated()).toBeTrue();
  });

  it('clears expired persistent sessions', () => {
    storage.establishSession('0123456789', true);
    const raw = localStorage.getItem('policystreet.auth.session.v1');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    parsed.expiresAt = Date.now() - 1;
    localStorage.setItem('policystreet.auth.session.v1', JSON.stringify(parsed));

    expect(storage.isAuthenticated()).toBeFalse();
    expect(storage.getSession()).toBeNull();
    expect(localStorage.getItem('policystreet.auth.session.v1')).toBeNull();
  });

  it('clearSession removes both persistent and tab sessions', () => {
    storage.establishSession('0123456789', true);
    storage.clearSession();
    expect(storage.isAuthenticated()).toBeFalse();

    storage.establishSession('0123456789', false);
    storage.clearSession();
    expect(storage.isAuthenticated()).toBeFalse();
  });
});
