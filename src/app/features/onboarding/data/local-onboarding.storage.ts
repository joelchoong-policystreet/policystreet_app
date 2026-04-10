import { Injectable } from '@angular/core';
import type { OnboardingStorage } from '../domain/onboarding-storage';

const STORAGE_KEY = 'policystreet.onboarding.v1';

@Injectable()
export class LocalOnboardingStorage implements OnboardingStorage {
  isComplete(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return localStorage.getItem(STORAGE_KEY) === '1';
  }

  markComplete(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, '1');
  }
}
