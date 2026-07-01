export type QuotationCustomerTab = 'malaysian' | 'foreigner' | 'company' | 'commercial';

export type QuotationIdentityType = 'malaysian' | 'police-army';

export type QuotationGender = 'male' | 'female';

export const QUOTATION_CUSTOMER_TABS: ReadonlyArray<{ id: QuotationCustomerTab; label: string }> = [
  { id: 'malaysian', label: 'Malaysian' },
  { id: 'foreigner', label: 'Foreigner' },
  { id: 'company', label: 'Company' },
  { id: 'commercial', label: 'Commercial' },
];

/** Customer types with a wired quotation flow (others show “coming soon”). */
export const IMPLEMENTED_QUOTATION_CUSTOMER_TABS: ReadonlySet<QuotationCustomerTab> = new Set([
  'malaysian',
  'foreigner',
]);

export function isQuotationCustomerTabImplemented(tab: QuotationCustomerTab): boolean {
  return IMPLEMENTED_QUOTATION_CUSTOMER_TABS.has(tab);
}

export function parseQuotationCustomerTab(value: string | null | undefined): QuotationCustomerTab {
  if (value === 'foreigner' || value === 'company' || value === 'commercial') {
    return value;
  }
  return 'malaysian';
}
