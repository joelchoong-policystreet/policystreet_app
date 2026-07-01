/** Persistence for “has the user finished onboarding?” */
export interface OnboardingStorage {
  isComplete(): boolean;
  markComplete(): void;
  /** Clears completion so the welcome flow shows again (e.g. `/onboarding?resetOnboarding=1`). */
  clearCompletion(): void;
}
