/** Saved quotation preference answers for a car owner (GNQ step 3). */

export type EHailingUsage = 'yes' | 'no';
export type QuotationMaritalStatus = 'single' | 'married';
export type QuotationContactMethod = 'email' | 'whatsapp';

export interface QuotationOwnerPreferences {
  eHailingUsage: EHailingUsage;
  maritalStatus: QuotationMaritalStatus;
  contactMethod: QuotationContactMethod;
}

/** Defaults — e-hailing: No, marital: Single, contact: Whatsapp. */
export const DEFAULT_QUOTATION_OWNER_PREFERENCES: QuotationOwnerPreferences = {
  eHailingUsage: 'no',
  maritalStatus: 'single',
  contactMethod: 'whatsapp',
};

export function normalizeQuotationOwnerKey(ownerFullName: string): string {
  return ownerFullName.trim().toLowerCase();
}
