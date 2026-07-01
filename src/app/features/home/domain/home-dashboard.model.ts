import type { MotorPolicy, PolicyStatus } from '../../policies/domain/policy.model';
export type { HomeActiveQuote } from '../../quotation/domain/active-quote.model';
export { HOME_ACTIVE_QUOTE_DEMO } from '../../quotation/domain/active-quote.model';

export interface HomeLatestCoverNote {
  id: string;
  plate: string;
  vehicleLabel: string;
  coverageLabel: string;
  coveredUntilLabel: string;
  status: PolicyStatus;
  statusLabel: string;
}

/** @deprecated Use `HomeLatestCoverNote`. */
export type HomeLatestPolicy = HomeLatestCoverNote;

export interface HomeLatestClaim {
  plate: string;
  claimId: string;
  submittedLabel: string;
  status: 'PROCESSING';
}

const COVER_NOTE_STATUS_LABEL: Record<PolicyStatus, string> = {
  ACTIVE: 'Active',
  'EXPIRING SOON': 'Expiring Soon',
  EXPIRED: 'Expired',
};

/** Maps the shared motor policy record into the home “Latest Cover Note” card. */
export function homeLatestCoverNoteFromMotor(m: MotorPolicy): HomeLatestCoverNote {
  return {
    id: m.id,
    plate: m.plate,
    vehicleLabel: m.carModel,
    coverageLabel: m.coverageType.toUpperCase(),
    coveredUntilLabel: m.coveragePeriodLong,
    status: m.status,
    statusLabel: COVER_NOTE_STATUS_LABEL[m.status],
  };
}

/** @deprecated Use `homeLatestCoverNoteFromMotor`. */
export const homeLatestPolicyFromMotor = homeLatestCoverNoteFromMotor;

export const HOME_NEWS_ITEMS: ReadonlyArray<{ title: string; imageSrc: string }> = [
  {
    title: 'Beacon Offers RM100 eWallet Credit for Every Car Insuran...',
    imageSrc: '/assets/home/ads-banner-home-mock.png',
  },
  {
    title: 'Home insurance covers damage caused by explosions, sa...',
    imageSrc: '/assets/home/ads-banner-home-mock.png',
  },
];
