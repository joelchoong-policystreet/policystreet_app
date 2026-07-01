/** Demo nationality options for foreigner quotation (GNQ step 2). */
export const QUOTATION_NATIONALITY_OPTIONS = [
  'Singapore',
  'Indonesia',
  'China',
  'India',
  'United Kingdom',
  'Australia',
  'United States',
  'Philippines',
  'Thailand',
  'Other',
] as const;

export type QuotationNationality = (typeof QUOTATION_NATIONALITY_OPTIONS)[number];
