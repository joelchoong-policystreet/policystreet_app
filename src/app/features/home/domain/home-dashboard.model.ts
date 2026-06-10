import type { MotorPolicy, PolicyStatus } from '../../policies/domain/policy.model';

export interface HomeActiveQuote {
  id: string;
  plate: string;
  /** Pre-formatted display label, e.g. `13 May 2026 03:52PM`. */
  dateLabel: string;
  /** ISO-8601 sort key — hub lists latest first regardless of plate. */
  createdAt: string;
  status: 'ready' | 'in-progress';
  /** Estimated minutes until the quote is ready (in-progress only). */
  readyInMinutes?: number;
  /** ISO-8601 submission time — used to compute remaining minutes. */
  submittedAt?: string;
  /** Hides the post-timer ready banner after the user taps View Quote. */
  readyNoticeDismissed?: boolean;
}

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

/** Demo active quotation — Figma `3089:24699`. Assign when mocking API with a quote. */
export const HOME_ACTIVE_QUOTE_DEMO: HomeActiveQuote = {
  id: 'quote-demo-vej1234',
  plate: 'VEJ1234',
  dateLabel: '13 May 2026 03:52PM',
  createdAt: '2026-05-13T15:52:00+08:00',
  status: 'ready',
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
    imageSrc: '/assets/home/news-article-01.png',
  },
  {
    title: 'Home insurance covers damage caused by explosions, sa...',
    imageSrc: '/assets/home/news-article-02.png',
  },
];
