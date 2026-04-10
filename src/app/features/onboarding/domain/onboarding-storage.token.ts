import { InjectionToken } from '@angular/core';
import type { OnboardingStorage } from './onboarding-storage';

export const ONBOARDING_STORAGE = new InjectionToken<OnboardingStorage>(
  'ONBOARDING_STORAGE',
);
