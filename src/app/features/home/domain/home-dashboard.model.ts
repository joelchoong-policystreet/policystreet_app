import type { MotorPolicy, PolicyStatus } from '../../policies/domain/policy.model';

export interface HomeLatestPolicy {
  plate: string;
  vehicleLabel: string;
  coverageLabel: string;
  coveredUntilLabel: string;
  status: PolicyStatus;
}

export interface HomeLatestClaim {
  plate: string;
  claimId: string;
  submittedLabel: string;
  status: 'PROCESSING';
}

/** Maps the shared motor policy record into the home “Latest Policy” card. */
export function homeLatestPolicyFromMotor(m: MotorPolicy): HomeLatestPolicy {
  return {
    plate: m.plate,
    vehicleLabel: m.carModel,
    coverageLabel: m.coverageType.toUpperCase(),
    coveredUntilLabel: m.coveragePeriodLong,
    status: m.status,
  };
}

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
