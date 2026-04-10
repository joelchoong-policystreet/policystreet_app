export type OnboardingIconKind = 'logo' | 'document' | 'lightning';

export interface OnboardingSlide {
  readonly headline: string;
  /** Main paragraph (screens 1–2) or second paragraph (screen 3). */
  readonly body: string;
  /** Optional bold lead line (screen 3). */
  readonly bodyLeadBold?: string;
  readonly icon: OnboardingIconKind;
}
