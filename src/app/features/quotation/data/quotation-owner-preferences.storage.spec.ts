import {
  getQuotationOwnerPreferences,
  resolveQuotationOwnerPreferences,
  saveQuotationOwnerPreferences,
} from './quotation-owner-preferences.storage';
import { DEFAULT_QUOTATION_OWNER_PREFERENCES } from '../domain/quotation-preferences.model';

const STORAGE_KEY = 'policystreet.quotation-owner-preferences.v1';

describe('quotation-owner-preferences.storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('resolveQuotationOwnerPreferences returns defaults when owner has no saved prefs', () => {
    expect(resolveQuotationOwnerPreferences('Jane Doe')).toEqual(DEFAULT_QUOTATION_OWNER_PREFERENCES);
  });

  it('saveQuotationOwnerPreferences persists by normalized owner key', () => {
    const prefs = {
      eHailingUsage: 'yes' as const,
      maritalStatus: 'married' as const,
      contactMethod: 'email' as const,
    };

    saveQuotationOwnerPreferences('  Jane Doe  ', prefs);
    expect(getQuotationOwnerPreferences('jane doe')).toEqual(prefs);
  });

  it('getQuotationOwnerPreferences ignores invalid stored values', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ 'jane doe': { eHailingUsage: 'maybe', maritalStatus: 'single', contactMethod: 'whatsapp' } }),
    );

    expect(getQuotationOwnerPreferences('Jane Doe')).toBeNull();
  });
});
