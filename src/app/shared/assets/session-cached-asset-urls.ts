/**
 * URLs prefetched in idle time after bootstrap (`AssetSessionCacheService.warmSessionAssets`).
 *
 * Keep this list **tight**: every URL here downloads once per tab session in the background.
 * Large files that are not referenced by the app should stay **out** so mobile bandwidth is not
 * wasted (on-demand caching still applies when an `<img appCachedAsset>` loads them).
 *
 * Orphan marketing PNGs under `public/` (e.g. multi‑MB placeholders) must not be listed here.
 */
export const SESSION_IMAGE_ASSET_URLS: readonly string[] = [
  '/assets/claims/coming-soon-1.svg',
  '/assets/claims/coming-soon-2.svg',
  '/assets/claims/coming-soon-3.svg',
  '/assets/claims/coming-soon.svg',
  '/assets/documents/delete.svg',
  '/assets/home/ps-consumer-car-insurance-logo.svg',
  '/assets/home/arrow-forward-ios.svg',
  '/assets/home/directions-car-ocr.svg',
  '/assets/home/directions-car.svg',
  '/assets/home/empty-state-magnifier.svg',
  '/assets/home/nav-claims-active.svg',
  '/assets/home/nav-claims.svg',
  '/assets/home/nav-home-active.svg',
  '/assets/home/nav-home.svg',
  '/assets/home/nav-person-active.svg',
  '/assets/home/nav-person.svg',
  '/assets/home/nav-policy-active.svg',
  '/assets/home/nav-policy.svg',
  '/assets/home/nav-scanner.svg',
  '/assets/home/news-article-01.png',
  '/assets/home/news-article-02.png',
  '/assets/home/quick-action-add-vehicle.svg',
  '/assets/home/quick-action-contact-support.svg',
  '/assets/home/quick-action-request-quote.svg',
  '/assets/home/welcome-layer-1.svg',
  '/assets/onboarding/onboarding-bg.png',
  '/assets/onboarding/welcome-hero.svg',
  '/assets/onboarding/welcome-key.svg',
  '/assets/onboarding/welcome-screen-2-bg.png',
  '/assets/onboarding/welcome-screen-2-float-1.svg',
  '/assets/onboarding/welcome-screen-2-float-2.svg',
  '/assets/onboarding/welcome-screen-2-front.svg',
  '/assets/onboarding/welcome-screen-3-bg.png',
  '/assets/onboarding/welcome-screen-3-clock-hub.svg',
  '/assets/onboarding/welcome-screen-3-hero.svg',
  '/assets/onboarding/welcome-screen-3-hour-hand.svg',
  '/assets/onboarding/welcome-screen-3-minute-hand.svg',
  '/assets/pawsper-icon.svg',
  '/assets/profile/profile-avatar.svg',
  '/assets/profile/referral-illustration.svg',
  '/assets/quotation/icon-myself.svg',
  '/assets/quotation/icon-someone-else.svg',
];
