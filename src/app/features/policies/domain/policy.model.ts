/** Policy domain + view shapes used by list, details, and quotation. */

export type PolicyStatus = 'ACTIVE' | 'EXPIRING SOON' | 'EXPIRED';

export type PolicyFilter = 'all' | 'active' | 'expiring' | 'expired';

/**
 * Single motor policy record: one source for list rows, detail screen, and quotation vehicle pickers.
 * Replace mock fixtures with API DTO → map into this shape (or adjust types when contracts land).
 */
export interface MotorPolicy {
  id: string;
  status: PolicyStatus;
  plate: string;
  carModel: string;
  policyNo: string;
  /** Short period line for policy list cards */
  coveragePeriodShort: string;
  /** Long period line for policy details */
  coveragePeriodLong: string;
  /** ISO date (YYYY-MM-DD) used for expiry countdown banners */
  coverageEndDate: string;
  coverageType: string;
  insurerProvider: string;
  sumInsured: string;
  ncd: string;
  premiumPaidAmount: string;
  addOns: string[];
  ownerFullName: string;
  ownerIcNumber: string;
  mobileNumber: string;
  emailAddress: string;
  maritalStatus: string;
  gender: string;
  residentialAddress: string;
  payeeName: string;
  paymentMethod: string;
  paymentDateTime: string;
  transactionReference: string;
  documents: string[];
}

/** List card (policies screen). */
export interface PolicyCard {
  id: string;
  plate: string;
  carModel: string;
  policyNo: string;
  coverageType: string;
  coveragePeriod: string;
  status: PolicyStatus;
  secondaryAction?: string;
}

/** Editable personal/contact fields on policy details (maps to `MotorPolicy`). */
export type PolicyPersonalDetailsPatch = Pick<
  MotorPolicy,
  | 'ownerFullName'
  | 'ownerIcNumber'
  | 'mobileNumber'
  | 'emailAddress'
  | 'maritalStatus'
  | 'gender'
  | 'residentialAddress'
>;

/** Detail template (policy details screen). */
export interface PolicyDetailsView {
  id: string;
  status: PolicyStatus;
  policyNo: string;
  insurerProvider: string;
  typeOfCoverage: string;
  sumInsured: string;
  ncd: string;
  coveragePeriod: string;
  coverageEndDate: string;
  premiumPaidAmount: string;
  addOns: string[];
  carPlateNumber: string;
  carModel: string;
  ownerFullName: string;
  ownerIcNumber: string;
  mobileNumber: string;
  emailAddress: string;
  maritalStatus: string;
  gender: string;
  residentialAddress: string;
  payeeName: string;
  paymentMethod: string;
  paymentDateTime: string;
  transactionReference: string;
  documents: string[];
}

export interface QuotationVehicleOption {
  id: string;
  plate: string;
  model: string;
  imageSrc: string;
}

/** My Vehicles list row — derived from the same `MotorPolicy` source as policies / quotation. */
export interface SavedVehicleView {
  id: string;
  plate: string;
  carModel: string;
}

/** Add-vehicle form payload (plate + owner name). */
export interface AddVehiclePayload {
  plate: string;
  ownerFullName: string;
}

export const QUOTATION_VEHICLE_IMAGE_SRC = '/assets/quotation/vehicle-thumb.png';

/** Whole days from `asOf` (start of day) until `coverageEndDate` (inclusive end day). */
export function daysUntilCoverageEnd(coverageEndDate: string, asOf: Date = new Date()): number {
  const [year, month, day] = coverageEndDate.split('-').map(Number);
  const endDay = new Date(year, month - 1, day);
  const today = new Date(asOf.getFullYear(), asOf.getMonth(), asOf.getDate());
  const diffMs = endDay.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffMs / 86_400_000));
}

export function formatExpiryDayLabel(days: number): string {
  return days === 1 ? '1 day' : `${days} days`;
}

export function toPolicyCard(policy: MotorPolicy): PolicyCard {
  return {
    id: policy.id,
    plate: policy.plate,
    carModel: policy.carModel,
    policyNo: policy.policyNo,
    coverageType: policy.coverageType,
    coveragePeriod: policy.coveragePeriodShort,
    status: policy.status,
    secondaryAction: policy.status === 'ACTIVE' ? undefined : 'Renew Now',
  };
}

export function toPolicyDetailsView(policy: MotorPolicy): PolicyDetailsView {
  return {
    id: policy.id,
    status: policy.status,
    policyNo: policy.policyNo,
    insurerProvider: policy.insurerProvider,
    typeOfCoverage: policy.coverageType,
    sumInsured: policy.sumInsured,
    ncd: policy.ncd,
    coveragePeriod: policy.coveragePeriodLong,
    coverageEndDate: policy.coverageEndDate,
    premiumPaidAmount: policy.premiumPaidAmount,
    addOns: policy.addOns,
    carPlateNumber: policy.plate,
    carModel: policy.carModel,
    ownerFullName: policy.ownerFullName,
    ownerIcNumber: policy.ownerIcNumber,
    mobileNumber: policy.mobileNumber,
    emailAddress: policy.emailAddress,
    maritalStatus: policy.maritalStatus,
    gender: policy.gender,
    residentialAddress: policy.residentialAddress,
    payeeName: policy.payeeName,
    paymentMethod: policy.paymentMethod,
    paymentDateTime: policy.paymentDateTime,
    transactionReference: policy.transactionReference,
    documents: policy.documents,
  };
}

export function toSavedVehicleViews(
  policies: ReadonlyArray<MotorPolicy>,
): ReadonlyArray<SavedVehicleView> {
  return policies.map((p) => ({
    id: p.id,
    plate: p.plate,
    carModel: p.carModel,
  }));
}

export function toQuotationVehicleOptions(
  policies: ReadonlyArray<MotorPolicy>,
): ReadonlyArray<QuotationVehicleOption> {
  return toSavedVehicleViews(policies).map((v) => ({
    id: v.id,
    plate: v.plate,
    model: v.carModel,
    imageSrc: QUOTATION_VEHICLE_IMAGE_SRC,
  }));
}

/**
 * Policies list → "All" tab order: active first, then expiring soon, then expired.
 */
export const POLICY_STATUS_SORT_ORDER: Record<PolicyStatus, number> = {
  ACTIVE: 0,
  'EXPIRING SOON': 1,
  EXPIRED: 2,
};

export function sortPolicyCardsForAllTab(cards: ReadonlyArray<PolicyCard>): PolicyCard[] {
  return [...cards].sort(
    (a, b) => POLICY_STATUS_SORT_ORDER[a.status] - POLICY_STATUS_SORT_ORDER[b.status],
  );
}

export function sortMotorPoliciesForAllTab(policies: ReadonlyArray<MotorPolicy>): MotorPolicy[] {
  return [...policies].sort(
    (a, b) => POLICY_STATUS_SORT_ORDER[a.status] - POLICY_STATUS_SORT_ORDER[b.status],
  );
}
