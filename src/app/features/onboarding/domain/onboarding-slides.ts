import type { OnboardingSlide } from './onboarding-slide.model';

/** Three-step welcome — step 1 matches Figma `Welcome Screen 1` (Consumer Car Insurance). */
export const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    icon: 'none',
    headline: 'Insurance,\nmade simple.',
    body: 'Manage your policies, renew, and file claims all in one app.',
    heroIllustrationSrc: '/assets/onboarding/welcome-hero.svg',
    heroSwingKeySrc: '/assets/onboarding/welcome-key.svg',
  },
  {
    icon: 'none',
    headline: 'All your policies\nin one place',
    body: 'View coverage, track expiry, and renew in seconds.',
    heroFloatLayerSrc: '/assets/onboarding/welcome-screen-2-float-1.svg',
    heroFloatLayerSrc2: '/assets/onboarding/welcome-screen-2-float-2.svg',
    heroIllustrationSrc: '/assets/onboarding/welcome-screen-2-front.svg',
    backgroundSrc: '/assets/onboarding/welcome-screen-2-bg.png',
  },
  {
    icon: 'none',
    headline: 'Fast & easy\nclaims',
    body: 'Upload documents once and submit claims in minutes.',
    heroIllustrationSrc: '/assets/onboarding/welcome-screen-3-hero.svg',
    heroClockHands: {
      minuteHandSrc: '/assets/onboarding/welcome-screen-3-minute-hand.svg',
      hourHandSrc: '/assets/onboarding/welcome-screen-3-hour-hand.svg',
      hubSrc: '/assets/onboarding/welcome-screen-3-clock-hub.svg',
    },
    backgroundSrc: '/assets/onboarding/welcome-screen-3-bg.png',
  },
];
