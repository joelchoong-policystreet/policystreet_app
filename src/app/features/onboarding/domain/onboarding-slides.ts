import type { OnboardingSlide } from './onboarding-slide.model';

/** Copy and structure from Figma welcome screens (Consumer Car Insurance). */
export const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    icon: 'logo',
    headline: 'Your insurance, simplified.',
    body:
      'Manage your policies, file claims, and get instant quotes—all in one place.',
  },
  {
    icon: 'document',
    headline: 'Track & Manage Policies',
    body:
      'Everything at your fingertips! Track all your motor policies, view coverage details, and renew with just a few taps.',
  },
  {
    icon: 'lightning',
    headline: 'Quick Actions, Instant Results',
    bodyLeadBold: 'Get things done faster!',
    body:
      'Upload your documents once and manage everything seamlessly. File claims in minutes.',
  },
];
