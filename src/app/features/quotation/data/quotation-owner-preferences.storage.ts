import {
  DEFAULT_QUOTATION_OWNER_PREFERENCES,
  normalizeQuotationOwnerKey,
  type QuotationOwnerPreferences,
} from '../domain/quotation-preferences.model';

const STORAGE_KEY = 'policystreet.quotation-owner-preferences.v1';

type PreferencesStore = Record<string, QuotationOwnerPreferences>;

function readStore(): PreferencesStore {
  if (typeof localStorage === 'undefined') {
    return {};
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as PreferencesStore;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: PreferencesStore): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function isValidPreferences(value: unknown): value is QuotationOwnerPreferences {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const prefs = value as QuotationOwnerPreferences;
  return (
    (prefs.eHailingUsage === 'yes' || prefs.eHailingUsage === 'no') &&
    (prefs.maritalStatus === 'single' || prefs.maritalStatus === 'married') &&
    (prefs.contactMethod === 'email' || prefs.contactMethod === 'whatsapp')
  );
}

export function getQuotationOwnerPreferences(
  ownerFullName: string,
): QuotationOwnerPreferences | null {
  const key = normalizeQuotationOwnerKey(ownerFullName);
  if (!key) {
    return null;
  }

  const saved = readStore()[key];
  return isValidPreferences(saved) ? saved : null;
}

export function saveQuotationOwnerPreferences(
  ownerFullName: string,
  preferences: QuotationOwnerPreferences,
): void {
  const key = normalizeQuotationOwnerKey(ownerFullName);
  if (!key) {
    return;
  }

  const store = readStore();
  store[key] = preferences;
  writeStore(store);
}

export function resolveQuotationOwnerPreferences(
  ownerFullName: string,
): QuotationOwnerPreferences {
  return getQuotationOwnerPreferences(ownerFullName) ?? DEFAULT_QUOTATION_OWNER_PREFERENCES;
}
