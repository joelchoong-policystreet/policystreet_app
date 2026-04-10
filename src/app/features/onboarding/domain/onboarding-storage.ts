/** Persistence for “has the user finished onboarding?” */
export interface OnboardingStorage {
  isComplete(): boolean;
  markComplete(): void;
}
