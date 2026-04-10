export interface HomeLatestPolicy {
  plate: string;
  vehicleLabel: string;
  coverageLabel: string;
  coveredUntilLabel: string;
  status: 'ACTIVE';
}

export interface HomeLatestClaim {
  plate: string;
  claimId: string;
  submittedLabel: string;
  status: 'PROCESSING';
}

export const HOME_LATEST_POLICY: HomeLatestPolicy = {
  plate: 'ABC1234',
  vehicleLabel: 'Proton Saga',
  coverageLabel: 'COMPREHENSIVE',
  coveredUntilLabel: 'Covered until 18 March 2027',
  status: 'ACTIVE',
};

export const HOME_LATEST_CLAIM: HomeLatestClaim = {
  plate: 'ABC1234',
  claimId: 'PSMOT12345',
  submittedLabel: 'Submitted on 18 April 2026',
  status: 'PROCESSING',
};

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
